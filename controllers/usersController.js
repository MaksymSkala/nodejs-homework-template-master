import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import userModel from '../models/contacts/userModels.js';
import dotenv from 'dotenv';

dotenv.config();

const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),
});

const register = async (req, res, next) => {
try {
    const { email, password } = req.body;

    // Валідація даних
    await registrationSchema.validateAsync({ email, password }, { abortEarly: false });

    // Перевірка наявності користувача з такою ж поштою
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email in use' });
    }

    // Засолювання паролю та створення нового користувача
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.create({ email, password: hashedPassword });

    // Відправка відповіді
    return res.status(201).json({
        user: {
        email: newUser.email,
        subscription: newUser.subscription,
        },
    });
    } catch (error) {
    // Обробка помилок валідації
    if (error.isJoi) {
        return res.status(400).json({ message: error.message });
    }
    // Передача помилки в глобальний обробник помилок
    next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        // Валідація даних
        await loginSchema.validateAsync({ email, password }, { abortEarly: false });
    
        // Знаходження користувача за email
        const user = await userModel.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: 'Email or password is wrong' });
        }
    
        // Порівняння паролів
        const isPasswordMatch = await bcrypt.compare(password, user.password);
    
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Email or password is wrong' });
        }
    
        // Створення токена
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
        // Додавання токена до користувача (можна використовувати для наступних запитів)
        user.tokens = user.tokens.concat({ token });
        await user.save();
    
        // Відправлення успішної відповіді
        res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
      } catch (error) {
        // Обробка помилок валідації
        if (error.isJoi) {
          return res.status(400).json({ message: error.message });
        }
        // Передача помилки в глобальний обробник помилок
        next(error);
      }
};

const logout = async (req, res, next) => {
    try {
        // Знаходження користувача за _id
        const user = await userModel.findById(req.user._id);
    
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
    
        // Видалення токена у поточного користувача
        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await user.save();
    
        // Відправлення успішної відповіді
        res.status(204).end();
        } catch (error) {
        next(error);
        }
};

const getCurrentUser = async (req, res, next) => {
    try {
        // Користувач знаходиться у req.user через мідлвар authMiddleware
        const { email, subscription } = req.user;
    
        // Відправлення успішної відповіді
        res.status(200).json({ email, subscription });
      } catch (error) {
        // Обробка помилок
        next(error);
      }
};

export default { register, login, logout, getCurrentUser };
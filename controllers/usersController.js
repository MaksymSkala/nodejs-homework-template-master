import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import gravatar from 'gravatar';
import userModel from '../models/contacts/userModels.js';
import dotenv from 'dotenv';
import upload from '../middlewares/multer.js';
import jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

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

    // Генерація URL аватара за допомогою Gravatar
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });

    // Збереження аватару в папці tmp
    const tmpPath = path.join(process.cwd(), 'tmp', `${email}_avatar.jpg`);

    const newUser = await userModel.create({ email, password: hashedPassword, avatarURL });

    // Відправка відповіді
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
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
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '23h' });

    // Додавання токена до користувача (можна використовувати для наступних запитів)
    user.tokens = user.tokens.concat({ token });
    const avatarURL = user.avatarURL; // Додайте цей рядок
    await user.save();
    // Відправлення успішної відповіді
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: avatarURL
      }
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

const logout = async (req, res, next) => {
  try {
    // Перевірка, чи користувач є автентифікованим
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Знаходження користувача за _id
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Видалення токена у поточного користувача
    user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== req.token);
    user.avatarURL = null;
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
        const { email, subscription, avatarURL } = req.user;
    
        // Відправлення успішної відповіді
        res.status(200).json({ email, subscription, avatarURL });
      } catch (error) {
        // Обробка помилок
        next(error);
      }
};

const updateAvatar = async (req, res, next) => {
  try {
    // Перевірте, чи користувач автентифікований
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Перевірка, чи вказано файл
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Видалення попереднього аватара з папки tmp
    if (req.user.avatarURL) {
      const previousAvatarPath = path.join(process.cwd(), 'public', 'avatars', path.basename(req.user.avatarURL));

      try {
        // Видалення попереднього аватара
        await fs.unlink(previousAvatarPath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    // Збереження файлу в папку tmp
    const tmpPath = req.file.path;
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${req.user._id}_${Date.now()}${fileExt}`;
    const avatarPath = path.join(process.cwd(), 'public', 'avatars', fileName);

    try {
      // Змінення розміру та обробка зображення за допомогою jimp
      const image = await jimp.read(tmpPath);
      await image.cover(250, 250).writeAsync(avatarPath);

      // Видалення тимчасового файлу
      await fs.unlink(tmpPath);

      // Призначення URL аватарки до користувача
      const avatarURL = `/avatars/${fileName}`;
      req.user.avatarURL = avatarURL;
      await req.user.save();

      // Відправлення успішної відповіді
      res.status(200).json({ avatarURL });
    } catch (error) {
      // Видалення тимчасового файлу у разі помилки
      await fs.unlink(tmpPath);
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout, getCurrentUser, updateAvatar };
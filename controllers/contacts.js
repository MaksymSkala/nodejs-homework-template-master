import mongoose from 'mongoose';
import contactsService from '../services/contacts.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import checkContactExistenceMiddleware from '../middlewares/checkContactExistenceMiddleware.js';
import isValidId from '../middlewares/isValidId.js';
import isValidOwner from '../middlewares/isValidOwner.js';

const DB_HOST = 'mongodb+srv://MaxS:aykewe41QJwgaCxG@cluster0.skedj19.mongodb.net/my-contacts?retryWrites=true&w=majority';
mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await contactsService.listContacts(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  try {
    const result = await contactsService.getContactById(userId, contactId);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const userId = req.user._id;

  validationMiddleware.validateContact(req, res, async () => {
    try {
      const { name, email, phone } = req.body;
      const result = await contactsService.addContact(userId, { name, email, phone, owner: userId });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });
};

const removeContact = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const { contactId } = req.params;
    await contactsService.removeContact(userId, contactId);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const userId = req.user._id;

  validationMiddleware.validateContact(req, res, async () => {
    try {
      const { name, email, phone } = req.body;
      const { contactId } = req.params;
      const result = await contactsService.updateContact(userId, contactId, { name, email, phone, owner: userId });
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    } catch (error) {
      next(error);
    }
  });
};

const updateStatusContact = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const { favorite } = req.body;
    const { contactId } = req.params;
    const result = await contactsService.updateStatusContact(userId, contactId, { favorite, owner: userId });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact: [checkContactExistenceMiddleware.checkContactExistence, isValidId, isValidOwner, removeContact], // Додано isValidId та isValidOwner
  updateContact,
  updateStatusContact: [isValidId, isValidOwner, updateStatusContact],
};
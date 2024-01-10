import mongoose from 'mongoose';
import contactsService from '../services/contacts.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import checkContactExistenceMiddleware from '../middlewares/checkContactExistenceMiddleware.js';

const DB_HOST = 'mongodb+srv://MaxS:aykewe41QJwgaCxG@cluster0.skedj19.mongodb.net/my-contacts?retryWrites=true&w=majority';
mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const listContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await contactsService.getContactById(contactId);
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
  validationMiddleware.validateContact(req, res, async () => {
    try {
      const { name, email, phone } = req.body;
      const result = await contactsService.addContact({ name, email, phone });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await contactsService.removeContact(contactId);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  validationMiddleware.validateContact(req, res, async () => {
    try {
      const { name, email, phone } = req.body;
      const { contactId } = req.params;
      const result = await contactsService.updateContact(contactId, { name, email, phone });
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
  try {
    const { favorite } = req.body;
    const { contactId } = req.params;
    const result = await contactsService.updateStatusContact(contactId, { favorite });
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
  removeContact: [checkContactExistenceMiddleware.checkContactExistence, removeContact],
  updateContact,
  updateStatusContact,
};
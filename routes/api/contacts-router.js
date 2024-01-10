import express from 'express';
import contactsController from '../../controllers/contacts.js';
import isValidId from '../../middlewares/isValidId.js';  // Виправлено тут

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.listContacts);
contactsRouter.get('/:contactId', isValidId, contactsController.getContactById);
contactsRouter.post('/', contactsController.addContact);
contactsRouter.delete('/:contactId', isValidId, contactsController.removeContact);
contactsRouter.put('/:contactId', isValidId, contactsController.updateContact);

export default contactsRouter;
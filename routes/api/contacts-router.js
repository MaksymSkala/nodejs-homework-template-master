import express from 'express';
import contactsController from '../../controllers/contacts.js';
import isValidId from '../../middlewares/isValidId.js';
import isValidOwner from '../../middlewares/isValidOwner.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.listContacts);
contactsRouter.get('/:contactId', isValidId, isValidOwner, contactsController.getContactById);
contactsRouter.post('/', isValidOwner, contactsController.addContact);
contactsRouter.delete('/:contactId', isValidId, isValidOwner, contactsController.removeContact);
contactsRouter.put('/:contactId', isValidId, isValidOwner, contactsController.updateContact);

export default contactsRouter;
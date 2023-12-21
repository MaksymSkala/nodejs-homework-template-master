import express from 'express';
import contactsController from '../../controllers/contacts.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.listContacts);

contactsRouter.get('/:contactId', contactsController.getContactById);

contactsRouter.post('/', contactsController.addContact);

contactsRouter.delete('/:contactId', contactsController.removeContact);

contactsRouter.put('/:contactId', contactsController.updateContact);

export default contactsRouter;
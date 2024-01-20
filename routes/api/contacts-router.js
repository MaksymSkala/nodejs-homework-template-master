import express from 'express';
import contactsController from '../../controllers/contacts.js';
import isValidId from '../../middlewares/isValidId.js';
import isValidOwner from '../../middlewares/isValidOwner.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);

contactsRouter.get('/', contactsController.listContacts);
contactsRouter.get('/:contactId', isValidId, isValidOwner, contactsController.getContactById);
contactsRouter.post('/', contactsController.addContact);
contactsRouter.delete('/:contactId', isValidId, isValidOwner, contactsController.removeContact);
contactsRouter.put('/:contactId', isValidId, isValidOwner, contactsController.updateContact);
contactsRouter.patch('/:contactId/favorite', isValidId, isValidOwner, contactsController.updateStatusContact);

export default contactsRouter;
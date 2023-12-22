import contactsService from '../services/contacts.js';

const checkContactExistence = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await contactsService.getContactById(contactId);
    if (contact) {
      next();
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  checkContactExistence,
};
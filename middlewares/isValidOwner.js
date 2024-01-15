import contactsService from '../services/contacts.js';

const isValidOwner = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  try {
    const contact = await contactsService.getContactById(userId, contactId);
    if (contact) {
      next();
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
};

export default isValidOwner;
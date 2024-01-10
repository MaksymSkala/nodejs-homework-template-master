import ContactModel from '../models/contacts/contactModel.js';

const listContacts = async () => {
  return ContactModel.find({});
};

const getContactById = async (contactId) => {
  return ContactModel.findById(contactId);
};

const removeContact = async (contactId) => {
  return ContactModel.findByIdAndDelete(contactId);
};

const addContact = async (body) => {
  return ContactModel.create(body);
};

const updateContact = async (contactId, body) => {
  return ContactModel.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  return ContactModel.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true });
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
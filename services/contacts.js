import ContactModel from '../models/contacts/contactModel.js';

const listContacts = async () => {
  return ContactModel.find({});
};

const getContactById = async (contactId, userId) => {
  return ContactModel.findById({ _id: contactId, owner: userId });
};

const removeContact = async (userId, contactId) => {
  return await ContactModel.findOneAndDelete({ _id: contactId, owner: userId });
};

const addContact = async (body) => {
  return ContactModel.create(body);
};

const updateContact = async (contactId, userId, body) => {
  return ContactModel.findOneAndUpdate({ _id: contactId, owner: userId }, body, { new: true });
};

const updateStatusContact = async (contactId, userId, body) => {
  return ContactModel.findOneAndUpdate({ _id: contactId, owner: userId }, { favorite: body.favorite }, { new: true });
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
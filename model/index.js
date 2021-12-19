const fs = require('fs/promises')
 const path = require("path");
//  const contacts = require('./contacts.json')

const shortid = require('shortid');

const contactsPath = path.join(__dirname, "contacts.json");
 
const listContacts = async() => {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
}

const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);;
    return result;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  const deleteContact = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return deleteContact;
}

const addContact = async (name, email, phone) => {
  const newContact = { name, email, phone, id: shortid.generate() };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async ({contactId, name, email, phone}) => {
    const contacts = await listContacts();
    const idx = contacts.findIndex(item => item.id === contactId);
    if(idx === -1){
        return null;
    }
    contacts[idx] = {contactId, name, email, phone};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[idx];
}
module.exports = {
    listContacts, getContactById, removeContact, addContact, updateContact
}

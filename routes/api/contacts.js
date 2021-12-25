const express = require('express');
const router = express.Router();

const Joi = require("Joi");

const {Contact} = require('../../model');

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool
});

router.get('/', async (req, res, next) => { 
  try {
    const contacts = await Contact.find();
    res.json(contacts)
    } catch (error) {
    next(error);
    
  }
  
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
      }
    res.json(contact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      const error = new Error("missing required name field");
      error.status = 400;
      throw error;
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(contactId);
    if (!deleteContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({message: "contact deleted"})
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      const error = new Error("missing field favorite");
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!updateContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const updateContact = await Contact.findByIdAndUpdate(contactId, {favorite}, {new: true});
    if (!updateContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
      }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
})

module.exports = router

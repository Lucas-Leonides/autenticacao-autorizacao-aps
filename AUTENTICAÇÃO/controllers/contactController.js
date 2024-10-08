const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc pegar todos os contatos
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req,res) =>{
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts);
});

//@desc pegar contato
//@route POST /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req,res) =>{
  const contact = await Contact.findById(req.params.id);
  if(!contact){
    res.status(404);
    throw new Error("Contato não encontrado");
  }
  res.status(200).json(contact)
});

//@desc criar novo contato
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req,res) =>{
    console.log(" O body request é:", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
      res.status(400);
      throw new Error("Todos os campos são mandatórios.")
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id
    });
    res.status(201).json(contact)
});

//@desc ajustar contato
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req,res) =>{
  const contact = await Contact.findById(req.params.id);
  if(!contact) {
    res.status(404);
    throw new Error("Contato não encontrado");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("Usuário não tem permissão para mudar outros contatos")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact)
});

//@desc deletar contato
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req,res) =>{
  const contact = await Contact.findById(req.params.id);
  if(!contact) {
    res.status(404);
    throw new Error("Contato não encontrado");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("Usuário não tem permissão para deletar outros contatos")
  }

  await Contact.findByIdAndDelete(req.params.id);
  res.status(204).json(contactDelete)
});

module.exports = { 
  getContact, 
  getContacts, 
  createContact, 
  deleteContact, 
  updateContact, };
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcrypt')

//@desc registro dos usuários
//@route Post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) =>{
  const {username, email, password} = req.body;
  if(!username || !email || !password) {
    res.status(400);
    throw new Error("Todos os campos devem ser preenchidos!")
  }
  const userAvailable = await User.findOne({email});
  if(userAvailable){
    res.status(400);
    throw new Error ("Usuário já cadastrado")
  }

  //hash senha
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  })

  console.log(`Usuário criado ${user}`);
  if(user){
    res.status(201).json({_id: user.id, email: user.email});
  } else {
    throw new Error ("Dados do usuário inválidos.")
  }
  res.json({ message: "Registrar o usuário" })
});

//@desc login dos usuários
//@route Post /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
      res.status(400);
      throw new Error("Todos os campos devem ser preenchidos!")
    }
    const user = await User.findOne({ email });
    // comparar senha com o hash
    if(user && (await bcrypt.compare(password, user.password))){
      const accessToken = jwt.sign({
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "15m"}
  );
      res.status(200).json({ accessToken });
    }else{
      res.status(401)
      throw new Error("Email ou senha inválido")
    }
  res.json({ message: "Login" })
});

//@desc informação do usuário atual
//@route Post /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) =>{
  res.json(req.user)
});

module.exports = {
  registerUser,
  loginUser,
  currentUser
}
const mongoose = require ('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "nome de usuário"],
    
  },
  email: {
    type: String,
    required: [true, "email do usuário"],
    unique: [true, "email já cadastrado"],
  },
  password: {
    type: String,
    required: [true, "senha do usuário"]
  }
  },
  {
  timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
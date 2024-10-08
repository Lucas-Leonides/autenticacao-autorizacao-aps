const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  name:{
    type: String,
    require: [true, "nome"]
  },
  email:{
    type: String,
    require: [true, "email"]
  },
  phone:{
    type: String,
    require: [true, "telefone"]
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Contact", contactSchema);
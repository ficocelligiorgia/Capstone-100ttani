const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  
  avatar:    { type: String, default: "" }, 
  address:   { type: String, default: "" },
  bio:       { type: String, default: "" },

  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    default: "user",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

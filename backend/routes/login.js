const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password errata" });
    }

   
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "365h" }
    );

   
    res.status(200).json({
      message: "Login riuscito",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (err) {
    console.error("Errore login:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;

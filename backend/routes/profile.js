const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json(user);
  } catch (err) {
    console.error("Errore GET /profile:", err);
    res.status(500).json({ message: "Errore nel recupero del profilo." });
  }
});

router.post("/update", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, phone, address, bio } = req.body;
    const updateData = { username, email, phone, address, bio };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ message: "Profilo aggiornato", user: updatedUser });
  } catch (err) {
    console.error("Errore POST /profile/update:", err);
    res.status(500).json({ message: "Errore nell'aggiornamento del profilo." });
  }
});


module.exports = router;


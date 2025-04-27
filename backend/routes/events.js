const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero eventi" });
  }
});


router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "staff"),
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        location,
        coordinates,
        poll
      } = req.body;

      const newEvent = new Event({
        title,
        description,
        date,
        location,
        coordinates,
        poll,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user.id,
      });

      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      console.error(" Errore nella creazione evento:", err);
      res.status(500).json({ error: "Errore nella creazione evento" });
    }
  }
);


router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event || !event.poll || !event.poll.options[optionIndex]) {
      return res.status(404).json({ error: "Evento o opzione non trovati" });
    }

    event.poll.options[optionIndex].votes += 1;
    await event.save();

    res.json({ message: "Voto registrato con successo" });
  } catch (err) {
    console.error(" Errore nella votazione:", err);
    res.status(500).json({ error: "Errore nella votazione" });
  }
});


router.delete("/:id", verifyToken, authorizeRoles("admin", "staff"), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.json({ message: "Evento eliminato con successo" });
  } catch (err) {
    console.error(" Errore nella cancellazione evento:", err);
    res.status(500).json({ error: "Errore nella cancellazione evento" });
  }
});

module.exports = router;

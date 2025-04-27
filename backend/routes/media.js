const express = require("express");
const router = express.Router();
const multer = require("multer");
const Media = require("../models/media");
const { verifyToken } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage: storage });


router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const newMedia = new Media({
      userId: req.user.id,
      title: req.body.title,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype.startsWith("video") ? "video" : "image",
    });

    await newMedia.save();
    console.log("MEDIA SALVATO:", newMedia);
    res.status(201).json({ message: "Media caricato!", media: newMedia });
  } catch (err) {
    res.status(500).json({ message: "Errore durante l'upload", error: err });
  }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const filter = req.query.mine === "true" ? { userId: req.user.id } : {};
    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "username email")
      .populate("comments.user", "username email");

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero", error: err });
  }
});


router.post("/:id/like", verifyToken, async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ message: "Media non trovato" });

  const alreadyLiked = media.likes.includes(req.user.id);

  if (alreadyLiked) {
    media.likes.pull(req.user.id);
  } else {
    media.likes.push(req.user.id);
  }

  await media.save();
  res.json({ liked: !alreadyLiked, totalLikes: media.likes.length });
});


router.post("/:id/comment", verifyToken, async (req, res) => {
  const { text } = req.body;
  const mediaId = req.params.id;

  try {
    const media = await Media.findById(mediaId);
    if (!media) return res.status(404).json({ message: "Media non trovato" });

    const comment = {
      text,
      user: req.user.id,
      createdAt: new Date(),
    };

    media.comments.push(comment);
    await media.save();

    res.status(201).json({ message: "Commento aggiunto", comment });
  } catch (err) {
    res.status(500).json({ message: "Errore nel commento", error: err });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media non trovato" });
    }

    if (media.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Media eliminato con successo" });
  } catch (err) {
    console.error("Errore nella cancellazione:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;

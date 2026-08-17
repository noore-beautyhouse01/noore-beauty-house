import express from "express";
import Message from "../models/Message.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC: customer sends message
router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const phone = String(req.body.phone || "").trim();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Your message has been received.",
      messageId: newMessage._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to send message.",
    });
  }
});

// ADMIN: get messages
router.get("/", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load messages.",
    });
  }
});

// ADMIN: mark read/unread
router.patch("/:id/read", requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: Boolean(req.body.read) },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update message.",
    });
  }
});

// ADMIN: delete message
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.json({
      message: "Message deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete message.",
    });
  }
});

export default router;
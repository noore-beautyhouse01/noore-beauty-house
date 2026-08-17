import express from "express";
import Gallery from "../models/Gallery.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET gallery
router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });

    res.json({ gallery });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load gallery.",
    });
  }
});

// CREATE gallery item
router.post("/", requireAdmin, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const image = String(req.body.image || "").trim();
    const category = String(
      req.body.category || "General"
    ).trim();

    if (!title || !image) {
      return res.status(400).json({
        message: "Title and image are required.",
      });
    }

    const gallery = await Gallery.create({
      title,
      image,
      category,
      active: req.body.active !== false,
    });

    res.status(201).json({
      message: "Gallery item created.",
      gallery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to create gallery item.",
    });
  }
});

// UPDATE gallery item
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title: String(req.body.title || "").trim(),
        image: String(req.body.image || "").trim(),
        category: String(
          req.body.category || "General"
        ).trim(),
        active: req.body.active !== false,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    res.json({ gallery });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update gallery item.",
    });
  }
});

// DELETE gallery item
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(
      req.params.id
    );

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    res.json({
      message: "Gallery item deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete gallery item.",
    });
  }
});

export default router;
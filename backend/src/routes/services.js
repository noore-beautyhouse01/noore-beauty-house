import express from "express";
import Service from "../models/Service.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load services." });
  }
});

// CREATE service
router.post("/", requireAdmin, async (req, res) => {
  try {
    const service = await Service.create({
      name: String(req.body.name || "").trim(),
      description: String(req.body.description || "").trim(),
      price: Number(req.body.price || 0),
      duration: String(req.body.duration || "").trim(),
      category: String(req.body.category || "Beauty").trim(),
      image: String(req.body.image || "").trim(),
      active: req.body.active !== false,
    });

    res.status(201).json({
      message: "Service created.",
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create service." });
  }
});

// UPDATE service
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: String(req.body.name || "").trim(),
        description: String(req.body.description || "").trim(),
        price: Number(req.body.price || 0),
        duration: String(req.body.duration || "").trim(),
        category: String(req.body.category || "Beauty").trim(),
        image: String(req.body.image || "").trim(),
        active: req.body.active !== false,
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    res.json({ service });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update service.",
    });
  }
});

// DELETE service
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    res.json({
      message: "Service deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete service.",
    });
  }
});

export default router;
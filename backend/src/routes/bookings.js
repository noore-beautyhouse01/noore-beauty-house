import express from "express";
import Booking from "../models/Booking.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

router.post("/", async (req, res) => {
  const name = clean(req.body.name, 80);
  const phone = clean(req.body.phone, 30);
  const service = clean(req.body.service, 40);
  const date = clean(req.body.date, 10);
  const time = clean(req.body.time, 5);
  const notes = clean(req.body.notes, 500);
  const guests = Math.min(2, Math.max(1, Number(req.body.guests || 1)));

  const allowed = ["Hair Atelier", "Skin Rituals", "Makeup Artistry", "Bridal House"];
  if (!name || !phone || !allowed.includes(service) || !date || !time) {
    return res.status(400).json({ message: "Please complete all required booking fields." });
  }

  const selectedDate = new Date(`${date}T${time}:00`);
  if (Number.isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: "Please choose a valid date and time." });
  }
  if (selectedDate < new Date()) {
    return res.status(400).json({ message: "Please choose a future appointment time." });
  }

  // Prevent obvious duplicate active requests for the same slot.
  const existing = await Booking.findOne({
    date, time, status: { $in: ["pending", "confirmed"] }
  });
  if (existing) {
    return res.status(409).json({ message: "That time is already requested. Please choose another time." });
  }

  const booking = await Booking.create({ name, phone, service, date, time, guests, notes });
  res.status(201).json({ message: "Appointment request received.", bookingId: booking._id });
});

router.get("/", requireAdmin, async (req, res) => {
  const { status, date, q } = req.query;
  const filter = {};
  if (status && ["pending","confirmed","completed","cancelled"].includes(status)) filter.status = status;
  if (date) filter.date = date;
  if (q) {
    const safe = String(q).trim().slice(0, 80);
    filter.$or = [
      { name: { $regex: safe, $options: "i" } },
      { phone: { $regex: safe, $options: "i" } },
      { service: { $regex: safe, $options: "i" } }
    ];
  }
  const bookings = await Booking.find(filter).sort({ date: 1, time: 1, createdAt: -1 }).limit(500);
  res.json({ bookings });
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const allowed = ["pending","confirmed","completed","cancelled"];
  const status = String(req.body.status || "");
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid booking status." });

  const booking = await Booking.findByIdAndUpdate(
    req.params.id, { status }, { new: true }
  );
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  res.json({ booking });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  res.json({ message: "Booking deleted." });
});

export default router;

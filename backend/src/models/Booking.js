import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  service: {
    type: String,
    required: true,
    enum: ["Hair Atelier", "Skin Rituals", "Makeup Artistry", "Bridal House"]
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, default: 1, min: 1, max: 2 },
  notes: { type: String, trim: true, maxlength: 500, default: "" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);

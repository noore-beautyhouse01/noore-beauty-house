import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    duration: {
      type: String,
      default: "",
      maxlength: 50,
    },

    category: {
      type: String,
      default: "Beauty",
      maxlength: 50,
    },

    image: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);
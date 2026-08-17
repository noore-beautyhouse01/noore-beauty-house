import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, admin: { email: admin.email } });
});

export default router;

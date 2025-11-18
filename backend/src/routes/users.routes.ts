import { Router } from "express";
import prisma from "../prisma/client";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";

const router = Router();

// GET PROFILE
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true }
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

// UPDATE PROFILE
router.put("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, phone, role }
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed }
    });

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;

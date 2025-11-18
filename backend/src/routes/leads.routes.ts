import { Router } from "express";
import prisma from "../prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET all leads (of logged-in user)
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const leads = await prisma.lead.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ leads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to load leads" });
  }
});

// CREATE lead
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { title, status, source, value } = req.body;

    const lead = await prisma.lead.create({
      data: {
        title,
        status,
        source,
        value: value ? Number(value) : null, // 🔥 FIX HERE
        ownerId: userId
      }
    });

    return res.status(201).json({ lead });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to create lead" });
  }
});

// UPDATE lead
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, source, value } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { title, status, source, value }
    });

    return res.json({ lead });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update lead" });
  }
});

// DELETE lead
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lead.delete({ where: { id } });

    return res.json({ message: "Lead deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to delete lead" });
  }
});

export default router;

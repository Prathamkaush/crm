import { Router } from "express";
import prisma from "../prisma/client";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const contacts = await prisma.contact.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ success: true, contacts });
  } catch (err) {
    console.error("GET /contacts error:", err);
    return res.status(500).json({ success: false, error: "Failed to load contacts" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    // pick only allowed fields from body
    const { name, email, phone, company, address } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email: email ?? null,
        phone: phone ?? null,
        company: company ?? null,
        address: address ?? null,
        ownerId: userId,
      },
    });

    return res.json({ success: true, contact });
  } catch (err) {
    console.error("POST /contacts error:", err);
    return res.status(500).json({ success: false, error: "Create failed" });
  }
});

// UPDATE Contact
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, email, phone, company, address } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });

    const contact = await prisma.contact.findFirst({
      where: { id, ownerId: userId },
    });

    if (!contact)
      return res.status(404).json({ success: false, error: "Contact not found" });

    const updated = await prisma.contact.update({
      where: { id },
      data: { name, email, phone, company, address },
    });

    return res.json({ success: true, contact: updated });
  } catch (err) {
    console.error("PUT /contacts error:", err);
    return res.status(500).json({ success: false, error: "Update failed" });
  }
});

// DELETE Contact
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });

    // ensure this contact belongs to current user
    const contact = await prisma.contact.findFirst({
      where: { id, ownerId: userId },
    });

    if (!contact)
      return res.status(404).json({ success: false, error: "Contact not found" });

    await prisma.contact.delete({ where: { id } });

    return res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    console.error("DELETE /contacts error:", err);
    return res.status(500).json({ success: false, error: "Delete failed" });
  }
});


export default router;

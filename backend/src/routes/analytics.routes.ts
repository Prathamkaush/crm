// src/routes/analytics.routes.ts
import { Router } from "express";
import prisma from "../prisma/client";

const router = Router();

// simple counts
router.get("/counts", async (req, res) => {
  try {
    const contacts = await prisma.contact.count();
    const leads = await prisma.lead.count();
    const tasks = await prisma.task.count();
    return res.json({ contacts, leads, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch counts" });
  }
});

// individual count endpoints (optional)
router.get("/contacts/count", async (req, res) => {
  try { const count = await prisma.contact.count(); return res.json({ count }); }
  catch (err) { console.error(err); return res.status(500).json({ error: "failed" }); }
});
router.get("/leads/count", async (req, res) => {
  try { const count = await prisma.lead.count(); return res.json({ count }); }
  catch (err) { console.error(err); return res.status(500).json({ error: "failed" }); }
});
router.get("/tasks/count", async (req, res) => {
  try { const count = await prisma.task.count(); return res.json({ count }); }
  catch (err) { console.error(err); return res.status(500).json({ error: "failed" }); }
});

// basic timeline: last N days aggregated by date (contacts + leads)
router.get("/timeline", async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));

    // group contacts by date
    const contacts = await prisma.contact.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true }
    });
    const leads = await prisma.lead.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true }
    });

    // helper to accumulate
    const map = new Map<string, { date: string, contacts: number, leads: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const key = d.toISOString().slice(0,10);
      map.set(key, { date: key, contacts: 0, leads: 0 });
    }
    contacts.forEach(c => {
      const k = c.createdAt.toISOString().slice(0,10);
      map.get(k) && (map.get(k)!.contacts += 1);
    });
    leads.forEach(l => {
      const k = l.createdAt.toISOString().slice(0,10);
      map.get(k) && (map.get(k)!.leads += 1);
    });

    const timeline = Array.from(map.values());
    return res.json(timeline);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed" });
  }
});

export default router;

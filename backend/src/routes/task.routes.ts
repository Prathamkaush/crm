import { Router } from "express";
import prisma from "../prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET all tasks for logged-in user
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to load tasks" });
  }
});

// CREATE task
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { title, dueDate, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        status: status || "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to create task" });
  }
});

// UPDATE task
router.put("/:id", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.update({
      where: { id },
      data: req.body,
    });

    return res.json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update task" });
  }
});

// DELETE task
router.delete("/:id", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to delete task" });
  }
});

export default router;

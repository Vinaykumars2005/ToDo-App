import express from "express";
import Task from "../models/Task";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.use(verifyToken);

router.get("/", async (req, res) => {
  const userId = (req as any).user.email;
  const tasks = await Task.find({ userId });
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const userId = (req as any).user.email;
  const { title, description, dateTime, deadline, priority } = req.body;

  const newTask = new Task({
    userId,
    title,
    description,
    dateTime,
    deadline: deadline || null,  // ✅ Always store null if undefined
    priority,
  });

  await newTask.save();
  res.json(newTask);
});


router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;

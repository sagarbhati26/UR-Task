import { Task } from "../models/task";
import { User } from "../models/user";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { sendEmail } from "../utils/email";

// Assign a task
const assignTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate, createdBy } = req.body;

  // Check if assigned user exists
  const employee = await User.findById(assignedTo);
  if (!employee) throw new apiError(404, "Employee not found");

  // Create task
  const task = await Task.create({
    title,
    description,
    assignedTo,
    dueDate,
    createdBy,
  });

  // Send email notification
  await sendEmail(
    employee.email,
    "New Task Assigned",
    `Task: ${title}\nDue Date: ${dueDate}`
  );

  res.status(201).json(new apiResponse(201, task, "Task assigned successfully"));
});

// Get all tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("assignedTo createdBy", "name email");
  res.status(200).json(new apiResponse(200, tasks, "Tasks fetched successfully"));
});

// Update task status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Update task status
  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  if (!task) throw new apiError(404, "Task not found");

  // Notify manager if completed
  if (status === "completed") {
    const manager = await User.findById(task.createdBy);
    await sendEmail(
      manager.email,
      "Task Completed",
      `Task: ${task.title} has been completed by the employee.`
    );
  }

  res.status(200).json(new apiResponse(200, task, "Task status updated successfully"));
});

export { assignTask, getTasks, updateTaskStatus };

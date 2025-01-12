import  Task  from "../models/task.js";
import { User } from "../models/user.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

// Assign a task to an employee
const assignTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate, createdBy } = req.body;

  // Check if the user exists by email
  const employee = await User.findOne({ email: assignedTo });
  if (!employee) throw new apiError(404, "Employee not found");

  // Create the task, linking the employee's ID
  const task = await Task.create({
    title,
    description,
    assignedTo: employee._id, // Use the employee's ID here
    dueDate,
    createdBy,
  });

  // Send email notification to the assigned user
  await sendEmail(
    employee.email,
    "New Task Assigned",
    `Task: ${title}\nDue Date: ${dueDate}`
  );

  res
    .status(201)
    .json(new apiResponse(201, task, "Task assigned successfully"));
});


// Get all tasks  
const getTasks = asyncHandler(async (req, res) => {
  // Check the logged-in user's role
  const { role, email } = req.user; // Assuming req.user contains the logged-in user's details

  let tasks;

  if (role === "employee") {
    // Fetch tasks assigned to the logged-in employee
    tasks = await Task.find({ assignedTo: email }).populate(
      "assignedTo createdBy",
      "fullName email"
    );
  } else if (role === "manager") {
    // Fetch all tasks created by the logged-in manager
    tasks = await Task.find({ createdBy: email }).populate(
      "assignedTo createdBy",
      "fullName email"
    );
  } else {
    throw new apiError(403, "Unauthorized access");
  }

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

import Task from "../models/task.js";
import { User } from "../models/user.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

// Get all tasks
const getTasks = asyncHandler(async (req, res) => {
  const { role, email } = req.body;

  // First verify the user exists
  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "User not found");

  let tasks;

  if (role === "employee") {
    // First get the tasks
    tasks = await Task.find({ assignedTo: email });
    
    // Then manually populate the user details
    const populatedTasks = await Promise.all(tasks.map(async (task) => {
      const assignedUser = await User.findOne({ email: task.assignedTo });
      const createdUser = await User.findOne({ email: task.createdBy });
      
      return {
        ...task.toObject(),
        assignedTo: {
          fullName: assignedUser?.fullName,
          email: assignedUser?.email
        },
        createdBy: {
          fullName: createdUser?.fullName,
          email: createdUser?.email
        }
      };
    }));

    tasks = populatedTasks;
    console.log(tasks);
  } else if (role === "manager") {
    // First get the tasks
    tasks = await Task.find({ createdBy: email });
    
    // Then manually populate the user details
    const populatedTasks = await Promise.all(tasks.map(async (task) => {
      const assignedUser = await User.findOne({ email: task.assignedTo });
      const createdUser = await User.findOne({ email: task.createdBy });
      
      return {
        ...task.toObject(),
        assignedTo: {
          fullName: assignedUser?.fullName,
          email: assignedUser?.email
        },
        createdBy: {
          fullName: createdUser?.fullName,
          email: createdUser?.email
        }
      };
    }));

    tasks = populatedTasks;
    
  } else {
    throw new apiError(403, "Unauthorized access");
  }

  res.status(200).json(new apiResponse(200, tasks, "Tasks fetched successfully"));
});

// Assign a task to an employee
const assignTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate, createdBy } = req.body;

  // Check if users exist
  const employee = await User.findOne({ email: assignedTo });
  if (!employee) throw new apiError(404, "Employee not found");

  const manager = await User.findOne({ email: createdBy });
  if (!manager) throw new apiError(404, "Manager not found");

  // Create task using emails
  const task = await Task.create({
    title,
    description,
    assignedTo: employee.email,
    dueDate,
    createdBy: manager.email,
  });

  // Send email notification
  await sendEmail(
    employee.email,
    "New Task Assigned",
    `Task: ${title}\nDue Date: ${dueDate}`
  );

  res
    .status(201)
    .json(new apiResponse(201, task, "Task assigned successfully"));
});

// Update task status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  
  if (!task) throw new apiError(404, "Task not found");

  // Get the manager's details
  const manager = await User.findOne({ email: task.createdBy });
  if (!manager) throw new apiError(404, "Manager not found");

  // Notify manager if completed
  if (status === "completed") {
    await sendEmail(
      manager.email,
      "Task Completed",
      `Task: ${task.title} has been completed by the employee.`
    );
  }

  res.status(200).json(new apiResponse(200, task, "Task status updated successfully"));
});

export { assignTask, getTasks, updateTaskStatus };
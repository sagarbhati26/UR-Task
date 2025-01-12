import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
  },
  description: {
    type: String,
  },
  assignedTo: {
    type: String,  // Keep as String to store email
    ref: 'User',
    required: [true, 'Assigned employee is required'],
    validate: {
      validator: async function(email) {
        const User = this.model('User');
        const user = await User.findOne({ email });
        return user !== null;
      },
      message: 'Invalid employee email'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  createdBy: {
    type: String,  // Keep as String to store email
    ref: 'User',
    required: [true, 'Manager is required'],
    validate: {
      validator: async function(email) {
        const User = this.model('User');
        const user = await User.findOne({ email });
        return user !== null;
      },
      message: 'Invalid manager email'
    }
  },
}, {
  timestamps: true,
});

export default model('Task', taskSchema);
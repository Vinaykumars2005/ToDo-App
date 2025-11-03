import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dateTime: { type: Date, default: Date.now },
    deadline: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);

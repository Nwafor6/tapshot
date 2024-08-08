import { Schema, model, Model } from "mongoose";
import { ITask, ITaskCompletion } from "../interfaces/tasks";

// Task Schema and Model
const TaskSchema: Schema<ITask> = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: Number, required: true },
    reward: { type: Number, required: true },
  },
  { timestamps: true }
);

// Task Completion Schema and Model
const TaskCompletionSchema: Schema<ITaskCompletion> =
  new Schema<ITaskCompletion>(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
      completedAt: { type: Date, required: true, default: Date.now },
      rewardReceived: { type: Number, required: true },
    },
    { timestamps: true }
  );

export const TaskCompletion: Model<ITaskCompletion> = model<ITaskCompletion>(
  "TaskCompletion",
  TaskCompletionSchema
);
export const Task: Model<ITask> = model<ITask>("Task", TaskSchema);

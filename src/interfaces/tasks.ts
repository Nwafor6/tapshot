import { Schema, model, Document } from 'mongoose';

// Task Interface
export interface ITask extends Document {
    title: string;
    description: string;
    level: number;
    reward: number;
  }
  
  // Task Completion Interface
  export interface ITaskCompletion extends Document {
    user: Schema.Types.ObjectId;
    task: Schema.Types.ObjectId;
    completedAt: Date;
    rewardReceived: number;
  }
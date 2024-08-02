import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: string;
  level:number;
  role: "user" | "admin"
}

export interface IWallet extends Document {
  user: Schema.Types.ObjectId;
  balance: number;

}
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: string;
  level:number;
  status:"online" | "offline";
  // telegramDate: Date;
  role: "user" | "admin"
}

export interface IWallet extends Document {
  user: Schema.Types.ObjectId;
  balance: number;

}
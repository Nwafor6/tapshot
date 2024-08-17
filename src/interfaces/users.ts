import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: string;
  level:number;
  code:string;
  status:"online" | "offline";
  // telegramDate: Date;
  role: "user" | "admin";
  refBy:string;
}

export interface IWallet extends Document {
  user: Schema.Types.ObjectId;
  balance: number;

}
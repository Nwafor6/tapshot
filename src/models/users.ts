import { Schema, model, Model } from 'mongoose';
import { IUser, IWallet } from '../interfaces/users';


// User Schema and Model
const UserSchema: Schema<IUser> = new Schema<IUser>({
  telegramId: { type: String, required: true },
  status: { type: String, default: "online" },
  // telegramDate:Date,
  level: { type: Number, default: 1 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if(this.isNew){
    await Wallet.create({user:this._id})
  };
  next()
})


// Wallet Schema and Model
const WalletSchema: Schema<IWallet> = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export const Wallet: Model<IWallet> = model<IWallet>('Wallet', WalletSchema);
export const User: Model<IUser> = model<IUser>('User', UserSchema);
import { Request, Response } from "express";
import { failedResponse, successResponse } from "../support/http";
import { loginValidator } from "../validator/user";
import { generateJwtToken } from "../support/generateTokens";
import { writeErrorsToLogs, addSuffix } from "../support/helpers";
import { User, Wallet } from "../models/users";
import { level } from "winston";

export class Onboarding {
  static async login(req: Request, res: Response) {
    try {
      const { error, value } = loginValidator.validate(req.body);
      if (error) return failedResponse(res, 400, `${error.details[0].message}`);

      let user = await User.findOne({ telegramId: value.telegramId });
      if (!user) {
        user = new User({
          telegramId: value.telegramId,
          level: value.level || 1,
          role: value.role || "user",
        });
        await user.save();
      }

      const accessToken = generateJwtToken({
        telegramId: value.telegramId,
        id: user._id,
      });
      const payload = {
        telegramId: user.telegramId,
        level: user.level,
        _id: user._id,
        role: user.role,
      };

      // Fetch wallet information
      const wallet = await Wallet.findOne({ user: user._id });
      const walletInfo = wallet ? { balance: wallet.balance } : { balance: 0 };

      return successResponse(res, 200, "Success", {
        payload,
        accessToken,
        wallet: walletInfo,
      });
    } catch (error: any) {
      writeErrorsToLogs(error);
      return failedResponse(res, 500, error.message);
    }
  }

  static async leaderBoard(req: Request, res: Response) {
    try {
      const wallets = await Wallet.find().sort({ balance: -1 });
      const formatted = wallets.map((wallet, index) => {
        return {
          _id: wallet._id,
          balance: wallet.balance,
          user: wallet.user,
          postion: addSuffix(index + 1),
        };
      });

      return successResponse(res, 200, "Success", formatted, true);
    } catch (e: any) {
      writeErrorsToLogs(e);
      return failedResponse(res, 500, e.message);
    }
  }
}

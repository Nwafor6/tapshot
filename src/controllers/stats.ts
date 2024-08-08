import { Request, Response } from "express";
import { failedResponse, successResponse } from "../support/http";
import { loginValidator } from "../validator/user";
import { generateJwtToken } from "../support/generateTokens";
import { writeErrorsToLogs, addSuffix } from "../support/helpers";
import { User, Wallet } from "../models/users";
import { level } from "winston";
import { Task, TaskCompletion } from "../models/tasks";

export class LeaderBoard {
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

  static async mainStats(req: Request, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const onlinePlayers = await User.find({
        status: "online",
      }).countDocuments();
      const totalTouches = await Wallet.aggregate([
        {
          $group: {
            _id: null,
            totalTaps: {
              $sum: "$balance",
            },
          },
        },
        {
          $project: {
            totalTaps: 1,
            _id: 0,
          },
        },
      ]);
      const data = {
        totalUsers,
        totalTouches: totalTouches[0].totalTaps,
        onlinePlayers,
      };
      return successResponse(res, 200, "Success", data, true);
    } catch (e: any) {
      writeErrorsToLogs(e);
      return failedResponse(res, 500, e.message);
    }
  }
}

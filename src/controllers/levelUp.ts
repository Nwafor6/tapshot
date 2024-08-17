import { Request, Response } from "express";
import { failedResponse, successResponse } from "../support/http";
import { writeErrorsToLogs, addSuffix } from "../support/helpers";
import { User, Wallet } from "../models/users";

export class Level {
    static async levelUp(req: Request, res: Response) {
        try {
            const id = (req as any).user.id
            const user = await User.findById(id);
            if (!user) {
                return failedResponse(res, 404, "User not found.");
            };
            user.level += 1;
            user.save();
            return successResponse(res, 200, "Congraulations you have just leveled up!", user);
        } catch (e: any) {
            writeErrorsToLogs(e);
            return failedResponse(res, 500, e.message);
        }
    };
}
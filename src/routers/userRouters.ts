import { Router } from "express";
import { Onboarding } from "../controllers/auth";

export const authRouter = Router();

authRouter.post("/play", Onboarding.login);
authRouter.get("/leader_board", Onboarding.leaderBoard);

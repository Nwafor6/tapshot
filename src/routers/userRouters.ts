import { Router } from "express";
import { Onboarding } from "../controllers/auth";
import { Level } from "../controllers/levelUp";
import { IsAuthenticatedUser } from "../support/middleware";

export const authRouter = Router();

authRouter
.post("/play", Onboarding.login)
.get("/leader_board", Onboarding.leaderBoard)
.get("/level-up", IsAuthenticatedUser ,Level.levelUp)

import { Router } from "express";
import { LeaderBoard } from "../controllers/stats";

export const statRouter = Router();

statRouter.get("/leader_board", LeaderBoard.leaderBoard);
statRouter.get("/general_stat", LeaderBoard.mainStats);

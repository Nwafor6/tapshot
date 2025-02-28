import { Server } from "socket.io";
import { io } from ".";
import { authenticate } from "./socket/authentication";
import { logger } from "./logger";
import { handleRecieveTap } from "./socket/sendMessageHandler";
import { User } from "./models/users";

export const EVENTS = {
  CONNECTION: "connection",
  CLIENT: {
    TAP: "TAP",
    JOIN_ROOM: "JOIN_ROOM",
    RECEIVE_LOCATION_FROM_SERVER: "RECEIVE_LOCATION_FROM_SERVER",
  },
  SERVER: {
    ROOMS: "ROOMS",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    WELCOME: "WELCOME",
  },
};

export async function socket() {
  io.use(authenticate);
  const onlineUsers: string[] = [];

  io.on(EVENTS.CONNECTION, async (socket) => {
    const roomId = socket.user.id;

    if (!roomId) {
      logger.error("Room ID is not defined");
      return;
    }

    await User.findByIdAndUpdate(roomId, { status: "online" });
    socket.join(roomId);
    logger.info(`${socket.user} joined room ${roomId}`);

    io.to(roomId).emit(EVENTS.SERVER.WELCOME, `Welcome ${roomId}`);

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(roomId, { status: "offline" });
      logger.info(`Client disconnected: ${roomId}`);
    });

    socket.on(EVENTS.CLIENT.TAP, async (message: any) => {
      await handleRecieveTap(socket, message);
    });
  });
}

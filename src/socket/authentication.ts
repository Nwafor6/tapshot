import { verifyJwtToken } from "../support/generateTokens";
import { logger } from "../logger";
import { TAP_SHOT_API_KEY } from "../support/middleware";


export async function authenticate(socket: any, next: any) {
    const token = socket.handshake.headers.token;
    const apikey = socket.handshake.headers.apikey;

    if (!token) {
        logger.info("Token not provided");
        return next(new Error("Authentication error"));
    }
    if (!apikey) {
        return next(new Error ( "API key is missing"))
      }
    
      if (apikey !== TAP_SHOT_API_KEY) {
        return next(new Error ( "Invalid apikey"))
      }

    try {
        const decoded = verifyJwtToken(token);
        socket.user = decoded;

        next();
    } catch (error: any) {
        logger.error(error.message);
        next(new Error("Authentication error"));
    }
};

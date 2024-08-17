import { io } from "..";
import { User, Wallet } from "../models/users";
import { EVENTS } from "../socket";
import { writeErrorsToLogs } from "../support/helpers";

export async function handleRecieveTap(socket: any, message: any) {

    const user = socket.user.id;
    try {

        
        let wallet = await Wallet.findOne({ user: user });
        const userInfo = await User.findById(user);

        if (wallet) {
            wallet.balance = wallet.balance || 0;
            wallet.balance += userInfo?.level || 1; //increase the wallet base on the user's level.
            await wallet.save();
        }
        
        io.to(user).emit(EVENTS.SERVER.SUCCESS, {
            status: 200,
            message: "Success",
            success: true,
            wallet
        });
    } catch (err: any) {
        writeErrorsToLogs(err);
        io.to(user).emit(EVENTS.SERVER.ERROR, {
            status: 500,
            message: "Internal server error",
            success: false,
        });
    }
}

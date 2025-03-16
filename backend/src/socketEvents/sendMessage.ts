import {Server, Socket} from "socket.io";
import {createConversationID} from "../utils/createConversationID";
import logger from "../config/logger";
import redis from "../utils/redis";
import {canSendMessage} from "../utils/rateLimiters";
import {joinConversation} from "./roomManager";
import ConnectService from "../services/ConnectService";

export const handleSendMessage = async (
    socket: Socket,
    io: Server,
    recipientId: string,
    text: string,
) => {
    try {
        if (!recipientId || !text)
            throw new Error("Recipient ID and message text are required.");

        // ✅ Get sender's userId from Redis (consistent source of truth)
        const senderUserId = await redis.get(`socket:${socket.id}`);
        if (!senderUserId) throw new Error("User not registered.");
        if (senderUserId === recipientId)
            throw new Error("Cannot send messages to yourself.");

        if (!(await canSendMessage(senderUserId))) {
            throw new Error(
                "Rate limit exceeded. Please wait before sending more messages.",
            );
        }

        // ✅ Ensure the sender is part of the conversation room
        const conversationId = createConversationID(senderUserId, recipientId);
        const isNewConversation =
            await ConnectService.isNewConversation(conversationId);
        const isSenderInRoom = socket.rooms.has(`chat:${conversationId}`);

        if (!isSenderInRoom) {
            logger.debug(
                `Sender ${senderUserId} is not in room chat:${conversationId}. Joining now...`,
            );
            await joinConversation(socket, recipientId); // Force join before sending
        }

        // ✅ Save message to MongoDB
        const newMessage = await ConnectService.addNewMessage({
            senderId: senderUserId,
            recipientId: recipientId,
            conversationId,
            text,
        });

        const messageToSend = {
            text,
            sender: senderUserId,
            recipient: recipientId,
            conversationId,
            _id: newMessage._id,
        };

        // ✅ Emit to the conversation-based room
        io.to(`chat:${conversationId}`).emit("receiveMessage", messageToSend);

        // ✅ Revalidate recent conversations if it's a new conversation
        if (isNewConversation) {
            // ✅ Emit "revalidateConversations" event to both users
            const recipientSockets = await redis.smembers(
                `userSockets:${recipientId}`,
            );
            recipientSockets.forEach((socketId) => {
                io.to(socketId).emit("revalidateConversations", {with: senderUserId});
            });

            const senderSockets = await redis.smembers(`userSockets:${senderUserId}`);
            senderSockets.forEach((socketId) => {
                io.to(socketId).emit("revalidateConversations", {with: recipientId});
            });
        }

        logger.debug(`Message sent from ${senderUserId} to ${recipientId}`);
    } catch (error: any) {
        logger.error(`Error sending message: ${error.message}`);
        socket.emit("error", {
            code: error.message.includes("Rate limit")
                ? "RATE_LIMITED"
                : "MESSAGE_FAILED",
            message: error.message || "Failed to send message",
        });
    }
};

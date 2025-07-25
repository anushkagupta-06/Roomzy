import { Server } from "socket.io";
import { isMatchedUser } from "./matchMiddleware.js";
import Message from "../src/models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", ({ userId }) => {
      socket.join(userId); // Join personal room
    });

    socket.on("private_message", async ({ senderId, receiverId, content }) => {
      const allowed = await isMatchedUser(senderId, receiverId);
      if (!allowed) return socket.emit("error", "Users not matched!");

      const message = await Message.create({ sender: senderId, receiver: receiverId, content });
      io.to(receiverId).emit("private_message", {
        senderId, content, timestamp: message.timestamp
      });
    });

    // Handle signaling for WebRTC
    socket.on("video-signal", ({ to, from, signal }) => {
      io.to(to).emit("video-signal", { from, signal });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
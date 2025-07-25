import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  type: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
export const getChatHistory = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { withUserId } = req.params;
  
    const allowed = await isMatchedUser(userId, withUserId);
    if (!allowed) throw new ApiError(403, "You are not matched with this user");
  
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: withUserId },
        { sender: withUserId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });
  
    res.status(200).json(new ApiResponse(200, messages));
  });
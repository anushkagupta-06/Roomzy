import Admin from "../src/models/Admin.js";

export const isMatchedUser = async (user1Id, user2Id) => {
  const admin = await Admin.findOne({});
  if (!admin) return false;

  return admin.matchedUsers.some(match =>
    (match.user.toString() === user1Id && match.roommate.toString() === user2Id) ||
    (match.user.toString() === user2Id && match.roommate.toString() === user1Id)
  );
};
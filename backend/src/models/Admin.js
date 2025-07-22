import mongoose from "mongoose";
import bcrypt from "bcrypt";

const matchedUserSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
  },
  roommate: {
    name: String,
    email: String,
  }
}, { _id: false });

const adminSchema = new mongoose.Schema({
  // ── Admin Info ──
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  role: {
    type: String,
    enum: ["admin"],
    default: "admin"
  },

  // ── List of approved user emails ──
  approvedUsers: [
    {
      type: String,
      lowercase: true
    }
  ],

  // ── Match records ──
  matchedUsers: [matchedUserSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ── Hash password before saving ──
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// ── Compare password ──
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
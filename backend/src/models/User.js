import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  // ─── Basic Info ───
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

  avatar: {
    type: String, // Cloudinary URL or local path
    default: ""
  },

  bio: {
    type: String,
    trim: true,
    maxlength: 250
  },

  age: {
    type: Number,
    min: 18,
    max: 99
  },

  role: {
    type: String,
    enum: ["user"],
    default: "user"
  },

  // ─── Preferences ───
  budgetRange: {
    type: String,
    enum: ["<5000", "5000-10000", "10000-15000", ">15000"]
  },

  preferredLanguage: {
    type: String,
    enum: ["English", "Hindi", "Bilingual", "Other"]
  },

  cleanliness: {
    type: String,
    enum: ["Messy", "Moderate", "Clean"]
  },

  sleepTime: {
    type: String,
    enum: ["Early", "Late", "Flexible"]
  },

  sociability: {
    type: String,
    enum: ["Introvert", "Extrovert", "Ambivert"]
  },

  studyHabit: {
    type: String,
    enum: ["Quiet", "Collaborative", "Flexible"]
  },

  musicPreference: {
    type: String,
    enum: ["Loud", "Headphones Only", "Doesn’t Matter"]
  },

  // ─── Match Data ───
  matchResult: {
    roommate: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: String,
      email: String
    },
    compatibilityScore: Number,
    explanation: String
  },

  // ─── Room Assignment ───
  roomAssignment: {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },
    roomType: {
      type: String,
      enum: ["Twin", "Single"]
    },
    preferences: {
      nearWindow: Boolean,
      preferredFloor: Number
    }
  },
  refreshToken: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ─── Password Hashing ───
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Compare Password ───
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
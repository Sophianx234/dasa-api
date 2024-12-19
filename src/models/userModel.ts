import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: [true, "name is required"] },
  email: { type: String, require: [true, "email is required"] },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: [8,'password must be at least 8 characters']
  },
  role: { type: String, enum: ["user", "admin", "guest"], default: "user" },
  contact: String,
  hall: String,
  course: String,
  profileImage: String,
  bio: String,

  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

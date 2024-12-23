import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: { type: String, require: [true, "name is required"] },
  email: { type: String, require: [true, "email is required"] },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: [8, "password must be at least 8 characters"],
    select: false
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
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
    validate: {
      validator: function (this: any, el: string) {
        return this.password === el;
      },
      message: "Passwords do not match",
    },
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

userSchema.pre("save", async function (this: any, next) {
  if (!this.isModified("password")) return next();
  
    this.password =  await bcrypt.hash(
      this.password,
      12);
    this.confirmPassword = null
});
const User = mongoose.model("User", userSchema);

export default User;

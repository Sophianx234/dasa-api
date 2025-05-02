import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import { Model } from "mongoose";
import crypto from "crypto";
import { genRandomName } from "../utils/helpers";
export type userDocument = Document & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "user" | "admin" | "guest";
  contact: string;
  hall?: string;
  status?: "active" | "inactive" | "suspended";
  course?: string;
  active: boolean;
  profileImage?: string;
  bio?: string;
  sex: "male" | "female";
  birthDate: Date
  anonymousName: string;
  anonymousProfile: string;
  confirmPassword?: string | boolean | null;
  createdAt?: Date;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  isCorrectPassword(
    this: userDocument,
    candidatePassword: string,
  ): Promise<boolean>;
  isPasswordChanged(jwtTimestamp: number): boolean;
  createPasswordResetToken(): string;
};

type userModel = Model<userDocument>;

const userSchema = new mongoose.Schema<userDocument>({
  username: String,
  firstName: { type: String, require: [true, "firstname is required"] },
  lastName: { type: String, require: [true, "lastname is required"] },
  email: { type: String, require: [true, "email is required"] },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: [8, "password must be at least 8 characters"],
    select: false,
  },
  role: { type: String, enum: ["user", "admin", "guest"], default: "user" },
  contact: String,
  hall: String,
  course: String,
  profileImage: {
    type: String,
    default: "https://i.ibb.co/BCqPkTT/default-img.jpg",
  },
  birthDate:Date
  ,
  bio: String,
  anonymousName:String,

  sex:String,
  anonymousProfile: {
    type: String,
  },

  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  active: {
    type: Boolean,
    default: true,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
    validate: {
      validator: function (this: userDocument, el: string) {
        return this.password === el;
      },
      message: "Passwords do not match",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (this: userDocument, next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.pre("save", async function (this: userDocument, next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(/^find/, function (this: any, next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre("save", function (this: userDocument, next) {
  this.username = `${this.firstName} ${this.lastName}`;
  this.anonymousProfile =
    this.sex === "male"
      ? "https://res.cloudinary.com/dtytb8qrc/image/upload/v1738576015/Dasa/users/bwg76dwwvyte11f71jah.jpg"
      : "https://res.cloudinary.com/dtytb8qrc/image/upload/v1738576016/Dasa/users/ocmq2tel9kfwdb5ew6ej.jpg";
      this.anonymousName = genRandomName()

  next();
});

userSchema.methods.isCorrectPassword = async function (
  this: userDocument,
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isPasswordChanged = async function (
  this: userDocument,
  jwtTimestamp: number,
) {
  if (this.passwordChangedAt) {
    const changedPassword: number = this.passwordChangedAt.getTime() / 1000;
    return jwtTimestamp < changedPassword;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (this: userDocument) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};
const User = mongoose.model<userDocument>("User", userSchema);

export default User;

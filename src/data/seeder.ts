import dotenv from "dotenv";
import { users } from "./user";
import { products } from "./products";
import mongoose from "mongoose";
import {media} from './media'
import User from "../models/userModel";
import { Product } from "../models/productModel";
import { Media } from "../models/mediaModel";
import Message from "../models/messagesModel";
import { messages } from "./messages";
import Anonymous from "../models/AnonymousModel";

import { anonymous } from "./anonymous";
dotenv.config();

async function importData() {
  try {
    //  await User.create(users);
     await Product.create(products)
     await Media.create(media)
     await Message.create(messages)
     await Anonymous.create(anonymous)
    console.log("Data imported successfully");
    // User.create(users)
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}
async function deleteData() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Media.deleteMany();
    await Message.deleteMany();
    console.log("Data deleted successfully");

    // User.create(users)
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB!)
  .then((con) => console.log("connected to database successfully"));
if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}

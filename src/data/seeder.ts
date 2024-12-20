import dotenv from "dotenv";
import { users } from "./user";
import { products } from "./products";
import {media} from './media'
import mongoose from "mongoose";
import User from "../models/userModel";
import { Product } from "../models/productModel";
import { Media } from "../models/mediaModel";
dotenv.config();

async function importData() {
  try {
     await User.create(users);
     await Product.create(products)
     await Media.create(media)
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

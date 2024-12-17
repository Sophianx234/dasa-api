import { exit } from "process";
import dotenv from 'dotenv'
import {users} from './user'
import mongoose from "mongoose";
import User from "../models/userModel";
dotenv.config()

async function importData() {
  try {
    await User.insertMany(users)
    // User.create(users)
  } catch (err) {
    console.log(err);
  }
}
async function deleteData() {
  try {
    await User.deleteMany()
    // User.create(users)
  } catch (err) {
    console.log(err);
  }
}
const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB!).then(con=>console.log('connected to database successfully'))
if (process.argv[2] === "--import") {
  importData()
 
}
if (process.argv[2] === "--delete") {
  console.log("Boruto");
  deleteData()
  exit()
 
}

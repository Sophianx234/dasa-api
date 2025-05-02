import dotenv from "dotenv";
import { users } from "./user";
import { products } from "./products";
import mongoose from "mongoose";
import { media } from "./media";
import User from "../models/userModel";
import { Product } from "../models/productModel";
import { Media } from "../models/mediaModel";
import Message from "../models/messagesModel";
import { messages } from "./messages";
import Anonymous from "../models/channelModel";

import { anonymous } from "./anonymous";
import Event from "../models/eventsModel";
import { events } from "./events";
import Announcement from "../models/announcementModel";
import { announcements } from "./announcement";
import { videos } from "./videos";
dotenv.config();

async function importData() {
  try {
    //  await User.create(users);
    /* await Product.create(products);
    await Message.create(messages);
    await Announcement.create(announcements);
    await Anonymous.create(anonymous); */
    console.log("Importing media: ", media.length, "items");
    await Media.create(media);
    console.log("Importing videos: ", videos.length, "items");
    await Media.create(videos);
    
    // await Event.create(events);
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
    /* await Product.deleteMany();
    await User.deleteMany();
    await Message.deleteMany(); */
    await Media.deleteMany()
    // await Announcement.deleteMany();
    console.log("Data deleted successfully");

    // User.create(users)
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}
const DB = process.env.DATABASE?.replace('<db_password>',`${process.env.DATABASE_PASSWORD}`);

mongoose
  .connect(DB!)
  .then((con) => console.log("connected to database successfully"));
if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}

import { Request, Response } from "express";
import User from "../models/userModel";
import { ApiFeatures } from "./ApiFeatures";
export type reqQueryType = string|string[]|null

export async function getAllUsers(req:Request,res:Response){
  const features = new ApiFeatures(req.query,User.find()).filter().sort().pagination()
  const users = await features.query
      res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: {
        users,
      },
    });
}
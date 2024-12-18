import { Request, Response } from "express";
import User from "../models/userModel";
export type reqQueryType = string|string[]|null

export async function getAllUsers(req:Request,res:Response){
    const queryObj = { ...req.query };
    const excludedFields = ["field", "page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let query;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
    query = User.find(JSON.parse(queryStr));
    if (req.query.sort){
      let sortField: reqQueryType = typeof req.query.sort === "string" ? req.query.sort : null;
      if(sortField?.includes(',')) sortField = sortField.split(',').join(' ')
        query = query.sort(sortField)
  
    } 
    if(req.query.field){
      let field: reqQueryType = typeof req.query.field === 'string'? req.query.field : null;
      
      if (field?.includes(',')) field = field.split(',').join(' ')
      if(field) query = query.select(field)
          
  
    }

    if(req.query.page){
        const page = Number(req.query.page)  
        const limit = Number(req.query.limit)
        const skip = page && limit && (page-1)*limit
        if(page)
        query = query.skip(skip).limit(limit)
    }
  
    const users = await query;
    res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: {
        users,
      },
    });
}
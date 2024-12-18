import { Request, Response } from 'express'
import User from '../models/userModel'

export async function getAllImages(req:Request,res:Response){
    const queryObj = {...req.query}
    const excludedFields = ['field','page','sort','limit']
    excludedFields.forEach(el=> delete queryObj[el])
    let query;
    let queryStr = JSON.stringify(queryObj)
    console.log(queryStr)
    console.log(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
    console.log('querystr',JSON.parse(queryStr))
    
    query =  User.find(JSON.parse(queryStr))
    const users = await query
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
    
    
}
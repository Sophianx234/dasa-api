import { NextFunction, Request, Response } from "express";
export type fullfunctionProps = (req:Request,res:Response,next:NextFunction)=>Promise<void>

export async function catAsync(fn:fullfunctionProps){
    return (req:Request,res:Response,next:NextFunction)=>{
        fn(req,res,next).catch((err:string)=>next(err))
    }

    
}
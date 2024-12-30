import mongoose, { Model } from "mongoose";

export type productDocument = Document &{
       
 name:string,

description: string,
price:number,
currency:string,
category: string,
stock:number,
images:string[],
seller:string,
sellerContact: string,
ratings:number,
createdAt:string
}

export type productModel = Model<productDocument>
const productSchema = new mongoose.Schema<productDocument>({
    
 name:{
    type:String,
    require: [true, 'name is required '],
 },
description: String,
price: Number,
currency:String,
category: String,
stock: Number,
images:{
    type:[String],
    
},
seller:String,
sellerContact: String,
 ratings:{
    type: Number,
    max: 8
 },
createdAt:String
  
})


export const Product = mongoose.model<productDocument>("Product",productSchema)
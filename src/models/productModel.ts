import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    
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


export const Product = mongoose.model("Product",productSchema)
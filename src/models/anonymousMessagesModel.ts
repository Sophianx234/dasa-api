import mongoose from "mongoose";
import { anonymous } from "../data/anonymous";


const anonymousSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },

})


anonymousSchema.pre('save',function(this:any,next){
    this.timestamp = Date.now()
    next()

})


const Anonymous = mongoose.model("Anonymous",anonymousSchema)

export default Anonymous
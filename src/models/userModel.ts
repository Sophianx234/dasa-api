import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        
        name:{type:String, require:[true,'name is required']} ,
        email:{type:String, require:[true,'email is required']},
        password:{type:String, require:[true,'password is required']},
        role: {type:String,
            enum:['user','admin','guest'],
            default: 'user'
        },
        profileImage:String,
        bio:String ,
        
        status:{
            type:String,
            enum: ['active','inactive','suspended'],
            default: 'active'
        },
        createAt:{
            type: Date,
            default: Date.now(),
            select: false
        }
      },
)

const User = mongoose.model('User',userSchema)

export default User
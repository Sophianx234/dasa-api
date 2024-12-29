import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
        api_key: process.env.CLOUDINARY_PUBLIC_API_KEY, 
        api_secret: process.env.CLOUDINARY_PRIVATE_API_KEY 
    });
    


    export default cloudinary
     
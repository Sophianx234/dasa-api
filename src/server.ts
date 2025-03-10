import mongoose from "mongoose"
import app, { customError } from "./app"
import setUpSocket from "./socket"
process.on('uncaughtException',(err:customError)=>{
    console.log("UNCAUGHT EXCEPTION! Shutting down....")
        process.exit(1)

})
const DB = process.env.DATABASE?.replace('<db_password>',process.env.DATABASE_PASSWORD!)
mongoose.connect(DB!).then(con=>console.log('DB Connection Succesfull'))
const port = process.env.PORT || 571
const server = app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
setUpSocket(server)
process.on('unhandledRejection',(err:customError)=>{
    console.log(err.name,err.message)
    console.log('UNHANDLED REJECTION! 💥 Shutting donw....')
    server.close(()=>{
        process.exit(1)
        
    })
    
})


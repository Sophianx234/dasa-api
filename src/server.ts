import mongoose from "mongoose"
import app from "./app"

const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB!).then(con=>console.log('DB Connection Succesfull'))
const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
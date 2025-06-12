import { app } from "./app.js"
import { dbConnect } from "./dataBase/db.js"
const port = process.env.PORT || 8000


dbConnect()
app.listen(port,()=>{
    console.log(`sever is running on ${port}` )
})

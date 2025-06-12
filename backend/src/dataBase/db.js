import mongoose from "mongoose"

const dbConnect = async ()=>{
    try {
        const connections = mongoose.connect(process.env.MONGODB_CONNECTION_URL);
        console.log("MongoDB connected!");
        
    } catch (error) {
        console.log("MongoDB connection error", error);
        throw new Error(error.message);
    }
}

export { dbConnect };
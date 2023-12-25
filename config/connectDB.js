import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URI, {family: 4})
    } catch (error) {
        console.error(error?.message, "DB Error")
    }
}

export default connectDB
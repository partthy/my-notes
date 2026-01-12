import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)      
        console.log("Connected to Database Connected")
    } catch (error) {
        console.error("Error connecting to Database", error)
        process.exit(1)
    }
}

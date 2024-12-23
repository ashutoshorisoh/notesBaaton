import mongoose from "mongoose";

let cachedDB = null;
const uri = process.env.MONGO_URI;

const connectDB = async () => {
    if (cachedDB) {
        console.log("Using cachedDB");
        return cachedDB;
    }

    console.log("Creating new connection");

    try {
        const db = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDB = db;
        console.log("New connection established");
        return db;
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        throw new Error("Connection failed");
    }
};

export default connectDB;

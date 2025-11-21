import mongoose from "mongoose";

const dbConnect = async () => {
    const db = process.env.CONNECTION_STRING;

    if (!db) {
        throw new Error("Database URL not provided...");
    }

    try {
        await mongoose.connect(db, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Database connected successfully...");
    } catch (err:any) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};

export default dbConnect;

import mongoose from "mongoose"

const dbConnect = () => {
    const db = process.env.CONNECTION_STRING;
    if(!db){
        throw new Error("Database port not provided...");
    }
    try {
        mongoose.connect(db);
        console.log("Database connected successfully....");
    } catch (err) {
        console.log("Database Disconnected....");
        process.exit(1);

    }
}

export default dbConnect
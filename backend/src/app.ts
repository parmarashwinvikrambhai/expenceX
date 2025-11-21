import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/auth-routes.js";
import categoryRoute from "./routes/category-routes.js";
import transactionRoute from "./routes/transaction-routes.js";

dotenv.config();

dbConnect();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,   
        credentials: true,
    })
);

// Extra headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use("/api/auth", userRoute);
app.use("/category", categoryRoute);
app.use("/transaction", transactionRoute);

app.get("/", (req, res) => {
    res.send("Backend running ✔");
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

const allowedOrigins = [
    "https://expencex-1.onrender.com",
    "https://expencex.onrender.com",
    "http://localhost:5173",
];

app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(cookieParser());

// disable cache
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

// Routes
app.use("/api/auth", userRoute);
app.use("/api", categoryRoute);
app.use("/api", transactionRoute);

app.get("/", (req, res) => {
    res.send("Backend running ✔");
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

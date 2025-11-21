import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/auth-routes";
import categoryRoute from "./routes/category-routes";
import transactionRoute from "./routes/transaction-routes";

dotenv.config();

dbConnect();
const app = express();

// ✅ CORS must be at very top
app.use(cors({
    origin: ["https://expencex-1.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// (optional) handle OPTIONS for all routes
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use("/api/auth", userRoute);
app.use("/api", categoryRoute);
app.use("/api", transactionRoute);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

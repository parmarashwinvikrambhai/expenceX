import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/db";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRoute from "./routes/auth-routes"
import categoryRoute from "./routes/category-routes"
import transactionRoute from "./routes/transaction-routes"

dotenv.config();


dbConnect();
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: ["http://localhost:5173", "https://expencex-1.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use("/api/auth",userRoute);
app.use("/api", categoryRoute);
app.use("/api", transactionRoute);



const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Your server is Running on http://localhost:${PORT}`);
    
});

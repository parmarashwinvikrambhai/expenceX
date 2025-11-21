import express from "express"
import { isAuthorizedUser } from "../middlewares/auth-middleware";
import { createTransaction, getTransaction, deleteTransaction, updateTransaction } from "../controllers/transaction-controller";
const route = express.Router();


route.post("/create-transaction", isAuthorizedUser, createTransaction);
route.get("/transaction", isAuthorizedUser, getTransaction);
route.delete("/delete-transaction/:id", isAuthorizedUser, deleteTransaction);
route.put("/update-transaction/:id", isAuthorizedUser, updateTransaction);




export default route


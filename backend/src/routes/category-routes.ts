import express from "express"
import { createCategory, getCategory, deleteCategory, updateCategory } from "../controllers/category-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();


route.post("/add-category", isAuthorizedUser,createCategory);
route.get("/category", isAuthorizedUser,getCategory);
route.delete("/delete-category/:id", isAuthorizedUser, deleteCategory);
route.put("/update-category/:id", isAuthorizedUser, updateCategory);




export default route

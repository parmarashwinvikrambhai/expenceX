import express from "express"
import { createUser, loginUser, logoutUser, checkAuth, getProfile, updateUser, changePassword, updateProfilePic, forgotPassword, resetPassword } from "../controllers/auth-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
import { upload } from "../middlewares/upload";
const route = express.Router();


route.post("/register", createUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
route.get("/check", checkAuth);
route.get("/profile", isAuthorizedUser,getProfile);
route.put("/edit-profile", isAuthorizedUser, updateUser);
route.put("/change-password", isAuthorizedUser, changePassword);
route.post("/profile-pic", isAuthorizedUser,upload.single("image"), updateProfilePic);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:token", resetPassword);









export default route
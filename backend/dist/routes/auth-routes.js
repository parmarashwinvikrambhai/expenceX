"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth-controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const upload_1 = require("../middlewares/upload");
const route = express_1.default.Router();
route.post("/register", auth_controller_1.createUser);
route.post("/login", auth_controller_1.loginUser);
route.post("/logout", auth_controller_1.logoutUser);
route.get("/check", auth_controller_1.checkAuth);
route.get("/profile", auth_middleware_1.isAuthorizedUser, auth_controller_1.getProfile);
route.put("/edit-profile", auth_middleware_1.isAuthorizedUser, auth_controller_1.updateUser);
route.put("/change-password", auth_middleware_1.isAuthorizedUser, auth_controller_1.changePassword);
route.post("/profile-pic", auth_middleware_1.isAuthorizedUser, upload_1.upload.single("image"), auth_controller_1.updateProfilePic);
route.post("/forgot-password", auth_controller_1.forgotPassword);
route.post("/reset-password/:token", auth_controller_1.resetPassword);
exports.default = route;
//# sourceMappingURL=auth-routes.js.map
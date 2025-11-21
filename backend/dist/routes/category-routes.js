"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category-controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const route = express_1.default.Router();
route.post("/add-category", auth_middleware_1.isAuthorizedUser, category_controller_1.createCategory);
route.get("/category", auth_middleware_1.isAuthorizedUser, category_controller_1.getCategory);
route.delete("/delete-category/:id", auth_middleware_1.isAuthorizedUser, category_controller_1.deleteCategory);
route.put("/update-category/:id", auth_middleware_1.isAuthorizedUser, category_controller_1.updateCategory);
exports.default = route;
//# sourceMappingURL=category-routes.js.map
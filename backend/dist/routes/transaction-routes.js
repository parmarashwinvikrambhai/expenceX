"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const transaction_controller_1 = require("../controllers/transaction-controller");
const route = express_1.default.Router();
route.post("/create-transaction", auth_middleware_1.isAuthorizedUser, transaction_controller_1.createTransaction);
route.get("/transaction", auth_middleware_1.isAuthorizedUser, transaction_controller_1.getTransaction);
route.delete("/delete-transaction/:id", auth_middleware_1.isAuthorizedUser, transaction_controller_1.deleteTransaction);
route.put("/update-transaction/:id", auth_middleware_1.isAuthorizedUser, transaction_controller_1.updateTransaction);
exports.default = route;
//# sourceMappingURL=transaction-routes.js.map
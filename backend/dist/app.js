"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const category_routes_1 = __importDefault(require("./routes/category-routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction-routes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api", category_routes_1.default);
app.use("/api", transaction_routes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Your server is Running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_js_1 = __importDefault(require("./routes/auth-routes.js"));
const category_routes_js_1 = __importDefault(require("./routes/category-routes.js"));
const transaction_routes_js_1 = __importDefault(require("./routes/transaction-routes.js"));
dotenv_1.default.config();
(0, db_js_1.default)();
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://expencex-1.onrender.com",
    "https://expencex.onrender.com",
    "http://localhost:5173",
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
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
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// disable cache
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});
// Routes
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api", category_routes_js_1.default);
app.use("/api", transaction_routes_js_1.default);
app.get("/", (req, res) => {
    res.send("Backend running ✔");
});
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map
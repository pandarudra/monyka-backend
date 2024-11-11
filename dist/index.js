"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./dbConfigs/db");
const route_1 = __importDefault(require("./router/route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", route_1.default);
(0, db_1.connectDB)().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

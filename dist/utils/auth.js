"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.genRefreshToken = exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const reftoken = process.env.REF_TOKEN_SECRET;
const genToken = (user) => {
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }
    return jsonwebtoken_1.default.sign({ uid: user.uid, email: user.email }, jwtSecret, {
        expiresIn: "1h",
    });
};
exports.genToken = genToken;
const genRefreshToken = (user) => {
    if (!reftoken) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in .env file");
    }
    return jsonwebtoken_1.default.sign({ uid: user.uid, email: user.email }, reftoken, {
        expiresIn: "7d",
    });
};
exports.genRefreshToken = genRefreshToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwtSecret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, reftoken);
};
exports.verifyRefreshToken = verifyRefreshToken;

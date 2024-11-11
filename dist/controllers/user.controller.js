"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const uuid_1 = require("uuid");
const hash_1 = require("../utils/hash");
const auth_1 = require("../utils/auth");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, role } = req.body;
    try {
        const alreadyExists = yield user_model_1.User.findOne({ email });
        if (alreadyExists) {
            res.status(400).json({ message: "User with email already exists" });
        }
        const user = new user_model_1.User({
            email,
            password: yield (0, hash_1.hash)(password),
            firstName,
            lastName,
            role,
            uid: (0, uuid_1.v4)(),
        });
        user.reftoken = (0, auth_1.genRefreshToken)(user);
        yield user.save();
        const token = (0, auth_1.genToken)(user);
        return res.status(201).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!(0, hash_1.compare)(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = (0, auth_1.genToken)(user);
        const reftoken = (0, auth_1.genRefreshToken)(user);
        user.reftoken = reftoken;
        yield user.save();
        return res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reftoken } = req.body;
    try {
        const decoded = (0, auth_1.verifyRefreshToken)(reftoken);
        const user = yield user_model_1.User.findOne({ uid: decoded.uid, email: decoded.email });
        if (!user || user.reftoken !== reftoken) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }
        const newToken = (0, auth_1.genToken)(user);
        return res.status(200).json({ token: newToken, user });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reftoken } = req.body;
    try {
        const decoded = (0, auth_1.verifyRefreshToken)(reftoken);
        const user = yield user_model_1.User.findOne({ uid: decoded.uid, email: decoded.email });
        if (!user || user.reftoken !== reftoken) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }
        user.reftoken = "";
        yield user.save();
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.logout = logout;

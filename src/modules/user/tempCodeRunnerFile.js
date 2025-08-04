import express from "express";
import { registerUser, verifyEmail, loginUser} from "./user.controller.js";
import { checkEmail } from "../../utilities/middleware/checkEmail.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";

export const userRoutes = express.Router();

userRoutes.post("/register", checkEmail, registerUser);

userRoutes.get("/verify/:token", verifyEmail);

userRoutes.post("/login", loginUser);

userRoutes.get("/profile", verifyToken, getProfile);



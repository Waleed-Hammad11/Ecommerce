// src/modules/user/user.routes.js
import express from "express";
import {registerUser, verifyAccount, loginUser} from "./user.controller.js";
import { checkEmail } from "../../utilities/middleware/checkEmail.js";

export const userRoutes = express.Router();

userRoutes.post("/register", checkEmail, registerUser);

userRoutes.get("/verify/:token", verifyAccount);

userRoutes.post("/login", loginUser);




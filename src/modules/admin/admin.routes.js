import express from "express";
import { getAllUsers, deleteUserById} from "./admin.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";

export const adminRoutes = express.Router();

adminRoutes.use(verifyToken, isAdmin);

adminRoutes.get("/users", getAllUsers);

adminRoutes.delete("/users/:id", deleteUserById);



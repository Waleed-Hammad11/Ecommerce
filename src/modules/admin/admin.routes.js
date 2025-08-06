import express from "express";
import { getAllUsers, deleteUserById} from "./admin.controller.js";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";

export const adminRoutes = express.Router();

adminRoutes.get("/users",verifyToken,isAdmin, getAllUsers);

adminRoutes.delete("/users/:id",verifyToken,isAdmin, deleteUserById);



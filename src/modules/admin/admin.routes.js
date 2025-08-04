import express from "express";
import { getAllUsers, deleteUserById, getAllProducts, getAllCarts} from "./admin.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";

export const adminRoutes = express.Router();

adminRoutes.use(verifyToken, isAdmin);

adminRoutes.get("/users", getAllUsers);

adminRoutes.delete("/users/:id", deleteUserById);

adminRoutes.get("/products", getAllProducts);

adminRoutes.get("/carts", getAllCarts);


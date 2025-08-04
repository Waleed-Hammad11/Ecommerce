import express from "express";
import { getCartById, adminDeleteCartItem, getAllCarts} from "./cart.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";

export const adminCartRoutes = express.Router();

adminCartRoutes.use(verifyToken);
adminCartRoutes.use(isAdmin);

adminCartRoutes.get("/", getAllCarts);        
adminCartRoutes.get("/:id", getCartById);      
adminCartRoutes.delete("/:id", adminDeleteCartItem); 

import express from "express";
import { getCartById, adminDeleteCartItem, getAllCarts, adminDeleteCart} from "./cart.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";

export const adminCartRoutes = express.Router();

adminCartRoutes.get("/",verifyToken, isAdmin, getAllCarts);        
adminCartRoutes.get("/:id",verifyToken, isAdmin, getCartById);      
adminCartRoutes.delete("/:cartId/:productId",verifyToken, isAdmin, adminDeleteCartItem); 
adminCartRoutes.delete("/:cartId",verifyToken, isAdmin,adminDeleteCart); 

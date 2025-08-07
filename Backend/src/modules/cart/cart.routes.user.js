import express from "express";
import { addToCart, getMyCart, updateMyCart, deleteCart,deleteCartItem } from "./cart.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
export const userCartRoutes = express.Router();

userCartRoutes.post("/add",verifyToken, addToCart);
userCartRoutes.get("/my-cart",verifyToken, getMyCart);
userCartRoutes.put("/update",verifyToken, updateMyCart);
userCartRoutes.delete("/delete-item/:productId",verifyToken, deleteCartItem);
userCartRoutes.delete("/clear",verifyToken, deleteCart);

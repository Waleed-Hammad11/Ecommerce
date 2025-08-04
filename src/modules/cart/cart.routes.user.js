import express from "express";
import { addToCart, getMyCart, updateMyCart, deleteMyCart } from "./cart.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
export const userCartRoutes = express.Router();

userCartRoutes.use(verifyToken);

userCartRoutes.post("/add", addToCart);
userCartRoutes.get("/my-cart", getMyCart);
userCartRoutes.put("/update", updateMyCart);
userCartRoutes.delete("/clear", deleteMyCart);

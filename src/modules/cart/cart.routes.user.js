import express from "express";
import { addToCart, getMyCart, updateMyCart, deleteMyCart} from "./cart.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
export const userCartRoutes = express.Router();

userCartRoutes.use(verifyToken); 

userCartRoutes.post("/", addToCart);       
userCartRoutes.get("/", getMyCart);        
userCartRoutes.put("/", updateMyCart);      
userCartRoutes.delete("/", deleteMyCart);   

import express from 'express';
import { getAllProducts, getProductById } from "./product.controller.js";

export const userProductRoutes = express.Router();

userProductRoutes.get("/getAll", getAllProducts);
userProductRoutes.get("/:id", getProductById);

import express from 'express'
import { getAllProducts } from "./product.controller.js";

export const userRoutes = express.Router()

router.get("/getAll", getAllProducts);


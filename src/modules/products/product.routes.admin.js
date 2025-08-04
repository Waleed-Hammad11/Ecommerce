import express from "express";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";
import { addProduct, getAllProducts, updateProduct, deleteProduct, getProductById} from "./product.controller.js";

export const adminProductRoutes = express.Router();

adminProductRoutes.post("/add", isAdmin, addProduct);
adminProductRoutes.put("/update/:id", isAdmin, updateProduct);
adminProductRoutes.delete("/delete/:id", isAdmin, deleteProduct);
adminProductRoutes.get("/getAll", isAdmin, getAllProducts);
adminProductRoutes.get("/:id", isAdmin, getProductById);

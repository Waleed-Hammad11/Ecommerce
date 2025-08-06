import express from "express";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";
import { addProduct, getAllProducts, updateProduct, deleteProduct, getProductById, createProductImg } from "./product.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
import { upload } from "../../utilities/middleware/multer.middleware.js";
export const adminProductRoutes = express.Router();



adminProductRoutes.post("/add",verifyToken, isAdmin, addProduct);
adminProductRoutes.put("/update/:id",verifyToken, isAdmin, updateProduct);
adminProductRoutes.delete("/delete/:id",verifyToken, isAdmin, deleteProduct);
adminProductRoutes.get("/", getAllProducts);
adminProductRoutes.get("/:id", getProductById);
adminProductRoutes.post( "/upload", verifyToken, isAdmin, upload.any(), createProductImg );

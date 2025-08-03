import express from 'express'
import { addProduct,getAllProducts,updateProduct,deleteProduct,getProductById } from "./product.controller";

export const adminRoutes = express.Router()

router.post("/add", addProduct);
router.put("/update/:id",  updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/getAll", getAllProducts);
router.get("/:id", getProductById);


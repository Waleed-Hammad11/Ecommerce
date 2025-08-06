import express from "express";
import { isAdmin } from "../../utilities/middleware/isAdmin.js";
import { addProduct, getAllProducts, updateProduct, deleteProduct, getProductById} from "./product.controller.js";
import { verifyToken } from "../../utilities/middleware/verifyToken.js";
export const adminProductRoutes = express.Router();

adminProductRoutes.use(verifyToken, isAdmin);


adminProductRoutes.post("/add", addProduct);
adminProductRoutes.put("/update/:id", updateProduct);
adminProductRoutes.delete("/delete/:id", deleteProduct);
adminProductRoutes.get("/getAll", getAllProducts);
adminProductRoutes.get("/:id", getProductById);

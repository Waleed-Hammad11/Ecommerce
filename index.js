import express from "express";
import { dbConnection } from "./db/db.connection.js";
import { userRoutes } from "./src/modules/user/user.routes.js";
import { adminRoutes } from "./src/modules/admin/admin.routes.js";
import { userProductRoutes } from "./src/modules/products/product.routes.user.js";
import { adminProductRoutes } from "./src/modules/products/product.routes.admin.js";
import { userCartRoutes } from "./src/modules/cart/cart.routes.user.js";
import { adminCartRoutes } from "./src/modules/cart/cart.routes.admin.js";

dbConnection

const app = express();
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/cart", adminCartRoutes);

app.use("/user", userRoutes);
app.use("/user/products", userProductRoutes);
app.use("/user/cart", userCartRoutes);

app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});

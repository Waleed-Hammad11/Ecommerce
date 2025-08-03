import express from "express";
import { userProductRoutes } from "./src/modules/products/product.routes.user.js";
import { userCartRoutes } from "./src/modules/cart/cart.routes.user.js";
import { adminProductRoutes } from "./src/modules/products/product.routes.admin.js";
import { adminCartRoutes } from "./src/modules/cart/cart.routes.admin.js";
import { dbConnection } from "./db/db.connection.js";
dbConnection
const app = express();


app.use("/admin/products", adminProductRoutes);
app.use("/admin/cart", adminCartRoutes);

app.use("/user/products", userProductRoutes);
app.use("/user/cart", userCartRoutes);

app.listen(3000, () => {
console.log("Server running on port 3000");
});

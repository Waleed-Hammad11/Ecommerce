import express from "express";
import { dbConnection } from "./db/db.connection";

const app = express();
dbConnection

app.listen(3000, () => {
console.log("Server running on port 3000");
});

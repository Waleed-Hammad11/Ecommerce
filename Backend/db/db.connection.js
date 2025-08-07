import mongoose from "mongoose";

export const dbConnection = mongoose
    .connect("mongodb://localhost:27017/halfEcommerce")
    .then(() => {
    console.log("DB Connected");
}).catch((err) => {console.log("DB Connection Error:", err.message);});

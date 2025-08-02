import { model, Schema } from "mongoose";

const productSchema = new Schema(
{
    title: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
    versionKey: false,
});

export const productModel = model("Product", productSchema);

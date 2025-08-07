import mongoose, { model, Schema } from "mongoose";

const cartSchema = new Schema(
{
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    products: [
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    ],
},
{
    timestamps: true,
    versionKey: false,
}
);

export const cartModel = model("Cart", cartSchema);

import { model, Schema } from "mongoose";

const cartSchema = new Schema(
{
    product : [
        {
            productId:Number,
            quantity:Number,
            createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }, 
        }
        

    ]
},
{
    timestamps: true,
    versionKey: false,
});

export const cartModel = model("Cart", cartSchema);

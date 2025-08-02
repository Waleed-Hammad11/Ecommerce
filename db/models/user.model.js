import { model, Schema } from "mongoose";

const userSchema = new Schema(
{
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export const userModel = model("User", userSchema);

import { cartModel } from "../../../db/models/cart.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { userModel } from "../../../db/models/user.model.js";

export const getAllUsers = async (req, res) => {
try {
    const users = await userModel.find();
    res.json({ message: "All users", users });
} catch (error) {
    res.status(500).json({ message: "Server Error", error });
}
};

export const deleteUserById = async (req, res) => {
try {
    const deleted = await userModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", deleted });
} catch (error) {
    res.status(500).json({ message: "Server Error", error });
}
};

export const getAllProducts = async (req, res) => {
try {
    const products = await productModel.find();
    res.json({ message: "All products", products });
} catch (error) {
    res.status(500).json({ message: "Server Error", error });
}
};

export const getAllCarts = async (req, res) => {
try {
    const carts = await cartModel.find();
    res.json({ message: "All carts", carts });
} catch (error) {
    res.status(500).json({ message: "Server Error", error });
}
};

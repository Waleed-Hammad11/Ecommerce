import { cartModel } from "../../../db/models/cart.model.js";
import { productModel } from "../../../db/models/product.model.js";

export const addToCart = async (req, res) => {
try {
    const productId = req.body.productId;
    const quantity = Number(req.body.quantity);
    const userId = req.decoded._id;

    if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
    return res.status(404).json({ message: "Product not found" });
    }

    let cart = await cartModel.findOne({ createdBy: userId });

    if (!cart) {
    const newCart = await cartModel.create({
        createdBy: userId,
        products: [{ productId, quantity }],
    });

    const populatedNewCart = await cartModel.findById(newCart._id).populate("products.productId", "title price image");

    return res.status(201).json({ message: "Cart created", cart: populatedNewCart });
    }

    const foundItem = cart.products.find(item => item.productId.toString() === productId);

    if (foundItem) {
    foundItem.quantity += quantity;
    } else {
    cart.products.push({ productId, quantity });
    }

    await cart.save();

    const populatedCart = await cartModel.findById(cart._id).populate("products.productId", "title price image");

    res.status(200).json({ message: "Cart updated successfully", cart: populatedCart });
} catch (error) { res .status(500) .json({ message: "Server error", error: error.message });
}
};



export const getMyCart = async (req, res) => {
try {
    const userId = req.decoded._id;

    const userCart = await cartModel.findOne({ createdBy: userId }).populate("products.productId", "title price image");

    if (!userCart) {
    return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Your cart items", cart: userCart, });
} catch (error) { res.status(500).json({ message: "Server error", error: error.message, });
}
};



export const getAllCarts = async (req, res) => {
try {
    const allCartItems = await cartModel.find().populate("createdBy", "username email").populate("products.productId");
    res.json({ message: "All cart items", carts: allCartItems });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};


export const getCartById = async (req, res) => {
try {
    const cartItemId = req.params.id;

    const cartItem = await cartModel.findById(cartItemId).populate("products.productId", "title price image")

    if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item retrieved", cartItem });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};



export const updateMyCart = async (req, res) => {
try {
    const userId = req.decoded._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid productId or quantity" });
    }

    const cart = await cartModel.findOne({ createdBy: userId });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.find(item => item.productId.toString() === productId);

    if (!item) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await cartModel.findById(cart._id).populate("products.productId", "title price image");

    res.status(200).json({ message: "Cart item updated", cart: updatedCart });

} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};



export const deleteCartItem = async (req, res) => {
try {
    const { productId } = req.params;

    const cart = await cartModel.findOneAndUpdate( { createdBy: req.decoded._id }, { $pull: { products: { productId } } }, { new: true } ).populate("products.productId", "title price image");

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const exist = cart.products.find(product => product.productId.toString() === productId);
    if (exist) {
        return res.status(500).json({ message: "Failed to delete product from cart" });
    }

    res.status(200).json({ message: "Cart item deleted", cart });

} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};


export const deleteCart = async (req, res) => {
try {
    const deletedCart = await cartModel.findOneAndDelete({ createdBy: req.decoded._id });

    if (!deletedCart) {
    return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully", cart: deletedCart });

} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};


export const adminDeleteCartItem = async (req, res) => {
try {
    const { cartId, productId } = req.params;

    const updatedCart = await cartModel.findByIdAndUpdate( cartId, { $pull: { products: { productId } } }, { new: true } ).populate("products.productId");

    if (!updatedCart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Product removed from cart by admin", cart: updatedCart });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

export const adminDeleteCart = async (req, res) => {
try {
    const { cartId } = req.params;

    const deletedCart = await cartModel.findByIdAndDelete(cartId);

    if (!deletedCart) {
    return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully by admin", cart: deletedCart });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

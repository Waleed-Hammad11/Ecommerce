import { cartModel } from "../../../db/models/cart.model.js";

// Add item to cart by use)
export const addToCart = async (req, res) => {
try {
    const { productId, quantity } = req.body;

    const cartItem = await cartModel.create({
    productId,
    quantity,
    createdBy: req.user._id
    });

    res.status(201).json({ message: "Item added to cart", cartItem });
} catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
}
};

//for user get my cart 
export const getMyCart = async (req, res) => {
try {
    const userId = req.user._id;

    const userCartItems = await cartModel.find({ createdBy: userId }).populate("productId");

    res.json({ message: "Your cart items", cart: userCartItems });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};

// for Admin
export const getAllCarts = async (req, res) => {
try {
    const allCartItems = await cartModel.find().populate("productId createdBy");

    res.json({ message: "All cart items", carts: allCartItems });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};


//for admin 
export const getCartById = async (req, res) => {
try {
    const cartItemId = req.params.id;

    const cartItem = await cartModel.findById(cartItemId).populate("productId");

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
    const { quantity } = req.body;

    const cartItem = await cartModel.findOneAndUpdate(
    {
        _id: req.params.id,
        createdBy: req.user._id
    },
    { quantity },
    { new: true }
    );

    if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    res.json({ message: "Cart item updated", cartItem });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

// Delete cart item
export const deleteMyCart = async (req, res) => {
try {
    const cartItem = await cartModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
    });

    if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    res.json({ message: "Cart item deleted", cartItem });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

//for Admin Delete any cart item by ID
export const adminDeleteCartItem = async (req, res) => {
try {
    const cartItem = await cartModel.findByIdAndDelete(req.params.id);

    if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted by admin", cartItem });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

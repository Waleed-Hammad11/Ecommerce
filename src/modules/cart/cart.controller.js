import { cartModel } from "../../../db/models/cart.model.js";

export const addToCart = async (req, res) => {
try {
    const { productId, quantity } = req.body;
    const userId = req.decoded.id;

    const product = await ProductModel.findById(productId);
    if (!product) {
    return res.status(404).json({ message: "المنتج غير موجود" });
    }

    let cart = await cartModel.findOne({ createdBy: userId });

    if (!cart) {
    const newCart = await cartModel.create({
        createdBy: userId,
        items: [{ product: productId, quantity }],
    });
    return res.status(201).json({ message: "تم إنشاء الكارت", cart: newCart });
    }

    const foundItem = cart.items.find(
    (item) => item.product.toString() === productId
    );

    if (foundItem) {
    foundItem.quantity += quantity;
    } else {
    cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "تم تحديث الكارت", cart });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "حصل خطأ داخلي", error });
}
};


export const getMyCart = async (req, res) => {
try {
    const userId = req.user._id;

    const userCartItems = await cartModel.find({ createdBy: userId }).populate("productId");

    res.json({ message: "Your cart items", cart: userCartItems });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};

export const getAllCarts = async (req, res) => {
try {
    const allCartItems = await cartModel.find().populate("productId createdBy");
    res.json({ message: "All cart items", carts: allCartItems });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};


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

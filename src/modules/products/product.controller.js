import { productModel } from "../../../db/models/product.model.js";

export const getAllProducts = async (req, res) => {
try {
    const products = await productModel.find();
    res.json({ message: "Products:", products });
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

export const getProductById = async (req, res) => {
try {
    const product = await productModel.findById(req.params.id);
    if (product) {
        res.json({ message: "Found product:", product });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

export const updateProduct = async (req, res) => {
try {
    const product = await productModel.findByIdAndUpdate(req.params.id,req.body,{ new: true } 
    );

    if (product) {
        res.json({ message: "Product updated:", product });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

export const deleteProduct = async (req, res) => {
try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (product) {
        res.json({ message: "Product deleted:", product });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
} catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
}
};

export const addProduct = async (req, res) => {
try {
    const product = await productModel.create(req.body);
    res.status(201).json({ message: "Product created", product });
} catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
}
};

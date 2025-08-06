import { productModel } from "../../../db/models/product.model.js";

export const getAllProducts = async (req, res) => {
try {
    const products = await productModel.find();
    res.json({ message: "All products", data: products });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};



export const getProductById = async (req, res) => {
try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
    return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product found", data: product });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};


export const addProduct = async (req, res) => {
try {
    const newProduct = await productModel.create({...req.body,createdBy: req.decoded._id});
    res.status(201).json({ message: "Product added", data: newProduct });
} catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
}
};


export const updateProduct = async (req, res) => {
try {
    const updated = await productModel.findByIdAndUpdate(req.params.id,req.body,{ new: true });

    if (!updated) {
        return res.status(404).json({ message: "Product not found" });
}

    res.json({ message: "Product updated", data: updated });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};



export const deleteProduct = async (req, res) => {
try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", data: deleted });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};



export const createProductImg = (req, res) => {
try {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedFile = req.files[0];
    return res.status(200).json({ message: "Upload successful ",  fileInfo: uploadedFile});
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
}
};



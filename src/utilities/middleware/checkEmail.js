import { userModel } from "../../../db/models/user.model.js";

export const checkEmail = async (req, res, next) => {
try {
    const exist = await userModel.findOne({ email: req.body.email });

    if (exist) {
    return res.status(400).json({
        message: "User already registered. Please login.",
    });
    }

    next();
    
} catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}
};

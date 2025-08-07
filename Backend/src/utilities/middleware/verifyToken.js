import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
const token = req.headers.token;
if (!token) return res.status(401).json({ message: "Token required" });

jwt.verify(token, "NTIG7", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.decoded = decoded; 
    next();
});
};

export const isAdmin = (req, res, next) => {
if (req.decoded.role === "admin") return next();
    return res.status(403).json({ message: "Access Denied: Admins only" });
};
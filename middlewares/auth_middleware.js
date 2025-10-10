const jwt = require("jsonwebtoken");

// Authenticate user via JWT
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token=token// { id, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// Authorize specific roles
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.user?.user?.roles; // 👈 adjust for nested object
        if (!roles) {
            return res.status(403).json({ message: "Forbidden: No roles found" });
        }

        const hasRole = roles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
        }

        next();
    };
};





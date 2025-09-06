const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; 

// Middleware function
const auth = (req, res, next) => {
  try {
    // 1. Token header se nikalna
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2. Token verify karna
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. User info req.user me dal dena
    req.user = decoded;

    // 4. Next middleware ya route handler ko call karna
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;

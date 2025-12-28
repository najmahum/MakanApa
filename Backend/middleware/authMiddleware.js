import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("REQ HEADERS:", req.headers);

    const header = req.headers.authorization;
    console.log("RAW AUTH HEADER:", header);

    const token = header?.split(" ")[1];
    console.log("PARSED TOKEN:", token);

    if (!token) {
        return res.status(401).json({ message: "Token tidak ada" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED JWT:", decoded);
        
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: "Token tidak valid" });
    }
}
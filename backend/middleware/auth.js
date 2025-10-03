import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You can attach the decoded user data to request
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

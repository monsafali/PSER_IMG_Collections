// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token =
//     req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // You can attach the decoded user data to request
//     next();
//   } catch (error) {
//     res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token." });
//   }
// };



import jwt from "jsonwebtoken";
import User from '../model/user.modle.js';



export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ THIS LINE IS IMPORTANT

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const protectAuth = async (req, res, next) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // verify the token
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return null
            } else {
                return decoded
            }
        })
        if (!decodedToken) {
            return res.json("Invalid  token")
        }

         // find user from the decoded token
        const user = await User.findById(decodedToken._id)
         if (!user) {
            return res.json("User not found")
         }
        req.user = user
        next()
    } catch (error) {
    console.error("Protect auth middleware error:", error);
    }

}
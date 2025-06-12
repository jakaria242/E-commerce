
export const adminAuth = async (req, res, next) => {

    try {
         if (req.user.role === "user" && req.user.role === "seller") {
             return res.send("access denide")
            }
            next()
    } catch (error) {
    console.error("Admin auth middleware error:", error);
    }

}
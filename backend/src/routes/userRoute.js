import express from "express"
import { createUser, emailVerify, login, userUpdate, logout } from "../controllers/userController.js"
import { upload } from "../midddlewares/multerMiddleware.js"
import { protectAuth } from "../midddlewares/protectauthMiddleware.js"


const router = express.Router()

router.route("/user/registration").post(createUser)
router.route("/user/:link").get(emailVerify)
router.route("/user/login").post(login)
router.route("/user/update").post(protectAuth, upload.single("profileImage"), userUpdate)
router.route("/user/logout").post(protectAuth, logout)



export default router
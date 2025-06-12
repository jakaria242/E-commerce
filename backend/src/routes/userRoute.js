import express from "express"
import { createUser, emailVerify } from "../controllers/userController.js"

const router = express.Router()

router.route("/user/registration").post(createUser)
router.route("/user/:link").get(emailVerify)


export default router
import express from "express"
import { processRegister } from "../controllers/userController.js"
import { userValidationRules } from "../validators/validationRules.js"
import runValidation from "../validators/validationRequest.js"
import upload from "../utils/multerUpload.js"

const userRouter = express.Router()

userRouter.post(
  "/register",
  upload.single("image"),
  userValidationRules,
  runValidation,
  processRegister
)

export default userRouter

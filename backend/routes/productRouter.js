import express from "express"
import { uploadProduct } from "../controllers/productController.js"
import upload from "../utils/multerUpload.js"
import runValidation from "../validators/validationRequest.js"
import { uploadProductValidationRules } from "../validators/validationRules.js"
import { isAdmin, isEmployee, isLoggedIn } from "../middlewares/auth.js"

const productRouter = express.Router()

productRouter.post(
  "/upload",
  upload.single("image"),
  uploadProductValidationRules,
  runValidation,
  uploadProduct
)

export default productRouter

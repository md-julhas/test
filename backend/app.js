import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import createHttpError from "http-errors"
import helmet from "helmet"
import cookiesParser from "cookie-parser"
import rateLimit from "express-rate-limit"

import { errorResponse, successReponse } from "./utils/responseHandlers.js"
import productRouter from "./routes/productRouter.js"
import userRouter from "./routes/userRouter.js"
import authRouter from "./routes/authRouter.js"
import adminRouter from "./routes/adminRouter.js"
import employeeRouter from "./routes/employeeRouter.js"

const app = express()

app.use(
  cors({
    origin: "https://test-three-rose-34.vercel.app",
    credentials: true,
  }),
)

// app.set("trust proxy", 2)
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 1000,
  message: "To many req from this IP, please try again later",
})

// app.use(limiter)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookiesParser())

// Test route
app.get("/test", (req, res) => {
  successReponse(res, {
    statusCode: 201,
    message: "Test route API is working properly!",
  })
})

// Routes
app.use("/api/products", productRouter)
app.use("/api/users", userRouter)

app.use("/api/auth", authRouter)

app.use("/api/admin", adminRouter)
app.use("/api/employee", employeeRouter)

// 404 error hanlde
app.use((req, res, next) => {
  next(createHttpError(404, "Route not found!"))
})

// Centralized error hanlder
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message })
})

export default app

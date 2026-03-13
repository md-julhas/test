import express from "express"
import { successReponse } from "../utils/responseHandlers.js"
import { isEmployee, isLoggedIn, isVerified } from "../middlewares/auth.js"

const employeeRouter = express.Router()

employeeRouter.use(isLoggedIn)

employeeRouter.get("/dashboard", (req, res) => {
  successReponse(res, {
    statusCode: 201,
    message: "You have access employee dashboard panel successfully!",
  })
})
employeeRouter.get("/create-invoice", (req, res) => {
  successReponse(res, {
    statusCode: 201,
    message: "create invoice",
  })
})
employeeRouter.get("/add-cost", (req, res) => {
  successReponse(res, {
    statusCode: 201,
    message: "cost added",
  })
})

export default employeeRouter

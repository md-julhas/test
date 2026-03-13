import createHttpError from "http-errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { streamUpload } from "../utils/cloudinaryStreamUpload.js"
import { successReponse } from "../utils/responseHandlers.js"
import User from "../models/userModel.js"
import createjwtToken from "../utils/jsonwebtoken.js"
import sendEmailWithNodemailer from "../utils/sendEmailWithNodemailer.js"

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, address, phone } = req.body

    const existingUser = await User.exists({ email: email })
    if (existingUser) {
      throw createHttpError(409, "Email already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    })

    const tokenPayload = { id: newUser._id }
    const token = createjwtToken(
      tokenPayload,
      process.env.JWT_SECRET_KEY,
      "10m",
    )

    return successReponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      payload: { token },
    })
  } catch (error) {
    next(error)
  }
}

export { processRegister }

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

    if (!req.file?.buffer) {
      throw createHttpError(400, "Image file is required")
    }

    if (req.file.buffer.length > 500 * 1024) {
      throw createHttpError(400, "Image must be less than 500KB")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Upload image
    let uploadResult
    try {
      uploadResult = await streamUpload(req.file.buffer, "invoice/users")
    } catch (err) {
      throw createHttpError(500, "Failed to upload image")
    }

    const { secure_url, public_id } = uploadResult || {}
    if (!secure_url || !public_id) {
      throw createHttpError(500, "Invalid image upload response")
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      image: secure_url,
      cloudinaryId: public_id,
    })

    const tokenPayload = { id: newUser._id }
    const token = createjwtToken(
      tokenPayload,
      process.env.JWT_SECRET_KEY,
      "10m"
    )

    const emailData = {
      email,
      subject: "Account Activation Email From Tajir Business Hub",
      text: `Hi, ${name}\n\nPlease activate your account using the link below:\n${process.env.CLIENT_URL}/verify/${token}\n\nThank you!`,
      html: `
        <!DOCTYPE html>
        <html>
        <body>
          <p><b>Hi, ${name}</b></p>
          <p>Click here to <a href="${process.env.CLIENT_URL}/verify/${token}" target="_blank" rel="noopener noreferrer">activate your account</a></p>
          <p>Thank you!</p>
        </body>
        </html>
      `,
    }
    await sendEmailWithNodemailer(emailData)

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

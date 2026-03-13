import createHttpError from "http-errors"

export function checkRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      throw createHttpError(401, "Unauthorized user")
    }

    if (req.user.role !== role) {
      throw createHttpError(403, "Forbidden - Wrong role")
    }

    next()
  }
}

// import { Readable } from "stream"
// import cloudinary from "./cloudinary.js"

// export const streamUpload = (buffer, folder = "invoice/users") => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder },
//       (error, result) => {
//         if (result) resolve(result)
//         else reject(error)
//       }
//     )

//     // const readable = new Readable()
//     // readable._read = () => {}
//     // readable.push(buffer)
//     // readable.push(null)
//     // readable.pipe(stream)
//     const readbale = Readable.from(buffer)
//     readbale.pipe(stream)
//   })
// }

export const streamUpload = (buffer, folder = "invoice/users") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error)
          return reject(error)
        }
        resolve(result)
      }
    )

    const readable = new Readable()
    readable._read = () => {}
    readable.push(buffer)
    readable.push(null)

    readable.pipe(stream)
  })
}

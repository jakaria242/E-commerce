import { v2 as cloudinary } from 'cloudinary'
import { unlinkSync } from 'fs'

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, 
})

export const cloudinaryUpload = async (path, public_id, folder) => {
  let uploadResult

  try {
       // Upload an image
       uploadResult = await cloudinary.uploader.upload(path, {
        public_id,
        folder
      })
      unlinkSync(path)
    } catch(error) {
        unlinkSync(path)
        console.error("Upload error",error)
        return {error: "Upload failed", uploadResult: null } // return error object
      }

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    })

    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: 'fill',
      gravity: 'auto',
      width: 500,
      height: 500,
    })

    return { uploadResult, optimizeUrl, autoCropUrl }
 
}
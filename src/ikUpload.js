// Cloudinary unsigned upload
import { IK_CONFIG } from './imagekit'

export async function uploadToImageKit(file, folder = 'store', resourceType = 'auto') {
  const isVideo = file.type.startsWith('video/')
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024*1024)).toFixed(1)
    const maxMB = (maxSize / (1024*1024)).toFixed(0)
    throw new Error(`File too large. Maximum size is ${maxMB}MB for ${isVideo ? 'videos' : 'images'}. Your file is ${sizeMB}MB.`)
  }

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const resource = isVideo ? 'video' : 'image'
  const uploadUrl = `https://api.cloudinary.com/v1_1/${IK_CONFIG.cloudName}/${resource}/upload`

  const formData = new FormData()
  formData.append('file', `data:${file.type};base64,${base64}`)
  formData.append('upload_preset', 'store folder')
  formData.append('folder', folder)

  const response = await fetch(uploadUrl, { method: 'POST', body: formData })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }

  const result = await response.json()

  return {
    url: result.secure_url,
    fileId: result.public_id,
    name: result.original_filename,
    filePath: result.public_id,
  }
}

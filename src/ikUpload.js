// Cloudinary unsigned upload
import { IK_CONFIG } from './imagekit'

export function uploadToImageKit(file, folder = 'store', resourceType = 'auto', onProgress) {
  const isVideo = resourceType === 'video' || (resourceType === 'auto' && file.type.startsWith('video/'))
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0)
    return Promise.reject(
      new Error(`حجم الملف كبير جداً. الحد الأقصى هو ${maxMB}MB (${sizeMB}MB مرفوع).`)
    )
  }

  const resource = isVideo ? 'video' : 'image'
  const uploadUrl = `https://api.cloudinary.com/v1_1/${IK_CONFIG.cloudName}/${resource}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'store folder')
  formData.append('folder', folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText || '{}')
        if (xhr.status >= 200 && xhr.status < 300 && result.secure_url) {
          resolve({
            url: result.secure_url,
            fileId: result.public_id,
            name: result.original_filename,
            filePath: result.public_id,
          })
        } else {
          reject(new Error(result.error?.message || 'فشل رفع الملف'))
        }
      } catch {
        reject(new Error('استجابة غير صالحة من الخادم'))
      }
    }

    xhr.onerror = () => reject(new Error('تعذر الاتصال بخدمة رفع الملفات'))
    xhr.send(formData)
  })
}

# ImageKit Integration Guide

## ✅ What's Configured

Your website is now integrated with ImageKit for optimized image delivery and uploads.

**Your ImageKit Account:**
- **URL Endpoint:** `https://ik.imagekit.io/fyh4tg6ec`
- **Public Key:** `public_iGMOMBB2CyjuyjlIxT02UjEPguU=`
- **ImageKit ID:** `fyh4tg6ec`

## 🔧 Required Setup in ImageKit Dashboard

To enable image uploads from the admin panel, you **must** enable unsigned uploads:

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Navigate to **Settings** → **API Keys**
3. Find **"Unsigned file upload"** section
4. Toggle **Enable unsigned uploads** to ON
5. Save changes

Without this, uploads from the admin panel will fail with authentication errors.

## 📁 How It Works

### Image Uploads (Admin Panel)
- When you upload an image in the admin panel, it's sent directly to ImageKit
- Images are stored in the `/hilaly-moving/gallery` folder
- The ImageKit URL is saved to your content (not base64)
- No more localStorage quota issues with large images

### Image Delivery (Website)
- All gallery images are served through ImageKit's CDN
- Automatic optimization (WebP, compression, resizing)
- Faster load times and better performance
- Images are cached globally

## 🎯 Benefits

1. **No Storage Limits** — Images stored on ImageKit, not in browser localStorage
2. **Automatic Optimization** — WebP conversion, compression, lazy loading
3. **Fast CDN Delivery** — Images served from the nearest edge location
4. **Responsive Images** — Automatic resizing based on device
5. **Better SEO** — Faster page loads improve search rankings

## 🔐 Security Note

- **Public Key** is safe to expose in frontend code (it's read-only)
- **Private Key** should NEVER be in frontend code (not included here)
- Unsigned uploads are safe when enabled — they only allow uploads, not deletions

## 📝 Usage in Code

### Upload an image:
```javascript
import { uploadToImageKit } from './ikUpload'

const result = await uploadToImageKit(file, '/hilaly-moving/gallery')
console.log(result.url) // https://ik.imagekit.io/fyh4tg6ec/...
```

### Use optimized URLs:
```javascript
import { ikUrl } from './imagekit'

// Resize to 800px width, 80% quality
const optimized = ikUrl('/gallery/photo.jpg', { width: 800, quality: 80 })
```

## 🚀 Next Steps

1. Enable unsigned uploads in ImageKit dashboard (required)
2. Upload images via admin panel at `http://localhost:5173/?admin=true`
3. Images will automatically be optimized and delivered via CDN
4. Monitor usage in ImageKit dashboard

## 📊 Free Tier Limits

ImageKit free tier includes:
- 20 GB bandwidth/month
- 20 GB storage
- Unlimited transformations

This is more than enough for most small-to-medium websites.

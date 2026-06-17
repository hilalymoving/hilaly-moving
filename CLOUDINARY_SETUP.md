# ✅ Cloudinary Video Upload - Setup Complete

## What Was Changed

The upload system now supports **videos up to 100MB** through Cloudinary.

### Changes Made:
1. ✅ Increased video file size limit from 10MB to 100MB
2. ✅ Auto-detects if file is video or image
3. ✅ Uses correct Cloudinary endpoint (`/video/upload` for videos)
4. ✅ Proper MIME type handling for videos

## Important: Cloudinary Upload Preset Configuration

Your upload preset **"store folder"** needs to allow video uploads. Follow these steps:

### 1. Go to Cloudinary Settings
- Login to https://cloudinary.com/console
- Click **Settings** (gear icon) in the top right
- Click **Upload** tab in the left menu

### 2. Find Your Upload Preset
- Scroll down to **Upload presets** section
- Find the preset named **"store folder"**
- Click **Edit** (pencil icon)

### 3. Enable Video Uploads
Make sure these settings are configured:

**Signing Mode:**
- ✅ Unsigned (should already be set)

**Folder:**
- ✅ Should be set to allow custom folder names

**Resource Type:**
- ✅ Change from "Image" to **"Auto"** or **"Video"**
- This allows both images and videos

**File Size Limit:**
- ✅ Set to at least **100MB** (or leave blank for no limit)

**Allowed Formats:**
- ✅ Add video formats: `mp4, mov, avi, webm, mkv`

### 4. Save Changes
- Click **Save** at the bottom

## How to Use

### Upload Video in Admin Panel

1. Go to admin panel (`?admin=1`)
2. Click **"🖼️ الصور والفيديو"** tab
3. Under video section, click **"📤 اختر ملف فيديو"**
4. Select your video file (up to 100MB)
5. Wait for upload (shows progress)
6. Video URL will be automatically filled
7. Add title and description
8. Click **"💾 حفظ في قاعدة البيانات"**

### Supported Video Formats
- ✅ MP4 (recommended)
- ✅ MOV
- ✅ AVI
- ✅ WebM
- ✅ MKV

### File Size Limits
- **Images:** 10MB max
- **Videos:** 100MB max

## Troubleshooting

### Error: "Upload preset not found"
**Solution:** Make sure the preset name is exactly **"store folder"** (with space)

### Error: "Resource type not allowed"
**Solution:** 
1. Go to Cloudinary upload preset settings
2. Change **Resource Type** to **"Auto"**
3. Save and try again

### Error: "File too large"
**Solution:**
- For videos over 100MB, compress them first or use a URL
- Use https://www.freeconvert.com/video-compressor
- Or upload to Cloudinary manually and paste the URL

### Video Upload is Slow
**Normal behavior:**
- 10MB video: ~10-20 seconds
- 50MB video: ~1-2 minutes
- 100MB video: ~2-4 minutes

The upload button will show progress: "⏳ جارٍ الرفع إلى ImageKit..."

## Alternative: Manual Upload

If you prefer to upload large videos manually:

1. **Upload to Cloudinary Dashboard:**
   - Go to https://cloudinary.com/console/media_library
   - Click **Upload**
   - Select your video
   - Wait for upload

2. **Get the URL:**
   - Click on the uploaded video
   - Copy the URL (looks like: `https://res.cloudinary.com/dxvoir9oy/video/upload/v123456/video.mp4`)

3. **Paste in Admin Panel:**
   - Go to admin panel
   - Paste URL in **"رابط الفيديو (URL)"** field
   - No file size limit when using URLs!

## Your Cloudinary Info

- **Cloud Name:** dxvoir9oy
- **Upload Preset:** store folder
- **Dashboard:** https://cloudinary.com/console

## Next Steps

1. ✅ Verify your upload preset allows videos (see steps above)
2. ✅ Try uploading a small test video (under 10MB) first
3. ✅ If it works, try your 17.9MB video
4. ✅ For videos over 100MB, use manual upload + URL method

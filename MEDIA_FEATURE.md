# 📷🎥 Multiple Images & Videos Feature

## Overview
Your Admin Posts now supports **multiple images and videos** for each post! This enhancement allows you to create rich, multimedia posts with images from various sources and embedded videos from popular platforms.

## ✨ What's New

### Multiple Images
- ✅ Add unlimited image URLs to any post
- ✅ Preview all images before publishing
- ✅ Remove individual images easily
- ✅ Images display in an interactive carousel

### Video Support
- ✅ **YouTube** - Automatic embed with video ID extraction
- ✅ **Vimeo** - Full video player support
- ✅ **Twitter/X** - Video tweet embedding
- ✅ **TikTok** - Direct link support
- ✅ **Facebook** - Video link support
- ✅ **Direct Videos** - Support for .mp4, .webm, .mov, and more

### Interactive Media Carousel
- 🔄 Navigate through images and videos
- 🖼️ Fullscreen image viewing
- 📱 Mobile-friendly responsive design
- 🎬 Embedded video players
- 📊 Media counter and navigation

## 🚀 How to Use

### Adding Images
1. Go to **Admin Posts** page
2. Click **"Add Post"** or edit existing post
3. Navigate to the **Media** section
4. Click the **"📷 Images"** tab
5. Paste an image URL in the input field
6. Press **Enter** or click **"+ Add Image"**
7. Repeat for multiple images
8. Remove unwanted images by clicking the trash icon

### Adding Videos
1. In the **Media** section, click **"🎥 Videos"** tab
2. Paste a video URL from supported platforms:
   - YouTube: `https://youtube.com/watch?v=...` or `https://youtu.be/...`
   - Vimeo: `https://vimeo.com/...`
   - Twitter: `https://twitter.com/.../status/...` or `https://x.com/...`
   - TikTok: `https://tiktok.com/@user/video/...`
   - Direct: Any `.mp4`, `.webm`, `.mov` file URL
3. Press **Enter** or click **"+ Add Video"**
4. The system auto-detects the platform and creates the proper embed
5. Remove videos by clicking the trash icon

### Managing Media
- **Preview**: All media shows thumbnails/previews in the form
- **Order**: Media displays in the order you add them
- **Mixed**: Combine images and videos in one post
- **Navigation**: Users can browse through media using carousel arrows

## 📋 Database Migration

**IMPORTANT**: Run this SQL in your Supabase SQL Editor:

```sql
-- Add media column to support multiple images and videos
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{"images": [], "videos": []}'::jsonb;

-- Migrate existing image_url data to media column
UPDATE posts 
SET media = jsonb_build_object(
    'images', 
    CASE 
        WHEN image_url IS NOT NULL THEN jsonb_build_array(image_url)
        ELSE '[]'::jsonb
    END,
    'videos', '[]'::jsonb
)
WHERE media IS NULL OR media = '{}'::jsonb OR media = '{"images": [], "videos": []}'::jsonb;
```

## 🔧 Technical Details

### Data Structure
```javascript
{
  "media": {
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "videos": [
      {
        "url": "https://youtube.com/watch?v=xxxxx",
        "platform": "youtube",
        "videoId": "xxxxx",
        "embedUrl": "https://youtube.com/embed/xxxxx",
        "thumbnail": "https://img.youtube.com/vi/xxxxx/maxresdefault.jpg"
      }
    ]
  }
}
```

### New Files Created
- `src/utils/videoParser.js` - Video URL parsing and embed generation
- `src/components/MediaCarousel.jsx` - Media display component
- Updated: `src/pages/AdminPosts.jsx` - Form UI with media tabs
- Updated: `api/posts.js` - Backend API to handle media objects
- Updated: `supabase-migration.sql` - Database schema changes

### Backward Compatibility
- ✅ Old posts with `image_url` will still display correctly
- ✅ System automatically migrates old image URLs to new media format
- ✅ Both old and new formats work simultaneously

## 🎨 Features

### Image Features
- Direct URL input
- Instant preview
- Drag-free management
- Remove individual images
- Displays in carousel

### Video Features
- Auto-detection of video platform
- Automatic embed URL generation
- Platform-specific icons
- Thumbnail generation (where available)
- Fallback for unsupported platforms

### Display Features
- Interactive carousel with navigation arrows
- Thumbnail strip for quick navigation
- Fullscreen mode for images
- Video player controls
- Media type badges
- Media counter (e.g., "3 / 5")
- Responsive design

## 📱 Mobile Support
- Touch-friendly navigation
- Responsive video players
- Optimized image loading
- Swipe gestures (future enhancement)

## 🐛 Troubleshooting

### Images not showing?
- Check if the URL is a direct image link
- Ensure the URL is publicly accessible
- Verify CORS permissions on the image host

### Videos not embedding?
- Confirm the URL is from a supported platform
- Check if the video is public (not private/unlisted for some platforms)
- Twitter/X videos may require viewing on platform due to embed limitations

### Old posts not showing images?
- Run the database migration SQL
- Old `image_url` field is automatically migrated

## 🔮 Future Enhancements
- [ ] Drag-and-drop image reordering
- [ ] Image upload from device (instead of URLs only)
- [ ] Video thumbnail customization
- [ ] Auto-fetch images from article URLs
- [ ] Image compression and optimization
- [ ] GIF support
- [ ] Audio file support

## 📞 Support
If you encounter any issues, check:
1. Browser console for error messages
2. Supabase logs for database errors
3. Network tab for failed requests

---

**Enjoy creating rich multimedia posts! 🎉**

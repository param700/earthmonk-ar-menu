

# Update Intro Video to New Cloudinary Video

## Overview
Replace the current intro video with your new Cloudinary-hosted video (Public ID: `globsalvideo2_ptqvcd`).

## Change Required

**File:** `src/data/menuData.ts`

Update the `INTRO_VIDEO_PATH` constant at the bottom of the file:

```typescript
// Before
export const INTRO_VIDEO_PATH = "earthmonk-intro_oucm79.mp4";

// After
export const INTRO_VIDEO_PATH = "globsalvideo2_ptqvcd";
```

## How It Works
- The `VideoIntro` component in `Index.tsx` checks if the path starts with `/` (local file) or not (Cloudinary)
- Since this is a Cloudinary public ID (no leading `/`), it will be passed to `getVideoUrl()` from `lib/cloudinary.ts`
- Final URL will be: `https://res.cloudinary.com/dlnn95ku7/video/upload/q_auto,f_auto/globsalvideo2_ptqvcd`
- Cloudinary handles automatic format optimization and quality settings

## No Other Changes Needed
The existing logic in `Index.tsx` and `VideoIntro.tsx` already handles Cloudinary video paths correctly.


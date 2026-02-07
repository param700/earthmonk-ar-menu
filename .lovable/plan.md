
# Fix 3D Model Rotation/Drag for Cloudinary-Hosted Models

## Problem Identified
The Cloudinary-hosted model (`3DModel_y7evpz.glb`) has a baked-in 90-degree X-axis rotation in its node data, which conflicts with the gesture manipulation system. Additionally, the custom gesture handlers only activate in AR mode, not in the standard 3D preview.

## Root Causes
1. **Model orientation mismatch**: The Cloudinary model has a pre-applied rotation (`[0.707, 0, 0, 0.707]` quaternion = 90° X rotation) that differs from local models
2. **Touch handlers limited to AR**: The `handleTouchMove` function returns early if `!isInAR`, meaning drag/rotate gestures don't work in the regular 3D viewer
3. **CORS headers**: While the model loads (200 status), some browsers restrict interactive manipulation of cross-origin 3D content

## Solution

### Option A: Enable Gestures for Non-AR Mode (Recommended)
Modify `ModelViewer.tsx` to allow touch gestures in the standard 3D viewer, not just AR mode.

**Changes to `src/components/ModelViewer.tsx`:**

1. **Remove the AR-only check** in `handleTouchMove` to allow gestures in regular 3D view
2. **Update touch event attachment** to work outside AR mode
3. **Enable the animation loop** for non-AR mode

```text
Key code changes:
- Line 120: Remove `if (!isInAR) return;`
- Line 229: Change `if (!modelViewer || !isInAR)` to `if (!modelViewer)`
- Line 244: Change `if (!isInAR) return;` to always run animation loop
- Add state to track if gestures should be enabled (model loaded)
```

### Option B: Fix Model Orientation (If Option A Doesn't Work)
If the gestures work but the model appears wrong, compensate for the baked-in rotation:

```typescript
// In the animate function, adjust orientation to compensate:
modelViewer.orientation = `90deg ${newRotation}deg 0deg`;
```

### Option C: Use Cloudinary's Raw Delivery
Change the Cloudinary URL to use `/raw/upload/` instead of `/image/upload/` for better 3D file handling:

```typescript
// In src/lib/cloudinary.ts
export const getRawFileUrl = (publicId: string): string => {
  if (publicId.startsWith("http") || publicId.startsWith("/")) {
    return publicId;
  }
  // Use raw/upload for 3D files to avoid image processing
  return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}`;
};
```

## Recommended Implementation Order
1. First try **Option C** (change to raw/upload) - simplest fix
2. If that doesn't work, implement **Option A** (enable non-AR gestures)
3. Apply **Option B** only if orientation is visually wrong

## Technical Details

### File Changes

**`src/lib/cloudinary.ts`** - Update getRawFileUrl:
```typescript
export const getRawFileUrl = (publicId: string): string => {
  if (publicId.startsWith("http") || publicId.startsWith("/")) {
    return publicId;
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}`;
};
```

**`src/components/ModelViewer.tsx`** - Enable gestures for non-AR:
- Remove the `if (!isInAR) return;` check from `handleTouchMove`
- Attach touch listeners after model loads (not only in AR)
- Run animation loop when model is loaded

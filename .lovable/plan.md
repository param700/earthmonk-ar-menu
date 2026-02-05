

# Update Classic Tiramisu to Use Cloudinary 3D Model

## Overview
Replace the local tiramisu model with your Cloudinary-hosted 3D model (Public ID: `3DModel_y7evpz`).

## Change Required

**File:** `src/data/menuData.ts`

Update the MODEL_3D constant:

```typescript
// Before
const MODEL_3D = {
  sampleDish: "output_bk3tev.glb",
  tiramisu: "/models/tiramisu.glb", // Local model
};

// After
const MODEL_3D = {
  sampleDish: "output_bk3tev.glb",
  tiramisu: "3DModel_y7evpz.glb", // Cloudinary model
};
```

## How It Works
- The `getRawFileUrl()` function in `lib/cloudinary.ts` automatically converts the public ID to the full Cloudinary URL
- Final URL will be: `https://res.cloudinary.com/dlnn95ku7/image/upload/3DModel_y7evpz.glb`
- The `.glb` extension is required for proper file resolution

## Technical Note
No other files need changes - the `model3D` field for tiramisu already references `MODEL_3D.tiramisu`, so updating the constant value is sufficient.


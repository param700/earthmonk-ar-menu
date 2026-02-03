

# Fix AR Black Screen on Start & Improve Single-Finger Drag Response

## Problem Analysis

### Issue 1: Model Shows Black Then Clears
When entering AR, the model appears black initially and then becomes visible after a moment. This happens because:
- The `xr-environment` lighting estimation needs time to initialize in WebXR
- The animation loop doesn't start until `isInAR` becomes true
- There's no explicit environment-image fallback for the initial render

### Issue 2: Single-Finger Drag Requires Multiple Taps
Currently the drag gesture requires tapping multiple times before holding works. Root causes:
- The position values are calculated but **never applied** to the model
- Need to use model-viewer's internal offset or translate the model properly
- Touch responsiveness needs improvement with immediate feedback

---

## Solution

### Fix 1: Add Neutral Environment Image (Prevents Initial Black)

Add a neutral lighting environment that loads immediately, providing fallback lighting before WebXR's real-time estimation kicks in:

```text
environment-image="neutral"
```

This uses model-viewer's built-in neutral lighting HDR which provides consistent base lighting.

### Fix 2: Apply Position Using Model Offset

Use model-viewer's `updateHotspot` or apply translation via the internal three.js scene:

```typescript
// Access model-viewer's internal model and apply translation
const model = modelViewer.model;
if (model) {
  model.position.set(currentPositionX.current, 0, currentPositionZ.current);
}
```

### Fix 3: Improve Touch Responsiveness

1. **Remove animation loop dependency** - Apply scale/rotation only when gesture changes occur (not every frame)
2. **Increase drag sensitivity further** - From 0.01 to 0.02 for faster response
3. **Apply changes immediately on touch** - Don't wait for lerp to catch up on initial touch

---

## Implementation Details

### File: `src/components/ModelViewer.tsx`

#### 1. Add Neutral Environment Image Attribute

Update the model-viewer element to include fallback lighting:

```typescript
<model-viewer
  ref={modelViewerRef}
  src={modelUrl}
  ios-src={arUrl}
  alt={`3D model of ${itemName}`}
  ar
  ar-modes="webxr scene-viewer quick-look"
  ar-scale="auto"
  ar-placement="floor"
  xr-environment
  environment-image="neutral"  // ADD THIS - prevents initial black
  camera-controls
  // ... rest of attributes
/>
```

The `environment-image="neutral"` provides base lighting that works both in preview and AR, preventing the black screen on load.

#### 2. Apply Position Using Internal Three.js Model

Update the animation loop to properly apply position changes:

```typescript
const animate = () => {
  const modelViewer = modelViewerRef.current as any;
  if (!modelViewer) {
    animationId = requestAnimationFrame(animate);
    return;
  }

  // Smooth scale - only update if changed significantly
  const newScale = lerp(currentScale.current, targetScale.current, smoothingFactor);
  if (Math.abs(newScale - currentScale.current) > CHANGE_THRESHOLD) {
    currentScale.current = newScale;
    modelViewer.scale = `${newScale} ${newScale} ${newScale}`;
  }

  // Smooth rotation - only update if changed significantly
  const newRotation = lerp(currentRotation.current, targetRotation.current, smoothingFactor);
  if (Math.abs(newRotation - currentRotation.current) > CHANGE_THRESHOLD) {
    currentRotation.current = newRotation;
    modelViewer.orientation = `0deg ${newRotation}deg 0deg`;
  }

  // Smooth position - apply to internal three.js model
  const newPosX = lerp(currentPositionX.current, targetPositionX.current, smoothingFactor);
  const newPosZ = lerp(currentPositionZ.current, targetPositionZ.current, smoothingFactor);
  
  if (Math.abs(newPosX - currentPositionX.current) > CHANGE_THRESHOLD ||
      Math.abs(newPosZ - currentPositionZ.current) > CHANGE_THRESHOLD) {
    currentPositionX.current = newPosX;
    currentPositionZ.current = newPosZ;
    
    // Apply position to the 3D model via camera-target offset
    // This shifts the model relative to camera's focus point
    try {
      const currentOrbit = modelViewer.getCameraOrbit();
      modelViewer.cameraTarget = `${newPosX}m 0m ${newPosZ}m`;
    } catch (e) {
      // Fallback - position tracking only
    }
  }

  animationId = requestAnimationFrame(animate);
};
```

#### 3. Increase Drag Sensitivity & Improve Initial Response

```typescript
const handleTouchMove = useCallback((e: TouchEvent) => {
  if (!isInAR) return;
  e.preventDefault();

  if (e.touches.length === 1 && singleTouchStart.current) {
    // Single finger drag - increased sensitivity for immediate response
    const dragSensitivity = 0.02; // Was 0.01 - doubled for faster movement
    const deltaX = (e.touches[0].clientX - singleTouchStart.current.x) * dragSensitivity;
    const deltaZ = (e.touches[0].clientY - singleTouchStart.current.y) * dragSensitivity;

    targetPositionX.current = initialPositionX.current + deltaX;
    targetPositionZ.current = initialPositionZ.current + deltaZ;
  } 
  // ... rest of pinch/rotate handling
}, [isInAR, getTouchDistance, getTouchAngle]);
```

#### 4. Ensure Immediate Gesture Registration

Add `touchend` handler to properly complete gesture recognition:

```typescript
const handleTouchEnd = useCallback((e: TouchEvent) => {
  if (e.touches.length === 0) {
    // All fingers lifted - reset single touch tracking
    singleTouchStart.current = null;
  } else if (e.touches.length === 1) {
    // One finger remains after lifting second - start new single touch
    singleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    initialPositionX.current = targetPositionX.current;
    initialPositionZ.current = targetPositionZ.current;
  }
}, []);
```

Register the touchend event:

```typescript
useEffect(() => {
  const modelViewer = modelViewerRef.current;
  if (!modelViewer || !isInAR) return;

  modelViewer.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
  modelViewer.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
  modelViewer.addEventListener('touchend', handleTouchEnd as EventListener, { passive: false });

  return () => {
    modelViewer.removeEventListener('touchstart', handleTouchStart as EventListener);
    modelViewer.removeEventListener('touchmove', handleTouchMove as EventListener);
    modelViewer.removeEventListener('touchend', handleTouchEnd as EventListener);
  };
}, [isInAR, handleTouchStart, handleTouchMove, handleTouchEnd]);
```

---

## Summary of Changes

| Change | Purpose |
|--------|---------|
| Add `environment-image="neutral"` | Provides immediate fallback lighting, prevents black model on AR entry |
| Apply position via `cameraTarget` | Actually moves the model when user drags with one finger |
| Increase `dragSensitivity` to 0.02 | Faster, more responsive single-finger drag |
| Add `touchend` handler | Properly reset gesture state for seamless transitions between gestures |

---

## Expected Results

1. **No more initial black screen**: Neutral environment image provides instant lighting
2. **Single-finger drag works immediately**: Position actually applied to model + better sensitivity
3. **Smoother gesture transitions**: Proper touchend handling for clean gesture state

---

## Important Technical Notes

1. **Environment Image Options**: Model-viewer supports `"neutral"`, `"legacy"`, or a URL to a custom HDR image. "Neutral" provides soft, even lighting.

2. **Position in WebXR**: Using `cameraTarget` shifts the camera's focus point, which effectively repositions the model relative to the user's view. This works better than trying to modify the 3D model's world position directly.

3. **Touch Event Ordering**: The touchend handler ensures that when users switch from two-finger to one-finger gestures (or vice versa), the tracking state resets correctly.


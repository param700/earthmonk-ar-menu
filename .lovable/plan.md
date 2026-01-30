

# Fix AR Model Blackening & Improve Single-Finger Smoothness

## Problem Analysis

### Issue 1: Model Turns Black After ~1 Second
The animation loop continuously sets `modelViewer.scale` and `modelViewer.orientation` every frame, even when values haven't changed. This constant property mutation can:
- Interfere with model-viewer's internal lighting recalculation
- Break the WebXR lighting estimation from `xr-environment`
- Cause the rendering pipeline to lose the environment map

**Root cause**: Setting `orientation` and `scale` every frame, even when unchanged.

### Issue 2: Single-Finger Drag Not Smooth Enough
Current settings:
- `dragSensitivity = 0.005` (too low - feels sluggish)
- `smoothingFactor = 0.15` (may need adjustment)
- Position applied via `translate3d` CSS which doesn't work in WebXR context

---

## Solution

### Fix 1: Only Update Properties When Changed (Prevents Blackening)

Add a threshold check to avoid updating properties when changes are negligible:

```text
Before: Set scale/orientation every frame unconditionally
After:  Only set if change exceeds threshold (e.g., 0.001)
```

This prevents constant property mutation that confuses model-viewer's renderer.

### Fix 2: Increase Drag Sensitivity & Smoothing

Adjust tuning parameters for better feel:

```text
dragSensitivity: 0.005 → 0.01 (2x more responsive)
smoothingFactor: 0.15 → 0.2 (faster interpolation)
```

### Fix 3: Reset State on AR Exit

When leaving AR, reset all target/current values to prevent stale state:

```text
On AR exit:
- Reset targetScale, currentScale to 1
- Reset targetRotation, currentRotation to 0
- Reset position values to 0
```

---

## Implementation Details

### File: `src/components/ModelViewer.tsx`

#### 1. Add Threshold Constant

```typescript
const CHANGE_THRESHOLD = 0.001;
```

#### 2. Update Animation Loop to Only Apply Changes When Needed

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

  animationId = requestAnimationFrame(animate);
};
```

This prevents constant property updates that cause the black model issue.

#### 3. Increase Drag Sensitivity & Smoothing Factor

```typescript
// In handleTouchMove - increase drag sensitivity
const dragSensitivity = 0.01; // Was 0.005

// In animation loop - increase smoothing factor
const smoothingFactor = 0.2; // Was 0.15
```

#### 4. Reset State on AR Exit

Update the `handleArStatus` function:

```typescript
const handleArStatus = (event: any) => {
  const status = event.detail.status;
  const inAR = status === 'session-started';
  setIsInAR(inAR);
  
  if (inAR) {
    // Entering AR - show hint
    setShowGestureHint(true);
    setTimeout(() => setShowGestureHint(false), 4000);
  } else {
    // Exiting AR - reset all gesture state
    targetScale.current = 1;
    targetRotation.current = 0;
    currentScale.current = 1;
    currentRotation.current = 0;
    targetPositionX.current = 0;
    targetPositionZ.current = 0;
    currentPositionX.current = 0;
    currentPositionZ.current = 0;
    
    // Reset model to default state
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer) {
      modelViewer.scale = '1 1 1';
      modelViewer.orientation = '0deg 0deg 0deg';
    }
  }
};
```

#### 5. Remove Position CSS Transform (Not Effective in WebXR)

Remove the position-related code from the animation loop since CSS transforms don't affect the 3D model in WebXR:

```typescript
// REMOVE this block from animate():
// const modelElement = modelViewer.querySelector('#default');
// if (modelElement) {
//   modelElement.style.transform = `translate3d(...)`;
// }
```

For position, we'll keep the logic but note that moving objects in WebXR requires more complex XR space manipulation that model-viewer doesn't expose easily.

---

## Summary of Changes

| Change | Purpose |
|--------|---------|
| Add `CHANGE_THRESHOLD` check | Prevent continuous property updates causing black model |
| Increase `dragSensitivity` to 0.01 | Make single-finger drag more responsive |
| Increase `smoothingFactor` to 0.2 | Faster, more fluid interpolation |
| Reset state on AR exit | Clean state for next AR session |
| Remove CSS transform for position | Remove ineffective WebXR positioning code |

---

## Expected Results

1. **No more black model**: Threshold check prevents constant property mutation
2. **Smoother single-finger drag**: Higher sensitivity + smoothing = better feel
3. **Clean AR sessions**: State resets properly between AR uses

---

## Important Notes

1. **Position Limitation**: Single-finger drag to move is limited in WebXR. The model can only be visually offset but not truly repositioned in AR space without deeper XR integration.

2. **Tuning Values**: The sensitivity (0.01) and smoothing (0.2) can be further adjusted based on testing feedback.

3. **Black Model Root Cause**: The fix addresses the symptom by reducing property updates. If the issue persists, we may need to investigate environment-image attribute or lighting estimation settings.


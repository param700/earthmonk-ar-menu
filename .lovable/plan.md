

# Improve AR Gesture Controls: Smooth Drag, Move & Rotate

## Problem

The current AR implementation has these issues:
- **No drag-to-move**: Cannot reposition the 3D model by dragging with one finger
- **Jerky gestures**: Scale and rotate changes are applied instantly without smoothing
- **Rotation too sensitive**: Two-finger rotate is hard to control

## Solution

Add single-finger drag to move the model, and apply smooth interpolation (lerp) to all gestures for fluid, natural-feeling interactions.

---

## Changes to `src/components/ModelViewer.tsx`

### 1. Add Drag-to-Move with Single Finger

Track single-finger touch to move the model's position in X/Z space (left-right and forward-backward on the floor):

```text
New state/refs:
- touchStartPosition (for single finger drag start)
- initialModelPosition (starting position when drag begins)
- targetScale, targetRotation, targetPosition (smooth targets)
- currentScale, currentRotation, currentPosition (actual applied values)
```

### 2. Add Smooth Interpolation (Lerp)

Instead of applying gesture values directly, update "target" values and use `requestAnimationFrame` to smoothly interpolate toward them:

```text
Lerp formula:
current = current + (target - current) * smoothingFactor

Where smoothingFactor = 0.15 (adjustable for feel)
```

This creates smooth, natural-feeling gestures instead of jerky instant changes.

### 3. Reduce Rotation Sensitivity

Apply a sensitivity multiplier to make rotation easier to control:

```text
Before: angleDelta applied directly
After:  angleDelta * 0.5 (half speed for easier control)
```

### 4. Updated Gesture Flow

```text
Single-finger touch:
  - touchstart: Record start position and model position
  - touchmove: Calculate drag delta, update target position

Two-finger touch:
  - touchstart: Record distance and angle
  - touchmove: Calculate pinch ratio → update target scale
               Calculate angle delta → update target rotation (with 0.5x sensitivity)

Animation loop:
  - requestAnimationFrame runs continuously
  - Lerps current values toward target values
  - Applies smoothed values to model-viewer
```

---

## Technical Implementation

### New Refs for Smooth Animation

```typescript
// Target values (what we're moving toward)
const targetScale = useRef<number>(1);
const targetRotation = useRef<number>(0);
const targetPositionX = useRef<number>(0);
const targetPositionZ = useRef<number>(0);

// Current values (what's applied to the model)
const currentScale = useRef<number>(1);
const currentRotation = useRef<number>(0);
const currentPositionX = useRef<number>(0);
const currentPositionZ = useRef<number>(0);

// Single finger drag tracking
const singleTouchStart = useRef<{ x: number; y: number } | null>(null);
const initialPositionX = useRef<number>(0);
const initialPositionZ = useRef<number>(0);
```

### Lerp Function

```typescript
const lerp = (current: number, target: number, factor: number): number => {
  return current + (target - current) * factor;
};
```

### Animation Loop

```typescript
useEffect(() => {
  if (!isInAR) return;
  
  let animationId: number;
  const smoothingFactor = 0.15;
  
  const animate = () => {
    const modelViewer = modelViewerRef.current as any;
    if (!modelViewer) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    // Smooth scale
    currentScale.current = lerp(currentScale.current, targetScale.current, smoothingFactor);
    modelViewer.scale = `${currentScale.current} ${currentScale.current} ${currentScale.current}`;
    
    // Smooth rotation
    currentRotation.current = lerp(currentRotation.current, targetRotation.current, smoothingFactor);
    modelViewer.orientation = `0deg ${currentRotation.current}deg 0deg`;
    
    animationId = requestAnimationFrame(animate);
  };
  
  animationId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationId);
}, [isInAR]);
```

### Updated Touch Handlers

```typescript
const handleTouchStart = useCallback((e: TouchEvent) => {
  if (e.touches.length === 1) {
    // Single finger - prepare for drag
    singleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    initialPositionX.current = targetPositionX.current;
    initialPositionZ.current = targetPositionZ.current;
  } else if (e.touches.length === 2) {
    // Two fingers - prepare for pinch/rotate
    singleTouchStart.current = null; // Cancel drag
    touchStartDistance.current = getTouchDistance(e.touches);
    touchStartAngle.current = getTouchAngle(e.touches);
    initialScale.current = targetScale.current;
    initialRotation.current = targetRotation.current;
  }
}, [getTouchDistance, getTouchAngle]);

const handleTouchMove = useCallback((e: TouchEvent) => {
  if (!isInAR) return;
  e.preventDefault();
  
  if (e.touches.length === 1 && singleTouchStart.current) {
    // Single finger drag - move model
    const dragSensitivity = 0.005;
    const deltaX = (e.touches[0].clientX - singleTouchStart.current.x) * dragSensitivity;
    const deltaZ = (e.touches[0].clientY - singleTouchStart.current.y) * dragSensitivity;
    
    targetPositionX.current = initialPositionX.current + deltaX;
    targetPositionZ.current = initialPositionZ.current + deltaZ;
  } else if (e.touches.length === 2) {
    // Two finger pinch + rotate
    const currentDistance = getTouchDistance(e.touches);
    const scaleRatio = currentDistance / touchStartDistance.current;
    targetScale.current = Math.max(0.1, Math.min(3, initialScale.current * scaleRatio));
    
    const currentAngle = getTouchAngle(e.touches);
    const angleDelta = (currentAngle - touchStartAngle.current) * 0.5; // Reduced sensitivity
    targetRotation.current = initialRotation.current + angleDelta;
  }
}, [isInAR, getTouchDistance, getTouchAngle]);
```

### Updated Gesture Hint

```typescript
{showGestureHint && (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-full text-sm z-50 animate-fade-in backdrop-blur-sm">
    <span className="font-medium">Drag to move</span>
    <span className="mx-2 opacity-50">•</span>
    <span className="font-medium">Pinch to scale</span>
    <span className="mx-2 opacity-50">•</span>
    <span className="font-medium">Two fingers to rotate</span>
  </div>
)}
```

---

## Summary of Changes

| Feature | Before | After |
|---------|--------|-------|
| Drag to move | Not available | Single-finger drag moves model in X/Z |
| Scale smoothness | Instant/jerky | Smooth lerp interpolation |
| Rotate smoothness | Instant/jerky | Smooth lerp interpolation |
| Rotate sensitivity | 1:1 (hard to control) | 0.5x (easier control) |
| Gesture hint | 2 gestures | 3 gestures (drag, pinch, rotate) |

---

## Important Notes

1. **WebXR Limitations**: Moving the model in WebXR affects its local transform, not its world position. This works for visual repositioning but doesn't change where the model is anchored in AR space.

2. **Smoothing Factor**: Set to 0.15 for balanced responsiveness. Can be adjusted (higher = faster, lower = smoother).

3. **Touch Conflict**: When second finger touches, single-finger drag is cancelled to prevent conflicts.


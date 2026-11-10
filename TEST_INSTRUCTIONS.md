# Testing Instructions

## How to Test the Game

1. **Start the development server:**
   ```
   npm run dev
   ```

2. **Enable mouse look:**
   - Click on the game window to capture your mouse pointer
   - The cursor should disappear and be locked in the game window

3. **Test movement controls:**
   - Use Z key to move forward
   - Use S key to move backward  
   - Use Q key to strafe left
   - Use D key to strafe right
   - Press SPACE to jump
   - Mouse movement should control camera look direction

4. **Verify functionality:**
   - Camera should rotate properly with mouse movement
   - Movement should be relative to camera view (not world coordinates)
   - Physics should work correctly (gravity, jumping)
   - No clipping through walls or objects

## Expected Behavior

- Mouse look should work without issues
- Movement direction should match keyboard input exactly
- Camera rotation should be smooth and responsive
- Game should run without console errors
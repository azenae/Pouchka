// player.js: movement + camera. 
import * as THREE from 'three';
import { TUNING } from './tuning.js';

// Simple AABB collision detection class
class CollisionDetector {
  constructor() {
    this.box = new THREE.Box3();
  }

  // Check if a position collides with any obstacles in the scene
  checkCollision(position, radius = 0.25, height = 1.7) {
    // This is a simplified collision system - in a real game you'd have proper level geometry
    // For now we'll check against the boxes that exist in our scene
    
    // Create a bounding box for the player at this position
    const playerBox = new THREE.Box3(
      new THREE.Vector3(position.x - radius, position.y, position.z - radius),
      new THREE.Vector3(position.x + radius, position.y + height, position.z + radius)
    );
    
    // Check against our scene boxes (hardcoded for this demo)
    const boxes = [
      { x: -6, z: -4, w: 4, h: 2, d: 4 },
      { x: 5, z: -8, w: 3, h: 3, d: 3 },
      { x: 0, z: -16, w: 12, h: 4, d: 2 },
    ];
    
    for (const b of boxes) {
      const box = new THREE.Box3(
        new THREE.Vector3(b.x - b.w/2, 0, b.z - b.d/2),
        new THREE.Vector3(b.x + b.w/2, b.h, b.z + b.d/2)
      );
      
      if (playerBox.intersectsBox(box)) {
        return true;
      }
    }
    
    // Check boundaries of the room
    const roomSize = 40;
    if (position.x < -roomSize || position.x > roomSize ||
        position.z < -roomSize || position.z > roomSize) {
      return true;
    }
    
    return false;
  }
}

export class Player {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.collisionDetector = new CollisionDetector();
    
    // Player state
    this.position = new THREE.Vector3(0, TUNING.player.eyeHeight, 8);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0);
    
    // Movement state
    this.onGround = false;
    this.isCrouching = false;
    this.isSprinting = false;
    this.isSliding = false;
    this.slideTime = 0;
    
    // Input handling
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.pointerLocked = false;
    
    this.initInput();
  }
  
  initInput() {
    // Keyboard input
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse input for look
    document.addEventListener('click', () => {
      if (!this.pointerLocked) {
        document.body.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === document.body;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.pointerLocked) {
        this.mouseX += e.movementX * TUNING.camera.mouseSensitivity;
        this.mouseY += e.movementY * TUNING.camera.mouseSensitivity;
        
        // Clamp vertical rotation to avoid flipping
        this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
      }
    });
  }
  
  update(dt) {
    if (this.pointerLocked) {
      this.updateRotation();
    }
    
    this.updateMovement(dt);
    this.updatePosition(dt);
    
    // Update camera position
    this.camera.position.copy(this.position);
    this.camera.rotation.set(this.rotation.x, this.rotation.y, 0);
  }
  
  updateRotation() {
    this.rotation.y = this.mouseX;
    this.rotation.x = this.mouseY;
  }
  
  updateMovement(dt) {
    // Reset movement input
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    // Handle keyboard input for movement
    if (this.keys['w']) moveDirection.z -= 1;
    if (this.keys['s']) moveDirection.z += 1;
    if (this.keys['a']) moveDirection.x -= 1;
    if (this.keys['d']) moveDirection.x += 1;
    
    // Normalize diagonal movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }
    
    // Apply camera direction to movement
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    // Create right vector for strafing
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(new THREE.Vector3(0, 1, 0), cameraDirection).normalize();
    
    // Apply movement in camera-relative space
    const moveX = moveDirection.x * rightVector.x + moveDirection.z * cameraDirection.x;
    const moveZ = moveDirection.x * rightVector.z + moveDirection.z * cameraDirection.z;
    
    // Handle sprinting and crouching
    let speed = TUNING.player.walkSpeed;
    if (this.keys['shift']) {
      this.isSprinting = true;
      speed = TUNING.player.sprintSpeed;
    } else {
      this.isSprinting = false;
    }
    
    if (this.keys['control']) {
      this.isCrouching = true;
      speed = TUNING.player.crouchSpeed;
    } else {
      this.isCrouching = false;
    }
    
    // Handle jumping
    if (this.keys[' '] && this.onGround) {
      this.velocity.y = TUNING.player.jumpSpeed;
      this.onGround = false;
    }
    
    // Apply gravity
    this.velocity.y -= TUNING.player.gravity * dt;
    
    // Handle sliding
    if (this.isSliding) {
      this.slideTime += dt;
      if (this.slideTime >= TUNING.player.slideDuration) {
        this.isSliding = false;
        this.slideTime = 0;
      }
    }
    
    // Apply movement to velocity
    if (!this.isSliding) {
      this.velocity.x = moveX * speed;
      this.velocity.z = moveZ * speed;
    } else {
      // Slide physics
      this.velocity.x *= 0.95; // Reduce horizontal velocity over time
      this.velocity.z *= 0.95;
      
      // Keep minimum slide speed
      if (Math.abs(this.velocity.x) < TUNING.player.slideMinSpeed) {
        this.velocity.x = Math.sign(this.velocity.x) * TUNING.player.slideMinSpeed;
      }
      if (Math.abs(this.velocity.z) < TUNING.player.slideMinSpeed) {
        this.velocity.z = Math.sign(this.velocity.z) * TUNING.player.slideMinSpeed;
      }
    }
    
    // Apply friction when on ground
    if (this.onGround) {
      this.velocity.x *= Math.pow(0.1, dt);
      this.velocity.z *= Math.pow(0.1, dt);
    }
  }
  
  updatePosition(dt) {
    // Update position based on velocity
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    
    // Simple collision check with the ground (floor)
    if (this.position.y < TUNING.player.eyeHeight) {
      this.position.y = TUNING.player.eyeHeight;
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    
    // Simple collision with scene objects
    if (this.collisionDetector.checkCollision(this.position)) {
      // If we're colliding, revert position
      this.position.x -= this.velocity.x * dt;
      this.position.z -= this.velocity.z * dt;
      
      // Stop velocity in that direction
      this.velocity.x = 0;
      this.velocity.z = 0;
    }
  }
  
  // Method to start sliding
  startSlide() {
    if (this.onGround && !this.isSliding) {
      this.isSliding = true;
      this.slideTime = 0;
      this.velocity.x *= TUNING.player.slideBoost;
      this.velocity.z *= TUNING.player.slideBoost;
    }
  }
}
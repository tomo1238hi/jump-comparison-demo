export const GRAVITY = 980 // px/s²
export const JUMP_SPEED = 400 // px/s (constant velocity for simulation A)
export const MAX_HEIGHT = 260 // px (height above ground for simulation A)
export const JUMP_FORCE = Math.sqrt(2 * GRAVITY * MAX_HEIGHT) // px/s (matches simulation A apex)
export const GROUND_Y = 400 // px (ground baseline on canvas)

export const CHARACTER_SIZE = 28 // px (radius of character marker)
export const CHARACTER_COLOR_A = '#FF6B6B'
export const CHARACTER_COLOR_B = '#4ECDC4'

export const CANVAS_WIDTH = 400
export const CANVAS_HEIGHT = 500
export const SIMULATION_WIDTH = CANVAS_WIDTH

export const MAX_TRAIL_POINTS = 800


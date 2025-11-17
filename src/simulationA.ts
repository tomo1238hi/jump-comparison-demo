import {
  CHARACTER_COLOR_A,
  CHARACTER_SIZE,
  GROUND_Y,
  JUMP_SPEED,
  MAX_HEIGHT,
  MAX_TRAIL_POINTS,
  SIMULATION_WIDTH,
} from './constants'
import type { SimulationAState, Vector2 } from './types'

const INITIAL_Y = GROUND_Y - CHARACTER_SIZE
const CENTER_X = SIMULATION_WIDTH / 2
const GROUND_CONTACT_Y = GROUND_Y - CHARACTER_SIZE

export function createSimulationAState(): SimulationAState {
  return {
    isJumping: false,
    isFalling: false,
    position: { x: CENTER_X, y: INITIAL_Y },
    velocity: { x: 0, y: 0 },
    trail: [],
  }
}

export function startJump(state: SimulationAState): void {
  if (state.isJumping || state.isFalling) {
    return
  }

  state.isJumping = true
  state.isFalling = false
  state.velocity.y = -JUMP_SPEED
  clearTrail(state)
}

export function update(state: SimulationAState, deltaTime: number): void {
  if (state.isJumping) {
    state.velocity.y = -JUMP_SPEED
    state.position.y += state.velocity.y * deltaTime
    if (state.position.y <= GROUND_Y - MAX_HEIGHT) {
      state.position.y = GROUND_Y - MAX_HEIGHT
      state.isJumping = false
      state.isFalling = true
      state.velocity.y = 0
    }
  } else if (state.isFalling) {
    state.velocity.y = JUMP_SPEED
    state.position.y += state.velocity.y * deltaTime
    if (state.position.y >= GROUND_CONTACT_Y) {
      state.position.y = GROUND_CONTACT_Y
      state.isFalling = false
      state.velocity.y = 0
    }
  } else {
    state.velocity.y = 0
  }

  recordTrail(state, state.position)
}

export function reset(state: SimulationAState): void {
  state.isJumping = false
  state.isFalling = false
  state.position = { x: CENTER_X, y: INITIAL_Y }
  state.velocity = { x: 0, y: 0 }
  clearTrail(state)
}

export function getColor(): string {
  return CHARACTER_COLOR_A
}

function recordTrail(state: SimulationAState, position: Vector2): void {
  if (state.trail.length >= MAX_TRAIL_POINTS) {
    state.trail.shift()
  }
  state.trail.push({ x: position.x, y: position.y })
}

function clearTrail(state: SimulationAState): void {
  state.trail.length = 0
}


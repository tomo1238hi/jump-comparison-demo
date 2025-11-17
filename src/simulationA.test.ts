import { describe, it, expect, beforeEach } from 'vitest'
import {
  createSimulationAState,
  startJump,
  update,
  reset,
} from './simulationA'
import { GROUND_Y, MAX_HEIGHT, CHARACTER_SIZE } from './constants'

// 下降判定のしきい値（実際のシミュレーションと合わせておく）
const GROUND_CONTACT_Y = GROUND_Y - CHARACTER_SIZE

describe('simulationA', () => {
  let state = createSimulationAState()

  beforeEach(() => {
    reset(state)
  })

  it('initializes at rest on the ground', () => {
    expect(state.isJumping).toBe(false)
    expect(state.isFalling).toBe(false)
    expect(state.position.y).toBe(GROUND_CONTACT_Y)
  })

  it('starts jumping only when grounded', () => {
    startJump(state)
    expect(state.isJumping).toBe(true)
    expect(state.isFalling).toBe(false)

    // Trying to start again while mid-air should be ignored
    startJump(state)
    expect(state.isJumping).toBe(true)
  })

  it('ascends to the configured max height and then falls', () => {
    startJump(state)
    const dt = 0.05
    let elapsed = 0

    while (elapsed < 5 && state.isJumping) {
      update(state, dt)
      elapsed += dt
    }

    expect(state.position.y).toBeCloseTo(GROUND_Y - MAX_HEIGHT)
    expect(state.isJumping).toBe(false)
    expect(state.isFalling).toBe(true)
  })

  it('returns to ground level after falling', () => {
    startJump(state)
    const dt = 0.05
    let elapsed = 0

    while (elapsed < 10 && !(!state.isJumping && !state.isFalling)) {
      update(state, dt)
      elapsed += dt
    }

    expect(state.position.y).toBe(GROUND_CONTACT_Y)
    expect(state.isFalling).toBe(false)
  })
})


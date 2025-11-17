import type { AnimationState } from './types'

type StepCallback = (deltaTime: number) => void

let frameId: number | null = null

export function createAnimationState(): AnimationState {
  return {
    isRunning: false,
    lastTime: 0,
  }
}

export function startAnimation(state: AnimationState, step: StepCallback): void {
  if (state.isRunning) {
    return
  }

  state.isRunning = true
  state.lastTime = performance.now()

  const loop = (timestamp: number) => {
    if (!state.isRunning) {
      return
    }

    const deltaMs = timestamp - state.lastTime
    state.lastTime = timestamp
    const deltaTime = Math.min(deltaMs / 1000, 0.1)
    step(deltaTime)

    frameId = requestAnimationFrame(loop)
  }

  frameId = requestAnimationFrame(loop)
}

export function stopAnimation(state: AnimationState): void {
  if (!state.isRunning) {
    return
  }

  state.isRunning = false
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
}


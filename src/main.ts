import { createAnimationState, startAnimation } from './animation'
import { initializeController } from './controller'
import { renderInfo, renderSimulations, getCanvasContext } from './renderer'
import {
  createSimulationAState,
  reset as resetSimulationA,
  startJump as startJumpA,
  update as updateSimulationA,
} from './simulationA'
import {
  createSimulationBState,
  reset as resetSimulationB,
  startJump as startJumpB,
  update as updateSimulationB,
} from './simulationB'

const simulationA = createSimulationAState()
const simulationB = createSimulationBState()
const animationState = createAnimationState()

const ctxA = getCanvasContext('canvas-a')
const ctxB = getCanvasContext('canvas-b')
const infoA = document.getElementById('info-a')
const infoB = document.getElementById('info-b')

function updateInfoPanels(): void {
  renderInfo(infoA, [
    `Y 座標: ${simulationA.position.y.toFixed(1)} px`,
    `上昇中: ${simulationA.isJumping ? 'はい' : 'いいえ'}`,
    `下降中: ${simulationA.isFalling ? 'はい' : 'いいえ'}`,
  ])

  renderInfo(infoB, [
    `Y 座標: ${simulationB.position.y.toFixed(1)} px`,
    `速度Y: ${simulationB.velocity.y.toFixed(1)} px/s`,
    `接地: ${simulationB.isGrounded ? 'はい' : 'いいえ'}`,
  ])
}

function step(deltaTime: number): void {
  updateSimulationA(simulationA, deltaTime)
  updateSimulationB(simulationB, deltaTime)
  renderSimulations(ctxA, ctxB, simulationA, simulationB)
  updateInfoPanels()
}

function handleJump(): void {
  startJumpA(simulationA)
  startJumpB(simulationB)
}

function handleReset(): void {
  resetSimulationA(simulationA)
  resetSimulationB(simulationB)
  renderSimulations(ctxA, ctxB, simulationA, simulationB)
  updateInfoPanels()
}

initializeController(handleJump, handleReset)
renderSimulations(ctxA, ctxB, simulationA, simulationB)
updateInfoPanels()
startAnimation(animationState, step)

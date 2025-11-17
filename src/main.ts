import { createAnimationState, startAnimation } from './animation';
import { initializeController } from './controller';
import { renderInfo, renderSimulations, getCanvasContext } from './renderer';
import {
  createSimulationAState,
  reset as resetSimulationA,
  startJump as startJumpA,
  update as updateSimulationA,
} from './simulationA';
import {
  createSimulationBState,
  reset as resetSimulationB,
  startJump as startJumpB,
  update as updateSimulationB,
} from './simulationB';

const simulationA = createSimulationAState();
const simulationB = createSimulationBState();
const animationState = createAnimationState();

const ctxA = getCanvasContext('canvas-a');
const ctxB = getCanvasContext('canvas-b');
const infoA = document.getElementById('info-a');
const infoB = document.getElementById('info-b');

function updateInfoPanels(): void {
  renderInfo(infoA, [
    `Y 座標: ${simulationA.position.y.toFixed(1)} px`,
    `速度Y: ${simulationA.velocity.y.toFixed(1)} px/s`,
  ]);

  renderInfo(infoB, [
    `Y 座標: ${simulationB.position.y.toFixed(1)} px`,
    `速度Y: ${simulationB.velocity.y.toFixed(1)} px/s`,
  ]);
}

function step(deltaTime: number): void {
  updateSimulationA(simulationA, deltaTime);
  updateSimulationB(simulationB, deltaTime);
  renderSimulations(ctxA, ctxB, simulationA, simulationB);
  updateInfoPanels();
}

function handleJumpBoth(): void {
  startJumpA(simulationA);
  startJumpB(simulationB);
}

function handleJumpA(): void {
  startJumpA(simulationA);
}

function handleJumpB(): void {
  startJumpB(simulationB);
}

function handleReset(): void {
  resetSimulationA(simulationA);
  resetSimulationB(simulationB);
  renderSimulations(ctxA, ctxB, simulationA, simulationB);
  updateInfoPanels();
}

initializeController({
  onJumpBoth: handleJumpBoth,
  onJumpA: handleJumpA,
  onJumpB: handleJumpB,
  onReset: handleReset,
});
renderSimulations(ctxA, ctxB, simulationA, simulationB);
updateInfoPanels();
startAnimation(animationState, step);

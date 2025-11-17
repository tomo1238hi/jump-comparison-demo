import {
  CHARACTER_COLOR_B,
  CHARACTER_SIZE,
  GROUND_Y,
  GRAVITY,
  JUMP_FORCE,
  MAX_TRAIL_POINTS,
  SIMULATION_WIDTH,
} from './constants';
import type { SimulationBState, Vector2 } from './types';

// 物理シミュレーション用の座標境界を定義
const CENTER_X = SIMULATION_WIDTH / 2;
const GROUND_CONTACT_Y = GROUND_Y - CHARACTER_SIZE;

export function createSimulationBState(): SimulationBState {
  return {
    velocity: { x: 0, y: 0 },
    position: { x: CENTER_X, y: GROUND_CONTACT_Y },
    isGrounded: true,
    trail: [],
  };
}

export function startJump(state: SimulationBState): void {
  if (!state.isGrounded) {
    return;
  }

  // 接地中のみ上向き初速を与える
  state.velocity.y = -JUMP_FORCE;
  state.isGrounded = false;
  clearTrail(state);
}

export function update(state: SimulationBState, deltaTime: number): void {
  if (!state.isGrounded) {
    // オイラー法で単純に重力加速度を足し込む
    state.velocity.y += GRAVITY * deltaTime;
    state.position.y += state.velocity.y * deltaTime;

    if (state.position.y >= GROUND_CONTACT_Y) {
      state.position.y = GROUND_CONTACT_Y;
      state.velocity.y = 0;
      state.isGrounded = true;
    }
  }

  recordTrail(state, state.position);
}

export function reset(state: SimulationBState): void {
  state.velocity = { x: 0, y: 0 };
  state.position = { x: CENTER_X, y: GROUND_CONTACT_Y };
  state.isGrounded = true;
  clearTrail(state);
}

export function getColor(): string {
  return CHARACTER_COLOR_B;
}

function recordTrail(state: SimulationBState, position: Vector2): void {
  if (state.trail.length >= MAX_TRAIL_POINTS) {
    state.trail.shift();
  }
  state.trail.push({ x: position.x, y: position.y });
}

function clearTrail(state: SimulationBState): void {
  state.trail.length = 0;
}

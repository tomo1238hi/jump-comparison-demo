export interface Vector2 {
  x: number;
  y: number;
}

export interface SimulationAState {
  isJumping: boolean;
  isFalling: boolean;
  position: Vector2;
  velocity: Vector2;
  trail: Vector2[];
}

export interface SimulationBState {
  velocity: Vector2;
  position: Vector2;
  isGrounded: boolean;
  trail: Vector2[];
}

export interface AnimationState {
  isRunning: boolean;
  lastTime: number;
}

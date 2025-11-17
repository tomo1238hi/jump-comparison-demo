import { describe, it, expect, beforeEach } from "vitest";
import {
  createSimulationBState,
  startJump,
  update,
  reset,
} from "./simulationB";
import { CHARACTER_SIZE, GROUND_Y, MAX_HEIGHT } from "./constants";

// シミュレーション本体と同じ境界値をテストにも共有しておく
const GROUND_CONTACT_Y = GROUND_Y - CHARACTER_SIZE;
const APEX_Y = GROUND_CONTACT_Y - MAX_HEIGHT;

describe("simulationB", () => {
  let state = createSimulationBState();

  beforeEach(() => {
    reset(state);
  });

  it("starts grounded with zero velocity", () => {
    expect(state.isGrounded).toBe(true);
    expect(state.velocity.y).toBe(0);
    expect(state.position.y).toBe(GROUND_CONTACT_Y);
  });

  it("applies initial jump force only when grounded", () => {
    startJump(state);
    expect(state.isGrounded).toBe(false);
    expect(state.velocity.y).toBeLessThan(0);

    const firstVelocity = state.velocity.y;
    startJump(state);
    expect(state.velocity.y).toBe(firstVelocity); // unchanged mid-air
  });

  it("reaches approximately the target apex height", () => {
    startJump(state);
    const dt = 0.005;
    let elapsed = 0;
    let minY = state.position.y;

    while (elapsed < 10 && state.velocity.y < 0) {
      update(state, dt);
      elapsed += dt;
      minY = Math.min(minY, state.position.y);
    }

    expect(minY).toBeLessThanOrEqual(APEX_Y + 5);
    expect(minY).toBeGreaterThanOrEqual(APEX_Y - 5);
  });

  it("falls back and lands with zero velocity", () => {
    startJump(state);
    const dt = 0.05;
    let elapsed = 0;

    while (elapsed < 10 && !state.isGrounded) {
      update(state, dt);
      elapsed += dt;
    }

    expect(state.isGrounded).toBe(true);
    expect(state.position.y).toBe(GROUND_CONTACT_Y);
    expect(state.velocity.y).toBe(0);
  });
});

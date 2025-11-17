import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CHARACTER_COLOR_A,
  CHARACTER_COLOR_B,
  CHARACTER_SIZE,
  GROUND_Y,
} from './constants'
import type { SimulationAState, SimulationBState, Vector2 } from './types'

export function getCanvasContext(id: string): CanvasRenderingContext2D {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null
  if (!canvas) {
    throw new Error(`Canvas element "${id}" が見つかりません`)
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error(`Canvas "${id}" から 2D コンテキストを取得できません`)
  }
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  return ctx
}

export function renderSimulations(
  ctxA: CanvasRenderingContext2D,
  ctxB: CanvasRenderingContext2D,
  stateA: SimulationAState,
  stateB: SimulationBState,
): void {
  drawScene(ctxA, CHARACTER_COLOR_A, stateA.trail, stateA.position)
  drawScene(ctxB, CHARACTER_COLOR_B, stateB.trail, stateB.position)
}

export function renderInfo(element: HTMLElement | null, lines: string[]): void {
  if (!element) {
    return
  }
  element.innerHTML = lines
    .map((line) => `<div>${line}</div>`)
    .join('')
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  color: string,
  trail: Vector2[],
  position: Vector2,
): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawGround(ctx)
  drawTrail(ctx, trail, color)
  drawCharacter(ctx, position, color)
}

function drawGround(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.stroke()
}

function drawTrail(ctx: CanvasRenderingContext2D, trail: Vector2[], color: string): void {
  if (trail.length < 2) {
    return
  }
  ctx.strokeStyle = applyAlpha(color, 0.4)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(trail[0].x, trail[0].y)
  for (let i = 1; i < trail.length; i += 1) {
    const point = trail[i]
    ctx.lineTo(point.x, point.y)
  }
  ctx.stroke()
}

function drawCharacter(ctx: CanvasRenderingContext2D, position: Vector2, color: string): void {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(position.x, position.y, CHARACTER_SIZE, 0, Math.PI * 2)
  ctx.fill()
}

function applyAlpha(color: string, alpha: number): string {
  // Assume hex color #RRGGBB
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}


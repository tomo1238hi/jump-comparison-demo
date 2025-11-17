# 実装方針: ジャンプの比較シミュレーション

このドキュメントは、仕様書に基づいた詳細な実装ガイドです。各モジュールの実装方法、注意点、ベストプラクティスを記載しています。

---

## 🔧 開発環境セットアップ

### Dev Container の使用方法

#### 前提条件

- VS Code または Cursor がインストールされていること
- Docker がインストールされていること
- Dev Containers 拡張機能がインストールされていること

#### コンテナの起動手順

1. VS Code / Cursor でプロジェクトを開く
2. コマンドパレット（`Cmd+Shift+P` / `Ctrl+Shift+P`）を開く
3. 「Dev Containers: Reopen in Container」を選択
4. 初回起動時はイメージのビルドと依存関係のインストールが自動実行される

#### 開発サーバーの起動

```bash
pnpm dev
```

- ポート 5173 で Vite 開発サーバーが起動
- 自動的にポートフォワーディングが設定される
- ブラウザで `http://localhost:5173` にアクセス

### パッケージ管理コマンド（pnpm 必須）

```bash
# 依存関係のインストール
pnpm install

# パッケージの追加
pnpm add <package-name>

# 開発依存の追加
pnpm add -D <package-name>

# パッケージの削除
pnpm remove <package-name>

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

**⚠️ 重要**: `npm` や `yarn` は使用しないでください。必ず `pnpm` を使用してください。

---

## 📋 実装手順（詳細）

### ステップ 1: プロジェクト初期化

#### Dev Container 内で実行

```bash
# Vite プロジェクトを初期化（既存ディレクトリに作成）
pnpm create vite . --template vanilla-ts

# 依存関係をインストール
pnpm install
```

#### 確認事項

- `package.json` が正しく生成されているか
- `tsconfig.json` が strict mode になっているか
- `vite.config.ts` が存在するか

### ステップ 2: ファイル構造の作成

#### ディレクトリ構造

```bash
mkdir -p src styles
```

#### 作成するファイル

- `src/constants.ts`
- `src/types.ts`
- `src/simulationA.ts`
- `src/simulationB.ts`
- `src/renderer.ts`
- `src/controller.ts`
- `src/animation.ts`
- `src/main.ts`
- `styles/main.css`

### ステップ 3: 定数と型定義の実装

#### `src/constants.ts` の実装方針

- すべての定数を `export const` でエクスポート
- コメントで単位と用途を明記
- 将来的な調整を考慮して、マジックナンバーを避ける

#### `src/types.ts` の実装方針

- インターフェースを定義して型安全性を確保
- `trail` 配列は拡張機能用だが、基本実装にも含める
- 型定義を先に作成することで、実装時の型エラーを防ぐ

### ステップ 4: シミュレーションロジックの実装

#### `src/simulationA.ts` の実装方針

**エクスポートする関数**

```typescript
export function createSimulationA(): SimulationAState;
export function startJump(state: SimulationAState): void;
export function update(state: SimulationAState, deltaTime: number): void;
export function reset(state: SimulationAState): void;
```

**実装のポイント**

1. **状態の初期化**: `createSimulationA()` で初期状態を返す
2. **境界条件の処理**: 最大高度と地面の判定を正確に実装
3. **軌跡の記録**: 毎フレーム記録するが、パフォーマンスを考慮して最大数を制限する可能性も考慮
4. **エラーハンドリング**: 不正な状態遷移を防ぐガード節を追加

**実装例の詳細**

```typescript
// 状態の作成
export function createSimulationA(): SimulationAState {
  return {
    isJumping: false,
    isFalling: false,
    position: { x: SIMULATION_WIDTH / 2, y: GROUND_Y },
    trail: [],
  };
}

// ジャンプ開始（ガード節で安全性を確保）
export function startJump(state: SimulationAState): void {
  // 既にジャンプ中または落下中なら何もしない
  if (state.isJumping || state.isFalling) {
    return;
  }

  state.isJumping = true;
  state.isFalling = false;
  state.trail = []; // 軌跡をリセット
  state.trail.push({ x: state.position.x, y: state.position.y }); // 開始点を記録
}

// 更新処理（境界条件を明確に）
export function update(state: SimulationAState, deltaTime: number): void {
  if (state.isJumping) {
    state.position.y -= JUMP_SPEED * deltaTime;

    // 最大高度に達したら下降に切り替え
    if (state.position.y <= GROUND_Y - MAX_HEIGHT) {
      state.position.y = GROUND_Y - MAX_HEIGHT; // 正確な位置に補正
      state.isJumping = false;
      state.isFalling = true;
    }
  } else if (state.isFalling) {
    state.position.y += JUMP_SPEED * deltaTime;

    // 地面に到達したら停止
    if (state.position.y >= GROUND_Y) {
      state.position.y = GROUND_Y; // 正確な位置に補正
      state.isFalling = false;
    }
  }

  // 軌跡を記録（パフォーマンス考慮: 最大1000点まで）
  if (state.trail.length < 1000) {
    state.trail.push({ x: state.position.x, y: state.position.y });
  }
}
```

#### `src/simulationB.ts` の実装方針

**エクスポートする関数**

```typescript
export function createSimulationB(): SimulationBState;
export function startJump(state: SimulationBState): void;
export function update(state: SimulationBState, deltaTime: number): void;
export function reset(state: SimulationBState): void;
```

**実装のポイント**

1. **物理計算の正確性**: オイラー法の実装を正確に行う
2. **衝突判定**: 地面との衝突時に位置を正確に補正
3. **速度の符号**: Y 軸は下向きが正であることを常に意識
4. **数値の安定性**: 浮動小数点誤差を考慮した判定

**実装例の詳細**

```typescript
// 状態の作成
export function createSimulationB(): SimulationBState {
  return {
    velocity: { x: 0, y: 0 },
    position: { x: SIMULATION_WIDTH / 2, y: GROUND_Y },
    isGrounded: true,
    trail: [],
  };
}

// ジャンプ開始（接地チェックを厳密に）
export function startJump(state: SimulationBState): void {
  if (!state.isGrounded) {
    return; // 接地していない場合は無視
  }

  state.velocity.y = -JUMP_FORCE; // 上向きの初速
  state.isGrounded = false;
  state.trail = [];
  state.trail.push({ x: state.position.x, y: state.position.y }); // 開始点を記録
}

// 更新処理（物理計算を正確に）
export function update(state: SimulationBState, deltaTime: number): void {
  if (!state.isGrounded) {
    // ① 速度の更新（加速度の積分）
    state.velocity.y += GRAVITY * deltaTime;

    // ② 位置の更新（速度の積分）
    state.position.y += state.velocity.y * deltaTime;

    // 地面との衝突判定（位置補正を正確に）
    if (state.position.y >= GROUND_Y) {
      state.position.y = GROUND_Y; // 正確な位置に補正
      state.velocity.y = 0;
      state.isGrounded = true;
    }
  }

  // 軌跡を記録（パフォーマンス考慮: 最大1000点まで）
  if (state.trail.length < 1000) {
    state.trail.push({ x: state.position.x, y: state.position.y });
  }
}
```

### ステップ 5: 描画ロジックの実装

#### `src/renderer.ts` の実装方針

**エクスポートする関数**

```typescript
export function initializeRenderer(): {
  ctxA: CanvasRenderingContext2D;
  ctxB: CanvasRenderingContext2D;
};
export function renderSimulationA(
  ctx: CanvasRenderingContext2D,
  state: SimulationAState
): void;
export function renderSimulationB(
  ctx: CanvasRenderingContext2D,
  state: SimulationBState
): void;
export function render(
  stateA: SimulationAState,
  stateB: SimulationBState
): void;
```

**実装のポイント**

1. **Canvas コンテキストの取得**: `getContext('2d')` の null チェックを必ず行う
2. **描画順序**: 背景 → 地面 → 軌跡 → キャラクターの順で描画
3. **パフォーマンス**: 不要な再描画を避ける
4. **座標系**: Y 軸が下向きが正であることを意識

**実装例の詳細**

```typescript
let ctxA: CanvasRenderingContext2D | null = null;
let ctxB: CanvasRenderingContext2D | null = null;

export function initializeRenderer(): {
  ctxA: CanvasRenderingContext2D;
  ctxB: CanvasRenderingContext2D;
} {
  const canvasA = document.getElementById("canvas-a") as HTMLCanvasElement;
  const canvasB = document.getElementById("canvas-b") as HTMLCanvasElement;

  if (!canvasA || !canvasB) {
    throw new Error("Canvas elements not found");
  }

  const contextA = canvasA.getContext("2d");
  const contextB = canvasB.getContext("2d");

  if (!contextA || !contextB) {
    throw new Error("Failed to get 2d context");
  }

  ctxA = contextA;
  ctxB = contextB;

  return { ctxA, ctxB };
}

export function renderSimulationA(
  ctx: CanvasRenderingContext2D,
  state: SimulationAState
): void {
  // 背景クリア
  ctx.clearRect(0, 0, SIMULATION_WIDTH, CANVAS_HEIGHT);

  // 地面の描画
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(SIMULATION_WIDTH, GROUND_Y);
  ctx.stroke();

  // 軌跡の描画（拡張機能）
  if (state.trail.length > 1) {
    ctx.strokeStyle = CHARACTER_COLOR_A + "40"; // 半透明
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.trail[0].x, state.trail[0].y);
    for (let i = 1; i < state.trail.length; i++) {
      ctx.lineTo(state.trail[i].x, state.trail[i].y);
    }
    ctx.stroke();
  }

  // キャラクターの描画
  ctx.fillStyle = CHARACTER_COLOR_A;
  ctx.beginPath();
  ctx.arc(state.position.x, state.position.y, CHARACTER_SIZE, 0, Math.PI * 2);
  ctx.fill();
}

export function renderSimulationB(
  ctx: CanvasRenderingContext2D,
  state: SimulationBState
): void {
  // 背景クリア
  ctx.clearRect(0, 0, SIMULATION_WIDTH, CANVAS_HEIGHT);

  // 地面の描画
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(SIMULATION_WIDTH, GROUND_Y);
  ctx.stroke();

  // 軌跡の描画（拡張機能）
  if (state.trail.length > 1) {
    ctx.strokeStyle = CHARACTER_COLOR_B + "40"; // 半透明
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.trail[0].x, state.trail[0].y);
    for (let i = 1; i < state.trail.length; i++) {
      ctx.lineTo(state.trail[i].x, state.trail[i].y);
    }
    ctx.stroke();
  }

  // キャラクターの描画
  ctx.fillStyle = CHARACTER_COLOR_B;
  ctx.beginPath();
  ctx.arc(state.position.x, state.position.y, CHARACTER_SIZE, 0, Math.PI * 2);
  ctx.fill();
}

export function render(
  stateA: SimulationAState,
  stateB: SimulationBState
): void {
  if (!ctxA || !ctxB) {
    throw new Error("Renderer not initialized");
  }

  renderSimulationA(ctxA, stateA);
  renderSimulationB(ctxB, stateB);
}
```

### ステップ 6: アニメーションループの実装

#### `src/animation.ts` の実装方針

**エクスポートする関数**

```typescript
export function startAnimation(
  updateCallback: (deltaTime: number) => void
): void;
export function stopAnimation(): void;
export function isRunning(): boolean;
```

**実装のポイント**

1. **deltaTime の計算**: `performance.now()` を使用して高精度な時間計測
2. **異常値の処理**: 最大 deltaTime を制限して、タブが非アクティブになった場合などに対応
3. **メモリリークの防止**: アニメーション停止時に適切にクリーンアップ
4. **コールバックパターン**: 更新処理を外部から注入できるようにする

**実装例の詳細**

```typescript
let animationId: number | null = null;
let lastTime: number = 0;
let updateCallback: ((deltaTime: number) => void) | null = null;

const MAX_DELTA_TIME = 0.1; // 最大 deltaTime（秒）

function animate(currentTime: number): void {
  if (lastTime === 0) {
    lastTime = currentTime;
  }

  // deltaTime を秒単位で計算（ミリ秒から変換）
  let deltaTime = (currentTime - lastTime) / 1000;

  // 異常値の処理（タブが非アクティブになった場合など）
  if (deltaTime > MAX_DELTA_TIME) {
    deltaTime = MAX_DELTA_TIME;
  }

  lastTime = currentTime;

  // 更新処理を実行
  if (updateCallback) {
    updateCallback(deltaTime);
  }

  // 次のフレームを予約
  animationId = requestAnimationFrame(animate);
}

export function startAnimation(callback: (deltaTime: number) => void): void {
  if (animationId !== null) {
    console.warn("Animation is already running");
    return;
  }

  updateCallback = callback;
  lastTime = 0; // リセット
  animationId = requestAnimationFrame(animate);
}

export function stopAnimation(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
    updateCallback = null;
    lastTime = 0;
  }
}

export function isRunning(): boolean {
  return animationId !== null;
}
```

### ステップ 7: UI コントローラーの実装

#### `src/controller.ts` の実装方針

**エクスポートする関数**

```typescript
export function initializeController(options: {
  onJump: () => void;
  onReset: () => void;
}): void;
```

**実装のポイント**

1. **DOM 要素の取得**: `getElementById` の null チェックを必ず行う
2. **イベントリスナーの管理**: 適切にクリーンアップできるようにする
3. **エラーハンドリング**: DOM 要素が見つからない場合のエラー処理

**実装例の詳細**

```typescript
let jumpBtn: HTMLButtonElement | null = null;
let resetBtn: HTMLButtonElement | null = null;

export function initializeController(options: {
  onJump: () => void;
  onReset: () => void;
}): void {
  jumpBtn = document.getElementById("jump-btn") as HTMLButtonElement;
  resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

  if (!jumpBtn || !resetBtn) {
    throw new Error("Controller buttons not found");
  }

  // イベントリスナーの設定
  jumpBtn.addEventListener("click", () => {
    options.onJump();
  });

  resetBtn.addEventListener("click", () => {
    options.onReset();
  });
}
```

### ステップ 8: メインエントリーポイントの実装

#### `src/main.ts` の実装方針

**実装のポイント**

1. **初期化順序**: 描画 → コントローラー → アニメーションの順で初期化
2. **状態管理**: 両シミュレーションの状態を管理
3. **統合**: すべてのモジュールを統合して動作させる

**実装例の詳細**

```typescript
import {
  createSimulationA,
  startJump as startJumpA,
  update as updateA,
  reset as resetA,
} from "./simulationA";
import {
  createSimulationB,
  startJump as startJumpB,
  update as updateB,
  reset as resetB,
} from "./simulationB";
import { initializeRenderer, render } from "./renderer";
import { initializeController } from "./controller";
import { startAnimation, stopAnimation } from "./animation";

// 状態の初期化
let stateA = createSimulationA();
let stateB = createSimulationB();

// 初期化処理
function init(): void {
  // 描画の初期化
  initializeRenderer();

  // コントローラーの初期化
  initializeController({
    onJump: () => {
      startJumpA(stateA);
      startJumpB(stateB);
    },
    onReset: () => {
      resetA(stateA);
      resetB(stateB);
      render(stateA, stateB); // リセット後の描画
    },
  });

  // アニメーションループの開始
  startAnimation((deltaTime: number) => {
    // シミュレーションの更新
    updateA(stateA, deltaTime);
    updateB(stateB, deltaTime);

    // 描画
    render(stateA, stateB);
  });

  // 初回描画
  render(stateA, stateB);
}

// DOMContentLoaded で初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

### ステップ 9: スタイリング

#### `styles/main.css` の実装方針

- モバイル対応を考慮したレスポンシブデザイン
- アクセシビリティを考慮したコントラスト比
- アニメーションの滑らかさを考慮したトランジション

### ステップ 10: 拡張機能の実装（任意）

#### 軌跡描画の最適化

- 軌跡の最大数を制限（例: 1000 点）
- 古い軌跡を削除するロジック
- パフォーマンステスト

#### パラメータ調整スライダーの実装

- HTML にスライダー要素を追加
- イベントリスナーでリアルタイム更新
- 定数の更新とシミュレーションの再初期化

#### 数値の可視化の実装

- `info-a` と `info-b` 要素に数値を表示
- 毎フレーム更新
- フォーマット関数で見やすく表示

---

## ✅ 品質チェック項目

### 機能テスト

- [ ] ボタン操作で常に両シミュレーションが同期して開始・停止すること
- [ ] シミュレーション A が等速度で上下移動し、B が加速度によって滑らかに変化することを視覚確認
- [ ] リセット後に双方の状態が完全初期化されることを確認
- [ ] `deltaTime` が正しく計算され、フレームレートに依存しないこと
- [ ] キャラクターが地面からはみ出さないこと

### コード品質

- [ ] TypeScript の型エラーがないこと
- [ ] ESLint のエラーがないこと（設定している場合）
- [ ] ブラウザのコンソールにエラーが出ないこと
- [ ] メモリリークがないこと（長時間実行テスト）

### パフォーマンス

- [ ] 60 FPS を維持できること
- [ ] 軌跡の記録がパフォーマンスに影響しないこと
- [ ] タブが非アクティブになった場合でも正常に動作すること

### UI/UX

- [ ] ボタンが適切に動作すること
- [ ] レスポンシブデザインが機能すること
- [ ] 拡張機能を実装した場合は UI 説明を追加

---

## 🐛 デバッグのヒント

### よくある問題と解決方法

#### 1. アニメーションが動かない

**原因**: `requestAnimationFrame` が正しく呼ばれていない

**解決方法**:

- ブラウザのコンソールでエラーを確認
- `startAnimation` が呼ばれているか確認
- `updateCallback` が正しく設定されているか確認

#### 2. シミュレーションがフレームレートに依存する

**原因**: `deltaTime` が正しく計算されていない

**解決方法**:

- `console.log` で `deltaTime` の値を確認
- `performance.now()` の使用を確認
- 最大 `deltaTime` の制限を確認

#### 3. キャラクターが地面からはみ出す

**原因**: 衝突判定が正しく実装されていない

**解決方法**:

- `position.y` と `GROUND_Y` の値を `console.log` で確認
- 衝突判定の条件を確認
- 位置補正が正しく行われているか確認

#### 4. 軌跡が表示されない

**原因**: 軌跡の配列が空、または描画処理が正しくない

**解決方法**:

- `state.trail.length` を確認
- 軌跡の記録が毎フレーム行われているか確認
- Canvas の描画処理を確認

### デバッグ用のコード例

```typescript
// deltaTime の確認
function animate(currentTime: number): void {
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
  console.log("deltaTime:", deltaTime); // デバッグ用
  // ...
}

// 状態の確認
function update(state: SimulationAState, deltaTime: number): void {
  // ...
  console.log("position.y:", state.position.y, "isJumping:", state.isJumping); // デバッグ用
}
```

### ブラウザの開発者ツールの活用

- **Performance タブ**: フレームレートとパフォーマンスを監視
- **Console タブ**: エラーとログを確認
- **Elements タブ**: DOM 要素の確認
- **Network タブ**: リソースの読み込み確認

---

## 📚 参考資料

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)

### Canvas API

- [MDN: Canvas API](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/ja/docs/Web/API/window/requestAnimationFrame)

### Vite

- [Vite Documentation](https://vitejs.dev/)
- [Vite TypeScript Guide](https://vitejs.dev/guide/features.html#typescript)

### 物理シミュレーション

- [オイラー法](https://ja.wikipedia.org/wiki/%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E6%B3%95)
- [ゲーム物理エンジン入門](https://www.amazon.co.jp/dp/4798123587)

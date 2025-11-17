# Cursor Rules: ジャンプの比較シミュレーション

このプロジェクトの詳細情報は以下のファイルを参照してください：

- **仕様書**: [`.cursor/specification.md`](.cursor/specification.md) - プロジェクトの要件、技術スタック、定数、型定義、HTML/CSS 構造、拡張機能の仕様
- **実装方針**: [`.cursor/implementation-guide.md`](.cursor/implementation-guide.md) - 開発環境セットアップ、詳細な実装手順、各モジュールの実装方針、品質チェック、デバッグ

---

## 📋 プロジェクト概要

物理シミュレーションの有無によるジャンプ挙動の違いを視覚化し、ゲームプログラミング初学者が「ふわっと感（加減速）」を体感できる教育用 Web ページを実装する。

---

## 🛠️ 技術スタック

- **言語**: TypeScript (strict mode)
- **ビルドツール**: Vite
- **フレームワーク**: なし（Vanilla TypeScript）
- **描画**: HTML5 Canvas API
- **スタイリング**: CSS3
- **パッケージ管理**: **pnpm（必須）** - `npm`や`yarn`は使用禁止
- **開発環境**: Dev Container（VS Code Dev Containers）

---

## 📁 プロジェクト構成

```
jump-comparison-demo/
├── .devcontainer/
│   └── devcontainer.json          # Dev Container設定
├── .cursor/
│   ├── rules.md                   # このファイル（インデックス）
│   ├── specification.md           # 仕様書
│   ├── implementation-guide.md    # 実装方針
│   └── commit-guide.md           # コミット方針
├── index.html                      # エントリーポイント
├── src/
│   ├── main.ts                    # アプリケーション初期化
│   ├── constants.ts               # 物理定数と設定値
│   ├── types.ts                   # TypeScript型定義
│   ├── simulationA.ts            # 等速ジャンプシミュレーション
│   ├── simulationB.ts            # 物理ジャンプシミュレーション
│   ├── renderer.ts                # Canvas描画ロジック
│   ├── controller.ts              # UIコントローラー
│   └── animation.ts               # アニメーションループ管理
├── styles/
│   └── main.css                   # スタイルシート
├── package.json
├── pnpm-lock.yaml                 # pnpmロックファイル
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 クイックスタート

### 開発環境セットアップ

1. Dev Container でプロジェクトを開く
2. 依存関係をインストール: `pnpm install`
3. 開発サーバーを起動: `pnpm dev`

詳細は [実装方針](.cursor/implementation-guide.md) を参照してください。

---

## 📚 ドキュメント

- [仕様書](.cursor/specification.md) - プロジェクトの要件と仕様
- [実装方針](.cursor/implementation-guide.md) - 詳細な実装ガイド
- [コミット方針](.cursor/commit-guide.md) - コミットメッセージの形式とルール

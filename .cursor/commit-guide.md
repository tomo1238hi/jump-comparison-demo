# コミット方針: ジャンプの比較シミュレーション

このプロジェクトでのコミットメッセージの書き方とコミットのルールを定義します。

---

## 📝 コミットメッセージの形式

### Conventional Commits 形式を使用

コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) の形式に従います。

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 必須要素

- **type**: コミットの種類（必須）
- **subject**: 変更内容の簡潔な説明（必須、50 文字以内）

### オプション要素

- **scope**: 変更範囲（オプション）
- **body**: 変更の詳細説明（オプション、72 文字で折り返し）
- **footer**: 関連する Issue 番号など（オプション）

---

## 🏷️ コミットタイプ（type）

### 主要なタイプ

| タイプ     | 説明                                       | 例                                       |
| ---------- | ------------------------------------------ | ---------------------------------------- |
| `feat`     | 新機能の追加                               | `feat: 軌跡描画機能を追加`               |
| `fix`      | バグ修正                                   | `fix: 地面との衝突判定を修正`            |
| `docs`     | ドキュメントの変更                         | `docs: READMEにセットアップ手順を追加`   |
| `style`    | コードスタイルの変更（動作に影響しない）   | `style: インデントを統一`                |
| `refactor` | リファクタリング（機能追加・バグ修正以外） | `refactor: シミュレーション関数を分割`   |
| `perf`     | パフォーマンス改善                         | `perf: 軌跡配列の最大数を制限`           |
| `test`     | テストの追加・変更                         | `test: シミュレーションAのテストを追加`  |
| `chore`    | ビルドプロセスやツールの変更               | `chore: pnpmのバージョンを更新`          |
| `ci`       | CI/CD 設定の変更                           | `ci: GitHub Actionsのワークフローを追加` |

### 使用例

```bash
feat(simulation): 軌跡描画機能を追加

各フレームで位置を記録し、Canvasに軌跡を描画する機能を実装。
シミュレーションAは直線、シミュレーションBは曲線で描画。

Closes #10
```

---

## 📍 スコープ（scope）

変更が影響する範囲を指定します。以下のスコープを使用できます：

- `simulation` - シミュレーションロジック（simulationA.ts, simulationB.ts）
- `renderer` - 描画ロジック（renderer.ts）
- `animation` - アニメーションループ（animation.ts）
- `controller` - UI コントローラー（controller.ts）
- `types` - 型定義（types.ts）
- `constants` - 定数定義（constants.ts）
- `styles` - CSS スタイル（main.css）
- `config` - 設定ファイル（tsconfig.json, vite.config.ts）
- `docs` - ドキュメント（.cursor/ 配下）
- `deps` - 依存関係（package.json）

### 使用例

```bash
feat(simulation): 軌跡描画機能を追加
fix(renderer): Canvas描画のパフォーマンスを改善
refactor(animation): deltaTime計算ロジックを最適化
```

---

## ✍️ サブジェクト（subject）の書き方

### ルール

1. **動詞で始める**（日本語の場合）

   - ✅ `feat: 軌跡描画機能を追加`
   - ❌ `feat: 軌跡描画機能の追加`

2. **現在形で書く**

   - ✅ `fix: 衝突判定を修正`
   - ❌ `fix: 衝突判定を修正した`

3. **簡潔に書く**（50 文字以内）

   - ✅ `feat: パラメータ調整スライダーを追加`
   - ❌ `feat: ユーザーがリアルタイムで重力やジャンプ力を調整できるスライダーUIを追加`

4. **句読点を付けない**
   - ✅ `fix: 地面との衝突判定を修正`
   - ❌ `fix: 地面との衝突判定を修正。`

### 良い例

```bash
feat(simulation): 軌跡描画機能を追加
fix(renderer): キャラクターが地面からはみ出す問題を修正
refactor(animation): deltaTime計算を関数に分離
docs: 実装方針にデバッグ手順を追加
```

### 悪い例

```bash
# 動詞で始まっていない
feat: 軌跡描画機能の追加

# 過去形
fix: 衝突判定を修正した

# 長すぎる
feat: ユーザーがリアルタイムで重力やジャンプ力を調整できるスライダーUIを追加して、よりインタラクティブな体験を提供する

# 句読点がある
fix: 地面との衝突判定を修正。
```

---

## 📄 ボディ（body）の書き方

### ルール

1. **変更の理由と内容を説明**
2. **72 文字で折り返し**
3. **空行でサブジェクトと区切る**
4. **箇条書きを使用可能**

### 使用例

```bash
feat(simulation): 軌跡描画機能を追加

各フレームで位置を記録し、Canvasに軌跡を描画する機能を実装。
- シミュレーションA: 直線で結ぶ（三角形の軌跡）
- シミュレーションB: 曲線で結ぶ（放物線の軌跡）
- パフォーマンス考慮: 最大1000点まで記録

Closes #10
```

---

## 🔗 フッター（footer）の書き方

### Issue 番号の参照

```bash
Closes #10
Fixes #15
Refs #20
```

### 破壊的変更の記載

```bash
BREAKING CHANGE: 定数名を変更（GRAVITY → GRAVITY_FORCE）

既存のコードでGRAVITYを使用している場合は、GRAVITY_FORCEに変更が必要です。
```

---

## 📋 コミットの粒度

### 良いコミットの特徴

1. **1 つの変更に 1 つのコミット**

   - ✅ 機能追加とバグ修正を別々にコミット
   - ❌ 複数の変更を 1 つのコミットにまとめる

2. **論理的な単位で分割**

   - ✅ 型定義の追加 → 関数の実装 → テストの追加（3 つのコミット）
   - ❌ すべてを 1 つのコミットにまとめる

3. **動作する状態でコミット**
   - ✅ コンパイルエラーがない状態でコミット
   - ❌ エラーがある状態でコミット

### コミットの分割例

```bash
# 1. 型定義の追加
feat(types): SimulationAStateインターフェースを追加

# 2. 関数の実装
feat(simulation): 等速ジャンプの実装を追加

# 3. テストの追加
test(simulation): シミュレーションAのテストを追加
```

---

## 🚫 コミットしてはいけないもの

### コミットしないファイル

- ビルド成果物（`dist/`, `build/`）
- ログファイル（`*.log`）
- エディタ設定（`.vscode/`, `.idea/`）※プロジェクト共通設定は除く
- OS 固有ファイル（`.DS_Store`, `Thumbs.db`）
- 一時ファイル（`*.tmp`, `*.swp`）

### `.gitignore` で除外

```gitignore
# ビルド成果物
dist/
build/

# ログ
*.log

# エディタ
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🔄 コミット前のチェックリスト

コミット前に以下を確認してください：

- [ ] コードがコンパイルエラーなく動作する
- [ ] TypeScript の型エラーがない
- [ ] ブラウザのコンソールにエラーが出ない
- [ ] コミットメッセージが Conventional Commits 形式に従っている
- [ ] 不要なファイルがコミット対象に含まれていない
- [ ] 1 つのコミットに 1 つの変更が含まれている

---

## 📚 コミット例

### 機能追加

```bash
feat(simulation): 軌跡描画機能を追加

各フレームで位置を記録し、Canvasに軌跡を描画する機能を実装。
シミュレーションAは直線、シミュレーションBは曲線で描画。

Closes #10
```

### バグ修正

```bash
fix(renderer): キャラクターが地面からはみ出す問題を修正

衝突判定で位置補正が正しく行われていなかったため、
地面に到達した際に正確な位置に補正する処理を追加。

Fixes #15
```

### リファクタリング

```bash
refactor(animation): deltaTime計算を関数に分離

deltaTime計算ロジックを独立した関数に分離し、
コードの可読性とテスト容易性を向上。

Refs #20
```

### ドキュメント更新

```bash
docs: 実装方針にデバッグ手順を追加

よくある問題と解決方法、デバッグ用コード例を追加。
```

### パフォーマンス改善

```bash
perf(simulation): 軌跡配列の最大数を制限

軌跡配列が無制限に増加するのを防ぐため、
最大1000点まで記録する制限を追加。

これにより長時間実行時のメモリ使用量を削減。
```

---

## 🔧 Git エイリアスの設定（オプション）

便利な Git エイリアスを設定できます：

```bash
# コミットメッセージのテンプレートを設定
git config --global commit.template .cursor/commit-template.txt

# エイリアスの設定例
git config --global alias.cm "commit -m"
git config --global alias.cam "commit -am"
```

---

## 📖 参考資料

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git コミットメッセージのベストプラクティス](https://qiita.com/itosho/items/9565c6f2eedc0c0dc4b1)
- [良いコミットメッセージを書くために](https://postd.cc/how-to-write-a-git-commit-message/)

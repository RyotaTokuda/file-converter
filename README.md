# ローカルファイル変換

HEIC・WebP・JPG・PNG などをブラウザ内だけで変換するウェブサービスです。
**ファイルはサーバーに送られません。**

## 対応形式（MVP）

### 画像
| 入力 | 出力 |
|---|---|
| HEIC / HEIF | JPG / PNG |
| WebP | JPG / PNG |
| JPG | PNG / WebP |
| PNG | JPG / WebP |

### 動画（予定）
- MP4 / MOV → MP4
- MP4 → GIF
- 動画の軽量化

## 技術スタック

| パッケージ | 役割 |
|---|---|
| Next.js (App Router) | フレームワーク |
| Tailwind CSS | スタイル |
| heic2any | HEIC → JPG/PNG 変換 |
| Canvas API | WebP / JPG / PNG 変換・圧縮・リサイズ |
| ffmpeg.wasm（予定） | 動画変換 |

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` をブラウザで開く。

## 注意事項

ffmpeg.wasm は SharedArrayBuffer を使用するため next.config.ts で COOP/COEP ヘッダーを設定しています。

## ディレクトリ構成

```
file-converter/
  app/
    page.tsx          ← メインUI（1画面完結）
    layout.tsx
    globals.css
  components/
    DropZone.tsx      ← ドラッグ&ドロップ
    FormatPicker.tsx  ← 出力形式・プリセット・品質設定
    ConvertPanel.tsx  ← ファイル一覧・進捗・ダウンロード
  lib/
    imageConverter.ts ← 画像変換ロジック
  next.config.ts      ← COOP/COEP ヘッダー設定
```

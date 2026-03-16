"use client";

import { useState } from "react";
import DropZone from "@/components/DropZone";
import FormatPicker from "@/components/FormatPicker";
import ConvertPanel from "@/components/ConvertPanel";
import { convertImage, OutputFormat, ConvertResult } from "@/lib/imageConverter";

interface FileItem {
  file: File;
  status: "waiting" | "converting" | "done" | "error";
  result?: ConvertResult;
  error?: string;
}

const ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif";

export default function Home() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.85);
  const [maxWidth, setMaxWidth] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  function handleFiles(files: File[]) {
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ file, status: "waiting" as const })),
    ]);
  }

  async function handleConvert() {
    setIsConverting(true);

    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== "waiting") continue;

      setItems((prev) =>
        prev.map((item, idx) => idx === i ? { ...item, status: "converting" } : item)
      );

      try {
        const result = await convertImage(items[i].file, {
          outputFormat,
          quality,
          maxWidth: maxWidth ? Number(maxWidth) : undefined,
        });
        setItems((prev) =>
          prev.map((item, idx) => idx === i ? { ...item, status: "done", result } : item)
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "変換に失敗しました";
        setItems((prev) =>
          prev.map((item, idx) => idx === i ? { ...item, status: "error", error: message } : item)
        );
      }
    }

    setIsConverting(false);
  }

  function handleClear() {
    setItems([]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">🔄 ローカルファイル変換</h1>
            <p className="text-xs text-gray-400">by Bloom Software</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-700">完全ローカル処理</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 説明 */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-4">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>ファイルはサーバーに送られません。</strong>
              すべての変換処理はあなたのブラウザ内だけで行われます。
              個人情報や機密ファイルも安心してご利用いただけます。
            </p>
          </div>

          {/* ドロップゾーン */}
          <DropZone onFiles={handleFiles} accept={ACCEPT} disabled={isConverting} />

          {/* 変換設定 */}
          <FormatPicker
            outputFormat={outputFormat}
            quality={quality}
            maxWidth={maxWidth}
            onOutputFormat={setOutputFormat}
            onQuality={setQuality}
            onMaxWidth={setMaxWidth}
          />

          {/* 変換パネル */}
          <ConvertPanel
            items={items}
            onConvert={handleConvert}
            onClear={handleClear}
            isConverting={isConverting}
          />
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Bloom Software ·{" "}
        <a href="https://bloom-software.vercel.app/privacy" className="hover:text-gray-600">
          プライバシーポリシー
        </a>
      </footer>
    </div>
  );
}

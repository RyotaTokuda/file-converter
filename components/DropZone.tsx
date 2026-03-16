"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface Props {
  onFiles: (files: File[]) => void;
  accept?: string;
  disabled?: boolean;
}

export default function DropZone({ onFiles, accept, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = "";
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed
        px-6 py-12 transition-colors cursor-pointer select-none
        ${isDragging ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span className="text-4xl">📂</span>
      <div className="text-center">
        <p className="font-semibold text-gray-800">ファイルをドロップ</p>
        <p className="text-sm text-gray-400 mt-0.5">またはクリックして選択</p>
      </div>
      <p className="text-xs text-gray-400">HEIC / WebP / JPG / PNG 対応</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

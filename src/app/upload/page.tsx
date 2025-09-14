// app/upload/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      router.push(`/p/${json.prescriptionId}`);
    } catch (err: any) {
      setMessage(err.message);
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Upload prescription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block rounded-2xl border-2 border-dashed border-neutral-300 p-6 text-center hover:border-neutral-400">
          <input
            type="file"
            accept="image/*,.pdf"
            capture="environment"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="space-y-1 text-sm text-neutral-600">
            Drag & drop, or click to choose an image/PDF
          </div>
          {file && (
            <div className="mt-2 text-xs text-neutral-500">
              Selected: {file.name}
            </div>
          )}
        </label>

        <button
          disabled={!file || status === "uploading"}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "uploading" ? "Uploading…" : "Upload"}
        </button>

        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
      <p className="text-xs text-neutral-500">
        By uploading, you confirm you own the prescription. Not medical advice.
      </p>
    </div>
  );
}

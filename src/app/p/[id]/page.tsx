// app/p/[id]/page.tsx (replace with this improved version)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { MedicationItem } from "@/lib/types";

interface RxResponse {
  _id: string;
  fileUrl: string;
  status: "UPLOADED" | "PROCESSING" | "READY" | "NEEDS_REVIEW" | "FAILED";
  items: MedicationItem[];
  overallConfidence?: number | null;
}

const STATUS_COLOR: Record<RxResponse["status"], string> = {
  UPLOADED: "bg-neutral-200 text-neutral-800",
  PROCESSING: "bg-amber-100 text-amber-800",
  READY: "bg-emerald-100 text-emerald-800",
  NEEDS_REVIEW: "bg-rose-100 text-rose-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function RxDetailPage() {
  const params = useParams<{ id: string }>();
  const [rx, setRx] = useState<RxResponse | null>(null);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [saving, setSaving] = useState(false);
  const pollRef = useRef<number | null>(null);

  const shouldPoll = useMemo(
    () =>
      rx &&
      (rx.status === "UPLOADED" ||
        rx.status === "PROCESSING" ||
        rx.status === "NEEDS_REVIEW"),
    [rx]
  );

  async function load() {
    const res = await fetch(`/api/prescriptions/${params.id}`);
    const json = await res.json();
    setRx(json);
    setItems(json.items || []);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  //   useEffect(() => {
  //     if (!shouldPoll) {
  //       if (pollRef.current) window.clearInterval(pollRef.current);
  //       pollRef.current = null;
  //       return;
  //     }
  //     pollRef.current = window.setInterval(load, 2500);
  //     return () => {
  //       if (pollRef.current) window.clearInterval(pollRef.current);
  //       pollRef.current = null;
  //     };
  //   }, [shouldPoll]);

  function updateItem(i: number, key: keyof MedicationItem, value: any) {
    setItems((prev) => {
      const clone = [...prev];
      clone[i] = { ...clone[i], [key]: value };
      return clone;
    });
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      { rawName: "", genericName: null, brandName: null },
    ]);
  }

  function removeRow(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/prescriptions/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(
        "Validation failed. Please check fields.\n" +
          JSON.stringify(j.issues, null, 2)
      );
    } else {
      await load();
    }
    setSaving(false);
  }

  async function processNow() {
    const r = await fetch(`/api/process/${params.id}`, { method: "POST" });
    if (!r.ok) {
      const j = await r.json();
      alert("Process failed: " + (j.error || r.statusText));
    } else {
      await load();
    }
  }

  if (!rx) return <div className="py-10 text-neutral-600">Loading…</div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescription</h1>
          <p className="text-sm text-neutral-600">
            ID: <span className="font-mono">{rx._id}</span>
          </p>
          <div
            className={`mt-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
              STATUS_COLOR[rx.status]
            }`}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current/60" />
            <span>Status: {rx.status}</span>
            {rx.overallConfidence != null && (
              <span className="ml-2 rounded bg-white/60 px-1.5 py-0.5 text-xs">
                Confidence: {(rx.overallConfidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={rx.fileUrl}
            target="_blank"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            View original
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {/* Dev-only: simulate worker */}
          {rx.status !== "READY" && (
            <button
              onClick={processNow}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Process now (dev)
            </button>
          )}
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              {[
                "Raw",
                "Generic",
                "Brand",
                "Strength",
                "Form",
                "Freq",
                "Duration",
                "Notes",
                "Buy URL",
                "",
              ].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <input
                    value={it.rawName || ""}
                    onChange={(e) => updateItem(idx, "rawName", e.target.value)}
                    className="w-48 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.genericName || ""}
                    onChange={(e) =>
                      updateItem(idx, "genericName", e.target.value)
                    }
                    className="w-48 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.brandName || ""}
                    onChange={(e) =>
                      updateItem(idx, "brandName", e.target.value)
                    }
                    className="w-40 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.strength || ""}
                    onChange={(e) =>
                      updateItem(idx, "strength", e.target.value)
                    }
                    className="w-28 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.form || ""}
                    onChange={(e) => updateItem(idx, "form", e.target.value)}
                    className="w-28 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.frequency || ""}
                    onChange={(e) =>
                      updateItem(idx, "frequency", e.target.value)
                    }
                    className="w-24 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.duration || ""}
                    onChange={(e) =>
                      updateItem(idx, "duration", e.target.value)
                    }
                    className="w-28 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.notes || ""}
                    onChange={(e) => updateItem(idx, "notes", e.target.value)}
                    className="w-64 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={it.buyUrl || ""}
                    onChange={(e) => updateItem(idx, "buyUrl", e.target.value)}
                    className="w-64 rounded-md border px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t">
              <td colSpan={10} className="px-3 py-3">
                <button
                  onClick={addRow}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                >
                  + Add medicine
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-500">
        This assistive tool doesn’t replace medical advice. Please review
        entries before purchasing.
      </p>
    </div>
  );
}

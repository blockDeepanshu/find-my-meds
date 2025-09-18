"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { MedicationItem } from "@/lib/types";

interface RxResponse {
  _id: string;
  fileUrl: string;
  status: "UPLOADED" | "PROCESSING" | "READY" | "NEEDS_REVIEW" | "FAILED";
  items: MedicationItem[];
  overallConfidence?: number | null;
}

const STATUS_CONFIG: Record<
  RxResponse["status"],
  { color: string; icon: string; label: string }
> = {
  UPLOADED: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📄",
    label: "Uploaded",
  },
  PROCESSING: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⚡",
    label: "AI Processing",
  },
  READY: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "✅",
    label: "Ready",
  },
  NEEDS_REVIEW: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "⚠️",
    label: "Needs Review",
  },
  FAILED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "❌",
    label: "Failed",
  },
};

export default function RxDetailPage() {
  const params = useParams<{ id: string }>();
  const [rx, setRx] = useState<RxResponse | null>(null);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
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
    setProcessing(true);
    try {
      const r = await fetch(`/api/process/${params.id}`, { method: "POST" });
      if (!r.ok) {
        const j = await r.json();
        alert("Process failed: " + (j.error || r.statusText));
      } else {
        await load();
      }
    } catch (error) {
      alert("Process failed: " + error);
    } finally {
      setProcessing(false);
    }
  }

  if (!rx) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">
              Loading prescription...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[rx.status];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Prescription
              </h3>
              <p className="text-gray-600">
                Our AI is analyzing your prescription...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Find My Med
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
              >
                Upload
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              Prescription Results
            </h1>
            <p className="mt-4 text-xl text-indigo-100">
              Review and edit your extracted medicine information
            </p>
          </div>
        </div>
      </section>

      {/* Prescription Info Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Prescription Details
                    </h2>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                    >
                      <span className="text-base">{statusConfig.icon}</span>
                      <span>{statusConfig.label}</span>
                      {rx.overallConfidence != null && (
                        <span className="ml-2 bg-white/60 px-2 py-0.5 rounded-full text-xs">
                          {(rx.overallConfidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Prescription ID:{" "}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {rx._id}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={rx.fileUrl}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Original
                  </a>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  {rx.status !== "READY" && (
                    <button
                      onClick={processNow}
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out cursor-pointer"
                    >
                      {processing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Process Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Medicine Items */}
            <div className="px-8 py-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Medicine Information
                </h3>
                <p className="text-sm text-gray-600">
                  Review and edit the extracted medicine details below
                </p>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No medicines found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add medicine information manually or reprocess the
                    prescription
                  </p>
                  <button
                    onClick={addRow}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out cursor-pointer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Medicine
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          Medicine #{idx + 1}
                        </h4>
                        <button
                          onClick={() => removeRow(idx)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition duration-150 ease-in-out cursor-pointer"
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Raw Name
                          </label>
                          <input
                            type="text"
                            value={item.rawName || ""}
                            onChange={(e) =>
                              updateItem(idx, "rawName", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="Medicine name as written"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generic Name
                          </label>
                          <input
                            type="text"
                            value={item.genericName || ""}
                            onChange={(e) =>
                              updateItem(idx, "genericName", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="Generic medicine name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand Name
                          </label>
                          <input
                            type="text"
                            value={item.brandName || ""}
                            onChange={(e) =>
                              updateItem(idx, "brandName", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="Brand name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Strength
                          </label>
                          <input
                            type="text"
                            value={item.strength || ""}
                            onChange={(e) =>
                              updateItem(idx, "strength", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="e.g., 500mg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Form
                          </label>
                          <input
                            type="text"
                            value={item.form || ""}
                            onChange={(e) =>
                              updateItem(idx, "form", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="e.g., tablet, capsule"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={item.frequency || ""}
                            onChange={(e) =>
                              updateItem(idx, "frequency", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="e.g., twice daily"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={item.duration || ""}
                            onChange={(e) =>
                              updateItem(idx, "duration", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="e.g., 7 days"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={item.notes || ""}
                            onChange={(e) =>
                              updateItem(idx, "notes", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            placeholder="Additional instructions"
                          />
                        </div>

                        <div className="lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Buy Online from Popular Stores
                          </label>
                          {(() => {
                            // Use raw name for search
                            const medicineNameForSearch =
                              item.rawName?.trim() || "medicine";
                            const searchQuery = encodeURIComponent(
                              medicineNameForSearch
                            );

                            // Define pharmacy configurations with search URLs
                            const pharmacyStores = [
                              {
                                name: "1mg",
                                color: "bg-orange-500 hover:bg-orange-600",
                                icon: "🟠",
                                url: `https://www.1mg.com/search/all?name=${searchQuery}`,
                              },
                              {
                                name: "PharmEasy",
                                color: "bg-green-500 hover:bg-green-600",
                                icon: "🟢",
                                url: `https://pharmeasy.in/search/all?name=${searchQuery}`,
                              },
                              {
                                name: "Apollo",
                                color: "bg-red-500 hover:bg-red-600",
                                icon: "🔴",
                                url: `https://www.apollopharmacy.in/search-medicines/${searchQuery}`,
                              },
                            ];

                            return (
                              <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                  Search for{" "}
                                  <strong>"{medicineNameForSearch}"</strong> on
                                  these pharmacy websites:
                                </p>

                                {/* Pharmacy Store Links */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {pharmacyStores.map((store) => (
                                    <a
                                      key={store.name}
                                      href={store.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex items-center justify-center px-4 py-3 text-white rounded-lg font-medium transition duration-150 ease-in-out cursor-pointer ${store.color}`}
                                    >
                                      <span className="mr-2 text-lg">
                                        {store.icon}
                                      </span>
                                      {store.name}
                                      <svg
                                        className="ml-2 h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                    </a>
                                  ))}
                                </div>

                                {/* Info Section */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div className="flex">
                                    <div className="flex-shrink-0">
                                      <svg
                                        className="h-5 w-5 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="ml-3">
                                      <h3 className="text-sm font-medium text-blue-800">
                                        💡 How it Works
                                      </h3>
                                      <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc list-inside space-y-1">
                                          <li>
                                            <strong>One-Click Search:</strong>{" "}
                                            Each button opens the pharmacy's
                                            search page with your medicine name
                                            already filled in
                                          </li>
                                          <li>
                                            <strong>Compare Prices:</strong>{" "}
                                            Check multiple stores to find the
                                            best deals and availability
                                          </li>
                                          <li>
                                            <strong>Reliable Results:</strong>{" "}
                                            Using exact medicine names ensures
                                            you find the right products
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-6">
                    <button
                      onClick={addRow}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Another Medicine
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Disclaimer */}
            <div className="px-8 py-6 bg-blue-50 border-t border-gray-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Medical Disclaimer
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This assistive tool doesn't replace medical advice. Always
                      consult your doctor before taking any medication. Please
                      review all extracted information for accuracy before
                      purchasing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

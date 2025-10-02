"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuotaStatus } from "@/components/QuotaStatus";
import { PaymentButton } from "@/components/PaymentButton";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const [message, setMessage] = useState<string>("");
  const [showPayment, setShowPayment] = useState(false);
  const [quotaKey, setQuotaKey] = useState(0); // For refreshing quota component
  const router = useRouter();

  // Check for payment success on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      setMessage("Payment successful! Your upload credits have been added.");
      setQuotaKey((prev) => prev + 1); // Refresh quota
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");
    setMessage("");
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();

      if (res.status === 402) {
        // Quota exceeded
        setShowPayment(true);
        setMessage(
          "Upload quota exceeded. Please purchase more credits to continue."
        );
        setStatus("idle");
        return;
      }

      if (!res.ok) throw new Error(json?.error || "Upload failed");

      // Refresh quota after successful upload
      setQuotaKey((prev) => prev + 1);
      router.push(`/p/${json.prescriptionId}`);
    } catch (err: any) {
      setMessage(err.message);
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/upload" className="text-indigo-600 font-medium">
                Upload
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Upload Your Prescription
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            Upload a photo or scan of your handwritten prescription and let our
            AI extract the medicine details for you.
          </p>
        </div>
      </section>

      {/* Upload Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quota Status Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <QuotaStatus key={quotaKey} />

                {showPayment && (
                  <div className="mt-6">
                    <PaymentButton
                      onPaymentComplete={() => {
                        setShowPayment(false);
                        setQuotaKey((prev) => prev + 1);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-8 py-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                      <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                      Step 1: Upload Your Prescription
                    </h2>
                    <p className="text-lg text-gray-500">
                      Take a clear photo or upload a scan of your prescription
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload Area */}
                    <label
                      className={`relative block w-full rounded-xl border-2 border-dashed p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer ${
                        file
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        className="sr-only"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />

                      {!file ? (
                        <div>
                          <div className="mx-auto h-16 w-16 text-gray-400 mb-6">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 48 48"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Upload prescription image or PDF
                          </h3>
                          <p className="text-sm text-gray-500 mb-6">
                            Drag and drop your file here, or click to browse
                          </p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                            <span>Supports JPG, PNG, PDF up to 10MB</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-10 w-10 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-lg font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-green-500"
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
                            </div>
                          </div>
                        </div>
                      )}
                    </label>

                    {/* Upload Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        type="submit"
                        disabled={!file || status === "uploading"}
                        className="relative inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[200px]"
                      >
                        {status === "uploading" ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
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
                              className="mr-2 h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            Upload & Process
                          </>
                        )}
                      </button>

                      <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        ← Back to Home
                      </Link>
                    </div>

                    {/* Status Messages */}
                    {message && (
                      <div
                        className={`rounded-xl p-4 ${
                          message.includes("successful")
                            ? "bg-green-50 border border-green-200"
                            : message.includes("quota exceeded")
                            ? "bg-yellow-50 border border-yellow-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className={`h-5 w-5 ${
                                message.includes("successful")
                                  ? "text-green-400"
                                  : message.includes("quota exceeded")
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  message.includes("successful")
                                    ? "M5 13l4 4L19 7"
                                    : message.includes("quota exceeded")
                                    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.98 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                }
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p
                              className={`text-sm font-medium ${
                                message.includes("successful")
                                  ? "text-green-800"
                                  : message.includes("quota exceeded")
                                  ? "text-yellow-800"
                                  : "text-red-800"
                              }`}
                            >
                              {message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>

                  {/* Disclaimer */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-xl p-6">
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
                            Important Notice
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                By uploading, you confirm you own this
                                prescription
                              </li>
                              <li>
                                This service is not medical advice - always
                                consult your doctor
                              </li>
                              <li>
                                Your data is processed securely and not stored
                                permanently
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What happens next?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                AI Processing
              </h3>
              <p className="text-gray-500">
                Our AI analyzes your prescription and extracts medicine details
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Review Results
              </h3>
              <p className="text-gray-500">
                Check the extracted information for accuracy
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Buy Online
              </h3>
              <p className="text-gray-500">
                Get links to purchase from trusted e-pharmacies
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Prescription {
  _id: string;
  status: "UPLOADED" | "PROCESSING" | "READY" | "NEEDS_REVIEW" | "FAILED";
  medicineCount: number;
  createdAt: string;
  originalImage: string;
}

const STATUS_CONFIG = {
  UPLOADED: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Uploaded",
  },
  PROCESSING: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    label: "Processing",
  },
  READY: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    label: "Ready",
  },
  NEEDS_REVIEW: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Needs Review",
  },
  FAILED: {
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Failed",
  },
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    fetchPrescriptions();
  }, [user, loading, router]);

  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/prescriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError("Failed to load prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading || isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-150">
                Find My Med
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Your Prescriptions
          </h2>
          <p className="text-gray-600 mt-2">
            Manage and view all your uploaded prescription documents
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="mb-6">
          <Link
            href="/upload"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Upload New Prescription
          </Link>
        </div>

        {/* Prescriptions List */}
        {prescriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicines
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescriptions.map((prescription) => (
                    <tr key={prescription._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            STATUS_CONFIG[prescription.status].color
                          }`}
                        >
                          {STATUS_CONFIG[prescription.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.medicineCount} medicine
                        {prescription.medicineCount !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/p/${prescription._id}`}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        STATUS_CONFIG[prescription.status].color
                      }`}
                    >
                      {STATUS_CONFIG[prescription.status].label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-900">
                      {prescription.medicineCount} medicine
                      {prescription.medicineCount !== 1 ? "s" : ""} extracted
                    </p>
                  </div>
                  <Link
                    href={`/p/${prescription._id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium transition duration-150"
                  >
                    View Details
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="mb-6">
          <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No prescriptions yet
      </h3>
      <p className="text-gray-600 mb-6">
        Upload your first prescription to get started with AI-powered medicine
        extraction
      </p>
      <Link
        href="/upload"
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        <svg
          className="w-5 h-5 mr-2"
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
        Upload Your First Prescription
      </Link>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface QuotaStatus {
  freeUploadsRemaining: number;
  paidUploadsRemaining: number;
  totalUploadsRemaining: number;
  canUpload: boolean;
}

interface QuotaStatusProps {
  refreshTrigger?: number;
}

export function QuotaStatus({ refreshTrigger }: QuotaStatusProps) {
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuota();
  }, [refreshTrigger]);

  const fetchQuota = async () => {
    try {
      const response = await fetch("/api/quota");
      if (response.ok) {
        const data = await response.json();
        setQuota(data.quotaStatus);
      }
    } catch (error) {
      console.error("Failed to fetch quota:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!quota) return null;

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-2">Upload Credits</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Free uploads remaining:</span>
          <span className="font-medium">{quota.freeUploadsRemaining}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Paid uploads remaining:</span>
          <span className="font-medium">{quota.paidUploadsRemaining}</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total remaining:</span>
            <span
              className={
                quota.totalUploadsRemaining > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {quota.totalUploadsRemaining}
            </span>
          </div>
        </div>
      </div>

      {!quota.canUpload && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          No upload credits remaining. Purchase more to continue uploading.
        </div>
      )}
    </div>
  );
}

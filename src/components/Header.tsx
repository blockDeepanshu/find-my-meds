"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SmoothLink } from "./LoadingRedirect";

interface HeaderProps {
  showAuth?: boolean;
  onLogout?: () => void;
}

export function Header({ showAuth = false, onLogout }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!onLogout) return;

    setIsLoggingOut(true);
    try {
      await onLogout();
      setTimeout(() => {
        router.push("/login");
      }, 300);
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <SmoothLink href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              Find My Med
            </span>
          </SmoothLink>

          <nav className="hidden md:flex space-x-8 items-center">
            <SmoothLink
              href="/"
              className="text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
              loadingMessage="Loading home..."
            >
              Home
            </SmoothLink>
            <SmoothLink
              href="/upload"
              className="text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
              loadingMessage="Loading upload..."
            >
              Upload
            </SmoothLink>

            {showAuth && (
              <>
                <SmoothLink
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                  loadingMessage="Loading dashboard..."
                >
                  Dashboard
                </SmoothLink>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Logging out...
                    </span>
                  ) : (
                    "Logout"
                  )}
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-900 cursor-pointer">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

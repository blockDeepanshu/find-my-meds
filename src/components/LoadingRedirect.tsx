"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoadingRedirectProps {
  to: string;
  message?: string;
  delay?: number;
}

export function LoadingRedirect({
  to,
  message = "Redirecting...",
  delay = 800,
}: LoadingRedirectProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsRedirecting(true);
    const timer = setTimeout(() => {
      router.push(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [to, delay, router]);

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
          <svg
            className="animate-spin h-8 w-8 text-white"
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
        </div>
        <p className="text-lg font-medium text-gray-900">{message}</p>
        <p className="text-sm text-gray-500 mt-1">Please wait...</p>
      </div>
    </div>
  );
}

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingMessage?: string;
}

export function SmoothLink({
  href,
  children,
  className = "",
  loadingMessage = "Loading...",
}: SmoothLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Add a small delay for better UX
    setTimeout(() => {
      router.push(href);
    }, 200);
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={`${className} cursor-pointer`}
      >
        {children}
      </a>
      {isLoading && (
        <LoadingRedirect to={href} message={loadingMessage} delay={0} />
      )}
    </>
  );
}

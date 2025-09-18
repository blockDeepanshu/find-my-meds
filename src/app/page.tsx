import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Turn Handwritten</span>
                  <span className="block text-yellow-300">
                    Prescriptions Into
                  </span>
                  <span className="block">Clear Medicine Orders</span>
                </h1>
                <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Upload your prescription, our AI deciphers it, and gives you
                  structured medicine details with buy-online links.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/upload"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="relative w-80 h-80 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-white text-6xl">📝</div>
              <div className="absolute -bottom-4 -right-4 text-4xl">→</div>
              <div className="absolute -bottom-4 right-8 text-white text-2xl">
                💊
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Powerful AI-Driven Medicine Recognition
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our advanced technology makes sense of even the messiest
              handwritten prescriptions.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      AI Powered OCR
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our advanced optical character recognition can handle even
                      the messiest handwritten prescriptions from doctors,
                      ensuring no medicine is missed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Structured Medicine Details
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get organized information with dosage, strength, and
                      frequency automatically extracted and formatted for easy
                      understanding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Buy Online
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Direct links to popular e-pharmacies like 1mg, PharmEasy,
                      and Apollo for safe and convenient online medicine
                      purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple 3-Step Process
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mx-auto">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  Upload Prescription
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Simply upload a photo or scan of your handwritten prescription
                  from your doctor.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mx-auto">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  AI Processing
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our AI extracts and normalizes medicine information, including
                  names, dosages, and frequencies.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mx-auto">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  Review & Buy
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Review the extracted information and purchase safely from
                  trusted online pharmacies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white font-medium">RS</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 italic">
                      "I couldn't read my doctor's handwriting at all. Find My
                      Med made it so easy to understand exactly what medicines I
                      needed and helped me order them online safely."
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-900">
                      - Rajesh Sharma, Mumbai
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white font-medium">PK</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 italic">
                      "As a senior citizen, I was struggling to decipher
                      prescriptions. This app is a game-changer - it saves me
                      time and ensures I get the right medications."
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-900">
                      - Priya Krishnan, Bangalore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Free Plan */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Free</h3>
                  <p className="mt-4 text-gray-500">
                    Perfect for occasional use
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ₹0
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Up to 5 prescriptions per month
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        AI-powered OCR
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Medicine buy links
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/upload"
                      className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                      Get Started Free
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500">
                <div className="px-6 py-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Pro
                    </h3>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                      Most Popular
                    </span>
                  </div>
                  <p className="mt-4 text-gray-500">
                    For regular users and families
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ₹299
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Unlimited prescriptions
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Priority AI processing
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Prescription history
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        24/7 customer support
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/upload"
                      className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                      Start Pro Trial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">
                  Find My Med
                </span>
              </div>
              <p className="text-gray-400 text-base">
                Making prescription reading simple and safe with AI technology.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.317C4.253 14.81 3.854 13.61 3.854 12.313c0-1.297.4-2.448 1.272-3.323C5.999 7.117 7.15 6.727 8.449 6.727c1.297 0 2.448.39 3.323 1.263.873.873 1.263 2.026 1.263 3.323 0 1.297-.39 2.497-1.263 3.324-.875.828-2.026 1.351-3.323 1.351zm7.706-10.404c-.302 0-.593-.12-.805-.333a1.146 1.146 0 01-.333-.806c0-.302.131-.593.333-.805a1.146 1.146 0 01.805-.333c.302 0 .593.131.805.333.202.212.333.503.333.805 0 .303-.131.594-.333.806a1.146 1.146 0 01-.805.333z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="text-center">
              <p className="text-base text-gray-400">
                © 2024 Find My Med. All rights reserved.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Disclaimer:</strong> This is not medical advice. Always
                consult your doctor before taking any medication.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

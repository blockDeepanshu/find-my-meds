import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Rx Reader</h1>
      <p className="text-neutral-600">
        Upload a doctor’s prescription image/PDF. We’ll extract medicines, dose,
        frequency, and safe buy links.
      </p>
      <Link
        href="/upload"
        className="inline-flex items-center rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
      >
        Get started
      </Link>
    </div>
  );
}

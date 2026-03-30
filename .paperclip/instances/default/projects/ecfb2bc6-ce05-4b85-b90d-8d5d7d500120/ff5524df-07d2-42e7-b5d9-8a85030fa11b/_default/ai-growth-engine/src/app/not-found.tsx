import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-extrabold">404</h1>
      <p className="mb-6 text-text-secondary">Page not found.</p>
      <Link
        href="/"
        className="cta-gradient rounded-lg px-6 py-3 font-bold text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}

import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">FH</div>
            <span className="text-xl font-bold text-gray-800">Friends Hardware</span>
          </Link>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">{children}</div>
      </div>
    </div>
  );
}

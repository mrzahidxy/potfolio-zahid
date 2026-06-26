"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center text-slate-900">
          <div>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page and try again.</p>
          </div>
        </main>
      </body>
    </html>
  );
}

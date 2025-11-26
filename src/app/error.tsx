"use client";
import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("GlobalError boundary caught:", error);
  return (
    <html>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 border border-neutral-800 rounded-lg p-6 bg-neutral-900">
          <h1 className="text-lg font-semibold">Unexpected Error</h1>
          <p className="text-sm text-neutral-300">{error.message || "Something went wrong while rendering this view."}</p>
          <div className="text-xs text-neutral-400">The error has been logged to the console. You can try to recover by resetting the boundary.</div>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded bg-accent text-black text-sm font-medium hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}

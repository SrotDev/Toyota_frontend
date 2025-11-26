"use client";
import React from "react";

export default function TelemetryError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Telemetry segment error:", error);
  return (
    <div className="space-y-4 border border-neutral-800 rounded p-6 bg-neutral-900">
      <h2 className="text-lg font-semibold">Telemetry Load Error</h2>
      <p className="text-sm text-neutral-300">{error.message || "Failed to load telemetry data."}</p>
      <button
        onClick={reset}
        className="px-3 py-1.5 rounded bg-accent text-black text-sm font-medium hover:opacity-90 transition"
      >Retry</button>
    </div>
  );
}

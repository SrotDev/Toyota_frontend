import React from "react";

export default function LoadingTelemetry() {
  // Skeleton blocks for charts and racing line while data loads
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-6 w-56 bg-neutral-800 rounded" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="h-4 w-40 bg-neutral-800 rounded" />
          <div className="h-64 w-full bg-neutral-800 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-48 bg-neutral-800 rounded" />
          <div className="h-64 w-full bg-neutral-800 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-44 bg-neutral-800 rounded" />
        <div className="h-72 w-full bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

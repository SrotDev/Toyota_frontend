"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) { setError('Choose a CSV or JSON telemetry file'); return; }
    const text = await file.text();
    // Store raw in sessionStorage for result processing
    sessionStorage.setItem('uploadedTelemetry', text);
    router.push('/upload/result');
  };

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Upload Telemetry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".csv,.json" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button className="px-4 py-2 rounded bg-accent text-sm" type="submit">Process</button>
      </form>
    </div>
  );
}

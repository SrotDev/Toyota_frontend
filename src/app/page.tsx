import React from 'react';
import { api } from '../utils/api';

export default async function HomePage() {
  const [leaderboard, tracks] = await Promise.all([
    api.leaderboardLaps(),
    api.tracks(),
  ]);

  // Create a mapping of track IDs to track names
  const trackMap = tracks.reduce((map: Record<string, string>, track: any) => {
    map[track.id] = track.name;
    return map;
  }, {});

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <header className="text-center py-16 border-b border-gray-700">
        <h1 className="text-4xl font-bold mb-4">Toyota Racing Dashboard</h1>
        <p className="text-lg text-gray-400">Your hub for track insights and lap analysis.</p>
        <a href="/tracks" className="mt-6 inline-block border border-white text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition">Explore Tracks</a>
      </header>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-12 px-6 border-t border-gray-700">
        <h2 className="text-2xl font-semibold mb-8 text-center">Top Lap Times</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left py-2">Track ID</th>
              <th className="text-left py-2">Track Name</th>
              <th className="text-left py-2">Lap #</th>
              <th className="text-left py-2">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row: any) => (
              <tr key={row.id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                <td>{row.track}</td>
                <td>{trackMap[row.track] || 'Unknown Track'}</td>
                <td>{row.lap_number}</td>
                <td>{row.lap_time.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-700">
        © 2025 Toyota Racing. All rights reserved.
      </footer>
    </div>
  );
}

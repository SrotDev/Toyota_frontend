import { api } from '../../utils/api';

export default async function TracksPage() {
  const tracks = await api.tracks();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Tracks</h2>
      <ul className="space-y-2">
        {tracks.map((t: any) => (
          <li key={t.id} className="border border-neutral-800 rounded p-3 flex justify-between">
            <span>{t.name}</span>
            <a className="text-accent" href={`/tracks/${t.id}`}>View</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

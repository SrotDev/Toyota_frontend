import { api } from '../../../../../utils/api';
interface Props { params: { id: string, turnId: string } }
export default async function TurnDetailPage({ params }: Props) {
  const ideal = await api.idealTelemetry(params.id);
  const turn = ideal.sectors?.find((s: any) => String(s.sector_number) === params.turnId);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Turn {params.turnId} Detail</h2>
      {turn ? (
        <pre className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800">{JSON.stringify(turn, null, 2)}</pre>
      ) : <p className="text-sm">No data for this turn.</p>}
    </div>
  );
}

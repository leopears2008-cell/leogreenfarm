import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface MandiRecord {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

interface MandiResponse {
  fetchedAt: string;
  region: string;
  source: string;
  prices: MandiRecord[];
}

const errorMessage = (body: unknown, fallback: string): string =>
  typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string'
    ? (body as { error: string }).error
    : fallback;

const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function MandiMarketWatch() {
  const [data, setData] = useState<MandiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/market-prices', { signal: controller.signal })
      .then(async (res) => {
        const body: unknown = await res.json().catch(() => null);
        if (!res.ok) throw new Error(errorMessage(body, 'Live mandi prices are unavailable right now.'));
        return body as MandiResponse;
      })
      .then((body) => setData(body))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(err instanceof Error ? err.message : 'Live mandi prices are unavailable right now.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.prices;
    return data.prices.filter((r) =>
      [r.commodity, r.variety, r.market, r.district].some((field) => field.toLowerCase().includes(q)),
    );
  }, [data, query]);

  return (
    <section className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 border border-emerald-500/20 shadow-2xl" aria-labelledby="mandi-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-500/15">
        <div>
          <h2 id="mandi-heading" className="text-2xl font-bold text-white tracking-tight">Mandi Market</h2>
          <p className="text-xs text-stone-400 mt-1">Reported wholesale prices from Tamil Nadu markets (₹ per quintal).</p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading && !data && <p role="status" className="text-sm text-stone-400 font-mono">Loading reported prices…</p>}

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error} Prices are never shown from sample data, so nothing is displayed until the live source works.</span>
        </div>
      )}

      {data && (
        <>
          <div className="relative max-w-sm">
            <label htmlFor="mandi-search" className="sr-only">Filter by commodity, market or district</label>
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="mandi-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by commodity, market or district"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121E16] border border-emerald-500/20 text-sm text-stone-200 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-stone-400">No records match. The source returned {data.prices.length} record(s) for Tamil Nadu.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-emerald-500/15">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Reported mandi prices in rupees per quintal</caption>
                <thead className="bg-[#121E16] text-xs font-mono uppercase text-emerald-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Commodity</th>
                    <th scope="col" className="px-4 py-3">Market</th>
                    <th scope="col" className="px-4 py-3 text-right">Min</th>
                    <th scope="col" className="px-4 py-3 text-right">Modal</th>
                    <th scope="col" className="px-4 py-3 text-right">Max</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10 text-stone-200">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3">{r.commodity}{r.variety ? <span className="text-stone-500"> · {r.variety}</span> : null}</td>
                      <td className="px-4 py-3">{r.market}<span className="text-stone-500">{r.district ? ` · ${r.district}` : ''}</span></td>
                      <td className="px-4 py-3 text-right font-mono">{rupees(r.minPrice)}</td>
                      <td className="px-4 py-3 text-right font-mono text-white">{rupees(r.modalPrice)}</td>
                      <td className="px-4 py-3 text-right font-mono">{rupees(r.maxPrice)}</td>
                      <td className="px-4 py-3 font-mono text-stone-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] font-mono text-stone-500 leading-relaxed">
            Source: {data.source}. Fetched {new Date(data.fetchedAt).toLocaleString('en-IN')}. Dates are the market's reported arrival dates and may not be today.
          </p>
        </>
      )}
    </section>
  );
}

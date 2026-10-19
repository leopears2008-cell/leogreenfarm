import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface ForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rain: number;
  rainMm: number;
}

interface WeatherData {
  district: string;
  zone: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainfallChance: number;
  uvIndex: number;
  forecast: ForecastDay[];
  units: { temperature: string; wind: string; rain: string };
  source: string;
  updatedAt: string;
}

const ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
  'cloud-fog': CloudFog,
};

const errorMessage = (body: unknown, fallback: string): string =>
  typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string'
    ? (body as { error: string }).error
    : fallback;

export default function WeatherDashboard({ district }: { district: string }) {
  const { t } = useLanguage();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/weather?district=${encodeURIComponent(district)}`, { signal: controller.signal })
      .then(async (res) => {
        const body: unknown = await res.json().catch(() => null);
        if (!res.ok) throw new Error(errorMessage(body, 'Live weather is unavailable right now.'));
        return body as WeatherData;
      })
      .then((body) => setData(body))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(err instanceof Error ? err.message : 'Live weather is unavailable right now.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [district, reloadKey]);

  const NowIcon = data ? ICONS[data.icon] ?? Cloud : Cloud;

  return (
    <section className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 border border-emerald-500/20 shadow-2xl" aria-labelledby="weather-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-500/15">
        <div>
          <h2 id="weather-heading" className="text-2xl font-bold text-white tracking-tight">Weather &amp; Rainfall</h2>
          <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            {data ? `${data.district} · ${data.zone}` : district}
          </p>
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

      {loading && !data && (
        <p role="status" className="text-sm text-stone-400 font-mono">Loading live forecast…</p>
      )}

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error} No sample data is shown in its place.</span>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-[#121E16]/80 border border-emerald-500/20">
              <NowIcon className="w-8 h-8 text-emerald-300 mb-2" aria-hidden="true" />
              <div className="text-4xl font-bold text-white font-mono">{data.temperature}{data.units.temperature}</div>
              <div className="text-sm text-stone-300">{data.condition}</div>
              <div className="text-xs text-stone-500 mt-1">Feels like {data.feelsLike}{data.units.temperature}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#121E16]/80 border border-emerald-500/20">
              <Droplets className="w-5 h-5 text-cyan-300 mb-2" aria-hidden="true" />
              <div className="text-xs text-stone-400">{t('humidity')}</div>
              <div className="text-xl font-bold text-white font-mono">{data.humidity}%</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#121E16]/80 border border-emerald-500/20">
              <Wind className="w-5 h-5 text-emerald-300 mb-2" aria-hidden="true" />
              <div className="text-xs text-stone-400">{t('wind')}</div>
              <div className="text-xl font-bold text-white font-mono">{data.windSpeed} {data.units.wind} {data.windDirection}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#121E16]/80 border border-emerald-500/20">
              <CloudRain className="w-5 h-5 text-sky-300 mb-2" aria-hidden="true" />
              <div className="text-xs text-stone-400">Rain chance today · UV max</div>
              <div className="text-xl font-bold text-white font-mono">{data.rainfallChance}% · {data.uvIndex}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">7-day forecast</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {data.forecast.map((day) => {
                const Icon = ICONS[day.icon] ?? Cloud;
                return (
                  <li key={day.date} className="p-3 rounded-xl bg-[#121E16]/80 border border-emerald-500/15 text-center space-y-1">
                    <div className="text-xs font-mono text-emerald-300">{day.day}</div>
                    <Icon className="w-6 h-6 mx-auto text-stone-200" aria-hidden="true" />
                    <div className="text-[11px] text-stone-400">{day.condition}</div>
                    <div className="text-sm font-mono text-white">{day.high}° / {day.low}°</div>
                    <div className="text-[11px] text-sky-300">{day.rain}% · {day.rainMm} {data.units.rain}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-[11px] font-mono text-stone-500 leading-relaxed">
            Source: {data.source}. Updated {data.updatedAt} (IST). Model forecasts can differ from conditions on your field.
          </p>
        </>
      )}
    </section>
  );
}

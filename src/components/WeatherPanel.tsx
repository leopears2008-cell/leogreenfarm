import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, MapPin, Calendar, Radio } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function WeatherPanel() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather?district=Thanjavur')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 h-64 animate-pulse" />;
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 text-white h-full flex flex-col justify-between bg-gradient-to-br from-[#0F2218] to-[#0A140E]" id="weather">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white text-sm">
              {weather?.district || 'Thanjavur'}, TN
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-mono text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span>LIVE</span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-4xl font-extrabold font-mono text-white mb-1">
              {weather?.temperature || 31}°C
            </div>
            <div className="text-emerald-300 text-sm font-medium">
              {language === 'ta' && weather?.conditionTa ? weather.conditionTa : (weather?.condition || 'Clear')}
            </div>
            {weather?.liveDate && (
              <div className="text-[11px] font-mono text-stone-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{weather.liveDate}</span>
              </div>
            )}
          </div>
          <Cloud className="w-10 h-10 text-cyan-400/40" />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-emerald-500/15 pt-4">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 font-mono">{t('humidity')}</div>
              <div className="text-xs font-bold font-mono text-white">{weather?.humidity || 65}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Wind className="w-4 h-4 text-stone-300 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 font-mono">{t('wind')}</div>
              <div className="text-xs font-bold font-mono text-white">{weather?.windSpeed || 14} km/h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

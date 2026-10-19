import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function WeatherPanel() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-64 animate-pulse"></div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl shadow-sm text-white h-full flex flex-col justify-between" id="weather">
      <div>
        <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-200" />
          <span className="font-medium text-blue-50">Local Farm</span>
        </div>
        <Cloud className="w-8 h-8 text-blue-100" />
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-5xl font-bold mb-1">{weather?.temperature}°C</div>
          <div className="text-blue-100 font-medium">{weather?.condition}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-blue-400/30 pt-6">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-blue-200" />
          <div>
            <div className="text-sm text-blue-200">{t('humidity')}</div>
            <div className="font-medium">{weather?.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-blue-200" />
          <div>
            <div className="text-sm text-blue-200">{t('wind')}</div>
            <div className="font-medium">{weather?.windSpeed} km/h</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

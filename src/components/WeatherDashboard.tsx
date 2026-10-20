import { useState, useEffect, useMemo } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  Sun, 
  MapPin, 
  Compass, 
  Calendar, 
  RefreshCw, 
  AlertTriangle, 
  Eye, 
  Thermometer, 
  Sparkles,
  Info,
  Search,
  Sunrise,
  Sunset,
  Gauge,
  Layers,
  Sprout,
  Activity,
  Radio
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TN_ALL_DISTRICTS, TNDistrict } from '../data/tnDistricts';
import TamilNaduWeather from '../TamilNaduWeather';

interface WeatherForecastDay {
  day: string;
  dateFormatted?: string;
  isoDate?: string;
  high: number;
  low: number;
  condition: string;
  conditionTa?: string;
  rain: number;
  icon: string;
}

interface WeatherData {
  district: string;
  districtId?: string;
  districtTa?: string;
  zone: string;
  zoneTa?: string;
  coordinates?: { lat: number; lon: number };
  live?: boolean;
  liveDate?: string;
  liveTime?: string;
  timestamp?: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionTa?: string;
  icon?: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  windDegrees?: number;
  rainfallChance: number;
  precipitation?: number;
  soilMoisture: string;
  soilMoistureNumeric?: number;
  evapotranspiration?: number;
  uvIndex: number;
  dewPoint: number;
  surfacePressure?: number;
  sunrise?: string;
  sunset?: string;
  advisory: string;
  advisoryTa?: string;
  primaryCrops?: string[];
  soilType?: string;
  forecast: WeatherForecastDay[];
}

const POPULAR_DISTRICT_IDS = [
  'thanjavur',
  'madurai',
  'coimbatore',
  'tiruchirappalli',
  'erode',
  'salem',
  'dindigul',
  'nilgiris'
];

export default function WeatherDashboard() {
  const { t, language } = useLanguage();
  const [selectedDistrictId, setSelectedDistrictId] = useState('thanjavur');
  const [viewMode, setViewMode] = useState<'station' | 'grid38'>('station');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');

  // Filter districts based on search query and zone
  const filteredDistricts = useMemo(() => {
    return TN_ALL_DISTRICTS.filter((d) => {
      const matchesSearch = 
        d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.nameTa.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.headquarters.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.zone.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesZone = 
        zoneFilter === 'all' || 
        d.zone.toLowerCase().includes(zoneFilter.toLowerCase());

      return matchesSearch && matchesZone;
    });
  }, [searchFilter, zoneFilter]);

  const currentDistrictObj = useMemo(() => {
    return TN_ALL_DISTRICTS.find(d => d.id === selectedDistrictId) || TN_ALL_DISTRICTS[0];
  }, [selectedDistrictId]);

  const fetchWeather = async (districtNameOrId: string) => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch(`/api/weather?district=${encodeURIComponent(districtNameOrId)}`);
      if (!res.ok) throw new Error('Failed to fetch weather telemetry');
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError('Unable to reach remote automated weather station.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDistrictId);
  }, [selectedDistrictId]);

  const getWeatherIcon = (iconName?: string) => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'cloud-drizzle':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      case 'sun':
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  if (loading && !weather) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-emerald-500/20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <p className="text-stone-300 font-mono text-sm">
          {language === 'ta' 
            ? 'தமிழ்நாடு 38 மாவட்ட வானிலை நிலையங்களுடன் இணைகிறது...' 
            : 'Synchronizing Real-Time Meteorological Telemetry across all 38 Tamil Nadu Districts...'}
        </p>
      </div>
    );
  }

  if (viewMode === 'grid38') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-[#0B130E] p-4 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Viewing Real-Time Numerical Weather Grid (All 38 Districts)</span>
          </div>
          <button
            onClick={() => setViewMode('station')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono cursor-pointer shadow transition-all"
          >
            ← Switch to Agro-Station & 7-Day Model
          </button>
        </div>
        <TamilNaduWeather onBackToDashboard={() => setViewMode('station')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & District Filter Controls */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-cyan-400 inline" />
                {t('weatherTitle')}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                38 Districts TN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {t('microclimate')} · {language === 'ta' ? 'அனைத்து 38 மாவட்ட நேரலை வானிலை நிலவரம்' : 'Live Real-Time Weather Integration & Forecasts'}
            </p>
          </div>

          {/* View Mode Toggle: Agro Station vs 38 Districts Grid */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09120C] border border-emerald-500/20 text-xs">
              <button
                onClick={() => setViewMode('station')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'station'
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Agro-Station
              </button>
              <button
                onClick={() => setViewMode('grid38')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid38'
                    ? 'bg-cyan-500 text-black font-bold shadow'
                    : 'text-cyan-300 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>38 Districts Grid</span>
              </button>
            </div>

            {/* Quick Refresh & Live Station Indicator */}
            {weather?.liveDate && (
              <div className="hidden sm:flex flex-col text-right pr-2 border-r border-white/10">
                <span className="text-[11px] font-mono text-emerald-300 font-semibold">{weather.liveDate}</span>
                <span className="text-[10px] font-mono text-stone-400">{weather.liveTime || 'Real-time'}</span>
              </div>
            )}
            <button
              onClick={() => fetchWeather(selectedDistrictId)}
              disabled={refreshing}
              className={`px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all cursor-pointer border border-white/10 flex items-center gap-2 text-xs font-mono ${
                refreshing ? 'text-emerald-400' : ''
              }`}
              title="Refresh Station Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Live'}</span>
            </button>
          </div>
        </div>

        {/* District Selector & Search Bar */}
        <div className="pt-2 border-t border-emerald-500/15 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={language === 'ta' ? '38 மாவட்டங்களில் தேடுங்கள் (எ.கா. சேலம், தஞ்சாவூர்)...' : 'Search 38 TN Districts (e.g. Salem, Nilgiris, Madurai)...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#0D1811] text-stone-200 placeholder-stone-500 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-emerald-500/20 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* All 38 Districts Dropdown */}
          <div className="md:col-span-7 flex items-center gap-2">
            <div className="w-full flex items-center gap-2 bg-[#0D1811] px-3 py-2 rounded-xl border border-emerald-500/20">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full bg-transparent text-emerald-300 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-3"
              >
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0B130E] text-stone-200">
                    {language === 'ta' ? `${d.nameTa} (${d.name})` : `${d.name} (${d.nameTa})`} — {d.zone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Select Chips for Major Farming Hubs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-mono uppercase text-stone-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {language === 'ta' ? 'முக்கிய மண்டலங்கள்:' : 'Key Hubs:'}
          </span>
          {POPULAR_DISTRICT_IDS.map((id) => {
            const dist = TN_ALL_DISTRICTS.find(d => d.id === id);
            if (!dist) return null;
            const isSelected = selectedDistrictId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedDistrictId(id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {language === 'ta' ? dist.nameTa : dist.name}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error} Presenting localized agro-meteorological estimate.</span>
        </div>
      )}

      {weather && (
        <>
          {/* Main Weather Hero Card & Current Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Current Weather Display */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between min-h-[340px] bg-gradient-to-br from-[#0F2218]/90 via-[#0B1710] to-[#070D09]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between z-10 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold">
                      {language === 'ta' && weather.zoneTa ? weather.zoneTa : weather.zone}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                    {language === 'ta' && weather.districtTa ? weather.districtTa : weather.district}, Tamil Nadu
                  </h3>
                  {weather.districtTa && language !== 'ta' && (
                    <span className="text-xs font-mono text-emerald-400/80">
                      {weather.districtTa}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live Weather Station
                  </div>
                  {weather.coordinates && (
                    <span className="text-[10px] font-mono text-stone-400">
                      GPS: {weather.coordinates.lat.toFixed(2)}°N, {weather.coordinates.lon.toFixed(2)}°E
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature & Main Condition with Live Date Timestamp */}
              <div className="my-6 z-10">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-6xl sm:text-7xl font-extrabold text-white font-mono tracking-tight">
                    {weather.temperature}°C
                  </span>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                      {getWeatherIcon(weather.icon)}
                      <span>
                        {language === 'ta' && weather.conditionTa ? weather.conditionTa : weather.condition}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 font-mono">
                      Feels like {weather.feelsLike}°C · Dew Point: {weather.dewPoint}°C
                    </div>
                  </div>
                </div>

                {/* Prominent Live Date & Time Bar */}
                {weather.liveDate && (
                  <div className="mt-3 flex items-center gap-3 text-xs font-mono text-cyan-300/90 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1.5 rounded-xl w-fit">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{weather.liveDate}</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-white font-semibold">{weather.liveTime}</span>
                  </div>
                )}
              </div>

              {/* Quick Row Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-500/15 z-10">
                <div>
                  <span className="text-[11px] text-stone-400 font-mono block mb-0.5 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    {t('humidity')}
                  </span>
                  <span className="text-base font-bold text-white font-mono">{weather.humidity}%</span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 font-mono block mb-0.5 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-stone-300" />
                    {t('wind')}
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {weather.windSpeed} km/h {weather.windDirection}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 font-mono block mb-0.5 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    {language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Chance'}
                  </span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    {weather.rainfallChance}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 font-mono block mb-0.5 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    Pressure
                  </span>
                  <span className="text-base font-bold text-stone-200 font-mono">
                    {weather.surfacePressure || 1012} hPa
                  </span>
                </div>
              </div>
            </div>

            {/* Field Agronomy Advisory Box & Agro-Soil Profile */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-emerald-500/20 flex flex-col justify-between space-y-4 bg-[#0A140E]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('agroAdvisory')}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    TNAU & KVK Model
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-2">
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                    {language === 'ta' && weather.advisoryTa ? weather.advisoryTa : weather.advisory}
                  </p>
                </div>

                {/* Additional Microclimate Parameters: Soil Moisture & UV */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0F1B13] border border-emerald-500/15">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                      {t('soilMoisture')}
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-300">
                      {weather.soilMoisture}
                    </span>
                    {weather.evapotranspiration && (
                      <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                        ET₀: {weather.evapotranspiration} mm/day
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#0F1B13] border border-emerald-500/15">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                      Solar UV Index
                    </span>
                    <span className="text-sm font-bold font-mono text-amber-300">
                      Index {weather.uvIndex} ({weather.uvIndex > 7 ? 'High' : 'Moderate'})
                    </span>
                    {weather.sunrise && (
                      <span className="text-[10px] font-mono text-stone-400 block mt-0.5 flex items-center gap-1">
                        <Sunrise className="w-3 h-3 text-amber-400 inline" /> {weather.sunrise} · <Sunset className="w-3 h-3 text-orange-400 inline" /> {weather.sunset}
                      </span>
                    )}
                  </div>
                </div>

                {/* District Key Crops and Soil Type Badge */}
                {currentDistrictObj && (
                  <div className="p-3 rounded-xl bg-[#0B150E] border border-emerald-500/10 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400 uppercase">
                      <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ta' ? 'முக்கிய பயிர்கள்:' : 'Primary District Crops:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentDistrictObj.primaryCrops.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-stone-300 font-mono text-[10px]">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 pt-0.5">
                      Soil: {currentDistrictObj.soilType} · HQ: {currentDistrictObj.headquarters}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] font-mono text-stone-500 flex items-center justify-between border-t border-emerald-500/10">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-500/60" />
                  Live satellite & telemetry synchronized
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {TN_ALL_DISTRICTS.length} TN Districts
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Agronomic Outlook Forecast Cards with Real Dates */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('forecast7Day')}
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Irrigation, Spraying & Sowing Planning
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {weather.forecast.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0B150E] border border-emerald-500/15 flex flex-col items-center justify-between text-center space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block">
                      {f.day}
                    </span>
                    {f.dateFormatted && (
                      <span className="text-[10px] font-mono text-stone-400 block">
                        {f.dateFormatted}
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    {getWeatherIcon(f.icon)}
                  </div>

                  <div className="text-[11px] text-stone-300 font-medium line-clamp-1">
                    {language === 'ta' && f.conditionTa ? f.conditionTa : f.condition}
                  </div>

                  <div className="w-full flex items-center justify-center gap-2 text-xs font-mono pt-2 border-t border-emerald-500/10">
                    <span className="text-white font-bold">{f.high}°</span>
                    <span className="text-stone-500">{f.low}°</span>
                  </div>

                  {f.rain > 0 ? (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-0.5 font-semibold">
                      <Droplets className="w-3 h-3" />
                      {f.rain}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-500">Dry</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

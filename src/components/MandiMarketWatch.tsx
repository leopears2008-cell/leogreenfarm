import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Truck,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface MarketPrice {
  id: string;
  commodity: string;
  commodityTa: string;
  market: string;
  marketTa: string;
  district: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  arrivalTons: number;
  date: string;
  source: string;
}

export default function MandiMarketWatch() {
  const { t, language } = useLanguage();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommodity, setActiveCommodity] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/market-prices');
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch (err) {
      console.error('Failed to fetch mandi prices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const districts = ['All', ...Array.from(new Set(prices.map(p => p.district)))];

  const filteredPrices = prices.filter(p => {
    const matchesDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;
    const matchesSearch = 
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.commodityTa.includes(searchQuery) ||
      p.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const getTrendBadge = (trend: string, change: string) => {
    if (trend === 'up') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          {change}
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-mono text-xs font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
          <TrendingDown className="w-3.5 h-3.5" />
          {change}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-stone-400 font-mono text-xs font-bold bg-stone-500/10 px-2 py-0.5 rounded-md border border-stone-500/20">
        <Minus className="w-3.5 h-3.5" />
        {change}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mandi Header Card */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-amber-400 inline" />
              {t('mandiTitle')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {t('mandiSubtitle')}
          </p>
        </div>

        <button
          onClick={fetchPrices}
          disabled={refreshing}
          className={`px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all cursor-pointer border border-white/5 flex items-center gap-2 text-xs font-medium ${
            refreshing ? 'text-emerald-400' : ''
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* District Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B130E] border border-emerald-500/20 overflow-x-auto no-scrollbar flex-1">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedDistrict === d
                  ? 'bg-emerald-500 text-[#070D09] font-bold shadow-md shadow-emerald-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {d === 'All' ? 'All Tamil Nadu Mandis' : d}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop or market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#0B130E] border border-emerald-500/20 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Main Mandi Price Cards Grid */}
      {loading ? (
        <div className="glass-card p-12 rounded-3xl border border-emerald-500/20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-stone-300 font-mono text-sm">Fetching daily APMC market price bulletin...</p>
        </div>
      ) : filteredPrices.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-emerald-500/20 text-center space-y-2">
          <p className="text-stone-300 font-medium">No mandi records matching your filter.</p>
          <button
            onClick={() => { setSelectedDistrict('All'); setSearchQuery(''); }}
            className="text-xs text-emerald-400 hover:underline cursor-pointer font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0E1B13] to-[#0A140E]"
            >
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.district}
                  </span>
                  {getTrendBadge(item.trend, item.change)}
                </div>

                <h3 className="text-lg font-bold text-white pt-1">
                  {language === 'ta' ? item.commodityTa : item.commodity}
                </h3>
                <p className="text-xs text-stone-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>{language === 'ta' ? item.marketTa : item.market}</span>
                </p>
              </div>

              {/* Price Highlights */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-400 font-mono">{t('modalPrice')}</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-300 font-mono">
                      ₹{item.modalPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono block">
                      per {item.unit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Range:</span>
                  <span className="text-stone-300">
                    ₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Arrivals and Source */}
              <div className="space-y-2 text-xs font-mono text-stone-400 pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    {t('arrival')}:
                  </span>
                  <span className="text-white font-semibold">{item.arrivalTons} Tons Today</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span className="text-emerald-500/80 truncate max-w-[150px]">{item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APMC Advisory Banner */}
      <div className="p-4 rounded-2xl bg-[#0F1E15] border border-emerald-500/20 flex items-center gap-3 text-xs text-stone-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-white font-semibold">TNAU Agmarknet Insight:</strong> Prices reflect authorized daily APMC gate transactions across Tamil Nadu. Farmers are advised to clean and grade produce to obtain top modal rates.
        </p>
      </div>
    </div>
  );
}

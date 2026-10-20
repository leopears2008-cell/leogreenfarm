import { useState } from 'react';
import { 
  Leaf, 
  Droplets, 
  Activity, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  Maximize2, 
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  RefreshCw,
  Compass
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SensorPin {
  id: string;
  name: string;
  nameTa: string;
  x: number; // percentage
  y: number; // percentage
  status: 'optimal' | 'good' | 'warning';
  value: string;
  metric: string;
  subValue: string;
  category: 'leaf' | 'stem' | 'root' | 'par';
  description: string;
  recommendation: string;
}

const CROP_OPTIONS = [
  { id: 'paddy', name: 'Samba Paddy (Ponni)', nameTa: 'சம்பா நெல் (பொன்னி)', stage: 'Tillering & Panicle Initiation', vitality: 93 },
  { id: 'banana', name: 'Grand Naine / Nendran Banana', nameTa: 'நேந்திரன் வாழை', stage: 'Vegetative Shooting (7th Month)', vitality: 89 },
  { id: 'turmeric', name: 'Erode Salem Turmeric', nameTa: 'ஈரோடு விரலி மஞ்சள்', stage: 'Rhizome Bulking Phase', vitality: 95 },
  { id: 'coconut', name: 'West Coast Tall Coconut', nameTa: 'நெட்டை தென்னை', stage: 'Nut Bearing & Inflorescence', vitality: 91 }
];

export default function BotanicalInspector() {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState(CROP_OPTIONS[0]);
  const [activePin, setActivePin] = useState<SensorPin | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectMode, setInspectMode] = useState<'vitality' | 'transpiration' | 'chlorophyll'>('vitality');

  const sensorPins: SensorPin[] = [
    {
      id: 'pin-canopy',
      name: 'Canopy Foliage & Transpiration',
      nameTa: 'இலைத் தழை & நீராவிப்போக்கு',
      x: 48,
      y: 22,
      status: 'optimal',
      value: '94%',
      metric: 'Relative Foliar Hydration',
      subValue: 'SPAD Chlorophyll: 44.8',
      category: 'leaf',
      description: 'Stomatal conductance is normal with active photosynthesis. No chlorosis or fungal leaf blast spots observed.',
      recommendation: 'Maintain current morning irrigation cycle. Foliar micro-nutrient spray recommended within 48 hours.'
    },
    {
      id: 'pin-stem',
      name: 'Vascular Stem & Nutrient Sap Flux',
      nameTa: 'தண்டு நாளங்கள் & ஊட்டச்சத்து பாய்வு',
      x: 52,
      y: 52,
      status: 'optimal',
      value: '14.2 cm/h',
      metric: 'Sap Flow Velocity',
      subValue: 'Stem Turgor: 0.92 MPa',
      category: 'stem',
      description: 'Active translocation of Nitrogen and Potassium upwards to newly emerging panicle tillers.',
      recommendation: 'Stem borer pheromone traps show zero adult moth catches. Keep water levels at 2.5 cm depth.'
    },
    {
      id: 'pin-light',
      name: 'Solar Influx & PAR Absorption',
      nameTa: 'சூரிய ஒளி & ஒளிச்சேர்க்கை வீச்சு',
      x: 74,
      y: 35,
      status: 'good',
      value: '1,420 µmol',
      metric: 'Photosynthetic Active Rad (PAR)',
      subValue: 'Canopy Temp: 28.6°C',
      category: 'par',
      description: 'Solar incidence is high with comfortable canopy micro-temperature buffered by gentle breeze.',
      recommendation: 'Photosynthetic efficiency is at peak 96%. Best time for natural sugar translocation.'
    },
    {
      id: 'pin-root',
      name: 'Sub-Surface Rhizosphere & Root Depth',
      nameTa: 'வேர் மண்டலம் & மண் ஈரப்பதம்',
      x: 50,
      y: 84,
      status: 'optimal',
      value: '78%',
      metric: 'Root Zone Moisture',
      subValue: 'Soil EC: 0.72 dS/m · pH: 6.8',
      category: 'root',
      description: 'Healthy white feeder roots with abundant mycorrhizal fungi activity in Cauvery alluvial clay.',
      recommendation: 'Soil pH is balanced. Next alternate wetting and drying (AWD) aeration cycle scheduled in 3 days.'
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden relative shadow-2xl bg-gradient-to-b from-[#0E1B13]/90 via-[#0A140E]/95 to-[#070D09]">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-emerald-500/15 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-400 inline" />
              {t('plantInspector')}
            </h2>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Live Bio-Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {t('inspectPinHint')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Crop Switcher */}
          <div className="flex items-center gap-1.5 bg-[#122017] p-1.5 rounded-xl border border-emerald-500/20">
            <span className="text-xs text-stone-400 pl-2 hidden sm:inline font-mono">
              {t('activeCrop')}:
            </span>
            <select
              value={selectedCrop.id}
              onChange={(e) => {
                const found = CROP_OPTIONS.find(c => c.id === e.target.value);
                if (found) setSelectedCrop(found);
              }}
              className="bg-transparent text-emerald-300 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0B130E] text-stone-200">
                  {language === 'ta' ? c.nameTa : c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all cursor-pointer border border-white/5 ${
              isRefreshing ? 'animate-spin text-emerald-400' : ''
            }`}
            title="Refresh Bio-Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left: Plant Specimen Showcase with Interactive Canvas / SVG Pins */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[460px] overflow-hidden bg-radial from-emerald-950/20 via-transparent to-transparent">
          
          {/* Ambient Lighting & Micro-Atmosphere */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Plant Graphic SVG with high fidelity botanical elements */}
          <div className="relative w-full max-w-md aspect-[4/5] flex items-center justify-center select-none">
            <svg
              viewBox="0 0 400 500"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
                <linearGradient id="leafGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="60%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
                <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="60%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#854D0E" />
                </linearGradient>
                <linearGradient id="rootGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#854D0E" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Sub-Surface Soil Layer */}
              <rect x="30" y="380" width="340" height="100" rx="16" fill="#151E17" opacity="0.8" />
              <line x1="30" y1="380" x2="370" y2="380" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <text x="45" y="400" fill="#6EE7B7" fontSize="10" fontFamily="monospace" opacity="0.7">ROOT ZONE / RHIZOSPHERE (0-45 cm)</text>

              {/* Botanical Roots */}
              <g stroke="url(#rootGrad)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85">
                <path d="M 200 370 Q 185 410 160 450" />
                <path d="M 200 370 Q 215 415 240 455" />
                <path d="M 195 385 Q 150 420 120 440" />
                <path d="M 205 385 Q 250 420 280 440" />
                <path d="M 175 425 Q 160 445 140 465" />
                <path d="M 225 425 Q 240 445 260 465" />
              </g>

              {/* Main Stem with organic taper */}
              <path
                d="M 200 375 Q 198 250 200 130"
                stroke="url(#stemGrad)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 200 375 Q 198 250 200 130"
                stroke="#6EE7B7"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />

              {/* Left Foliage (Lower) */}
              <path
                d="M 198 310 Q 130 300 80 250 C 95 230 150 240 197 290"
                fill="url(#leafGrad1)"
                opacity="0.95"
              />
              {/* Left Foliage Veins */}
              <path d="M 198 300 Q 140 275 85 252" stroke="#6EE7B7" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Right Foliage (Lower) */}
              <path
                d="M 201 280 Q 270 260 320 210 C 305 190 250 210 200 260"
                fill="url(#leafGrad2)"
                opacity="0.95"
              />
              {/* Right Foliage Veins */}
              <path d="M 201 270 Q 260 238 315 212" stroke="#6EE7B7" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Left Foliage (Upper) */}
              <path
                d="M 198 220 Q 140 180 110 120 C 130 110 180 140 199 200"
                fill="url(#leafGrad1)"
              />

              {/* Right Foliage (Upper - Sunlit) */}
              <path
                d="M 201 180 Q 260 140 290 80 C 270 70 220 100 201 160"
                fill="url(#leafGrad2)"
              />

              {/* Apical Shoot / Crown Tip */}
              <path
                d="M 200 140 Q 195 90 200 50 Q 205 90 200 140"
                fill="url(#leafGrad1)"
                filter="url(#glow)"
              />

              {/* Dew Drops Simulation */}
              <circle cx="130" cy="245" r="3" fill="#A7F3D0" opacity="0.8" />
              <circle cx="280" cy="205" r="3.5" fill="#A7F3D0" opacity="0.9" />
              <circle cx="140" cy="130" r="2.5" fill="#A7F3D0" opacity="0.8" />
            </svg>

            {/* Pulsing Interactive Hotspot Pins */}
            {sensorPins.map((pin) => {
              const isSelected = activePin?.id === pin.id;
              return (
                <div
                  key={pin.id}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  onClick={() => setActivePin(isSelected ? null : pin)}
                >
                  {/* Ping Animation Wave */}
                  <span className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping" />
                  
                  {/* Pin Dot */}
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-emerald-400 border-white text-emerald-950 scale-125 ring-4 ring-emerald-500/40'
                      : 'bg-[#0B130E]/90 border-emerald-400 text-emerald-300 hover:scale-110 hover:border-white'
                  }`}>
                    {pin.category === 'leaf' && <Leaf className="w-3.5 h-3.5" />}
                    {pin.category === 'stem' && <Activity className="w-3.5 h-3.5" />}
                    {pin.category === 'root' && <Droplets className="w-3.5 h-3.5" />}
                    {pin.category === 'par' && <Sun className="w-3.5 h-3.5" />}
                  </div>

                  {/* Pin Hover Pill Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070D09]/95 border border-emerald-500/30 text-[10px] text-white font-mono whitespace-nowrap shadow-xl z-30 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{language === 'ta' ? pin.nameTa : pin.name}</span>
                    <span className="text-emerald-400 font-bold">{pin.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Watermark / Quick Stats */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-stone-400 mt-4 pt-4 border-t border-emerald-500/10">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phenological Stage: <strong className="text-white">{selectedCrop.stage}</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry: LoRaWAN 868MHz (Active)</span>
            </div>
          </div>
        </div>

        {/* Right: Inspection Drawer / Live Telemetry Matrix */}
        <div className="lg:col-span-4 p-6 border-t lg:border-t-0 lg:border-l border-emerald-500/15 flex flex-col justify-between bg-[#08100B]/60 space-y-6">
          
          {/* Plant Vitality Index Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#0F1B13] border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('plantHealthScore')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                Grade A1
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {selectedCrop.vitality}%
              </span>
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Optimum Health
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Based on multispectral NDVI reflectance, stomatal moisture transpiration, and root zone moisture.
            </p>

            {/* Vitality Progress Bar */}
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                style={{ width: `${selectedCrop.vitality}%` }}
              />
            </div>
          </div>

          {/* Active Sensor Pin Focus Panel */}
          {activePin ? (
            <div className="p-5 rounded-2xl bg-[#0F1D14] border border-emerald-400/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Sensor Hotspot Details
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Realtime
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {language === 'ta' ? activePin.nameTa : activePin.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {activePin.value}
                  </span>
                  <span className="text-xs text-stone-400">
                    {activePin.metric}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">
                  {activePin.subValue}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15 space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                  <Info className="w-3.5 h-3.5" />
                  <span>Observation:</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activePin.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
                <span className="font-semibold block mb-0.5 text-emerald-300">Agronomist Recommendation:</span>
                {activePin.recommendation}
              </div>

              <button
                onClick={() => setActivePin(null)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                Close Hotspot
              </button>
            </div>
          ) : (
            /* Default Metrics Grid */
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-stone-400 flex items-center justify-between">
                <span>Core Bio-Parameters</span>
                <span className="text-[10px] text-emerald-400 font-mono">4 Sensors Online</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div 
                  onClick={() => setActivePin(sensorPins[0])}
                  className="p-3.5 rounded-xl bg-[#0F1A12] border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                    <span className="group-hover:text-emerald-300">Leaf Moisture</span>
                    <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-white">94%</div>
                  <span className="text-[10px] text-emerald-400 font-mono">Optimal</span>
                </div>

                <div 
                  onClick={() => setActivePin(sensorPins[1])}
                  className="p-3.5 rounded-xl bg-[#0F1A12] border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                    <span className="group-hover:text-emerald-300">Stem Sap Flux</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-white">14.2 cm/h</div>
                  <span className="text-[10px] text-emerald-400 font-mono">Healthy Flow</span>
                </div>

                <div 
                  onClick={() => setActivePin(sensorPins[3])}
                  className="p-3.5 rounded-xl bg-[#0F1A12] border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                    <span className="group-hover:text-emerald-300">Root Zone</span>
                    <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-white">78%</div>
                  <span className="text-[10px] text-teal-400 font-mono">Aerated AWD</span>
                </div>

                <div 
                  onClick={() => setActivePin(sensorPins[2])}
                  className="p-3.5 rounded-xl bg-[#0F1A12] border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                    <span className="group-hover:text-emerald-300">PAR Influx</span>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-white">1,420 µm</div>
                  <span className="text-[10px] text-amber-400 font-mono">Peak Solar</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0C150E] border border-emerald-500/15 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[11px] text-stone-400 leading-snug">
                  Click any hotspot or telemetry tile above for in-depth agronomic diagnosis and tailored bio-spray suggestions.
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span>Sensor Station ID: TN-DELTA-08</span>
              <span>Battery: 98% (Solar)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

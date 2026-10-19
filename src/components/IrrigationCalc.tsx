import { useState } from 'react';
import { Droplets, Calculator, Info, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function IrrigationCalc() {
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState('paddy');
  const [soil, setSoil] = useState('alluvial');
  const [method, setMethod] = useState<'drip' | 'sprinkler' | 'flood'>('drip');
  const [area, setArea] = useState('2');
  const [stage, setStage] = useState('vegetative');
  const [result, setResult] = useState<{ liters: number; dripDurationHours: number; waterSavedLiters: number } | null>(null);

  const calculateWater = () => {
    const areaNum = Math.max(0.25, parseFloat(area) || 1);
    
    // Base daily water in liters per acre
    let baseLitersPerAcre = 8000;

    // Crop factors (Kc)
    if (crop === 'paddy') baseLitersPerAcre = 16000; // high water demand
    else if (crop === 'sugarcane') baseLitersPerAcre = 12000;
    else if (crop === 'banana') baseLitersPerAcre = 10000;
    else if (crop === 'turmeric') baseLitersPerAcre = 6500;
    else if (crop === 'cotton') baseLitersPerAcre = 6000;
    else if (crop === 'coconut') baseLitersPerAcre = 5500;
    else if (crop === 'vegetables') baseLitersPerAcre = 5000;

    // Growth stage multiplier
    let stageMultiplier = 1.0;
    if (stage === 'flowering') stageMultiplier = 1.35;
    else if (stage === 'ripening') stageMultiplier = 0.8;
    else if (stage === 'nursery') stageMultiplier = 0.6;

    // Soil water holding capacity adjustment
    let soilMultiplier = 1.0;
    if (soil === 'sandy') soilMultiplier = 1.25; // higher percolation
    else if (soil === 'alluvial') soilMultiplier = 0.95; // good retention
    else if (soil === 'clay') soilMultiplier = 0.85; // high moisture hold
    else if (soil === 'red') soilMultiplier = 1.05;

    // Method efficiency
    let methodEfficiency = 0.92; // Drip is 90-95% efficient
    let floodEquivalentLiters = baseLitersPerAcre * stageMultiplier * soilMultiplier * areaNum * 1.8;

    if (method === 'sprinkler') {
      methodEfficiency = 0.78;
    } else if (method === 'flood') {
      methodEfficiency = 0.55;
    }

    const neededLiters = Math.round((baseLitersPerAcre * stageMultiplier * soilMultiplier * areaNum) / methodEfficiency);
    const dripDurationHours = Number(((neededLiters / (areaNum * 3500))).toFixed(1));
    const waterSavedLiters = Math.max(0, Math.round(floodEquivalentLiters - neededLiters));

    setResult({
      liters: neededLiters,
      dripDurationHours: Math.max(0.5, dripDurationHours),
      waterSavedLiters: method === 'flood' ? 0 : waterSavedLiters
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 border border-emerald-500/20 shadow-2xl h-full flex flex-col" id="irrigation">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              {t('irrigationTitle')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Cauvery Precision Water Estimator
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {t('irrigationDesc')}
          </p>
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
            {t('cropType')}
          </label>
          <select 
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-3 rounded-xl border border-emerald-500/20 focus:border-emerald-400 bg-[#121E16] text-stone-100 text-sm focus:outline-none"
          >
            <option value="paddy">Ponni Samba Paddy / நெல்</option>
            <option value="sugarcane">Sugarcane / கரும்பு</option>
            <option value="banana">Banana (Nendran/Poovan) / வாழை</option>
            <option value="turmeric">Turmeric / மஞ்சள்</option>
            <option value="coconut">Coconut Palms / தென்னை</option>
            <option value="cotton">Cotton / பருத்தி</option>
            <option value="vegetables">Vegetables / காய்கறிகள்</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
            {t('soilType')}
          </label>
          <select 
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
            className="w-full p-3 rounded-xl border border-emerald-500/20 focus:border-emerald-400 bg-[#121E16] text-stone-100 text-sm focus:outline-none"
          >
            <option value="alluvial">Cauvery Delta Alluvial Loam</option>
            <option value="clay">Black Cotton Heavy Clay (Regur)</option>
            <option value="red">Red Sandy Loam (Southern Zone)</option>
            <option value="sandy">Coastal / Riverbed Sandy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
            Growth Stage
          </label>
          <select 
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full p-3 rounded-xl border border-emerald-500/20 focus:border-emerald-400 bg-[#121E16] text-stone-100 text-sm focus:outline-none"
          >
            <option value="nursery">Seedling / Nursery Stage</option>
            <option value="vegetative">Vegetative Tillering</option>
            <option value="flowering">Panicle / Flowering (Critical)</option>
            <option value="ripening">Maturity / Pre-Harvest</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
            {t('farmArea')} (Acres)
          </label>
          <input 
            type="number"
            min="0.25"
            step="0.25"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full p-3 rounded-xl border border-emerald-500/20 focus:border-emerald-400 bg-[#121E16] text-stone-100 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Irrigation Method Selector */}
      <div>
        <label className="block text-xs font-mono text-stone-300 mb-2 uppercase">
          Delivery Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'drip', name: 'Micro Drip', eff: '92% Efficiency' },
            { id: 'sprinkler', name: 'Overhead Sprinkler', eff: '78% Efficiency' },
            { id: 'flood', name: 'Channel / Flood', eff: '55% Efficiency' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id as any)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                method === m.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                  : 'bg-[#121E16] border-emerald-500/15 text-stone-300 hover:border-emerald-500/30'
              }`}
            >
              <span className="text-xs font-bold block">{m.name}</span>
              <span className="text-[10px] font-mono text-stone-400 block">{m.eff}</span>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={calculateWater}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-[#070D09] font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Calculator className="w-4 h-4 stroke-[2.5]" />
        <span>{t('calculate')}</span>
      </button>

      {/* Result Display */}
      {result !== null && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-cyan-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Calculated Daily Requirement
            </span>
            <span className="text-xs font-mono text-stone-300">
              For {area} Acre(s)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#0B130E]/80 border border-cyan-500/20">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Water Volume</span>
              <span className="text-2xl font-bold font-mono text-white">
                {result.liters.toLocaleString()}
              </span>
              <span className="text-xs text-cyan-300 ml-1">Liters / day</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B130E]/80 border border-emerald-500/20">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Recommended Drip Runtime</span>
              <span className="text-2xl font-bold font-mono text-emerald-300">
                {result.dripDurationHours}
              </span>
              <span className="text-xs text-stone-300 ml-1">Hours / session</span>
            </div>
          </div>

          {result.waterSavedLiters > 0 && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span>Estimated water saved vs conventional flood irrigation:</span>
              <span className="font-mono font-bold text-white">
                +{result.waterSavedLiters.toLocaleString()} L
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

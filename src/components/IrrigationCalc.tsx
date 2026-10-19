import { useState } from 'react';
import { Droplet, Calculator } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function IrrigationCalc() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState('wheat');
  const [soil, setSoil] = useState('loamy');
  const [area, setArea] = useState('1');
  const [result, setResult] = useState<number | null>(null);

  const calculateWater = () => {
    // A simplified mock calculation
    const baseWater = 5000; // base liters per acre
    let multiplier = 1;

    if (crop === 'rice') multiplier *= 2.5;
    if (crop === 'wheat') multiplier *= 1.2;
    if (crop === 'cotton') multiplier *= 1.5;

    if (soil === 'sandy') multiplier *= 1.3;
    if (soil === 'clay') multiplier *= 0.8;

    const total = baseWater * multiplier * (parseFloat(area) || 1);
    setResult(Math.round(total));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col" id="irrigation">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
          <Droplet className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('irrigationTitle')}</h2>
          <p className="text-sm text-slate-500">{t('irrigationDesc')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('cropType')}</label>
            <select 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
            >
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="cotton">Cotton</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('soilType')}</label>
            <select 
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
            >
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="clay">Clay</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('areaAcres')}</label>
          <input 
            type="number"
            min="0.1"
            step="0.1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>

        <button
          onClick={calculateWater}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          {t('calculate')}
        </button>

        {result !== null && (
          <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100 text-center">
            <div className="text-sm text-cyan-800 font-medium mb-1">{t('waterNeed')}</div>
            <div className="text-3xl font-bold text-cyan-600">{result.toLocaleString()} <span className="text-lg font-medium">{t('litersPerDay')}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

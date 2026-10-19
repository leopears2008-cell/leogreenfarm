import { useEffect, useState } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  date: string;
  done: boolean;
}

interface Template {
  label: string;
  steps: { title: string; offset: number }[];
}

/**
 * Indicative day offsets relative to the planting date. These are generic starting points,
 * NOT variety- or location-specific recommendations. Every milestone is editable.
 */
const TEMPLATES: Record<string, Template> = {
  paddy: {
    label: 'Paddy (transplanted, ~120-day variety)',
    steps: [
      { title: 'Sow nursery', offset: -25 },
      { title: 'Prepare and puddle main field', offset: -7 },
      { title: 'Transplant seedlings', offset: 0 },
      { title: 'First weeding / nutrient check', offset: 20 },
      { title: 'Second weeding / nutrient check', offset: 40 },
      { title: 'Watch for panicle initiation; avoid water stress', offset: 60 },
      { title: 'Flowering: keep field adequately watered', offset: 85 },
      { title: 'Drain field ahead of harvest', offset: 110 },
      { title: 'Harvest when most grains are straw-coloured', offset: 120 },
    ],
  },
  turmeric: {
    label: 'Turmeric (~9-month crop)',
    steps: [
      { title: 'Prepare land and organic manure', offset: -14 },
      { title: 'Plant rhizomes', offset: 0 },
      { title: 'Weeding and earthing up', offset: 45 },
      { title: 'Nutrient top-dress check', offset: 90 },
      { title: 'Second earthing up', offset: 120 },
      { title: 'Stop irrigation as leaves dry; plan harvest', offset: 255 },
      { title: 'Harvest', offset: 270 },
    ],
  },
  tomato: {
    label: 'Tomato (transplanted)',
    steps: [
      { title: 'Prepare beds and transplant seedlings', offset: 0 },
      { title: 'Stake plants', offset: 15 },
      { title: 'Weeding and nutrient check', offset: 30 },
      { title: 'Watch flowering and fruit set', offset: 45 },
      { title: 'Begin harvests', offset: 70 },
      { title: 'Review plant health; plan end of crop', offset: 110 },
    ],
  },
  banana: {
    label: 'Banana (~11-month crop)',
    steps: [
      { title: 'Prepare pits and plant suckers/tissue-culture plants', offset: 0 },
      { title: 'Weeding and desuckering', offset: 60 },
      { title: 'Nutrient schedule check', offset: 120 },
      { title: 'Propping against wind', offset: 240 },
      { title: 'Harvest when fingers are well filled', offset: 330 },
    ],
  },
};

const STORAGE_KEY = 'lgf.cropPlan.v1';

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

interface StoredPlan {
  cropKey: string;
  plantingDate: string;
  milestones: Milestone[];
}

const loadPlan = (): StoredPlan | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Partial<StoredPlan>;
    if (typeof p.cropKey !== 'string' || !(p.cropKey in TEMPLATES)) return null;
    if (typeof p.plantingDate !== 'string' || !isIsoDate(p.plantingDate)) return null;
    if (!Array.isArray(p.milestones)) return null;
    const valid = p.milestones.every(
      (m) =>
        typeof m === 'object' && m !== null &&
        typeof (m as Milestone).id === 'string' &&
        typeof (m as Milestone).title === 'string' &&
        typeof (m as Milestone).date === 'string' &&
        typeof (m as Milestone).done === 'boolean',
    );
    return valid ? (p as StoredPlan) : null;
  } catch {
    return null;
  }
};

const buildMilestones = (cropKey: string, plantingDate: string): Milestone[] =>
  TEMPLATES[cropKey].steps.map((s) => ({ id: newId(), title: s.title, date: addDays(plantingDate, s.offset), done: false }));

export default function CropPlanner() {
  const stored = loadPlan();
  const [cropKey, setCropKey] = useState(stored?.cropKey ?? 'paddy');
  const [plantingDate, setPlantingDate] = useState(stored?.plantingDate ?? todayIso());
  const [milestones, setMilestones] = useState<Milestone[]>(stored?.milestones ?? []);
  const [saveFailed, setSaveFailed] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cropKey, plantingDate, milestones }));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [cropKey, plantingDate, milestones]);

  const generate = () => {
    if (!isIsoDate(plantingDate)) {
      setDateError('Enter a valid planting date.');
      return;
    }
    if (milestones.length > 0 && !window.confirm('Replace the current milestones with a new plan?')) return;
    setDateError(null);
    setMilestones(buildMilestones(cropKey, plantingDate));
  };

  const update = (id: string, patch: Partial<Milestone>) =>
    setMilestones((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const remove = (id: string) => setMilestones((list) => list.filter((m) => m.id !== id));

  const add = () => setMilestones((list) => [...list, { id: newId(), title: 'New milestone', date: isIsoDate(plantingDate) ? plantingDate : todayIso(), done: false }]);

  const sorted = [...milestones].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 border border-emerald-500/20 shadow-2xl" aria-labelledby="planner-heading">
      <div className="pb-4 border-b border-emerald-500/15">
        <h2 id="planner-heading" className="text-2xl font-bold text-white tracking-tight">Crop Planner</h2>
        <p className="text-xs text-stone-400 mt-1">Pick a crop and planting date to draft an editable timeline.</p>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          These are generic, indicative intervals. Real timing depends on variety, season, location and field conditions.
          Confirm with your block Agriculture Officer, TNAU recommendations or nearest KVK, and edit every milestone to suit your field.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="planner-crop" className="text-xs font-mono text-stone-400 block mb-1">Crop</label>
          <select
            id="planner-crop"
            value={cropKey}
            onChange={(e) => setCropKey(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-sm text-stone-200 focus:outline-none focus:border-emerald-400"
          >
            {Object.entries(TEMPLATES).map(([key, tpl]) => (
              <option key={key} value={key}>{tpl.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="planner-date" className="text-xs font-mono text-stone-400 block mb-1">Planting / transplanting date</label>
          <input
            id="planner-date"
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            aria-invalid={dateError ? true : undefined}
            aria-describedby={dateError ? 'planner-date-error' : undefined}
            className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-sm text-stone-200 focus:outline-none focus:border-emerald-400"
          />
          {dateError && <p id="planner-date-error" role="alert" className="text-xs text-red-300 mt-1">{dateError}</p>}
        </div>
        <button
          type="button"
          onClick={generate}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Generate timeline
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-stone-400">No milestones yet. Generate a timeline or add your own.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121E16]/80 border border-emerald-500/15">
              <input
                type="checkbox"
                checked={m.done}
                onChange={(e) => update(m.id, { done: e.target.checked })}
                aria-label={`Mark "${m.title}" as done`}
                className="w-4 h-4 accent-emerald-500"
              />
              <input
                type="text"
                value={m.title}
                maxLength={120}
                onChange={(e) => update(m.id, { title: e.target.value })}
                aria-label="Milestone title"
                className={`flex-1 min-w-[10rem] bg-transparent text-sm focus:outline-none border-b border-transparent focus:border-emerald-400 ${m.done ? 'line-through text-stone-500' : 'text-stone-100'}`}
              />
              <input
                type="date"
                value={m.date}
                onChange={(e) => isIsoDate(e.target.value) && update(m.id, { date: e.target.value })}
                aria-label={`Date for ${m.title}`}
                className="p-1.5 rounded-lg bg-[#0B130E] border border-emerald-500/20 text-xs text-stone-200 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => remove(m.id)}
                aria-label={`Delete milestone ${m.title}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-300 hover:bg-white/5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={add}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-medium border border-white/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add milestone
        </button>
        <span className="text-[11px] font-mono text-stone-500">
          {saveFailed ? 'Could not save on this device (storage unavailable).' : 'Saved on this device only (browser storage); not synced to any server.'}
        </span>
      </div>
    </section>
  );
}

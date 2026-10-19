import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface Stage {
  id: string;
  phase: 'Vegetative' | 'Reproductive' | 'Ripening';
  name: string;
  look: string;
  focus: string;
}

/** General rice (paddy) growth-stage reference. Durations vary by variety and season, so none are stated. */
const STAGES: Stage[] = [
  { id: 'seedling', phase: 'Vegetative', name: 'Germination & seedling', look: 'Seed takes up water, the root and first shoot emerge, and the first leaves unfold in the nursery or direct-seeded field.', focus: 'Even moisture, healthy seed and a clean nursery give uniform seedlings.' },
  { id: 'tillering', phase: 'Vegetative', name: 'Tillering', look: 'The plant produces side shoots (tillers) from its base, building the number of potential grain-bearing stems.', focus: 'Water management, balanced nutrition and weed control matter most here.' },
  { id: 'elongation', phase: 'Reproductive', name: 'Stem elongation & panicle initiation', look: 'Stems lengthen and the young panicle begins forming inside the stem, not yet visible.', focus: 'Avoid water and nutrient stress; this stage influences how many grains the panicle can carry.' },
  { id: 'booting', phase: 'Reproductive', name: 'Booting & heading', look: 'The panicle swells inside the flag-leaf sheath, then emerges from it.', focus: 'Keep the field adequately watered and scout regularly for pests and disease.' },
  { id: 'flowering', phase: 'Reproductive', name: 'Flowering', look: 'Individual flowers (spikelets) open and are pollinated, mostly by the same plant.', focus: 'Sensitive to drought and extreme heat; avoid disturbing the crop.' },
  { id: 'grainfill', phase: 'Ripening', name: 'Grain filling (milk to dough)', look: 'Grains fill with a milky liquid that gradually thickens into dough as starch accumulates.', focus: 'Maintain moisture as advised locally and protect the crop from lodging and grain pests.' },
  { id: 'maturity', phase: 'Ripening', name: 'Maturity', look: 'Grains harden and turn straw-coloured; leaves senesce.', focus: 'Plan drainage and harvest timing; harvest when most grains in the panicle have matured.' },
];

export default function BotanicalInspector() {
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const active = STAGES.find((s) => s.id === activeId) ?? STAGES[0];

  return (
    <section className="glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/20 shadow-2xl" aria-labelledby="inspector-heading">
      <div className="flex items-center gap-3 pb-4 border-b border-emerald-500/15">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Leaf className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="inspector-heading" className="text-xl font-bold text-white tracking-tight">Paddy growth stages</h2>
          <p className="text-xs text-stone-400">Reference guide, not live field data. Timing varies by variety and season.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5" role="group" aria-label="Growth stage">
          <ul className="space-y-1.5">
            {STAGES.map((stage) => {
              const isActive = stage.id === activeId;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(stage.id)}
                    aria-pressed={isActive}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-white font-semibold'
                        : 'bg-[#121E16]/80 border-emerald-500/15 text-stone-300 hover:text-white hover:border-emerald-500/40'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-emerald-400">{stage.phase}</span>
                    {stage.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#121E16]/80 border border-emerald-500/20 space-y-4" aria-live="polite">
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-400">{active.phase} phase</span>
            <h3 className="text-lg font-bold text-white">{active.name}</h3>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-400 mb-1">What happens</h4>
            <p className="text-sm text-stone-200 leading-relaxed">{active.look}</p>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-400 mb-1">Farm focus</h4>
            <p className="text-sm text-stone-200 leading-relaxed">{active.focus}</p>
          </div>
          <p className="text-[11px] text-stone-500">General guidance only. Follow TNAU / local Agriculture Department recommendations for your variety and zone.</p>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  Tag, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Compass, 
  Leaf, 
  Check,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FarmTask {
  id: string;
  title: string;
  titleTa: string;
  crop: string;
  category: 'irrigation' | 'fertilizer' | 'pest' | 'field';
  dueDate: string;
  completed: boolean;
  notes: string;
}

const DEFAULT_TASKS: FarmTask[] = [
  {
    id: 't-1',
    title: 'Alternate Wetting & Drying (AWD) Ponding Check',
    titleTa: 'காய்ச்சலும் பாய்ச்சலுமாக நீர் மேலாண்மை ஆய்வு',
    crop: 'Paddy Samba (Ponni)',
    category: 'irrigation',
    dueDate: 'Tomorrow, 07:00 AM',
    completed: false,
    notes: 'Allow surface water to recede to 5cm below soil surface before opening borewell inlet.'
  },
  {
    id: 't-2',
    title: 'Foliar Spray: 3% Panchagavya for Tillering Boost',
    titleTa: 'பஞ்சகாவ்யா 3% இலைவழி தெளித்தல்',
    crop: 'Paddy Samba (Ponni)',
    category: 'fertilizer',
    dueDate: 'In 2 days, 06:30 AM',
    completed: false,
    notes: 'Mix 300ml filtered Panchagavya with 10L water. Spray during cool morning hours.'
  },
  {
    id: 't-3',
    title: 'Pheromone Trap Inspection for Yellow Stem Borer',
    titleTa: 'தண்டு துளைப்பான் இனக்கவர்ச்சி பொறி ஆய்வு',
    crop: 'Paddy Samba (Ponni)',
    category: 'pest',
    dueDate: 'Friday',
    completed: true,
    notes: 'Zero moth trap threshold recorded. Crop canopy clean.'
  },
  {
    id: 't-4',
    title: 'Sub-soil Jeevamrutham Canal Dosing (200L/Acre)',
    titleTa: 'ஜீவாமிர்தம் 200 லிட்டர் பாசன நீருடன் விடுதல்',
    crop: 'Erode Turmeric',
    category: 'fertilizer',
    dueDate: 'Next Monday',
    completed: false,
    notes: 'Enriches rhizosphere micro-flora during rhizome elongation phase.'
  },
  {
    id: 't-5',
    title: 'Banana Shoot Propping & Wind Barrier Check',
    titleTa: 'வாழை முட்டு கொடுத்தல் மற்றும் காற்று பாதுகாப்பு',
    crop: 'Nendran Banana',
    category: 'field',
    dueDate: 'In 5 days',
    completed: false,
    notes: 'Use bamboo casuarina poles to support 7th-month bunch heavy stems against 20km/h gust winds.'
  }
];

const SEASONS_TN = [
  {
    name: 'Samba Season (சம்பா பருவம்)',
    months: 'August – January',
    focus: 'Main Tamil Nadu paddy season; Long & Medium duration varieties (Ponni, CR1009, White Ponni).',
    status: 'Active Now'
  },
  {
    name: 'Kuruvai Season (குறுவை பருவம்)',
    months: 'June – September',
    focus: 'Short duration paddy (ADT 43, ASD 16) with Mettur dam canal water releases.',
    status: 'Upcoming Planning'
  },
  {
    name: 'Thaladi Season (தாளடி பருவம்)',
    months: 'October – February',
    focus: 'Second crop in Delta region after Kuruvai harvest; Medium duration paddy.',
    status: 'Upcoming'
  }
];

export default function CropPlanner() {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    try {
      const saved = localStorage.getItem('leo_farm_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCrop, setNewTaskCrop] = useState('Paddy Samba (Ponni)');
  const [newTaskCategory, setNewTaskCategory] = useState<'irrigation' | 'fertilizer' | 'pest' | 'field'>('field');
  const [newTaskDue, setNewTaskDue] = useState('Tomorrow');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('leo_farm_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: FarmTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      titleTa: newTaskTitle.trim(),
      crop: newTaskCrop,
      category: newTaskCategory,
      dueDate: newTaskDue,
      completed: false,
      notes: 'Added from Farm Planner workspace.'
    };

    setTasks(prev => [task, ...prev]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'irrigation':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'fertilizer':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pest':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400 inline" />
              {t('cropPlanner')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Tamil Nadu Seasonal Milestones & Agronomic Task Calendar
          </p>
        </div>

        {/* Task Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-stone-400">{t('pending')}: </span>
            <strong className="text-emerald-400">{pendingCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-stone-400">{t('completed')}: </span>
            <strong className="text-teal-300">{completedCount}</strong>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#070D09] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('addTask')}</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal / Collapse Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="glass-card p-5 rounded-3xl border border-emerald-400/40 space-y-4 bg-[#0E1C14] animate-fadeIn">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Create Farm Activity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">Task Title</label>
              <input
                type="text"
                placeholder="e.g., Apply bio-fertilizer spray or weed bunds"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#09120C] border border-emerald-500/20 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">Crop</label>
                <select
                  value={newTaskCrop}
                  onChange={e => setNewTaskCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09120C] border border-emerald-500/20 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="Paddy Samba (Ponni)">Paddy Samba</option>
                  <option value="Nendran Banana">Banana</option>
                  <option value="Erode Turmeric">Turmeric</option>
                  <option value="Coconut">Coconut</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#09120C] border border-emerald-500/20 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="irrigation">Irrigation</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="pest">Pest Defense</option>
                  <option value="field">Field Work</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">Due</label>
                <input
                  type="text"
                  placeholder="e.g. In 2 days"
                  value={newTaskDue}
                  onChange={e => setNewTaskDue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09120C] border border-emerald-500/20 text-xs text-stone-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium border border-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#070D09] font-bold text-xs transition-colors cursor-pointer"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Tasks and Seasons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-stone-400 px-1">
            <span>{t('upcomingTasks')} ({tasks.length})</span>
            <span>Status / Action</span>
          </div>

          {tasks.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-stone-300 text-sm font-medium">All scheduled farm activities are completed!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  task.completed 
                    ? 'border-emerald-500/10 bg-[#0A130D]/50 opacity-60' 
                    : 'border-emerald-500/20 hover:border-emerald-500/40 bg-[#0E1A12]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-[#070D09]'
                        : 'border-emerald-500/30 hover:border-emerald-400 bg-white/5 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400/80">
                        {task.crop}
                      </span>
                    </div>

                    <h4 className={`text-sm sm:text-base font-semibold ${task.completed ? 'line-through text-stone-500' : 'text-white'}`}>
                      {language === 'ta' ? task.titleTa : task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-stone-400 leading-relaxed font-sans">
                        {task.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-stone-400">
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Tamil Nadu Seasonal Crop Calendar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 space-y-4 bg-gradient-to-b from-[#0E1B13] to-[#0A140E]">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                TN Agro Seasons Calendar
              </h3>
            </div>

            <div className="space-y-3">
              {SEASONS_TN.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#09130D] border border-emerald-500/15 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">{s.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      s.status.includes('Active') 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-white/5 text-stone-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400">{s.months}</div>
                  <p className="text-xs text-stone-400 leading-relaxed">{s.focus}</p>
                </div>
              ))}
            </div>

            {/* Quick Farming Advisory */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paddy Samba Best Practice:</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Maintain 2.5cm standing water during panicle emergence, followed by gradual draining 10 days before final harvest to ensure uniform grain drying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

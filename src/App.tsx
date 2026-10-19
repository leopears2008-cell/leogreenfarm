import { useEffect, useState } from 'react';
import {
  Leaf,
  Globe,
  CloudSun,
  ScanLine,
  Calendar,
  TrendingUp,
  Droplets,
  Bot,
  Bell,
  Settings,
  X,
  MapPin,
  Home,
  Wind,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Language } from './translations';
import LandingPage from './components/LandingPage';
import BotanicalInspector from './components/BotanicalInspector';
import WeatherDashboard from './components/WeatherDashboard';
import DiseaseDetector from './components/DiseaseDetector';
import CropPlanner from './components/CropPlanner';
import MandiMarketWatch from './components/MandiMarketWatch';
import IrrigationCalc from './components/IrrigationCalc';
import AIAssistant from './components/AIAssistant';
import CinematicCropBackdrop from './components/CinematicCropBackdrop';

const TABS = ['overview', 'weather', 'health', 'planner', 'mandi', 'irrigation', 'assistant'] as const;
type ActiveTab = (typeof TABS)[number];
const isTab = (value: string): value is ActiveTab => (TABS as readonly string[]).includes(value);

const OPACITY_LEVELS = ['subtle', 'balanced', 'deep'] as const;
type OpacityLevel = (typeof OPACITY_LEVELS)[number];
const isOpacityLevel = (value: string): value is OpacityLevel => (OPACITY_LEVELS as readonly string[]).includes(value);

const BLEND_MODES = ['luminosity', 'overlay', 'normal'] as const;
type BlendMode = (typeof BLEND_MODES)[number];
const isBlendMode = (value: string): value is BlendMode => (BLEND_MODES as readonly string[]).includes(value);

/** District keys must match the districts supported by GET /api/weather. */
const ZONES = [
  { district: 'Thanjavur', label: 'Cauvery Delta (Thanjavur)' },
  { district: 'Coimbatore', label: 'Western Agro-Zone (Coimbatore)' },
  { district: 'Madurai', label: 'Southern Rainfed (Madurai)' },
  { district: 'Tiruchirappalli', label: 'Central Alluvium (Tiruchirappalli)' },
] as const;

interface FarmSettings {
  farmerName: string;
  totalAcres: string;
  primaryCrop: string;
  soilType: string;
  irrigationType: string;
}

const PROFILE_KEY = 'lgf.farmProfile.v1';
const DEFAULT_PROFILE: FarmSettings = {
  farmerName: '',
  totalAcres: '',
  primaryCrop: '',
  soilType: '',
  irrigationType: '',
};

const loadProfile = (): FarmSettings => {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PROFILE;
    const p = parsed as Record<string, unknown>;
    const pick = (key: keyof FarmSettings) => (typeof p[key] === 'string' ? (p[key] as string) : '');
    return {
      farmerName: pick('farmerName'),
      totalAcres: pick('totalAcres'),
      primaryCrop: pick('primaryCrop'),
      soilType: pick('soilType'),
      irrigationType: pick('irrigationType'),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const validateProfile = (p: FarmSettings): Partial<Record<keyof FarmSettings, string>> => {
  const errors: Partial<Record<keyof FarmSettings, string>> = {};
  if (p.farmerName.trim().length > 60) errors.farmerName = 'Use 60 characters or fewer.';
  if (p.totalAcres.trim() !== '') {
    const acres = Number(p.totalAcres);
    if (!Number.isFinite(acres) || acres <= 0 || acres > 10000) errors.totalAcres = 'Enter a number between 0 and 10,000.';
  }
  (['primaryCrop', 'soilType', 'irrigationType'] as const).forEach((key) => {
    if (p[key].trim().length > 80) errors[key] = 'Use 80 characters or fewer.';
  });
  return errors;
};

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState<string>(ZONES[0].district);

  const [backdropEnabled, setBackdropEnabled] = useState(true);
  const [backdropOpacity, setBackdropOpacity] = useState<OpacityLevel>('subtle');
  const [backdropBlend, setBackdropBlend] = useState<BlendMode>('luminosity');

  const [farmSettings, setFarmSettings] = useState<FarmSettings>(loadProfile);
  const [draft, setDraft] = useState<FarmSettings>(farmSettings);
  const [errors, setErrors] = useState<Partial<Record<keyof FarmSettings, string>>>({});
  const [saveNote, setSaveNote] = useState<string | null>(null);

  const activeZone = ZONES.find((z) => z.district === activeDistrict) ?? ZONES[0];

  // Close open dialogs with Escape.
  useEffect(() => {
    if (!notificationsOpen && !settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notificationsOpen, settingsOpen]);

  const handleOpenDashboard = (tab?: string) => {
    if (tab && isTab(tab)) setActiveTab(tab);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSettings = () => {
    setDraft(farmSettings);
    setErrors({});
    setSaveNote(null);
    setSettingsOpen(true);
  };

  const saveSettings = () => {
    const found = validateProfile(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const cleaned: FarmSettings = {
      farmerName: draft.farmerName.trim(),
      totalAcres: draft.totalAcres.trim(),
      primaryCrop: draft.primaryCrop.trim(),
      soilType: draft.soilType.trim(),
      irrigationType: draft.irrigationType.trim(),
    };
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(cleaned));
      setFarmSettings(cleaned);
      setSettingsOpen(false);
    } catch {
      setSaveNote('Could not save: browser storage is unavailable. Your changes were not stored.');
    }
  };

  const navItems = [
    { id: 'overview', label: language === 'ta' ? 'கண்ணோட்டம்' : language === 'hi' ? 'अवलोकन' : 'Overview', icon: Leaf },
    { id: 'weather', label: language === 'ta' ? 'வானிலை & மழை' : language === 'hi' ? 'मौसम व वर्षा' : 'Weather & Rain', icon: CloudSun },
    { id: 'health', label: language === 'ta' ? 'பயிர் மருத்துவம்' : language === 'hi' ? 'फसल रोग जांच' : 'Crop Vision', icon: ScanLine },
    { id: 'planner', label: language === 'ta' ? 'பயிர் காலண்டர்' : language === 'hi' ? 'फसल योजना' : 'Crop Planner', icon: Calendar },
    { id: 'mandi', label: language === 'ta' ? 'மண்டி விலை' : language === 'hi' ? 'मंडी भाव' : 'Mandi Market', icon: TrendingUp },
    { id: 'irrigation', label: language === 'ta' ? 'பாசனக் கணக்கீடு' : language === 'hi' ? 'सिंचाई कैलकुलेटर' : 'Irrigation', icon: Droplets },
    { id: 'assistant', label: language === 'ta' ? 'AI வேளாண் ஆலோசகர்' : language === 'hi' ? 'एआई सहायक' : 'Leo AI Assistant', icon: Bot },
  ] as const;

  if (view === 'landing') {
    return <LandingPage onOpenDashboard={handleOpenDashboard} />;
  }

  const inputClass =
    'w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400';

  const overviewCards: { tab: ActiveTab; title: string; body: string }[] = [
    { tab: 'weather', title: 'Live weather & rain', body: `7-day forecast for ${activeZone.district} from Open-Meteo.` },
    { tab: 'mandi', title: 'Mandi prices', body: 'Reported Tamil Nadu market prices from Agmarknet, when the server is configured.' },
    { tab: 'health', title: 'Crop photo check', body: 'Upload a leaf photo for a preliminary AI opinion, then confirm with your KVK.' },
  ];

  return (
    <div className="min-h-screen bg-[#070D09] text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative">
      <CinematicCropBackdrop enabled={backdropEnabled} opacityLevel={backdropOpacity} blendMode={backdropBlend} />

      <header className="sticky top-0 z-40 bg-[#070D09]/85 backdrop-blur-xl border-b border-emerald-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setView('landing')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
            aria-label="Leo Green Farm, return to homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-[#070D09] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold tracking-tight text-white block">Leo Green Farm</span>
              <span className="text-[11px] text-stone-400 font-mono block">Agricultural Decision Support</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121E16] border border-emerald-500/25 text-xs text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <label htmlFor="zone-select" className="text-stone-400">Zone:</label>
            <select
              id="zone-select"
              value={activeDistrict}
              onChange={(e) => setActiveDistrict(e.target.value)}
              className="bg-transparent border-none text-emerald-300 font-medium cursor-pointer outline-none text-xs"
            >
              {ZONES.map((z) => (
                <option key={z.district} value={z.district} className="bg-[#0B130E] text-stone-200">{z.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setView('landing')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('viewWebsite')}</span>
            </button>

            <div className="flex items-center gap-1 bg-[#121E16] border border-emerald-500/25 rounded-xl px-2.5 py-1.5 text-xs text-stone-200">
              <Globe className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <label htmlFor="language-select" className="sr-only">Language</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-xs font-medium cursor-pointer outline-none text-emerald-300"
              >
                <option value="en" className="bg-[#0B130E] text-stone-200">EN</option>
                <option value="ta" className="bg-[#0B130E] text-stone-200">தமிழ்</option>
                <option value="hi" className="bg-[#0B130E] text-stone-200">हिंदी</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setBackdropEnabled(!backdropEnabled)}
              aria-pressed={backdropEnabled}
              aria-label="Animated crop background"
              title={backdropEnabled ? 'Animated crop background: on' : 'Animated crop background: off'}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                backdropEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Open notifications"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={openSettings}
              aria-label="Open farm profile and settings"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
        <nav aria-label="Dashboard sections" className="mb-6 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B130E] border border-emerald-500/20 overflow-x-auto no-scrollbar shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-[#070D09] font-bold shadow-md shadow-emerald-500/25'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'text-stone-400'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 w-full space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {farmSettings.farmerName || farmSettings.primaryCrop || farmSettings.totalAcres ? (
                <p className="text-sm text-stone-300">
                  {[
                    farmSettings.farmerName,
                    farmSettings.totalAcres ? `${farmSettings.totalAcres} acres` : '',
                    farmSettings.primaryCrop,
                  ].filter(Boolean).join(' · ')}
                </p>
              ) : (
                <p className="text-sm text-stone-400">Add your farm details in Settings to keep them on this device.</p>
              )}

              <BotanicalInspector />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {overviewCards.map((card) => (
                  <button
                    type="button"
                    key={card.tab}
                    onClick={() => setActiveTab(card.tab)}
                    className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-left space-y-2 hover:border-emerald-400/50 transition-colors cursor-pointer"
                  >
                    <span className="text-base font-bold text-white block">{card.title}</span>
                    <span className="text-xs text-stone-400 block leading-relaxed">{card.body}</span>
                    <span className="text-xs font-mono text-emerald-400 block">Open &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weather' && <WeatherDashboard district={activeDistrict} />}
          {activeTab === 'health' && <DiseaseDetector />}
          {activeTab === 'planner' && <CropPlanner />}
          {activeTab === 'mandi' && <MandiMarketWatch />}
          {activeTab === 'irrigation' && <IrrigationCalc />}
          {activeTab === 'assistant' && (
            <div className="max-w-4xl mx-auto w-full">
              <AIAssistant />
            </div>
          )}
        </main>
      </div>

      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setNotificationsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            className="w-full max-w-sm bg-[#0B130E] border-l border-emerald-500/20 p-6 h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <h3 id="notifications-title" className="font-bold text-white text-base">Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close notifications"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 py-6 text-sm text-stone-400 leading-relaxed">
              <p className="text-stone-200 font-medium mb-1">No notifications</p>
              <p>Alerts are not connected yet, so nothing is shown here. Check the Weather and Mandi tabs for live information.</p>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSettingsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0B130E] border border-emerald-500/30 rounded-3xl p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <h3 id="settings-title" className="text-lg font-bold text-white">Farm profile &amp; settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400 font-mono">Saved in this browser only. Not sent to or stored on a server.</p>

            <div className="space-y-4 text-xs">
              {([
                { key: 'farmerName', label: 'Farm / farmer name', inputMode: undefined },
                { key: 'totalAcres', label: 'Total land (acres)', inputMode: 'decimal' as const },
                { key: 'primaryCrop', label: 'Primary crop', inputMode: undefined },
                { key: 'soilType', label: 'Soil type', inputMode: undefined },
                { key: 'irrigationType', label: 'Irrigation system', inputMode: undefined },
              ]).map((field) => (
                <div key={field.key}>
                  <label htmlFor={`profile-${field.key}`} className="text-stone-400 block mb-1 font-mono">{field.label}</label>
                  <input
                    id={`profile-${field.key}`}
                    type="text"
                    inputMode={field.inputMode}
                    value={draft[field.key as keyof FarmSettings]}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    aria-invalid={errors[field.key as keyof FarmSettings] ? true : undefined}
                    aria-describedby={errors[field.key as keyof FarmSettings] ? `profile-${field.key}-error` : undefined}
                    className={inputClass}
                  />
                  {errors[field.key as keyof FarmSettings] && (
                    <p id={`profile-${field.key}-error`} role="alert" className="text-red-300 mt-1">{errors[field.key as keyof FarmSettings]}</p>
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-emerald-500/15 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-white text-xs font-semibold block">Animated crop background</span>
                    <span className="text-[11px] text-stone-400">Decorative loop; turn off for a calmer, lighter page.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBackdropEnabled(!backdropEnabled)}
                    aria-pressed={backdropEnabled}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                      backdropEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-stone-400 border-white/10'
                    }`}
                  >
                    {backdropEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {backdropEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="backdrop-opacity" className="text-stone-400 block mb-1">Opacity</label>
                      <select
                        id="backdrop-opacity"
                        value={backdropOpacity}
                        onChange={(e) => isOpacityLevel(e.target.value) && setBackdropOpacity(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 text-xs"
                      >
                        <option value="subtle">Subtle</option>
                        <option value="balanced">Balanced</option>
                        <option value="deep">Deep</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="backdrop-blend" className="text-stone-400 block mb-1">Blend mode</label>
                      <select
                        id="backdrop-blend"
                        value={backdropBlend}
                        onChange={(e) => isBlendMode(e.target.value) && setBackdropBlend(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 text-xs"
                      >
                        <option value="luminosity">Luminosity</option>
                        <option value="overlay">Overlay</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {saveNote && <p role="alert" className="text-xs text-red-300">{saveNote}</p>}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-emerald-500/15 bg-[#0B130E]/60 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400">
            <Leaf className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Leo Green Farm · Agricultural decision support. Not a substitute for advice from your Agriculture Officer or KVK.</span>
          </div>
          <span className="font-mono">Zone: {activeZone.label}</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Globe, 
  ArrowRight, 
  LayoutDashboard, 
  CloudSun, 
  ScanLine, 
  Calendar, 
  TrendingUp, 
  Droplets, 
  Bot, 
  Bell, 
  Settings, 
  X, 
  Menu, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  RefreshCw,
  Eye,
  Home,
  Wind,
  Layers
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

type ActiveTab = 'overview' | 'weather' | 'health' | 'planner' | 'mandi' | 'irrigation' | 'assistant';

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeZone, setActiveZone] = useState('Cauvery Delta (Thanjavur)');
  
  // Cinematic crop loop settings
  const [backdropEnabled, setBackdropEnabled] = useState(true);
  const [backdropOpacity, setBackdropOpacity] = useState<'subtle' | 'balanced' | 'deep'>('subtle');
  const [backdropBlend, setBackdropBlend] = useState<'luminosity' | 'overlay' | 'normal'>('luminosity');

  // Farm Profile settings state
  const [farmSettings, setFarmSettings] = useState({
    farmerName: 'Leo Agro Grower',
    totalAcres: '4.5',
    primaryCrop: 'Paddy Samba (Ponni)',
    soilType: 'Cauvery Delta Alluvial Clay',
    irrigationType: 'Drip & Borewell'
  });

  const notifications = [
    {
      id: 1,
      title: 'Monsoon Advisory: Rain expected in Delta',
      time: '15m ago',
      desc: '32mm rainfall forecast in Thanjavur over the next 48 hrs. Pause foliar bio-fertilizer spray.',
      type: 'weather'
    },
    {
      id: 2,
      title: 'Mandi Price Alert: Turmeric rose by ₹180',
      time: '2h ago',
      desc: 'Erode APMC recorded turmeric at ₹14,250/quintal due to strong export arrivals.',
      type: 'market'
    },
    {
      id: 3,
      title: 'Plant Health Notice: Foliage hydration 94%',
      time: '4h ago',
      desc: 'Sensor pin on shoot apex indicates optimum transpiration and normal stomatal conductance.',
      type: 'plant'
    }
  ];

  const handleOpenDashboard = (tab?: string) => {
    if (tab && ['overview', 'weather', 'health', 'planner', 'mandi', 'irrigation', 'assistant'].includes(tab)) {
      setActiveTab(tab as ActiveTab);
    }
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'overview', label: language === 'ta' ? 'கண்ணோட்டம்' : language === 'hi' ? 'अवलोकन' : 'Overview', icon: Leaf },
    { id: 'weather', label: language === 'ta' ? 'வானிலை & மழை' : language === 'hi' ? 'मौसम व वर्षा' : 'Weather & Rain', icon: CloudSun },
    { id: 'health', label: language === 'ta' ? 'பயிர் மருத்துவம்' : language === 'hi' ? 'फसल रोग जांच' : 'Crop Vision', icon: ScanLine },
    { id: 'planner', label: language === 'ta' ? 'பயிர் காலண்டர்' : language === 'hi' ? 'फसल योजना' : 'Crop Planner', icon: Calendar },
    { id: 'mandi', label: language === 'ta' ? 'மண்டி விலை' : language === 'hi' ? 'मंडी भाव' : 'Mandi Market', icon: TrendingUp },
    { id: 'irrigation', label: language === 'ta' ? 'பாசனக் கணக்கீடு' : language === 'hi' ? 'सिंचाई कैलकुलेटर' : 'Irrigation', icon: Droplets },
    { id: 'assistant', label: language === 'ta' ? 'AI வேளாண் ஆலோசகர்' : language === 'hi' ? 'एआई सहायक' : 'Leo AI Assistant', icon: Bot },
  ];

  if (view === 'landing') {
    return <LandingPage onOpenDashboard={handleOpenDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#070D09] text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative">
      {/* Cinematic Looping Backdrop with CSS Blend Mode & Low Opacity */}
      <CinematicCropBackdrop 
        enabled={backdropEnabled} 
        opacityLevel={backdropOpacity} 
        blendMode={backdropBlend} 
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070D09]/85 backdrop-blur-xl border-b border-emerald-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
              title="Return to Editorial Homepage"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-[#070D09] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Leo Green Farm
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    Ops
                  </span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono block">
                  Agricultural Intelligence Suite
                </span>
              </div>
            </button>
          </div>

          {/* Active Tamil Nadu Zone Selector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121E16] border border-emerald-500/25 text-xs text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-stone-400">Zone:</span>
            <select
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value)}
              className="bg-transparent border-none text-emerald-300 font-medium cursor-pointer outline-none text-xs focus:ring-0"
            >
              <option value="Cauvery Delta (Thanjavur)" className="bg-[#0B130E] text-stone-200">Cauvery Delta (Thanjavur)</option>
              <option value="Western Agro-Zone (Coimbatore)" className="bg-[#0B130E] text-stone-200">Western Agro-Zone (Coimbatore)</option>
              <option value="Southern Rainfed (Madurai)" className="bg-[#0B130E] text-stone-200">Southern Rainfed (Madurai)</option>
              <option value="Central Alluvium (Tiruchirappalli)" className="bg-[#0B130E] text-stone-200">Central Alluvium (Tiruchirappalli)</option>
            </select>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2.5">
            {/* View Editorial Website Button */}
            <button
              onClick={() => setView('landing')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('viewWebsite')}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#121E16] border border-emerald-500/25 rounded-xl px-2.5 py-1.5 text-xs text-stone-200">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-xs font-medium cursor-pointer outline-none text-emerald-300 focus:ring-0"
              >
                <option value="en" className="bg-[#0B130E] text-stone-200">EN</option>
                <option value="ta" className="bg-[#0B130E] text-stone-200">தமிழ்</option>
                <option value="hi" className="bg-[#0B130E] text-stone-200">हिंदी</option>
              </select>
            </div>

            {/* Cinematic Swaying Crops Atmosphere Toggle */}
            <button
              onClick={() => setBackdropEnabled(!backdropEnabled)}
              className={`p-2 rounded-xl transition-all relative cursor-pointer border ${
                backdropEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
              }`}
              title={backdropEnabled ? 'Cinematic Swaying Crops: Active (Click to toggle off)' : 'Cinematic Swaying Crops: Paused (Click to activate)'}
              aria-label="Toggle Cinematic Swaying Crops"
            >
              <Wind className="w-4 h-4" />
              {backdropEnabled && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors relative cursor-pointer border border-white/5"
              title="Agro Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Farm Settings Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/5"
              title="Farm Profile & Parameters"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
        {/* Navigation Tabs Pill Bar */}
        <div className="mb-6 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B130E] border border-emerald-500/20 overflow-x-auto no-scrollbar shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-[#070D09] font-bold shadow-md shadow-emerald-500/25'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab View Contents */}
        <div className="flex-1 w-full space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Botanical Inspector Central Showcase */}
              <BotanicalInspector />

              {/* Quick Telemetry Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-emerald-400">Crop Health Index</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">92% Optimum</div>
                  <p className="text-xs text-stone-400">Active tiller formation. No visible blast or blight symptoms.</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-cyan-400">Microclimate</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">29.4°C · 76% RH</div>
                  <p className="text-xs text-stone-400">Cauvery Delta Zone. Light breeze from South-East at 12 km/h.</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-amber-400">Mandi Benchmark</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">₹2,380 / Qtl</div>
                  <p className="text-xs text-stone-400">Thanjavur Regulated Market yard for Ponni Grade-A Paddy.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && <WeatherDashboard />}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <DiseaseDetector />
            </div>
          )}

          {activeTab === 'planner' && <CropPlanner />}

          {activeTab === 'mandi' && <MandiMarketWatch />}

          {activeTab === 'irrigation' && <IrrigationCalc />}

          {activeTab === 'assistant' && (
            <div className="max-w-4xl mx-auto w-full">
              <AIAssistant />
            </div>
          )}
        </div>
      </div>

      {/* Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0B130E] border-l border-emerald-500/20 p-6 h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Agro Notifications</h3>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-[#121E16] border border-emerald-500/15 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-emerald-400">{n.type}</span>
                    <span className="text-[10px] font-mono text-stone-500">{n.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setNotificationsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* Farm Profile Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B130E] border border-emerald-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Farm Profile & Soil Context</h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-stone-400 block mb-1">Farm / Farmer Name</label>
                <input
                  type="text"
                  value={farmSettings.farmerName}
                  onChange={(e) => setFarmSettings({ ...farmSettings, farmerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Total Land (Acres)</label>
                  <input
                    type="text"
                    value={farmSettings.totalAcres}
                    onChange={(e) => setFarmSettings({ ...farmSettings, totalAcres: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Primary Crop</label>
                  <input
                    type="text"
                    value={farmSettings.primaryCrop}
                    onChange={(e) => setFarmSettings({ ...farmSettings, primaryCrop: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Soil Classification</label>
                <input
                  type="text"
                  value={farmSettings.soilType}
                  onChange={(e) => setFarmSettings({ ...farmSettings, soilType: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Irrigation System</label>
                <input
                  type="text"
                  value={farmSettings.irrigationType}
                  onChange={(e) => setFarmSettings({ ...farmSettings, irrigationType: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Atmospheric Background Settings */}
              <div className="pt-3 border-t border-emerald-500/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white text-xs font-semibold block">Cinematic Swaying Crops Backdrop</label>
                    <span className="text-[11px] text-stone-400">Atmospheric video loop with CSS blend mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBackdropEnabled(!backdropEnabled)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                      backdropEnabled 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'bg-white/5 text-stone-400 border-white/10'
                    }`}
                  >
                    {backdropEnabled ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>

                {backdropEnabled && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-stone-400 block mb-1">Backdrop Opacity</label>
                      <select
                        value={backdropOpacity}
                        onChange={(e) => setBackdropOpacity(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 text-xs focus:outline-none"
                      >
                        <option value="subtle">Subtle (15% Opacity)</option>
                        <option value="balanced">Balanced (25% Opacity)</option>
                        <option value="deep">Cinematic (35% Opacity)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1">CSS Blend Mode</label>
                      <select
                        value={backdropBlend}
                        onChange={(e) => setBackdropBlend(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-[#121E16] border border-emerald-500/20 text-stone-200 text-xs focus:outline-none"
                      >
                        <option value="luminosity">Luminosity (Moody Forest)</option>
                        <option value="overlay">Overlay (Sunlit Depth)</option>
                        <option value="normal">Normal (Soft Dark)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-500/15 bg-[#0B130E]/60 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Leo Green Farm · Agricultural Decision Support</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Zone: {activeZone}</span>
            <span className="text-emerald-400">System Healthy</span>
          </div>
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

import { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  Calculator, 
  Info, 
  CheckCircle2, 
  Waves, 
  ArrowRight, 
  Bell, 
  BellRing, 
  BellOff, 
  AlertTriangle, 
  Flame, 
  CloudRain, 
  Sun, 
  Wind, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Clock, 
  RefreshCw, 
  Send, 
  Check, 
  Settings2, 
  Sparkles, 
  X,
  Gauge,
  Sliders,
  Radio,
  Zap,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TN_ALL_DISTRICTS } from '../data/tnDistricts';

interface WeatherSnapshot {
  district: string;
  zone: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfallChance: number;
  evapotranspiration: number; // mm/day
  condition: string;
}

interface AlertLog {
  id: string;
  timestamp: string;
  cropName: string;
  moisturePercent: number;
  thresholdPercent: number;
  weatherSummary: string;
  severity: 'urgent' | 'warning' | 'info';
  actionTaken?: string;
}

interface InAppPushBanner {
  id: string;
  title: string;
  body: string;
  urgency: 'urgent' | 'warning' | 'info';
  timestamp: string;
  litersNeeded?: number;
  runtimeHours?: number;
}

const DISTRICT_WEATHER_DEFAULTS: Record<string, WeatherSnapshot> = {
  Thanjavur: {
    district: 'Thanjavur',
    zone: 'Cauvery Delta Zone',
    temperature: 34,
    humidity: 58,
    windSpeed: 14,
    rainfallChance: 15,
    evapotranspiration: 5.6,
    condition: 'Hot & Dry'
  },
  Madurai: {
    district: 'Madurai',
    zone: 'Southern Rainfed Agro-Zone',
    temperature: 36,
    humidity: 48,
    windSpeed: 12,
    rainfallChance: 5,
    evapotranspiration: 6.2,
    condition: 'Intense Heat'
  },
  Coimbatore: {
    district: 'Coimbatore',
    zone: 'Western Agro-Zone',
    temperature: 30,
    humidity: 65,
    windSpeed: 16,
    rainfallChance: 35,
    evapotranspiration: 4.4,
    condition: 'Partly Cloudy'
  },
  Tiruchirappalli: {
    district: 'Tiruchirappalli',
    zone: 'Central Alluvial Plain',
    temperature: 35,
    humidity: 52,
    windSpeed: 13,
    rainfallChance: 10,
    evapotranspiration: 5.9,
    condition: 'Sunny & Arid'
  }
};

export default function IrrigationCalc() {
  const { t, language } = useLanguage();

  // Basic Calculator State
  const [crop, setCrop] = useState('paddy');
  const [soil, setSoil] = useState('alluvial');
  const [method, setMethod] = useState<'drip' | 'sprinkler' | 'flood'>('drip');
  const [area, setArea] = useState('2');
  const [stage, setStage] = useState('flowering');
  const [result, setResult] = useState<{ liters: number; dripDurationHours: number; waterSavedLiters: number } | null>(null);

  // Active Tab inside Irrigation Component: Calculator vs Push Alert Center
  const [irrigationSubTab, setIrrigationSubTab] = useState<'calculator' | 'alert_setup'>('calculator');

  // Soil Moisture & Microclimate Context State
  const [selectedDistrict, setSelectedDistrict] = useState('Thanjavur');
  const [weatherSnapshot, setWeatherSnapshot] = useState<WeatherSnapshot>(DISTRICT_WEATHER_DEFAULTS['Thanjavur']);
  const [soilMoisture, setSoilMoisture] = useState<number>(31); // Real-time moisture probe % (e.g. 31% is critical)
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Push Alert Configuration State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [moistureThreshold, setMoistureThreshold] = useState<number>(38); // Alert when moisture < 38%
  const [heatStressMultiplier, setHeatStressMultiplier] = useState<boolean>(true); // Escalate if temp > 33°C
  const [rainHoldInterlock, setRainHoldInterlock] = useState<boolean>(true); // Suppress alert if rain > 60%
  const [floweringStagePriority, setFloweringStagePriority] = useState<boolean>(true); // Extra sensitive in panicle stage
  const [audioChimeEnabled, setAudioChimeEnabled] = useState<boolean>(true);
  const [alertFrequency, setAlertFrequency] = useState<'immediate' | 'twice_daily'>('immediate');

  // Native Browser Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // In-App Push Notification Banner
  const [activePushBanner, setActivePushBanner] = useState<InAppPushBanner | null>(null);
  const [alertLog, setAlertLog] = useState<AlertLog[]>([]);
  const [testAlertSending, setTestAlertSending] = useState(false);
  const lastAlertTimeRef = useRef<number>(0);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('leo_irrigation_alerts_v1');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (typeof parsed.alertsEnabled === 'boolean') setAlertsEnabled(parsed.alertsEnabled);
        if (typeof parsed.moistureThreshold === 'number') setMoistureThreshold(parsed.moistureThreshold);
        if (typeof parsed.heatStressMultiplier === 'boolean') setHeatStressMultiplier(parsed.heatStressMultiplier);
        if (typeof parsed.rainHoldInterlock === 'boolean') setRainHoldInterlock(parsed.rainHoldInterlock);
        if (typeof parsed.audioChimeEnabled === 'boolean') setAudioChimeEnabled(parsed.audioChimeEnabled);
        if (parsed.alertFrequency) setAlertFrequency(parsed.alertFrequency);
        if (Array.isArray(parsed.alertLog)) setAlertLog(parsed.alertLog.slice(0, 10));
      }
    } catch {
      // Local storage read error fallback
    }
  }, []);

  // Save preferences to localStorage whenever changed
  useEffect(() => {
    try {
      const config = {
        alertsEnabled,
        moistureThreshold,
        heatStressMultiplier,
        rainHoldInterlock,
        audioChimeEnabled,
        alertFrequency,
        alertLog: alertLog.slice(0, 10)
      };
      localStorage.setItem('leo_irrigation_alerts_v1', JSON.stringify(config));
    } catch {
      // Ignore storage write error
    }
  }, [alertsEnabled, moistureThreshold, heatStressMultiplier, rainHoldInterlock, audioChimeEnabled, alertFrequency, alertLog]);

  // Fetch local weather for selected district
  const fetchDistrictWeather = (district: string) => {
    setLoadingWeather(true);
    fetch(`/api/weather?district=${encodeURIComponent(district)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.temperature !== undefined) {
          const et = typeof data.evapotranspiration === 'number'
            ? data.evapotranspiration
            : data.temperature > 34 ? 6.1 : data.temperature > 30 ? 5.2 : 4.1;
          setWeatherSnapshot({
            district: data.district || district,
            zone: data.zone || 'Tamil Nadu Agro-Zone',
            temperature: data.temperature || 32,
            humidity: data.humidity || 60,
            windSpeed: data.windSpeed || 12,
            rainfallChance: data.rainfallChance || 15,
            evapotranspiration: et,
            condition: data.condition || 'Clear'
          });
        }
        setLoadingWeather(false);
      })
      .catch(() => {
        // Fallback to static data
        setWeatherSnapshot(DISTRICT_WEATHER_DEFAULTS[district] || DISTRICT_WEATHER_DEFAULTS['Thanjavur']);
        setLoadingWeather(false);
      });
  };

  useEffect(() => {
    fetchDistrictWeather(selectedDistrict);
  }, [selectedDistrict]);

  // Pleasant Web Audio alert synthesizer (Zero external dependencies)
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Harmonic chime: E5 (659Hz) -> A5 (880Hz)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio context policy fallback
    }
  };

  // Request browser notification permission
  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
  };

  // Evaluate watering urgency based on soil moisture and local weather
  const evaluateUrgency = () => {
    const isRainImminent = weatherSnapshot.rainfallChance >= 65 && rainHoldInterlock;
    if (isRainImminent) {
      return {
        level: 'rain_hold' as const,
        label: language === 'ta' ? 'மழை வரவுள்ளது · பாசனத்தை நிறுத்துங்கள்' : language === 'hi' ? 'वर्षा की संभावना · सिंचाई रोकें' : 'Rain Forecasted · Pause Irrigation',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10 border-cyan-500/30',
        badge: 'Rain Hold',
        description: `High precipitation probability (${weatherSnapshot.rainfallChance}%) in ${weatherSnapshot.district}. Hold irrigation cycle to conserve groundwater and prevent nitrogen leaching.`
      };
    }

    // Effective threshold adjusted for high heat, low humidity, and critical flowering stage
    let effectiveThreshold = moistureThreshold;
    if (heatStressMultiplier && weatherSnapshot.temperature >= 33) effectiveThreshold += 5;
    if (floweringStagePriority && stage === 'flowering') effectiveThreshold += 4;
    if (weatherSnapshot.humidity <= 50) effectiveThreshold += 3;

    if (soilMoisture <= effectiveThreshold) {
      return {
        level: 'urgent' as const,
        label: language === 'ta' ? 'உடனடி பாசனம் தேவைப்படுகிறது' : language === 'hi' ? 'तत्काल सिंचाई आवश्यक है' : 'Urgent Watering Required',
        color: 'text-rose-400',
        bg: 'bg-rose-500/15 border-rose-500/40',
        badge: 'CRITICAL STRESS',
        effectiveThreshold,
        description: `Soil moisture (${soilMoisture}%) has dropped below critical threshold (${effectiveThreshold}%) under ${weatherSnapshot.temperature}°C heat and ${weatherSnapshot.evapotranspiration} mm/d evapotranspiration in ${weatherSnapshot.district}. Initiate irrigation to prevent root wilting.`
      };
    } else if (soilMoisture <= effectiveThreshold + 10) {
      return {
        level: 'warning' as const,
        label: language === 'ta' ? 'ஈரப்பதம் குறைந்து வருகிறது · கவனம் தேவை' : language === 'hi' ? 'नमी कम हो रही है · निगरानी रखें' : 'Moisture Depleting · Schedule Soon',
        color: 'text-amber-400',
        bg: 'bg-amber-500/15 border-amber-500/30',
        badge: 'ATTENTION',
        effectiveThreshold,
        description: `Soil moisture (${soilMoisture}%) is approaching depletion under steady heat (${weatherSnapshot.temperature}°C). Prepare irrigation cycle for early evening or dawn.`
      };
    }

    return {
      level: 'optimal' as const,
      label: language === 'ta' ? 'மண் ஈரப்பதம் சீராக உள்ளது' : language === 'hi' ? 'मिट्टी की नमी सामान्य है' : 'Soil Hydration Optimal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      badge: 'BALANCED',
      effectiveThreshold,
      description: `Current moisture (${soilMoisture}%) provides adequate capillary root hydration. No immediate watering required.`
    };
  };

  const urgencyState = evaluateUrgency();

  // Dispatch push-notification-style alert
  const dispatchPushAlert = (isSimulated = false) => {
    if (!alertsEnabled && !isSimulated) return;

    // Throttle duplicate alerts in a short time frame unless simulated
    const now = Date.now();
    if (!isSimulated && now - lastAlertTimeRef.current < 60000) return;
    lastAlertTimeRef.current = now;

    const cropLabel = crop === 'paddy' ? 'Ponni Samba Paddy' : crop === 'sugarcane' ? 'Sugarcane' : crop === 'banana' ? 'Banana' : crop.toUpperCase();
    const title = urgencyState.level === 'urgent'
      ? `🚨 Urgent Watering Alert: ${cropLabel}`
      : urgencyState.level === 'warning'
      ? `⚠️ Moisture Stress Notice: ${cropLabel}`
      : `🌧️ Rain Advisory: ${cropLabel}`;

    const body = `${cropLabel} at ${soilMoisture}% moisture in ${weatherSnapshot.district}. Temp: ${weatherSnapshot.temperature}°C, ET₀: ${weatherSnapshot.evapotranspiration} mm/d. ${urgencyState.level === 'urgent' ? 'Immediate drip cycle recommended!' : 'Monitor soil status.'}`;

    // Play synthesized acoustic chime if enabled
    if (audioChimeEnabled) {
      playAlertChime();
    }

    // Native Browser Web Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'leo-irrigation-urgent-alert',
          vibrate: [200, 100, 200]
        } as any);
      } catch (e) {
        console.warn('Native notification suppressed by browser sandbox, falling back to in-app push banner', e);
      }
    }

    // In-App Push Notification Banner (high-contrast slide-in)
    const alertId = `alert-${Date.now()}`;
    const calculatedLiters = Math.round(parseFloat(area) * 14000);
    const calculatedHours = Number((calculatedLiters / (parseFloat(area) * 3500)).toFixed(1));

    setActivePushBanner({
      id: alertId,
      title,
      body,
      urgency: urgencyState.level === 'urgent' ? 'urgent' : urgencyState.level === 'warning' ? 'warning' : 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      litersNeeded: calculatedLiters,
      runtimeHours: Math.max(0.8, calculatedHours)
    });

    // Add to Alert Activity Log
    const newEntry: AlertLog = {
      id: alertId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cropName: cropLabel,
      moisturePercent: soilMoisture,
      thresholdPercent: urgencyState.effectiveThreshold || moistureThreshold,
      weatherSummary: `${weatherSnapshot.temperature}°C · ${weatherSnapshot.humidity}% RH · ${weatherSnapshot.district}`,
      severity: urgencyState.level === 'urgent' ? 'urgent' : urgencyState.level === 'warning' ? 'warning' : 'info'
    };
    setAlertLog((prev) => [newEntry, ...prev.slice(0, 9)]);

    // Emit event for global navigation header notification count in App.tsx
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('leo-agro-alert', {
          detail: {
            id: Date.now(),
            title,
            desc: body,
            time: 'Just now',
            type: 'irrigation'
          }
        })
      );
    }
  };

  // Monitor automated trigger when moisture drops below threshold
  useEffect(() => {
    if (alertsEnabled && urgencyState.level === 'urgent') {
      dispatchPushAlert(false);
    }
  }, [soilMoisture, weatherSnapshot.district, alertsEnabled]);

  // Standard calculator function
  const calculateWater = (overrideArea?: string) => {
    const areaNum = Math.max(0.25, parseFloat(overrideArea || area) || 1);
    
    // Base daily water in liters per acre
    let baseLitersPerAcre = 8000;

    // Crop factors (Kc)
    if (crop === 'paddy') baseLitersPerAcre = 16000;
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
    if (soil === 'sandy') soilMultiplier = 1.25;
    else if (soil === 'alluvial') soilMultiplier = 0.95;
    else if (soil === 'clay') soilMultiplier = 0.85;
    else if (soil === 'red') soilMultiplier = 1.05;

    // Weather Evapotranspiration Heat factor
    let weatherETMultiplier = 1.0;
    if (weatherSnapshot.temperature > 34) weatherETMultiplier = 1.2;
    else if (weatherSnapshot.temperature > 31) weatherETMultiplier = 1.1;

    // Method efficiency
    let methodEfficiency = 0.92;
    let floodEquivalentLiters = baseLitersPerAcre * stageMultiplier * soilMultiplier * weatherETMultiplier * areaNum * 1.8;

    if (method === 'sprinkler') {
      methodEfficiency = 0.78;
    } else if (method === 'flood') {
      methodEfficiency = 0.55;
    }

    const neededLiters = Math.round((baseLitersPerAcre * stageMultiplier * soilMultiplier * weatherETMultiplier * areaNum) / methodEfficiency);
    const dripDurationHours = Number(((neededLiters / (areaNum * 3500))).toFixed(1));
    const waterSavedLiters = Math.max(0, Math.round(floodEquivalentLiters - neededLiters));

    setResult({
      liters: neededLiters,
      dripDurationHours: Math.max(0.5, dripDurationHours),
      waterSavedLiters: method === 'flood' ? 0 : waterSavedLiters
    });
  };

  // Immediate Action: Apply Urgent Recommended Watering from Alert
  const handleApplyUrgentSchedule = () => {
    calculateWater();
    setIrrigationSubTab('calculator');
    setActivePushBanner(null);
  };

  // Simulate urgent condition for instant testing
  const handleSimulateUrgentCondition = () => {
    setTestAlertSending(true);
    setSoilMoisture(26); // Set probe to critical 26%
    setTimeout(() => {
      dispatchPushAlert(true);
      setTestAlertSending(false);
    }, 400);
  };

  // Restore moisture to optimal state
  const handleRestoreOptimalMoisture = () => {
    setSoilMoisture(64);
    setActivePushBanner(null);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 border border-emerald-500/20 shadow-2xl h-full flex flex-col relative" id="irrigation">
      
      {/* Interactive In-App Push-Notification Banner (Mobile & Desktop Push Mockup) */}
      {activePushBanner && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex flex-col gap-3 ${
            activePushBanner.urgency === 'urgent'
              ? 'bg-[#180A0B]/95 border-rose-500/60 shadow-rose-950/50'
              : activePushBanner.urgency === 'warning'
              ? 'bg-[#191307]/95 border-amber-500/60 shadow-amber-950/50'
              : 'bg-[#091512]/95 border-cyan-500/60 shadow-cyan-950/50'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activePushBanner.urgency === 'urgent' ? 'bg-rose-500 text-black' : 'bg-amber-400 text-black'
                }`}>
                  <BellRing className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
                      LEO GREEN FARM · SOIL SENSOR
                    </span>
                    <span className="text-[10px] text-stone-400">· {activePushBanner.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight mt-0.5">
                    {activePushBanner.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setActivePushBanner(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Dismiss push alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {activePushBanner.body}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
              <button
                onClick={handleApplyUrgentSchedule}
                className="flex-1 py-1.5 px-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Start Drip Cycle</span>
              </button>
              <button
                onClick={() => setActivePushBanner(null)}
                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-xs transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              {t('irrigationTitle')}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Sensor Interlock
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Cauvery Precision Water & Push Alert Center</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {t('irrigationDesc')}
          </p>
        </div>

        {/* Sub-tab navigation: Calculator vs Smart Alert Setup */}
        <div className="flex items-center gap-1.5 bg-[#0B130E] p-1 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIrrigationSubTab('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              irrigationSubTab === 'calculator'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Water Budget</span>
          </button>
          <button
            type="button"
            onClick={() => setIrrigationSubTab('alert_setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer relative ${
              irrigationSubTab === 'alert_setup'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-black font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Push Alert Setup</span>
            {urgencyState.level === 'urgent' && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Real-time Soil Moisture & Local Weather Microclimate Bar */}
      <div className={`p-4 rounded-2xl border transition-all ${urgencyState.bg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Urgency Badge & Summary */}
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              urgencyState.level === 'urgent' ? 'bg-rose-500/20 text-rose-400' : urgencyState.level === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {urgencyState.level === 'urgent' ? (
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              ) : urgencyState.level === 'warning' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                  urgencyState.level === 'urgent' ? 'bg-rose-500 text-black' : urgencyState.level === 'warning' ? 'bg-amber-400 text-black' : 'bg-emerald-500 text-black'
                }`}>
                  {urgencyState.badge}
                </span>
                <span className="text-xs font-bold text-white">
                  {urgencyState.label}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed max-w-2xl">
                {urgencyState.description}
              </p>
            </div>
          </div>

          {/* Quick Microclimate Telemetry Pill */}
          <div className="flex items-center gap-3 bg-[#0B130E]/70 p-2.5 rounded-xl border border-white/10 shrink-0 text-xs">
            <div>
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Zone & Temp</span>
              <span className="font-bold text-white font-mono">{weatherSnapshot.district} · {weatherSnapshot.temperature}°C</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <span className="text-[10px] font-mono text-stone-400 block uppercase">ET₀ Rate</span>
              <span className="font-bold text-emerald-400 font-mono">{weatherSnapshot.evapotranspiration} mm/d</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Rain Chance</span>
              <span className="font-bold text-cyan-400 font-mono">{weatherSnapshot.rainfallChance}%</span>
            </div>
          </div>
        </div>

        {/* Live Soil Moisture Slider & Interactive Controls */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-7 flex items-center gap-3">
            <span className="text-xs font-mono text-stone-300 shrink-0 uppercase flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              Soil Moisture Probe:
            </span>
            <input
              type="range"
              min="10"
              max="90"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded-lg shrink-0 ${
              soilMoisture <= 35 ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-[#121E16] text-cyan-300 border border-cyan-500/30'
            }`}>
              {soilMoisture}%
            </span>
          </div>

          {/* Quick Moisture Presets & Actions */}
          <div className="md:col-span-5 flex items-center gap-1.5 justify-end">
            <button
              type="button"
              onClick={handleSimulateUrgentCondition}
              disabled={testAlertSending}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Set low moisture (26%) and trigger instant push notification"
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>Simulate Urgent (26%)</span>
            </button>

            <button
              type="button"
              onClick={handleRestoreOptimalMoisture}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
              title="Reset moisture to 64% optimal"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Optimal (64%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: SMART PUSH-NOTIFICATION-STYLE ALERT SETUP                      */}
      {/* ========================================================================= */}
      {irrigationSubTab === 'alert_setup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Push Notification Control Card */}
          <div className="p-5 lg:p-6 rounded-2xl bg-[#0E1711] border border-emerald-500/25 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/15">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-emerald-400" />
                  <span>{t('irrigationAlertsTitle')}</span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  {t('irrigationAlertsDesc')}
                </p>
              </div>

              {/* Master Active Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-stone-300">
                  {alertsEnabled ? 'Monitoring Active' : 'Monitoring Paused'}
                </span>
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                    alertsEnabled ? 'bg-emerald-500' : 'bg-stone-700'
                  }`}
                  role="switch"
                  aria-checked={alertsEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Browser Permission & Delivery Channel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Channel 1: Native Browser Push Notification */}
              <div className="p-3.5 rounded-xl bg-[#121E16] border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    Web Push Notification
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    notificationPermission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : notificationPermission === 'denied'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {notificationPermission === 'granted' ? 'Allowed' : notificationPermission === 'denied' ? 'Blocked' : 'Needs Setup'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-snug">
                  Sends native OS notifications to phone or laptop lockscreen when moisture drops critically.
                </p>
                {notificationPermission !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleRequestPermission}
                    className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Allow Browser Notifications
                  </button>
                )}
              </div>

              {/* Channel 2: Audio Alert Chime */}
              <div className="p-3.5 rounded-xl bg-[#121E16] border border-emerald-500/20 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {audioChimeEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
                      Audio Chime Alert
                    </span>
                    <button
                      type="button"
                      onClick={() => setAudioChimeEnabled(!audioChimeEnabled)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border cursor-pointer ${
                        audioChimeEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      {audioChimeEnabled ? 'Enabled' : 'Muted'}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug mt-1.5">
                    Plays a crisp acoustic chime through speakers when an urgent threshold triggers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={playAlertChime}
                  className="w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] border border-white/10 transition-colors cursor-pointer"
                >
                  Test Audio Tone
                </button>
              </div>

              {/* Channel 3: Alert Frequency */}
              <div className="p-3.5 rounded-xl bg-[#121E16] border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Dispatch Cadence
                </span>
                <p className="text-[11px] text-stone-400 leading-snug">
                  Choose how often moisture telemetry notifications should be delivered.
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setAlertFrequency('immediate')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                      alertFrequency === 'immediate'
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/30 border-white/10 text-stone-400'
                    }`}
                  >
                    Immediate
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertFrequency('twice_daily')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                      alertFrequency === 'twice_daily'
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/30 border-white/10 text-stone-400'
                    }`}
                  >
                    Dawn & Dusk
                  </button>
                </div>
              </div>

            </div>

            {/* Threshold & Weather Rules Configuration */}
            <div className="pt-2 space-y-4">
              <h5 className="text-xs font-mono uppercase text-stone-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Intelligent Weather-Aware Thresholds
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Moisture Threshold Slider */}
                <div className="p-4 rounded-xl bg-[#121E16] border border-emerald-500/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Baseline Moisture Trigger
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                      Below {moistureThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={moistureThreshold}
                    onChange={(e) => setMoistureThreshold(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>20% (Dry crops / Millets)</span>
                    <span>38% (Standard)</span>
                    <span>50% (Paddy / Banana)</span>
                  </div>
                </div>

                {/* Weather Adjuster Checkboxes */}
                <div className="p-4 rounded-xl bg-[#121E16] border border-emerald-500/15 space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-200">
                    <input
                      type="checkbox"
                      checked={heatStressMultiplier}
                      onChange={(e) => setHeatStressMultiplier(e.target.checked)}
                      className="mt-0.5 rounded accent-emerald-400 cursor-pointer"
                    />
                    <span>
                      <strong>Heat Stress Escalation:</strong> Raise alert sensitivity by +5% if local temperature exceeds 33°C.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-200">
                    <input
                      type="checkbox"
                      checked={rainHoldInterlock}
                      onChange={(e) => setRainHoldInterlock(e.target.checked)}
                      className="mt-0.5 rounded accent-emerald-400 cursor-pointer"
                    />
                    <span>
                      <strong>Rain Conservation Interlock:</strong> Automatically suppress urgent alerts if local rain forecast exceeds 65%.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-200">
                    <input
                      type="checkbox"
                      checked={floweringStagePriority}
                      onChange={(e) => setFloweringStagePriority(e.target.checked)}
                      className="mt-0.5 rounded accent-emerald-400 cursor-pointer"
                    />
                    <span>
                      <strong>Flowering Panicle Guard:</strong> Extra protection during sensitive reproductive growth stages.
                    </span>
                  </label>
                </div>

              </div>
            </div>

            {/* Test Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-500/15">
              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test your notification setup anytime without affecting real farm timers.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => dispatchPushAlert(true)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-rose-950/40 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('simulateAlert')}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Alert History / Log Table */}
          <div className="p-5 rounded-2xl bg-[#0E1711] border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono uppercase text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Recent Soil Alert History & Push Logs
              </h5>
              {alertLog.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAlertLog([])}
                  className="text-[11px] text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            {alertLog.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#121E16] border border-emerald-500/10 text-center text-xs text-stone-400">
                No recent alert events logged. Click "Test Urgent Push Alert" above or lower the moisture probe below {moistureThreshold}% to trigger an alert.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-500/15 text-[10px] font-mono text-stone-400 uppercase">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Severity</th>
                      <th className="pb-2">Crop</th>
                      <th className="pb-2">Moisture Reading</th>
                      <th className="pb-2">Weather Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10 font-mono">
                    {alertLog.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-stone-400">{log.timestamp}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.severity === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 text-white font-sans font-medium">{log.cropName}</td>
                        <td className="py-2.5 text-rose-300 font-bold">{log.moisturePercent}% (Limit &lt; {log.thresholdPercent}%)</td>
                        <td className="py-2.5 text-stone-300 font-sans">{log.weatherSummary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: PRECISION WATER BUDGET CALCULATOR                              */}
      {/* ========================================================================= */}
      {irrigationSubTab === 'calculator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
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
                className="w-full p-3 rounded-xl border border-emerald-500/20 focus:border-emerald-400 bg-[#121E16] text-stone-100 text-sm focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Agro District Selector - All 38 Tamil Nadu Districts */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-stone-300 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local Weather Station (38 Districts TN)</span>
              </span>
              <button
                type="button"
                onClick={() => fetchDistrictWeather(selectedDistrict)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-mono"
              >
                <RefreshCw className={`w-3 h-3 ${loadingWeather ? 'animate-spin' : ''}`} />
                <span>Sync Live Station</span>
              </button>
            </label>

            {/* All 38 Districts Select Dropdown */}
            <div className="flex items-center gap-2 bg-[#0E1B13] p-2 rounded-xl border border-emerald-500/20">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-transparent text-emerald-300 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-3"
              >
                {TN_ALL_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name} className="bg-[#0B130E] text-stone-200">
                    {language === 'ta' ? `${d.nameTa} (${d.name})` : `${d.name} (${d.nameTa})`} — {d.zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Select Buttons for Major Farming Zones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { name: 'Thanjavur', label: 'Cauvery Delta' },
                { name: 'Madurai', label: 'Southern Arid' },
                { name: 'Coimbatore', label: 'Western Belt' },
                { name: 'Salem', label: 'North Western' }
              ].map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setSelectedDistrict(d.name)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedDistrict === d.name
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                      : 'bg-[#121E16] border-emerald-500/15 text-stone-300 hover:border-emerald-500/30'
                  }`}
                >
                  <span className="text-xs font-bold block">{d.name}</span>
                  <span className="text-[10px] font-mono text-stone-400 block">
                    {d.label}
                  </span>
                </button>
              ))}
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
            onClick={() => calculateWater()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-[#070D09] font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 stroke-[2.5]" />
            <span>{t('calculate')}</span>
          </button>

          {/* Result Display */}
          {result !== null && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyan-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Calculated Daily Requirement ({weatherSnapshot.district} Weather Adjusted)
                </span>
                <span className="text-xs font-mono text-stone-300">
                  For {area} Acre(s)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#0B130E]/80 border border-cyan-500/20">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">Water Volume</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {result.liters.toLocaleString()}
                  </span>
                  <span className="text-xs text-cyan-300 ml-1">Liters / day</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B130E]/80 border border-emerald-500/20">
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
      )}

    </div>
  );
}

export type Language = 'en' | 'hi' | 'ta';

export interface TranslationDictionary {
  appName: string;
  brandTagline: string;
  tagline: string;
  launchDashboard: string;
  viewWebsite: string;
  askLeoAI: string;
  exploreFarm: string;
  
  // Navigation
  navFeatures: string;
  navPlantHealth: string;
  navWeather: string;
  navMarket: string;
  navIrrigation: string;
  navAbout: string;
  navFaq: string;
  
  // Landing Hero
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroExploreUseCases: string;
  
  // Landing Highlights
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;
  
  // TN Agro Zones
  agroZonesTitle: string;
  agroZonesSub: string;
  zoneCauvery: string;
  zoneCauveryDesc: string;
  zoneWestern: string;
  zoneWesternDesc: string;
  zoneSouthern: string;
  zoneSouthernDesc: string;
  
  // Dashboard Core
  dashboard: string;
  overview: string;
  plantInspector: string;
  cropHealth: string;
  weather: string;
  irrigation: string;
  marketPrices: string;
  cropPlanner: string;
  farmProfile: string;
  notifications: string;
  
  // Botanical Inspector
  plantHealthScore: string;
  leafVitality: string;
  stemNutrients: string;
  rootHydration: string;
  photosynthesisPAR: string;
  activeCrop: string;
  selectCrop: string;
  inspectPinHint: string;
  
  // Weather
  weatherTitle: string;
  microclimate: string;
  forecast7Day: string;
  temperature: string;
  humidity: string;
  wind: string;
  rainfallChance: string;
  soilMoisture: string;
  agroAdvisory: string;
  selectedDistrict: string;
  
  // AI Assistant
  assistant: string;
  askQuestion: string;
  send: string;
  thinking: string;
  greeting: string;
  voiceListening: string;
  voiceStart: string;
  voiceStop: string;
  safetyWarning: string;
  suggestedQuestions: string[];
  
  // Disease Detector
  diseaseTitle: string;
  diseaseDesc: string;
  uploadImage: string;
  analyzeCrop: string;
  analyzing: string;
  trySamplePhoto: string;
  
  // Irrigation
  irrigationTitle: string;
  irrigationDesc: string;
  cropType: string;
  soilType: string;
  areaAcres: string;
  irrigationMethod: string;
  calculate: string;
  waterNeed: string;
  litersPerDay: string;
  irrigationAlertsTitle: string;
  irrigationAlertsDesc: string;
  enableAlerts: string;
  soilMoistureLevel: string;
  criticalMoistureThreshold: string;
  urgentWateringNeeded: string;
  moistureHealthy: string;
  simulateAlert: string;
  testAlertSent: string;
  notificationPermission: string;
  weatherConditionFactor: string;
  
  // Mandi
  mandiTitle: string;
  mandiSubtitle: string;
  filterDistrict: string;
  filterCommodity: string;
  modalPrice: string;
  minMax: string;
  arrival: string;
  marketSource: string;
  
  // Tasks
  upcomingTasks: string;
  addTask: string;
  completed: string;
  pending: string;
  
  // Footer
  footerCopyright: string;
  kvkHelpline: string;
  footerAbout: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Leo Green Farm',
    brandTagline: 'Intelligent Sustainable Agriculture',
    tagline: 'Farmer-First Precision Intelligence for Tamil Nadu & India',
    launchDashboard: 'Launch Farm Dashboard',
    viewWebsite: 'Back to Website',
    askLeoAI: 'Consult Leo AI',
    exploreFarm: 'Explore Live Operations',
    
    // Navigation
    navFeatures: 'Capabilities',
    navPlantHealth: 'Plant Inspector',
    navWeather: 'Microclimate',
    navMarket: 'Mandi Prices',
    navIrrigation: 'Smart Irrigation',
    navAbout: 'Tamil Nadu Zones',
    navFaq: 'Farmer FAQ',
    
    // Landing Hero
    heroEyebrow: 'CALESCENCE AGRI-INTELLIGENCE · TAMIL NADU & BEYOND',
    heroHeadline: 'Anticipating how heat shapes agricultural productivity',
    heroSubheadline: 'Solar radiation intelligence to analyse how changing heat conditions affect farming systems, food production, and long-term land resilience across Tamil Nadu and Indian agricultural belts.',
    heroBadge: 'Active Field Telemetry · Cauvery Delta, Western & Southern Zones',
    heroExploreUseCases: 'EXPLORE USE CASES ↓',
    
    // Landing Highlights
    feat1Title: 'Live Botanical Health Inspector',
    feat1Desc: 'Inspect plant foliage with interactive sensor pins tracking leaf hydration, chlorophyll balance, transpiration, and root zone moisture in real time.',
    feat2Title: 'Agro-Climatic Microclimate Radar',
    feat2Desc: 'Precision weather forecasting with crop-specific agricultural advisories tuned to Tamil Nadu rain patterns, solar radiation, and wind currents.',
    feat3Title: 'Multimodal AI Crop Pathologist',
    feat3Desc: 'Upload foliage snapshots to instantly diagnose pests, fungal blights, and nutrient deficiencies with organic bio-remedies and KVK guidance.',
    feat4Title: 'Official Mandi Market Watch',
    feat4Desc: 'Live regulated APMC market prices from Thanjavur, Erode, Dindigul, Coimbatore, and Pollachi with transparent modal prices and arrival trends.',
    
    // TN Agro Zones
    agroZonesTitle: 'Calibrated for Tamil Nadu Agro-Climatic Zones',
    agroZonesSub: 'Agricultural strategies vary by geography. Leo Green Farm adapts models to the specific soil, water, and crop cycles of your district.',
    zoneCauvery: 'Cauvery Delta Alluvial Zone',
    zoneCauveryDesc: 'Specialized for Kuruvai & Samba Ponni paddy cycles, sub-surface bund moisture retention, and delta silt microbial health (Thanjavur, Tiruvarur, Nagapattinam).',
    zoneWestern: 'Western Agro-Climatic Zone',
    zoneWesternDesc: 'Optimized for Coconut palms, Nendran banana propping, turmeric rhizome vitality, and wind-resilient drip irrigation (Coimbatore, Tiruppur, Erode).',
    zoneSouthern: 'Southern Rainfed & Red Soil Zone',
    zoneSouthernDesc: 'Engineered for drought-tolerant pulse farming, small onion (shallot) management, Madurai jasmine blooming, and tank-fed water conservation (Madurai, Dindigul, Ramanathapuram).',
    
    // Dashboard Core
    dashboard: 'Farm Dashboard',
    overview: 'Operations Overview',
    plantInspector: 'Botanical Inspector',
    cropHealth: 'Crop Pathologist',
    weather: 'Microclimate Weather',
    irrigation: 'Irrigation & Water',
    marketPrices: 'APMC Mandi Prices',
    cropPlanner: 'Farm Planner',
    farmProfile: 'Farm Settings',
    notifications: 'Alerts & Bulletins',
    
    // Botanical Inspector
    plantHealthScore: 'Overall Plant Vitality',
    leafVitality: 'Leaf Hydration & Transpiration',
    stemNutrients: 'Stem Sap Flux & N-P-K Mobility',
    rootHydration: 'Sub-Surface Root Zone Moisture',
    photosynthesisPAR: 'Photosynthetic Active Radiation (PAR)',
    activeCrop: 'Inspected Crop',
    selectCrop: 'Switch Focus Crop',
    inspectPinHint: 'Click pulsing hotspot pins on the plant to inspect live bio-sensor telemetry',
    
    // Weather
    weatherTitle: 'Agro Microclimate',
    microclimate: 'Microclimate & 7-Day Forecast',
    forecast7Day: '7-Day Agronomic Outlook',
    temperature: 'Temperature',
    humidity: 'Relative Humidity',
    wind: 'Wind Velocity',
    rainfallChance: 'Precipitation Probability',
    soilMoisture: 'Soil Moisture Index',
    agroAdvisory: 'Field Agronomy Advisory',
    selectedDistrict: 'Regional Agro-Zone',
    
    // AI Assistant
    assistant: 'Leo AI Farm Agronomist',
    askQuestion: 'Ask about crops, bio-fertilizers, pest remedies, or sowing schedules...',
    send: 'Send',
    thinking: 'Leo AI is analyzing your agronomic query...',
    greeting: 'Vanakkam! I am your Leo Green Farm agronomist. How can I assist your farm today in Tamil Nadu or across India?',
    voiceListening: 'Listening in English... Speak your question now',
    voiceStart: 'Voice Input',
    voiceStop: 'Stop Listening',
    safetyWarning: 'Notice: Always adhere to recommended dosage guidelines. For severe chemical pest outbreaks, confirm with your district Krishi Vigyan Kendra (KVK).',
    suggestedQuestions: [
      'Best organic bio-control for paddy stem borer?',
      'Ideal drip watering schedule for small onions in red soil?',
      'How to prepare Panchagavya foliar spray for banana?',
      'Upcoming rain alert precautions for Cauvery Delta paddy harvest'
    ],
    
    // Disease Detector
    diseaseTitle: 'AI Crop Health Diagnostic Scanner',
    diseaseDesc: 'Capture or upload foliage photos to diagnose diseases, pest damage, or chlorosis with instant organic treatment recommendations.',
    uploadImage: 'Upload Plant Photo',
    analyzeCrop: 'Analyze Foliage Health',
    analyzing: 'Scanning cellular structure & leaf pathology...',
    trySamplePhoto: 'Or test with a sample field image:',
    
    // Irrigation
    irrigationTitle: 'Precision Drip & Water Budget Calculator',
    irrigationDesc: 'Compute precise water needs based on soil transpiration, crop coefficient (Kc), and Tamil Nadu evapotranspiration rates.',
    cropType: 'Crop Variety',
    soilType: 'Soil Classification',
    areaAcres: 'Cultivated Area (Acres)',
    irrigationMethod: 'Irrigation System',
    calculate: 'Calculate Daily Water Requirement',
    waterNeed: 'Estimated Daily Water Requirement',
    litersPerDay: 'Liters / Day',
    irrigationAlertsTitle: 'Smart Soil & Weather Alert Setup',
    irrigationAlertsDesc: 'Set up push-notification-style alerts when soil moisture data indicates urgent watering needs based on local weather conditions.',
    enableAlerts: 'Enable Automated Push Alerts',
    soilMoistureLevel: 'Current Soil Moisture Telemetry',
    criticalMoistureThreshold: 'Alert Trigger Threshold',
    urgentWateringNeeded: 'Urgent Watering Required',
    moistureHealthy: 'Soil Hydration Balanced',
    simulateAlert: 'Test Urgent Push Alert',
    testAlertSent: 'Push Notification Dispatched',
    notificationPermission: 'Browser Notification Permission',
    weatherConditionFactor: 'Weather & Heat Stress Multiplier',
    
    // Mandi
    mandiTitle: 'Tamil Nadu APMC Regulated Mandi Watch',
    mandiSubtitle: 'Official daily modal and arrival prices from authorized agricultural produce marketing yards.',
    filterDistrict: 'Filter by District',
    filterCommodity: 'Filter by Crop',
    modalPrice: 'Modal Price',
    minMax: 'Min / Max Price',
    arrival: 'Daily Arrivals',
    marketSource: 'Verified by TN Agricultural Marketing Board',
    
    // Tasks
    upcomingTasks: 'Scheduled Farm Tasks',
    addTask: 'Schedule Task',
    completed: 'Completed',
    pending: 'Action Required',
    
    // Footer
    footerCopyright: '© 2026 Leo Green Farm. Sustainable, farmer-first agriculture intelligence.',
    kvkHelpline: 'KVK Kisan Support Toll-Free Helpline: 1800-180-1551 · Tamil Nadu Agri Dept',
    footerAbout: 'Leo Green Farm combines modern AI vision, real microclimate sensors, and verified mandi data to help everyday Indian farmers achieve higher yields sustainably.'
  },
  
  ta: {
    appName: 'லியோ பசுமை பண்ணை',
    brandTagline: 'அறிவார்ந்த நீடித்த விவசாயம்',
    tagline: 'தமிழ்நாடு மற்றும் இந்திய விவசாயிகளுக்கான நுண்ணறிவு தளம்',
    launchDashboard: 'பண்ணை டாஷ்போர்டு திறக்க',
    viewWebsite: 'வலைத்தளத்திற்கு திரும்பு',
    askLeoAI: 'லியோ AI ஆலோசனை',
    exploreFarm: 'நேரடி பண்ணை மேலாண்மை',
    
    // Navigation
    navFeatures: 'அம்சங்கள்',
    navPlantHealth: 'பயிர் ஆய்வு',
    navWeather: 'வானிலை & சூழல்',
    navMarket: 'மண்டி சந்தை விலை',
    navIrrigation: 'சொட்டு நீர் பாசனம்',
    navAbout: 'தமிழ்நாடு மண்டலங்கள்',
    navFaq: 'விவசாயிகள் கேள்வி-பதில்',
    
    // Landing Hero
    heroEyebrow: 'CALESCENCE விவசாய நுண்ணறிவு · தமிழ்நாடு & இந்தியா',
    heroHeadline: 'வெப்பநிலையும் தட்பவெப்பமும் பயிர் விளைச்சலை எவ்வாறு மாற்றுகிறது என்பதை முன்கூட்டியே அறிதல்',
    heroSubheadline: 'சூரியக் கதிர்வீச்சு மற்றும் நுண் காலநிலை அறிவாற்றல் மூலம் பயிர் உற்பத்தி, மண் வளம் மற்றும் நீண்டகால விவசாய பாதுகாப்பை முன்கூட்டியே பகுப்பாய்வு செய்தல்.',
    heroBadge: 'நேரடி களத் தரவு · காவிரி டெல்டா, மேற்கு மற்றும் தென் மண்டலங்கள்',
    heroExploreUseCases: 'பயன்பாடுகளை ஆராய்க ↓',
    
    // Landing Highlights
    feat1Title: 'நேரடி தாவர ஆரோக்கிய ஆய்வு',
    feat1Desc: 'இலை ஈரப்பதம், தண்டு சத்து ஓட்டம், ஒளிச்சேர்க்கை மற்றும் வேர் மண்டல நீர் அளவை நேரடி சென்சார் புள்ளிகள் மூலம் கண்காணிக்கவும்.',
    feat2Title: 'துல்லிய வேளாண் வானிலை ரேடார்',
    feat2Desc: 'மழை வாய்ப்பு, காற்றின் வேகம் மற்றும் குறிப்பிட்ட பயிர்களுக்கான இயற்கை பூச்சி மருந்து தெளிப்பு நேர ஆலோசனைகள்.',
    feat3Title: 'AI பயிர் நோய் கண்டறிதல்',
    feat3Desc: 'பாதிக்கப்பட்ட இலை படத்தை பதிவேற்றி நொடிகளில் நோய் பெயர், பஞ்சகவ்யா உள்ளிட்ட இயற்கை மருந்துகள் மற்றும் வேளாண் வல்லுநர் ஆலோசனைகளைப் பெறுங்கள்.',
    feat4Title: 'தமிழ்நாடு ஒழுங்குமுறை மண்டி விலை',
    feat4Desc: 'தஞ்சாவூர், ஈரோடு, திண்டுக்கல், பொள்ளாச்சி, திருச்சி ஒழுங்குமுறை விற்பனைக்கூடங்களின் அன்றாட மாதிரி விலை நிலவரம்.',
    
    // TN Agro Zones
    agroZonesTitle: 'தமிழ்நாட்டின் வேளாண்-காலநிலை மண்டலங்களுக்கு ஏற்றது',
    agroZonesSub: 'ஒவ்வொரு மாவட்டத்தின் மண் மற்றும் நீர் நிலைக்கு ஏற்ப துல்லியமான பரிந்துரைகளை லியோ பசுமை பண்ணை வழங்குகிறது.',
    zoneCauvery: 'காவிரி டெல்டா வண்டல் மண் மண்டலம்',
    zoneCauveryDesc: 'குறுவை மற்றும் சம்பா பொன்னி நெல் சாகுபடி, வரப்பு ஈரப்பதம் பாதுகாப்பு மற்றும் தண்டு துளைப்பான் தடுப்பு மேலாண்மை (தஞ்சை, திருவாரூர், நாகை).',
    zoneWestern: 'மேற்கு வேளாண் மண்டலம்',
    zoneWesternDesc: 'தென்னை மர பராமரிப்பு, நேந்திரன் வாழை முட்டு கொடுத்தல், மஞ்சள் வேர் ஆரோக்கியம் மற்றும் காற்று தாங்கும் சொட்டு நீர் மேலாண்மை (கோவை, திருப்பூர், ஈரோடு).',
    zoneSouthern: 'தென் மானாவாரி & செம்மண் மண்டலம்',
    zoneSouthernDesc: 'சின்ன வெங்காய தழைப்பு, மதுரை மல்லிகை பூக்கும் திறன் மற்றும் வறட்சியைத் தாங்கும் பயறு வகை விவசாயத்திற்கான நீர் சேமிப்பு வழிகாட்டல் (மதுரை, திண்டுக்கல், ராமநாதபுரம்).',
    
    // Dashboard Core
    dashboard: 'பண்ணை டாஷ்போர்டு',
    overview: 'பொது பார்வை',
    plantInspector: 'பயிர் ஆரோக்கிய ஆய்வு',
    cropHealth: 'நோய் கண்டறிதல்',
    weather: 'வானிலை & காற்று',
    irrigation: 'நீர்ப்பாசன கணக்கீடு',
    marketPrices: 'மண்டி சந்தை நிலவரம்',
    cropPlanner: 'பயிர் காலண்டர்',
    farmProfile: 'பண்ணை விவரங்கள்',
    notifications: 'எச்சரிக்கைகள் & குறிப்புகள்',
    
    // Botanical Inspector
    plantHealthScore: 'ஒட்டுமொத்த தாவர ஆரோக்கியம்',
    leafVitality: 'இலை ஈரப்பதம் & சுவாசம்',
    stemNutrients: 'தண்டு சாறு ஓட்டம் & சத்து உறிஞ்சுதல்',
    rootHydration: 'வேர் மண்டல ஈரப்பதம்',
    photosynthesisPAR: 'ஒளிச்சேர்க்கை வீச்சு (PAR)',
    activeCrop: 'தேர்ந்தெடுக்கப்பட்ட பயிர்',
    selectCrop: 'பயிர் மாற்று',
    inspectPinHint: 'நேரடி பயிர் சென்சார் அளவீடுகளைக் காண ஒளிரும் புள்ளிகளை கிளிக் செய்யவும்',
    
    // Weather
    weatherTitle: 'வேளாண் நுண்-வானிலை',
    microclimate: 'வானிலை & 7 நாள் முன்னறிவிப்பு',
    forecast7Day: '7 நாள் வேளாண் வானிலை',
    temperature: 'வெப்பநிலை',
    humidity: 'காற்றின் ஈரப்பதம்',
    wind: 'காற்றின் வேகம்',
    rainfallChance: 'மழை பொழிவு வாய்ப்பு',
    soilMoisture: 'மண் ஈரப்பத குறியீடு',
    agroAdvisory: 'இன்றைய கள வேளாண் ஆலோசனை',
    selectedDistrict: 'வேளாண் மண்டலம்',
    
    // AI Assistant
    assistant: 'லியோ AI வேளாண் ஆலோசகர்',
    askQuestion: 'பயிர்கள், உரங்கள், பூச்சி மேலாண்மை அல்லது விதைப்பு பற்றி தமிழில் கேளுங்கள்...',
    send: 'அனுப்பு',
    thinking: 'லியோ AI ஆய்வு செய்கிறது...',
    greeting: 'வணக்கம்! நான் லியோ பசுமை பண்ணை AI ஆலோசகர். உங்கள் தமிழ்நாடு பயிர் சாகுபடிக்கு இன்று எவ்வாறு உதவலாம்?',
    voiceListening: 'தமிழில் கேட்கிறது... உங்கள் கேள்வியைப் பேசுங்கள்',
    voiceStart: 'குரல் பதிவு',
    voiceStop: 'நிறுத்து',
    safetyWarning: 'குறிப்பு: பரிந்துரைக்கப்பட்ட மருந்து அளவை மட்டும் பயன்படுத்தவும். தீவிர பூச்சி தாக்குதலுக்கு அருகில் உள்ள வேளாண் அறிவியல் நிலையத்தை (KVK) அணுகவும்.',
    suggestedQuestions: [
      'நெல் தண்டு துளைப்பானுக்கு சிறந்த இயற்கை கட்டுப்பாடு எது?',
      'செம்மண்ணில் சின்ன வெங்காயத்திற்கு சொட்டு நீர் பாசன அட்டவணை?',
      'வாழைக்கு பஞ்சகவ்யா தெளிப்பது எப்படி?',
      'காவிரி டெல்டா அறுவடை காலத்தில் வரவிருக்கும் மழை முன்னெச்சரிக்கை'
    ],
    
    // Disease Detector
    diseaseTitle: 'AI பயிர் நோய் கண்டறிதல் ஸ்கேனர்',
    diseaseDesc: 'பாதிக்கப்பட்ட பயிர் இலையின் புகைப்படத்தை பதிவேற்றி நோய் விபரம், தீவிரம் மற்றும் உடனடி இயற்கை மருந்துகளைப் பெறுங்கள்.',
    uploadImage: 'பயிர் புகைப்படத்தை பதிவேற்றவும்',
    analyzeCrop: 'இலையை ஆய்வு செய்',
    analyzing: 'செல்லுலார் மற்றும் நோய் தன்மையை பகுப்பாய்வு செய்கிறது...',
    trySamplePhoto: 'மாதிரி புகைப்படத்தை முயற்சி செய்யவும்:',
    
    // Irrigation
    irrigationTitle: 'துல்லிய சொட்டு நீர் பாசன கால்குலேட்டர்',
    irrigationDesc: 'மண் வகை, பயிர் வளர்ச்சி நிலை மற்றும் தமிழ்நாட்டின் ஆவியாதல் வீதத்தின் அடிப்படையில் துல்லிய நீர் தேவையை கணக்கிடுங்கள்.',
    cropType: 'பயிர் வகை',
    soilType: 'மண் வகை',
    areaAcres: 'சாகுபடி பரப்பளவு (ஏக்கர்)',
    irrigationMethod: 'பாசன முறை',
    calculate: 'தினசரி நீர் தேவையை கணக்கிடு',
    waterNeed: 'மதிப்பிடப்பட்ட தினசரி நீர் தேவை',
    litersPerDay: 'லிட்டர் / நாள்',
    irrigationAlertsTitle: 'மண் ஈரப்பதம் & வானிலை உடனடி புஷ் எச்சரிக்கைகள்',
    irrigationAlertsDesc: 'உள்ளூர் வானிலை சூழல் மற்றும் குறைந்த மண் ஈரப்பதத்தைக் கொண்டு அவசர பாசன புஷ் அறிவிப்புகளை அமைக்கவும்.',
    enableAlerts: 'தானியங்கி புஷ் அறிவிப்புகளை இயக்கு',
    soilMoistureLevel: 'தற்போதைய மண் ஈரப்பதம்',
    criticalMoistureThreshold: 'எச்சரிக்கை வரம்பு',
    urgentWateringNeeded: 'உடனடி பாசனம் தேவைப்படுகிறது',
    moistureHealthy: 'மண் ஈரப்பதம் சீராக உள்ளது',
    simulateAlert: 'மாதிரி புஷ் எச்சரிக்கை அனுப்பு',
    testAlertSent: 'புஷ் அறிவிப்பு அனுப்பப்பட்டது',
    notificationPermission: 'உலாவி அறிவிப்பு அனுமதி',
    weatherConditionFactor: 'வானிலை & வெப்ப அழுத்த காரணி',
    
    // Mandi
    mandiTitle: 'தமிழ்நாடு ஒழுங்குமுறை விற்பனைக்கூட விலை நிலவரம்',
    mandiSubtitle: 'அரசு அங்கீகாரம் பெற்ற விற்பனைக்கூடங்களின் அன்றாட மாதிரி மற்றும் வரத்து விபரம்.',
    filterDistrict: 'மாவட்டம் வாரியாக',
    filterCommodity: 'பயிர் வாரியாக',
    modalPrice: 'சராசரி மாதிரி விலை',
    minMax: 'குறைந்த / அதிக விலை',
    arrival: 'இன்றைய வரத்து',
    marketSource: 'தமிழ்நாடு வேளாண் வணிக வாரியத்தால் சரிபார்க்கப்பட்டது',
    
    // Tasks
    upcomingTasks: 'திட்டமிடப்பட்ட பண்ணை பணிகள்',
    addTask: 'புதிய பணி சேர்க்க',
    completed: 'முடிக்கப்பட்டது',
    pending: 'நிலுவையில் உள்ளது',
    
    // Footer
    footerCopyright: '© 2026 லியோ பசுமை பண்ணை. நிலையான விவசாய நுண்ணறிவு தளம்.',
    kvkHelpline: 'கிசான் இலவச கட்டண உதவி எண்: 1800-180-1551 · தமிழ்நாடு வேளாண் துறை',
    footerAbout: 'லியோ பசுமை பண்ணை நவீன AI பார்வை, வானிலை மற்றும் அதிகாரப்பூர்வ சந்தை தகவல்களை இணைத்து தமிழ்நாட்டு விவசாயிகளின் மகசூலை அதிகரிக்க உதவுகிறது.'
  },

  hi: {
    appName: 'लियो ग्रीन फार्म',
    brandTagline: 'बुद्धिमान सतत कृषि',
    tagline: 'तमिलनाडु और भारतीय किसानों के लिए उन्नत कृषि मंच',
    launchDashboard: 'फार्म डैशबोर्ड खोलें',
    viewWebsite: 'वेबसाइट पर वापस जाएं',
    askLeoAI: 'लियो AI से पूछें',
    exploreFarm: 'लाइव फार्म देखें',
    
    // Navigation
    navFeatures: 'विशेषताएं',
    navPlantHealth: 'पौधा स्वास्थ्य',
    navWeather: 'मौसम और जलवायु',
    navMarket: 'मंडी भाव',
    navIrrigation: 'सिंचाई गणना',
    navAbout: 'कृषि क्षेत्र',
    navFaq: 'अक्सर पूछे जाने वाले प्रश्न',
    
    // Landing Hero
    heroEyebrow: 'CALESCENCE कृषि बुद्धिमत्ता · तमिलनाडु एवं भारत',
    heroHeadline: 'बढ़ती गर्मी और सूक्ष्म जलवायु से कृषि उत्पादकता पर पड़ने वाले प्रभावों का सटीक पूर्वानुमान',
    heroSubheadline: 'सौर विकिरण और सूक्ष्म जलवायु बुद्धिमत्ता द्वारा कृषि प्रणालियों, खाद्य उत्पादन और दीर्घकालिक भूमि लचीलेपन का सटीक वैज्ञानिक विश्लेषण।',
    heroBadge: 'सक्रिय फ़ील्ड डेटा · कावेरी डेल्टा, पश्चिमी और दक्षिणी क्षेत्र',
    heroExploreUseCases: 'उपयोग के मामले देखें ↓',
    
    // Landing Highlights
    feat1Title: 'लाइव पौधा स्वास्थ्य विश्लेषक',
    feat1Desc: 'पत्तियों की नमी, तने के पोषक प्रवाह और जड़ क्षेत्र की नमी को वास्तविक समय में इंटरैक्टिव सेंसर पिन से जांचें।',
    feat2Title: 'सटीक कृषि मौसम रडार',
    feat2Desc: 'फसल-विशिष्ट कृषि सलाह, वर्षा संभावना और कीटनाशक छिड़काव के सर्वोत्तम समय का पूर्वानुमान।',
    feat3Title: 'मल्टीमॉडल एआई फसल रोग विशेषज्ञ',
    feat3Desc: 'पत्ते का फोटो अपलोड करें और तुरंत रोग का नाम, जैविक उपचार (जीवामृत, नीम तेल) और विशेषज्ञ सलाह प्राप्त करें।',
    feat4Title: 'आधिकारिक एपीएमसी मंडी भाव',
    feat4Desc: 'तंजावुर, इरोड, डिंडीगुल, कोयंबटूर और पोल्लाची की सरकारी मंडियों के सटीक दैनिक मूल्य और आवक आंकड़े।',
    
    // TN Agro Zones
    agroZonesTitle: 'तमिलनाडु के कृषि-जलवायु क्षेत्रों के लिए अनुकूलित',
    agroZonesSub: 'प्रत्येक जिले की मिट्टी और जल चक्र के अनुसार सटीक कृषि सलाह।',
    zoneCauvery: 'कावेरी डेल्टा जलोढ़ क्षेत्र',
    zoneCauveryDesc: 'कुरुवई और सांबा पोन्नी धान चक्र, मेड़ की नमी संरक्षण और कीट रोकथाम (तंजावुर, तिरुवारूर, नागपट्टिनम)।',
    zoneWestern: 'पश्चिमी कृषि क्षेत्र',
    zoneWesternDesc: 'नारियल बागान, नेन्द्रन केला सहारा और हवा-सहिष्णु ड्रिप सिंचाई (कोयंबटूर, तिरुपुर, इरोड)।',
    zoneSouthern: 'दक्षिणी वर्षा आधारित एवं लाल मिट्टी क्षेत्र',
    zoneSouthernDesc: 'छोटे प्याज (शैलट्स), मदुरै चमेली और सूखा-सहिष्णु दलहन फसलों के लिए विशेष सलाह (मदुरै, डिंडीगुल, रामनाथपुरम)।',
    
    // Dashboard Core
    dashboard: 'फार्म डैशबोर्ड',
    overview: 'संचालन समीक्षा',
    plantInspector: 'पौधा स्वास्थ्य जांच',
    cropHealth: 'रोग पहचान',
    weather: 'मौसम पूर्वानुमान',
    irrigation: 'जल व सिंचाई',
    marketPrices: 'एपीएमसी मंडी भाव',
    cropPlanner: 'फसल कैलेंडर',
    farmProfile: 'फार्म सेटिंग्स',
    notifications: 'अलर्ट एवं सूचनाएं',
    
    // Botanical Inspector
    plantHealthScore: 'कुल पौधा जीवन शक्ति',
    leafVitality: 'पत्ती की नमी और श्वसन',
    stemNutrients: 'तने का रस प्रवाह व पोषक गतिशीलता',
    rootHydration: 'जड़ क्षेत्र की भूमिगत नमी',
    photosynthesisPAR: 'प्रकाश संश्लेषक विकिरण (PAR)',
    activeCrop: 'सक्रिय फसल',
    selectCrop: 'फसल बदलें',
    inspectPinHint: 'लाइव बायो-सेंसर डेटा देखने के लिए पौधे पर चमकते पिन पर क्लिक करें',
    
    // Weather
    weatherTitle: 'कृषि सूक्ष्म-मौसम',
    microclimate: 'मौसम व 7 दिवसीय दृष्टिकोण',
    forecast7Day: '7 दिवसीय कृषि पूर्वानुमान',
    temperature: 'तापमान',
    humidity: 'हवा में नमी',
    wind: 'हवा की गति',
    rainfallChance: 'वर्षा की संभावना',
    soilMoisture: 'मिट्टी की नमी सूचकांक',
    agroAdvisory: 'आज की क्षेत्रीय कृषि सलाह',
    selectedDistrict: 'कृषि क्षेत्र',
    
    // AI Assistant
    assistant: 'लियो AI कृषि विशेषज्ञ',
    askQuestion: 'फसलों, जैविक खादों, कीट प्रबंधन या बुवाई के बारे में हिंदी में पूछें...',
    send: 'भेजें',
    thinking: 'लियो AI आपकी क्वेरी का विश्लेषण कर रहा है...',
    greeting: 'नमस्ते! मैं लियो ग्रीन फार्म AI सहायक हूँ। तमिलनाडु या भारत में आपकी खेती के लिए मैं क्या सहायता कर सकता हूँ?',
    voiceListening: 'हिंदी में सुन रहा है... अपना प्रश्न बोलें',
    voiceStart: 'आवाज से पूछें',
    voiceStop: 'रोकें',
    safetyWarning: 'ध्यान दें: रासायनिक कीटनाशकों का प्रयोग केवल अनुशंसित मात्रा में करें। गंभीर प्रकोप के लिए नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।',
    suggestedQuestions: [
      'धान के तना छेदक के लिए सबसे अच्छा जैविक नियंत्रण?',
      'लाल मिट्टी में छोटे प्याज के लिए ड्रिप सिंचाई का समय?',
      'केले के लिए पंचगव्य का छिड़काव कैसे तैयार करें?',
      'कावेरी डेल्टा में धान कटाई के दौरान बारिश से सुरक्षा के उपाय'
    ],
    
    // Disease Detector
    diseaseTitle: 'एआई फसल रोग निदान स्कैनर',
    diseaseDesc: 'रोगों, कीटों और पोषक तत्वों की कमी का तुरंत पता लगाने के लिए फसल की पत्ती का फोटो अपलोड करें।',
    uploadImage: 'फसल की तस्वीर अपलोड करें',
    analyzeCrop: 'पत्ती का विश्लेषण करें',
    analyzing: 'रोग लक्षणों का विश्लेषण हो रहा है...',
    trySamplePhoto: 'या नमूना चित्र से परीक्षण करें:',
    
    // Irrigation
    irrigationTitle: 'सटीक ड्रिप व जल बजट कैलकुलेटर',
    irrigationDesc: 'मिट्टी के प्रकार, फसल के गुणांक और वाष्पीकरण दर के आधार पर सटीक दैनिक जल आवश्यकता की गणना करें।',
    cropType: 'फसल का प्रकार',
    soilType: 'मिट्टी का प्रकार',
    areaAcres: 'खेती का रकबा (एकड़)',
    irrigationMethod: 'सिंचाई विधि',
    calculate: 'दैनिक जल आवश्यकता निकालें',
    waterNeed: 'अनुमानित दैनिक पानी की आवश्यकता',
    litersPerDay: 'लीटर / दिन',
    irrigationAlertsTitle: 'स्मार्ट मिट्टी नमी और मौसम पुश अलर्ट सेटअप',
    irrigationAlertsDesc: 'स्थानीय मौसम और कम नमी के आधार पर आपातकालीन सिंचाई के लिए पुश-नोटिफिकेशन अलर्ट सेट करें।',
    enableAlerts: 'स्वचालित पुश अलर्ट सक्षम करें',
    soilMoistureLevel: 'वर्तमान मिट्टी की नमी टेलीमेट्री',
    criticalMoistureThreshold: 'अलर्ट ट्रिगर सीमा',
    urgentWateringNeeded: 'तत्काल सिंचाई की आवश्यकता है',
    moistureHealthy: 'मिट्टी की नमी सामान्य है',
    simulateAlert: 'पुश अलर्ट का परीक्षण करें',
    testAlertSent: 'पुश नोटिफिकेशन भेजा गया',
    notificationPermission: 'ब्राउज़र नोटिफिकेशन अनुमति',
    weatherConditionFactor: 'मौसम और गर्मी तनाव कारक',
    
    // Mandi
    mandiTitle: 'तमिलनाडु एपीएमसी सरकारी मंडी भाव',
    mandiSubtitle: 'अधिकृत कृषि उपज मंडियों के दैनिक मॉडल और आवक मूल्य।',
    filterDistrict: 'जिला चुनें',
    filterCommodity: 'फसल चुनें',
    modalPrice: 'औसत मॉडल भाव',
    minMax: 'न्यूनतम / अधिकतम भाव',
    arrival: 'दैनिक आवक',
    marketSource: 'तमिलनाडु कृषि विपणन बोर्ड द्वारा सत्यापित',
    
    // Tasks
    upcomingTasks: 'आगामी कृषि कार्य',
    addTask: 'नया कार्य जोड़ें',
    completed: 'पूर्ण',
    pending: 'लंबित',
    
    // Footer
    footerCopyright: '© 2026 लियो ग्रीन फार्म। सतत किसान-प्रथम कृषि मंच।',
    kvkHelpline: 'किसान टोल-फ्री हेल्पलाइन: 1800-180-1551 · तमिलनाडु कृषि विभाग',
    footerAbout: 'लियो ग्रीन फार्म आधुनिक एआई, मौसम सेंसर और वास्तविक मंडी भावों का उपयोग करके किसानों की पैदावार बढ़ाने में मदद करता है।'
  }
};

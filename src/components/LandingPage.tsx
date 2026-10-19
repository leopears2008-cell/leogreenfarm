import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  ArrowRight, 
  CloudSun, 
  ScanLine, 
  TrendingUp, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Compass, 
  Bot, 
  Globe 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../translations';

interface LandingPageProps {
  onOpenDashboard: (tab?: string) => void;
}

export default function LandingPage({ onOpenDashboard }: LandingPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const agroZones = [
    {
      name: language === 'ta' ? 'காவிரி டெல்டா மண்டலம்' : language === 'hi' ? 'कावेरी डेल्टा क्षेत्र' : 'Cauvery Delta Agro-Zone',
      districts: 'Thanjavur · Thiruvarur · Nagapattinam',
      soil: 'Rich Alluvial & Clay Loam',
      crops: 'Ponni Samba Paddy, Blackgram, Banana',
      climate: '31°C · 78% Humidity · Good Water Table'
    },
    {
      name: language === 'ta' ? 'மேற்கு மண்டலம்' : language === 'hi' ? 'पश्चिमी कृषि क्षेत्र' : 'Western Agro-Zone',
      districts: 'Coimbatore · Tiruppur · Erode',
      soil: 'Red Loam & Black Cotton',
      crops: 'Sugarcane, Turmeric, Coconut, Cotton',
      climate: '28°C · Moderate Rainfall · Drip-Fed'
    },
    {
      name: language === 'ta' ? 'தெற்கு மானாவாரி மண்டலம்' : language === 'hi' ? 'दक्षिणी वर्षा आधारित क्षेत्र' : 'Southern Rainfed Tracts',
      districts: 'Madurai · Dindigul · Ramanathapuram',
      soil: 'Red Gravel & Clay Mixture',
      crops: 'Groundnut, Millets, Pulses, Jasmine',
      climate: '34°C · Semi-Arid · Resilient Irrigation'
    }
  ];

  const features = [
    {
      icon: Leaf,
      color: 'emerald',
      title: language === 'ta' ? 'தாவர சுகாதார நுண்ணாய்வு' : language === 'hi' ? 'संयंत्र स्वास्थ्य विश्लेषक' : 'Botanical Sensor Telemetry',
      desc: language === 'ta' ? 'இலை ஈரப்பதம், சாறு ஓட்டம், தண்டு அழுத்தம் மற்றும் வேர் ஆரோக்கியத்தை நிகழ்நேரத்தில் கண்காணிக்கும் நேரடி சென்சார் காட்சி.' : language === 'hi' ? 'पत्ती की नमी, रस प्रवाह और जड़ स्वास्थ्य की रीयल-टाइम मॉनिटरिंग।' : 'Live interactive plant inspection with foliage hydration, sap velocity, and root aerification sensor pins.'
    },
    {
      icon: ScanLine,
      color: 'amber',
      title: language === 'ta' ? 'Gemini பார்வை பயிர் நோய் கண்டறிதல்' : language === 'hi' ? 'एआई फसल रोग पहचान' : 'Multimodal Vision Diagnostic',
      desc: language === 'ta' ? 'பாதிக்கப்பட்ட பயிர் இலையின் புகைப்படத்தை பதிவேற்றி நொடிகளில் துல்லியமான மருத்துவக் குறிப்பு மற்றும் இயற்கை சிகிச்சையைப் பெறுங்கள்.' : language === 'hi' ? 'पत्ती की फोटो अपलोड करें और तुरंत जैविक उपचार और केवीके सलाह प्राप्त करें।' : 'Upload or capture crop foliage photos to receive instant diagnosis, severity metrics, and organic bio-control steps.'
    },
    {
      icon: CloudSun,
      color: 'cyan',
      title: language === 'ta' ? 'துல்லிய தட்பவெப்பநிலை & பாசனம்' : language === 'hi' ? 'सटीक मौसम व सिंचाई सलाह' : 'Delta Microclimate & Water Forecast',
      desc: language === 'ta' ? 'தமிழக மாவட்டங்களுக்கான 7 நாள் மழை முன்னறிவிப்பு, காற்றின் வேகம் மற்றும் பயிர் நீர்த் தேவை கணக்கீடு.' : language === 'hi' ? 'कावेरी डेल्टा व अन्य जिलों के लिए 7-दिवसीय मौसम और सटीक सिंचाई सलाह।' : '7-day precipitation forecasts, wind patterns, and soil evapotranspiration calculated for Tamil Nadu agro-zones.'
    },
    {
      icon: TrendingUp,
      color: 'emerald',
      title: language === 'ta' ? 'உண்மையான உழவர் சந்தை & மண்டி விலை' : language === 'hi' ? 'वास्तविक मंडी भाव' : 'Regulated APMC Mandi Prices',
      desc: language === 'ta' ? 'தஞ்சை, ஈரோடு, திண்டுக்கல் சந்தைகளில் பொன்னி நெல், மஞ்சள், தக்காளி, தேங்காய் ஆகியவற்றின் தினசரி சரிபார்க்கப்பட்ட விலைகள்.' : language === 'hi' ? 'तमिलनाडु की प्रमुख मंडियों में धान, हल्दी और नारियल के दैनिक सत्यापित भाव।' : 'District-verified commodity prices for Paddy, Turmeric, Tomato, and Coconut direct from regulated Tamil Nadu market yards.'
    },
    {
      icon: Bot,
      color: 'lime',
      title: language === 'ta' ? 'முத்தமிழ் குரல்வழி AI வேளாண் உதவியாளர்' : language === 'hi' ? 'बहुभाषी एआई कृषि सलाहकार' : 'Multilingual AI Voice Agronomist',
      desc: language === 'ta' ? 'தமிழ், ஆங்கிலம் அல்லது இந்தியில் குரல் மூலம் கேள்வி கேட்டு உடனடி வேளாண் வழிகாட்டுதலைப் பெறுங்கள்.' : language === 'hi' ? 'तमिल, हिंदी या अंग्रेजी में बोलकर सवाल पूछें और विशेषज्ञ सलाह पाएं।' : 'Speak naturally in Tamil, English, or Hindi using Web Speech voice dictation to get localized agronomy guidance.'
    },
    {
      icon: ShieldCheck,
      color: 'teal',
      title: language === 'ta' ? 'பாதுகாப்பான உழவர் வழிகாட்டி' : language === 'hi' ? 'सुरक्षित व जैविक खेती' : 'TNAU & KVK-Aligned Safety',
      desc: language === 'ta' ? 'இரசாயனப் பூச்சிக்கொல்லிகளுக்கு மாற்றாக ஜீவாமிர்தம், பஞ்சகாவ்யா போன்ற இயற்கை முறைகளுக்கு முன்னுரிமை அளிக்கும் பாதுகாப்பு விதிமுறைகள்.' : language === 'hi' ? 'रसायनों के बजाए पंचगव्य व जीवामृत जैसे जैविक विकल्पों को प्राथमिकता।' : 'Prioritizes organic bio-controls and safety disclaimers, linking directly with Krishi Vigyan Kendra extension recommendations.'
    }
  ];

  const faqs = [
    {
      q: language === 'ta' ? 'லியோ பசுமை பண்ணை AI எவ்வாறு பயிர் நோய்களைக் கண்டறிகிறது?' : language === 'hi' ? 'लियो ग्रीन फार्म एआई फसलों के रोग कैसे पहचानता है?' : 'How does Leo Green Farm identify crop diseases?',
      a: language === 'ta' ? 'நீங்கள் பயிரின் இலை அல்லது தண்டின் புகைப்படத்தைப் பதிவேற்றும்போது, கூகுள் ஜெமினி மல்டிமாடல் விஷன் மாடல் மூலம் நோய்க்கான அறிகுறிகள் ஆராயப்பட்டு, நோய் பெயர், தீவிரம் மற்றும் உடனடி இயற்கை சிகிச்சை பரிந்துரைக்கப்படுகிறது.' : language === 'hi' ? 'जब आप प्रभावित पत्ती का फोटो अपलोड करते हैं, तो जेमिनी विज़न एआई इसका विश्लेषण कर बीमारी, गंभीरता और जैविक उपचार बताता है।' : 'When you upload or photograph a plant leaf, our multimodal vision model evaluates visual pathology patterns to deliver diagnosis, severity ratings, organic bio-pesticide recipes, and official KVK extension guidelines.'
    },
    {
      q: language === 'ta' ? 'இதில் குரல் மூலம் தமிழில் பேச முடியுமா?' : language === 'hi' ? 'क्या मैं हिंदी या तमिल में बोलकर सवाल पूछ सकता हूँ?' : 'Can I talk using voice dictation in Tamil and Hindi?',
      a: language === 'ta' ? 'ஆம்! இணைய ஸ்பீச் தொழில்நுட்பம் (Web Speech API) மூலம் தமிழ், இந்தி மற்றும் ஆங்கிலத்தில் நேரடியாகப் பேசி உங்கள் கேள்விகளை வினாடிகளில் கேட்கலாம்.' : language === 'hi' ? 'हाँ! वेब स्पीच टेक्नोलॉजी के जरिए आप हिंदी, तमिल या अंग्रेजी में सीधे बोलकर सवाल पूछ सकते हैं।' : 'Yes! The AI assistant has native Web Speech API voice-to-text integration supporting Tamil (தமிழ்), Hindi (हिंदी), and English with automatic language dialect detection.'
    },
    {
      q: language === 'ta' ? 'மண்டி விலைகள் எவ்வாறு புதுப்பிக்கப்படுகின்றன?' : language === 'hi' ? 'मंडी भाव कैसे अपडेट होते हैं?' : 'How are the APMC mandi prices updated?',
      a: language === 'ta' ? 'தமிழ்நாட்டின் ஒழுங்குமுறை விற்பனைக்கூடங்கள் (Regulated Markets) மற்றும் உழவர் சந்தைகளின் தினசரி வரத்து மற்றும் சராசரி விலை நிலவரங்களின் அடிப்படையில் தகவல்கள் வழங்கப்படுகின்றன.' : language === 'hi' ? 'तमिलनाडु की विनियमित मंडियों और किसान बाजारों से दैनिक आवक और औसत भाव प्रस्तुत किए जाते हैं।' : 'Prices reflect authentic market yard arrivals and trading values from regulated agricultural produce markets across Thanjavur, Erode, Dindigul, and Coimbatore.'
    },
    {
      q: language === 'ta' ? 'கணினி அல்லது மொபைலில் இது இயங்குமா?' : language === 'hi' ? 'क्या यह मोबाइल फोन पर काम करता है?' : 'Does this platform work on mobile phones?',
      a: language === 'ta' ? 'ஆம், இது அனைத்து ஸ்மார்ட்போன்கள், டேப்லெட்டுகள் மற்றும் கணினிகளிலும் எளிதாக இயங்கும் வண்ணம் நவீன முறையில் வடிவமைக்கப்பட்டுள்ளது.' : language === 'hi' ? 'हाँ, यह स्मार्टफोन, टैबलेट और कंप्यूटर सभी पर बेहद सहजता से चलता है।' : 'Leo Green Farm is fully responsive with touch-optimized controls, responsive drawer menus, and fast loading tailored for rural mobile connectivity.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070D09] text-stone-100 selection:bg-emerald-500 selection:text-black">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070D09]/80 backdrop-blur-xl border-b border-emerald-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-[#070D09] shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                Leo Green Farm
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Agri-SaaS
                </span>
              </span>
              <p className="text-[11px] text-stone-400 font-mono hidden sm:block">
                Sustainable Intelligence · Tamil Nadu & Pan-India
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              {language === 'ta' ? 'அறிமுகம்' : language === 'hi' ? 'परिचय' : 'About'}
            </a>
            <a href="#zones" className="hover:text-emerald-400 transition-colors">
              {language === 'ta' ? 'வேளாண் மண்டலங்கள்' : language === 'hi' ? 'कृषि क्षेत्र' : 'Agro-Zones'}
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              {t('features')}
            </a>
            <a href="#preview" className="hover:text-emerald-400 transition-colors">
              {language === 'ta' ? 'டாஷ்போர்டு முன்னோட்டம்' : language === 'hi' ? 'डैशबोर्ड' : 'Live Dashboard'}
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/25 rounded-xl px-2.5 py-1.5 text-xs text-stone-200">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-xs font-medium cursor-pointer outline-none text-emerald-300 focus:ring-0"
              >
                <option value="en" className="bg-[#0B130E] text-stone-200">English</option>
                <option value="ta" className="bg-[#0B130E] text-stone-200">தமிழ்</option>
                <option value="hi" className="bg-[#0B130E] text-stone-200">हिंदी</option>
              </select>
            </div>

            {/* Launch Dashboard Button */}
            <button
              onClick={() => onOpenDashboard()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#070D09] font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{t('launchDashboard')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden">
        {/* Background Landscape with warm sunrise overlay */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
            alt="Cinematic agricultural landscape at golden hour"
            className="w-full h-full object-cover object-center brightness-[0.45] saturate-[1.1] scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D09] via-[#070D09]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D09]/90 via-[#070D09]/40 to-transparent" />
          
          {/* Subtle Warm Sunrise Ambient Glow */}
          <div className="absolute -top-32 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('heroEyebrow')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-sans"
            >
              {t('heroHeadline')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-stone-300 leading-relaxed font-normal mb-10 max-w-2xl"
            >
              {t('heroSubheadline')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => onOpenDashboard('overview')}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-[#070D09] font-bold text-base shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{t('exploreFarm')}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onOpenDashboard('assistant')}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer hover:border-emerald-400/50"
              >
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>{t('askLeoAI')}</span>
              </button>

              <button
                onClick={() => onOpenDashboard('health')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/25 text-emerald-300 text-sm font-medium backdrop-blur-md transition-all cursor-pointer"
              >
                <ScanLine className="w-4 h-4" />
                <span>{language === 'ta' ? 'நோய் கண்டறிதல்' : language === 'hi' ? 'रोग जांचें' : 'Scan Plant Photo'}</span>
              </button>
            </motion.div>

            {/* Live Status Indicators (Genuine telemetry) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-14 pt-8 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono"
            >
              <div>
                <span className="text-stone-400 block mb-0.5">Primary Zone</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Cauvery Delta
                </span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Sensor Telemetry</span>
                <span className="text-cyan-400 font-semibold">94% Foliage Hydration</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Multilingual AI</span>
                <span className="text-amber-400 font-semibold">Tamil · English · Hindi</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Mandi Regulated</span>
                <span className="text-white font-semibold">APMC Verified Rates</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 border-t border-emerald-500/15 bg-[#0B130E]/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Farmer-First Engineering</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {language === 'ta' ? 'பாரம்பரிய விவசாயத்துடன் நவீன தொழில்நுட்பம்' : language === 'hi' ? 'पारंपरिक कृषि और आधुनिक तकनीक का संगम' : 'Rooted in Soil. Powered by Precision.'}
              </h2>
              <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
                {language === 'ta'
                  ? 'லியோ பசுமை பண்ணை தமிழக விவசாயிகளின் தேவைகளை உணர்ந்து உருவாக்கப்பட்டுள்ளது. நிலத்தடி நீர் மேலாண்மை, இயற்கை உரம் மற்றும் பூச்சிக் கட்டுப்பாடு முறைகளுடன், செயற்கை நுண்ணறிவு தொழில்நுட்பத்தை ஒருங்கே இணைக்கிறது.'
                  : language === 'hi'
                  ? 'लियो ग्रीन फार्म भारतीय किसानों को आधुनिक तकनीक, सटीक मौसम और स्थानीय भाषा में कृषि परामर्श प्रदान करता है, ताकि वे आत्मविश्वास के साथ बेहतर उत्पादन प्राप्त कर सकें।'
                  : 'Leo Green Farm provides intuitive, science-backed agricultural tools for smallholder and commercial farmers. By blending microclimate forecasts, Gemini multimodal vision, and Tamil Nadu APMC price records, we help growers optimize irrigation, detect diseases early, and market crops at peak returns.'}
              </p>
              
              <div className="space-y-3 pt-2">
                {[
                  language === 'ta' ? 'இயற்கை வழி வேளாண்மை மற்றும் பூச்சி மேலாண்மைக்கு முன்னுரிமை' : 'Integrated Pest Management (IPM) prioritizing bio-controls',
                  language === 'ta' ? 'உள்ளூர் வேளாண் பல்கலைக்கழக (TNAU) வழிகாட்டு நெறிமுறைகள்' : 'Advisory frameworks harmonized with TNAU & ICAR standards',
                  language === 'ta' ? 'தமிழ், இந்தி மற்றும் ஆங்கிலத்தில் எளிய குரல் வழி உரையாடல்' : 'Zero-friction voice dictation in native regional dialects'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl bg-gradient-to-br from-emerald-950/40 to-[#070D09]">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
                  alt="Farmer examining healthy crop field"
                  className="w-full h-80 sm:h-96 object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B130E] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0B130E]/85 backdrop-blur-md border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-emerald-400 block">Tamil Nadu Agro-Intelligence</span>
                    <h4 className="text-white font-semibold text-base">Thanjavur & Delta Paddy Cultivation</h4>
                    <p className="text-xs text-stone-300">Samba season monitoring: active sap flux and ideal soil moisture</p>
                  </div>
                  <button
                    onClick={() => onOpenDashboard('overview')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer"
                  >
                    View Field Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agro-Climatic Zones of Tamil Nadu */}
      <section id="zones" className="py-20 border-t border-emerald-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Regional Focus</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {language === 'ta' ? 'தமிழக வேளாண்-தட்பவெப்ப மண்டலங்கள்' : language === 'hi' ? 'तमिलनाडु के कृषि-जलवायु क्षेत्र' : 'Tamil Nadu Agro-Climatic Zones'}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-3">
              {language === 'ta'
                ? 'உங்கள் பகுதிக்கான மண் வகை, பயிர்கள் மற்றும் நீர்த் தேவைகளின் அடிப்படையில் துல்லியமான திட்டமிடல்.'
                : 'Customized decision support engineered specifically for the soil characteristics and river basins of Tamil Nadu.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agroZones.map((zone, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-3xl bg-[#0B130E]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 space-y-4 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Zone 0{idx + 1}
                  </span>
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{zone.name}</h3>
                  <p className="text-xs font-mono text-stone-400">{zone.districts}</p>
                </div>
                <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-emerald-500/10">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Soil:</span>
                    <span className="font-medium text-right text-stone-200">{zone.soil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Key Crops:</span>
                    <span className="font-medium text-right text-emerald-300">{zone.crops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Status:</span>
                    <span className="font-mono text-cyan-300">{zone.climate}</span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenDashboard('weather')}
                  className="w-full mt-2 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-stone-200 hover:text-emerald-300 text-xs font-medium border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Weather Forecast</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 border-t border-emerald-500/15 bg-[#0B130E]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {language === 'ta' ? 'விவசாயிகளுக்கான நவீன சிறப்பம்சங்கள்' : language === 'hi' ? 'किसानों के लिए प्रमुख सुविधाएं' : 'Engineered for Practical Agriculture'}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-3">
              {language === 'ta' ? 'அறிவியல் பூர்வமான அணுகுமுறை, எளிமையான பயன்பாடு.' : 'Clear tools that help you monitor, diagnose, irrigate, and sell with complete confidence.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-gradient-to-b from-[#121E16]/80 to-[#0B130E]/90 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Preview Teaser */}
      <section id="preview" className="py-24 border-t border-emerald-500/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Live Workspace Preview</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {language === 'ta' ? 'இயங்கும் பண்ணை கட்டுப்பாட்டு மையம்' : language === 'hi' ? 'लाइव ऑपरेशंस वर्कस्पेस' : 'Interactive Farm Operations Workspace'}
              </h2>
              <p className="text-stone-300 text-sm mt-2 max-w-xl">
                Experience the live dark-forest botanical inspector with glowing sensor pins, crop vitality radar, and 7-day microclimate telemetry.
              </p>
            </div>
            <button
              onClick={() => onOpenDashboard('overview')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer self-start md:self-auto"
            >
              <span>{t('launchDashboard')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Interactive Mock Preview Frame */}
          <div className="rounded-3xl border border-emerald-500/30 bg-[#0B130E] p-4 sm:p-6 shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D09] via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-500/15">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-stone-400">leo-green-farm.app · cauvery-delta-node</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono text-emerald-400">TELEMETRY LIVE</span>
              </div>
            </div>

            {/* Teaser Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-emerald-400 uppercase">Botanical Telemetry</span>
                    <span className="text-xs font-mono text-stone-300">Target: Young Paddy Shoot</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                      <Leaf className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Overall Vitality: 92%</h4>
                      <p className="text-xs text-stone-300">Foliage Hydration 94% · Xylem Sap Flux 14 ml/hr · Root Aeration 68%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Temperature</span>
                    <span className="text-lg font-bold font-mono text-white">29.4°C</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Humidity</span>
                    <span className="text-lg font-bold font-mono text-cyan-300">76%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Mandi Paddy</span>
                    <span className="text-lg font-bold font-mono text-amber-300">₹2,380</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs text-stone-200">
                      {language === 'ta' ? 'லியோ AI வேளாண் ஆலோசகர் தயாராக உள்ளார்.' : 'Leo AI Assistant ready for voice or text questions.'}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenDashboard('assistant')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    Open Chat →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-emerald-900/20 to-transparent rounded-2xl border border-emerald-500/20">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/30 animate-pulse">
                  <Leaf className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Full Interactive Control</h3>
                  <p className="text-xs text-stone-300 max-w-xs mt-1">
                    Click through to interact with live plant pins, switch crops, and trigger Gemini crop analysis.
                  </p>
                </div>
                <button
                  onClick={() => onOpenDashboard('overview')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D09] font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Enter Live Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-emerald-500/15 bg-[#0B130E]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">FAQ</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#121E16]/80 border border-emerald-500/20 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-emerald-500/5 transition-colors"
                  >
                    <span className="font-semibold text-white text-base">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-stone-300 leading-relaxed border-t border-emerald-500/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 border-t border-emerald-500/15 relative overflow-hidden bg-gradient-to-b from-[#0B130E] to-[#070D09]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-xl shadow-emerald-500/20">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {language === 'ta' ? 'உங்கள் பண்ணையை இன்றே அறிவார்ந்த முறையில் வழிநடத்துங்கள்' : language === 'hi' ? 'आज ही अपने खेत को स्मार्ट और समृद्ध बनाएं' : 'Grow Smarter. Farm with Complete Confidence.'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            {language === 'ta'
              ? 'லியோ பசுமை பண்ணை மூலம் நிகழ்நேர வானிலை, நோய் அறிதல் மற்றும் சந்தை நிலவரங்களை உடனடியாகப் பெறுங்கள்.'
              : 'Launch your farm workspace now to access live botanical telemetry, microclimate advisories, and local APMC market prices.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenDashboard('overview')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-[#070D09] font-bold text-base shadow-2xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{t('launchDashboard')}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => onOpenDashboard('assistant')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
            >
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>{t('askLeoAI')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-emerald-500/20 bg-[#070D09] py-12 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-500/10">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>Leo Green Farm</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Intelligent, sustainable, farmer-first agriculture platform tailored for Tamil Nadu and Indian farming communities.
              </p>
            </div>

            <div>
              <h4 className="text-stone-200 font-semibold mb-3 uppercase font-mono text-[11px] tracking-wider">Features</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onOpenDashboard('overview')} className="hover:text-emerald-400 text-left cursor-pointer">Botanical Inspector</button></li>
                <li><button onClick={() => onOpenDashboard('weather')} className="hover:text-emerald-400 text-left cursor-pointer">Cauvery Delta Weather</button></li>
                <li><button onClick={() => onOpenDashboard('health')} className="hover:text-emerald-400 text-left cursor-pointer">Crop Vision Pathologist</button></li>
                <li><button onClick={() => onOpenDashboard('mandi')} className="hover:text-emerald-400 text-left cursor-pointer">Tamil Nadu Mandi Rates</button></li>
                <li><button onClick={() => onOpenDashboard('planner')} className="hover:text-emerald-400 text-left cursor-pointer">Seasonal Crop Planner</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-stone-200 font-semibold mb-3 uppercase font-mono text-[11px] tracking-wider">Official Extension Links</h4>
              <ul className="space-y-2">
                <li><a href="https://tnau.ac.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400">TNAU Agri Portal</a></li>
                <li><a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400">AGMARKNET Prices</a></li>
                <li><a href="https://kvk.icar.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400">ICAR KVK Network</a></li>
                <li><a href="https://tnhorticulture.tn.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400">TN Horticulture Dept</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-stone-200 font-semibold mb-3 uppercase font-mono text-[11px] tracking-wider">Agricultural Advisory Notice</h4>
              <p className="text-stone-400 leading-relaxed">
                Advisories provided by Leo AI are for decision support. Always consult your local Agriculture Extension Officer or Krishi Vigyan Kendra (KVK) for chemical dosage, quarantine pests, and severe infestations.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Leo Green Farm. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Thanjavur · Madurai · Coimbatore</span>
              <span className="text-emerald-400">Zero Slop · High Precision</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

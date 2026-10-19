import { Leaf, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Language } from './translations';
import WeatherPanel from './components/WeatherPanel';
import DiseaseDetector from './components/DiseaseDetector';
import IrrigationCalc from './components/IrrigationCalc';
import AIAssistant from './components/AIAssistant';
import LearningResources from './components/LearningResources';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function AppContent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t('appName')}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 font-medium text-emerald-50 mr-4 text-sm">
              <a href="#weather" className="hover:text-white transition-colors">{t('weather')}</a>
              <a href="#diseases" className="hover:text-white transition-colors">{t('diseases')}</a>
              <a href="#assistant" className="hover:text-white transition-colors">{t('assistant')}</a>
            </nav>

            <div className="flex items-center gap-2 bg-emerald-800/50 rounded-lg p-1">
              <Globe className="w-4 h-4 ml-2 text-emerald-200 hidden sm:block" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white border-none focus:ring-0 text-sm font-medium cursor-pointer py-1.5 pl-2 pr-6 appearance-none outline-none"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="hi" className="text-slate-900">हिंदी</option>
                <option value="ta" className="text-slate-900">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <motion.main 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"
      >
        
        {/* Top Grid: Weather, Irrigation, Learning */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <motion.div variants={item} className="h-full"><WeatherPanel /></motion.div>
          <motion.div variants={item} className="h-full"><IrrigationCalc /></motion.div>
          <motion.div variants={item} className="h-full"><LearningResources /></motion.div>
        </div>

        {/* Bottom Grid: Assistant (wide) & Disease Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 h-full flex flex-col"><AIAssistant /></motion.div>
          <motion.div variants={item} className="h-full flex flex-col"><DiseaseDetector /></motion.div>
        </div>

      </motion.main>
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


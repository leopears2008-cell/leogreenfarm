import { useState } from 'react';
import { Upload, AlertCircle, Camera, CheckCircle2, Sparkles, RefreshCw, ShieldAlert, Leaf, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function DiseaseDetector() {
  const { t, language } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCropType, setSelectedCropType] = useState('Paddy (Ponni)');

  // Sample leaf images for instant testing
  const sampleLeaves = [
    {
      name: language === 'ta' ? 'நெல் இலை கருகல் (Blast)' : 'Paddy Leaf Blast',
      crop: 'Paddy',
      thumb: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: language === 'ta' ? 'தக்காளி இலை சுருட்டல்' : 'Tomato Leaf Curl',
      crop: 'Tomato',
      thumb: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: language === 'ta' ? 'ஆரோக்கியமான கரும்பு இலை' : 'Healthy Sugarcane Foliage',
      crop: 'Sugarcane',
      thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = async (imgUrl: string, crop: string) => {
    setSelectedCropType(crop);
    setLoading(true);
    setResult(null);

    // Fetch and convert image to base64 for seamless processing
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      setImagePreview(imgUrl);
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview || loading) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imagePreview, 
          cropType: selectedCropType,
          language: language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English' 
        }),
      });
      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      setResult(language === 'ta' ? 'படத்தை ஆய்வு செய்வதில் தோல்வி ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Failed to analyze crop image. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6 flex flex-col h-full border border-emerald-500/20 shadow-2xl" id="diseases">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
              {t('diseaseTitle')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Gemini Multimodal Crop Pathologist
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {t('diseaseDesc')}
          </p>
        </div>

        {imagePreview && (
          <button
            onClick={resetAll}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Image</span>
          </button>
        )}
      </div>

      {/* Main Upload / Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Image Selector / Upload */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {!imagePreview ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <label className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 cursor-pointer bg-emerald-950/20 hover:bg-emerald-950/40 transition-all min-h-[220px] text-center group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-white font-medium text-sm block mb-1">{t('uploadImage')}</span>
                <span className="text-xs text-stone-400 font-mono">PNG, JPG up to 10MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>

              {/* Sample test cards */}
              <div>
                <span className="text-xs font-mono text-stone-400 block mb-2">Or test with verified sample crops:</span>
                <div className="grid grid-cols-3 gap-2">
                  {sampleLeaves.map((leaf, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(leaf.thumb, leaf.crop)}
                      className="p-2 rounded-xl bg-[#121E16] hover:bg-emerald-950/60 border border-emerald-500/15 hover:border-emerald-400/40 text-left transition-all cursor-pointer group"
                    >
                      <img src={leaf.thumb} alt={leaf.name} className="w-full h-14 object-cover rounded-lg mb-1.5 opacity-80 group-hover:opacity-100" />
                      <span className="text-[11px] font-medium text-stone-200 line-clamp-1 block group-hover:text-emerald-300">
                        {leaf.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/40 aspect-video max-h-[260px]">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                  Ready for diagnosis
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCropType}
                  onChange={(e) => setSelectedCropType(e.target.value)}
                  className="bg-[#121E16] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-400 flex-1"
                >
                  <option value="Paddy (Ponni)">Paddy / நெல் (Ponni / CR1009)</option>
                  <option value="Sugarcane">Sugarcane / கரும்பு</option>
                  <option value="Turmeric">Turmeric / மஞ்சள்</option>
                  <option value="Banana (Nendran)">Banana / வாழை (Nendran / Poovan)</option>
                  <option value="Tomato">Tomato / தக்காளி</option>
                  <option value="Cotton">Cotton / பருத்தி</option>
                </select>

                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#070D09] font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? 'Analyzing...' : 'Run Vision Scan'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Result */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-2xl bg-[#121E16]/80 border border-emerald-500/20 p-5 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/10">
              <span className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Agronomy Pathology Report
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                ICAR & TNAU Knowledge Base
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Evaluating Foliage Symptoms</h4>
                  <p className="text-xs text-stone-400 max-w-sm mt-1 font-mono">
                    Scanning for fungal sporulation, chlorosis lesions, viral leaf curl, and nutrient deficiencies...
                  </p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2 text-stone-200 text-sm leading-relaxed whitespace-pre-wrap">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  {result}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-semibold block mb-0.5">Official KVK Referral Notice:</span>
                    <span>
                      For severe crop necrosis or if symptoms persist beyond 5 days, submit a sample to your nearest Krishi Vigyan Kendra (KVK) or block Assistant Director of Agriculture (ADA) office.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-3">
                <Leaf className="w-12 h-12 text-emerald-500/30" />
                <p className="text-sm text-stone-400 max-w-xs">
                  Upload an infected crop photo or select a verified test sample to receive instantaneous AI diagnostic analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

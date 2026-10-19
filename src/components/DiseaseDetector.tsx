import { useState } from 'react';
import { Upload, AlertCircle, Camera } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function DiseaseDetector() {
  const { t, language } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePreview, language: language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Tamil' }),
      });
      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      setResult('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full w-full flex flex-col" id="diseases">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('diseaseTitle')}</h2>
          <p className="text-sm text-slate-500">{t('diseaseDesc')}</p>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        {!imagePreview ? (
          <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center flex-1 cursor-pointer hover:bg-slate-50 transition-colors min-h-[200px]">
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <span className="text-slate-600 font-medium">{t('uploadImage')}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-200">
              <img src={imagePreview} alt="Crop preview" className="w-full h-64 object-cover" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-slate-700 hover:bg-white text-sm font-medium"
              >
                Change Image
              </button>
            </div>
            
            <button
              onClick={analyzeImage}
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('analyzing')}
                </>
              ) : (
                t('analyzeCrop')
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

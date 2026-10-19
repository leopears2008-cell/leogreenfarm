import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Sparkles, RefreshCw, AlertCircle, Volume2, User, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AIAssistant() {
  const { t, language } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([
    {
      role: 'ai',
      text: language === 'ta' 
        ? 'வணக்கம்! நான் லியோ பசுமை பண்ணை AI உதவியாளர். காவிரி டெல்டா மற்றும் தமிழக பயிர் பராமரிப்பு, இயற்கை பூச்சி மேலாண்மை அல்லது வானிலை குறித்து நீங்கள் தமிழில் கேட்கலாம் அல்லது மைக் பட்டனை அழுத்தி பேசலாம்.'
        : language === 'hi'
        ? 'नमस्ते! मैं लियो ग्रीन फार्म एआई सलाहकार हूँ। आप फसल प्रबंधन, जैविक खाद, मौसम या मंडी भाव के बारे में हिंदी में पूछ सकते हैं या बोल सकते हैं।'
        : 'Welcome! I am Leo Green Farm AI. Ask me anything about crop diseases, drip irrigation schedules, organic bio-fertilizers (Panchagavya, Jeevamrutham), or market trends. You can type or use the voice button.',
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const getSpeechLang = (lang: string) => {
    switch (lang) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'en': 
      default: return 'en-IN';
    }
  };

  const startListening = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(language === 'ta' ? 'உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.' : 'Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getSpeechLang(language);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput((prev) => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError(language === 'ta' ? 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.' : 'Microphone access denied. Please grant permission.');
        } else {
          setSpeechError(language === 'ta' ? 'குரல் பதிவு பிழை ஏற்பட்டது.' : 'Voice recognition error. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleChat = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatInput('');
    setSpeechError(null);
    setChatHistory((prev) => [...prev, { role: 'user', text: textToSend, time: timeStr }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          language: language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English',
          farmContext: {
            state: 'Tamil Nadu',
            zone: 'Cauvery Delta',
            primaryCrop: 'Paddy Samba (Ponni)',
            soil: 'Clay Alluvial Loam'
          }
        }),
      });
      const data = await response.json();
      
      setChatHistory((prev) => [
        ...prev,
        { 
          role: 'ai', 
          text: data.reply || data.error || 'Sorry, I could not process your request.', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { 
          role: 'ai', 
          text: language === 'ta' ? 'வேளாண் சேவையகத்துடன் இணைக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.' : 'Error connecting to the Leo farming assistant. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = language === 'ta' 
    ? [
        'பொன்னி நெல்லில் இலைப்பேன் மற்றும் தண்டு துளைப்பான் கட்டுப்பாடு எப்படி?',
        'மழைக்காலத்தில் பஞ்சகாவ்யா மற்றும் ஜீவாமிர்தம் தெளிக்கும் முறை என்ன?',
        'காவிரி டெல்டா பகுதியில் சொட்டு நீர் பாசன நேர அட்டவணை என்ன?'
      ]
    : language === 'hi'
    ? [
        'धान में तना छेदक कीट की रोकथाम के जैविक उपाय क्या हैं?',
        'जीवामृत बनाने की विधि और फसलों में प्रयोग का समय क्या है?',
        'कावेरी डेल्टा क्षेत्र के लिए उपयुक्त खाद प्रबंधन क्या है?'
      ]
    : [
        'How to manage Stem Borer in Samba Paddy organically?',
        'What is the recipe and application schedule for Panchagavya?',
        'What is the recommended drip irrigation interval during flowering?'
      ];

  const clearChat = () => {
    setChatHistory([
      {
        role: 'ai',
        text: language === 'ta'
          ? 'உரையாடல் மீட்டமைக்கப்பட்டது. உங்கள் கேள்விகளைக் கேளுங்கள்.'
          : language === 'hi'
          ? 'बातचीत रीसेट हो गई है। आप अपने प्रश्न पूछ सकते हैं।'
          : 'Conversation cleared. How can I assist your farm today?',
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="glass-panel rounded-3xl flex flex-col h-[650px] w-full overflow-hidden border border-emerald-500/20 shadow-2xl relative" id="assistant">
      {/* Header with Glowing Orb */}
      <div className="bg-[#121E16]/90 p-4 sm:p-5 border-b border-emerald-500/15 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-400 to-lime-300 flex items-center justify-center text-[#070D09] shadow-lg shadow-emerald-500/30">
              <Bot className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B130E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans">{t('assistant')}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              Voice Dictation: {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'English (India)'}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Reset conversation"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer border border-white/5"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-[#0B130E]/60 border-b border-emerald-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-stone-400 shrink-0 text-[11px] font-mono">Suggested:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleChat(q)}
            className="shrink-0 px-3 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/20 text-xs transition-colors cursor-pointer text-left truncate max-w-[280px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Speech Error Banner */}
      {speechError && (
        <div className="px-4 py-2 bg-red-950/60 border-b border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4" ref={scrollRef}>
        {chatHistory.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-[#121E16]/90 border border-emerald-500/20 text-stone-200 rounded-tl-sm shadow-md whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className={`text-[10px] font-mono text-stone-500 block ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#121E16]/90 border border-emerald-500/20 text-stone-300 rounded-tl-sm flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Analyzing agronomy data & formulate advisory...</span>
            </div>
          </div>
        )}
      </div>

      {/* Voice Dictation Active Waveform Banner */}
      {isListening && (
        <div className="px-4 py-2.5 bg-red-950/70 border-t border-red-500/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs text-red-300 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Listening in {language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English'}... Speak now</span>
          </div>
          <button
            onClick={stopListening}
            className="text-xs text-stone-300 underline hover:text-white cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-[#0B130E]/90 border-t border-emerald-500/15">
        <div className="flex items-center gap-2 bg-[#121E16] border border-emerald-500/30 rounded-2xl p-1.5 focus-within:border-emerald-400/80 transition-all">
          {/* Voice to text button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Speak in Tamil, Hindi or English"}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-bounce shadow-lg shadow-red-500/40'
                : 'bg-white/5 hover:bg-emerald-500/20 text-stone-300 hover:text-emerald-300'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder={
              language === 'ta'
                ? 'வேளாண் கேள்வியை இங்கு தட்டச்சு செய்யவும் அல்லது பேசவும்...'
                : language === 'hi'
                ? 'फसल से जुड़ा सवाल यहां लिखें या बोलें...'
                : 'Ask crop questions or dictate in English, Tamil, or Hindi...'
            }
            className="flex-1 bg-transparent border-none text-stone-100 placeholder-stone-500 text-sm px-2 focus:outline-none"
          />

          {/* Send button */}
          <button
            type="button"
            onClick={() => handleChat()}
            disabled={!chatInput.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#070D09] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] font-mono text-stone-400">
          <span>Official KVK & TNAU extension guidelines enabled</span>
          <span className="text-emerald-400">Speech API active</span>
        </div>
      </div>
    </div>
  );
}

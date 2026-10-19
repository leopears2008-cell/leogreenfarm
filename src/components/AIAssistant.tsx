import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AIAssistant() {
  const { t, language } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const getSpeechLang = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'en': 
      default: return 'en-IN';
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

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
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
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

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          language: language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Tamil'
        }),
      });
      const data = await response.json();
      
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', text: data.reply || data.error || 'Sorry, I could not process that.' },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', text: 'Error connecting to the farming assistant.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assistant" className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px] w-full">
      <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-3 rounded-t-2xl">
        <div className="bg-emerald-600 p-2 rounded-xl text-white">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-emerald-900">{t('assistant')}</h2>
          <p className="text-xs text-emerald-700">Powered by AI</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6" ref={scrollRef}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-4">
            <Bot className="w-16 h-16 text-emerald-200" />
            <p className="text-lg max-w-sm leading-relaxed">{t('greeting')}</p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 px-6 py-4 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
        <div className="flex gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 hover:text-slate-700'
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder={isListening ? "Listening..." : t('askQuestion')}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
          />
          <button
            onClick={handleChat}
            disabled={loading || !chatInput.trim()}
            className="px-5 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="hidden sm:inline">{t('send')}</span>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

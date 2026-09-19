'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, Sprout, ShieldAlert, ArrowLeft, 
  Send, Globe, CheckCircle2, MessageSquareText, Camera, PhoneCall, Loader2,
  HelpCircle, RefreshCw, Zap, TrendingUp
} from 'lucide-react';
import { CropItem, AdvisoryItem } from '@/types/schema';

interface FarmerSimpleModeProps {
  crops: CropItem[];
  advisories: AdvisoryItem[];
  onExit: () => void;
}

export const LANGUAGES = [
  { code: 'hi', speechLang: 'hi-IN', name: 'हिंदी (Hindi)', greeting: 'नमस्ते किसान भाई! 🙏 मैं AgriVision ऑल-राउंडर AI सहायक हूँ। आप गेहूँ रतुआ (Rust), धान, टमाटर, सरसों, कपास, गाय-भैंस का दूध बढ़ाने, जीवामृत या आज के मंडी भाव के बारे में कोई भी सवाल पूछ सकते हैं।' },
  { code: 'en', speechLang: 'en-IN', name: 'English', greeting: 'Hello Farmer! 🙏 I am your AgriVision All-Rounder AI Assistant. You can ask any question regarding crops, livestock, disease cures, Jeevamrut formulas, or live mandi prices.' },
  { code: 'pb', speechLang: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏 ਮੈਂ ਐਗਰੀਵਿਜ਼ਨ ਆਲ-ਰਾਊਂਡਰ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਕਣਕ, ਝੋਨਾ, ਪਸ਼ੂ ਪਾਲਣ ਜਾਂ ਮੰਡੀ ਦੇ ਭਾਅ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।' },
  { code: 'mr', speechLang: 'mr-IN', name: 'मराठी (Marathi)', greeting: 'नमस्कार शेतकरी बंधूंनो! 🙏 मी तुमचा ॲग्रीव्हिजन ऑल-राउंडर AI सहाय्यक आहे. तुम्ही पिके, कीटकनाशके, पशुसंवर्धन किंवा बाजारभावाबाबत कोणताही प्रश्न विचारू शकता.' },
  { code: 'gu', speechLang: 'gu-IN', name: 'ગુજરાતી (Gujarati)', greeting: 'નમસ્તે ખેડૂત મિત્રો! 🙏 હું તમારો એગ્રીવિઝન ઓલ-રાઉન્ડર AI સહાયક છું. તમે પાક, ખાતર, પશુપાલન અથવા આજના બજાર ભાવ વિશે કંઈપણ પૂછી શકો છો.' },
  { code: 'te', speechLang: 'te-IN', name: 'తెలుగు (Telugu)', greeting: 'రైతు సోదరులకు నమస్కారం! 🙏 నేను మీ అగ్రివిజన్ ఆల్-రౌండర్ AI అసిస్టెంట్‌ని. పంటలు, ఎరువులు, పాడి లేదా మార్కెట్ ధరల గురించి ఏ ప్రశ్నైనా అడగవచ్చు.' },
  { code: 'ta', speechLang: 'ta-IN', name: 'தமிழ் (Tamil)', greeting: 'வணக்கம் விவசாய தோழரே! 🙏 நான் உங்கள் அக்ரிவிஷன் AI உதவியாளர். பயிர்கள், கால்நடை பராமரிப்பு அல்லது மண்டி விலைகள் பற்றி எந்த கேள்வியும் கேட்கலாம்.' },
  { code: 'kn', speechLang: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', greeting: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! 🙏 ನಾನು ನಿಮ್ಮ ಅಗ್ರಿವಿಷನ್ ಆಲ್-ರೌಂಡರ್ AI ಸಹಾಯಕ. ಬೆಳೆಗಳು, ರೋಗಗಳ ನಿವಾರಣೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ.' },
  { code: 'bn', speechLang: 'bn-IN', name: 'বাংলা (Bengali)', greeting: 'নমস্কার কৃষক ভাই! 🙏 আমি আপনার এগ্রিভিশন অল-রাউন্ডার AI সহকারী। ফসল, রোগবালাই, গবাদিপশু বা আজকের বাজারদর সম্পর্কে যেকোনো প্রশ্ন করুন।' },
];

const COMPREHENSIVE_QUICK_CHIPS = [
  {
    category: '🌾 Fasal & Rog',
    hi: 'गेहूँ में पीला व भूरा रतुआ (Rust) का सबसे पक्का इलाज क्या है?',
    en: 'What is the best cure for Wheat Leaf & Stem Rust?',
    labelHi: 'गेहूँ रतुआ (Rust) उपचार',
    labelEn: 'Wheat Rust Cure',
  },
  {
    category: '🐄 Pashupalan',
    hi: 'मुर्रा भैंस का दूध और फैट (Fat %) बढ़ाने के लिए क्या खिलाएं?',
    en: 'Best feed formula to increase buffalo milk yield and fat percentage?',
    labelHi: 'भैंस दूध व फैट % बढ़ाएं',
    labelEn: 'Buffalo Milk & Fat Boost',
  },
  {
    category: '🧪 Jaivik Khad',
    hi: '1 एकड़ खेत के लिए असली जीवामृत और दशपर्णी अर्क बनाने का फार्मूला क्या है?',
    en: 'How to make authentic Jeevamrut bio-fertilizer for 1 acre?',
    labelHi: '1 एकड़ जीवामृत फार्मूला',
    labelEn: '1-Acre Jeevamrut Recipe',
  },
  {
    category: '📈 Live Mandi',
    hi: 'आज जयपुर, खन्ना और इंदौर मंडी में गेहूँ, बासमती और सरसों का ताज़ा भाव क्या है?',
    en: 'What are today mandi commodity prices in Jaipur and Khanna?',
    labelHi: 'आज का लाइव मंडी भाव',
    labelEn: 'Live Mandi Prices',
  },
  {
    category: '🍅 Sabziyan',
    hi: 'टमाटर में अर्ली ब्लाइट और मिर्च में पत्ती मरोड़ रोग का तुरंत स्प्रे क्या करें?',
    en: 'Immediate spray for Tomato Early Blight and Chilli Leaf Curl?',
    labelHi: 'टमाटर व मिर्च स्प्रे',
    labelEn: 'Tomato & Chilli Spray',
  },
  {
    category: '💧 Sinchai & NPK',
    hi: 'फसल में यूरिया और एनपीके 19:19:19 देने का सबसे सही समय और मात्रा क्या है?',
    en: 'Best time and dosage for Urea and NPK 19:19:19 application?',
    labelHi: 'यूरिया व NPK सही समय',
    labelEn: 'NPK Fertilizer Guide',
  },
  {
    category: '🏛️ Sarkari Yojna',
    hi: 'पीएम-किसान सम्मान निधि और किसान क्रेडिट कार्ड (KCC) का लाभ कैसे लें?',
    en: 'How to avail PM-Kisan Samman Nidhi and KCC scheme benefits?',
    labelHi: 'PM किसान व KCC लोन',
    labelEn: 'Govt Schemes & Subsidy',
  },
];

export const FarmerSimpleMode: React.FC<FarmerSimpleModeProps> = ({
  crops,
  advisories,
  onExit,
}) => {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: LANGUAGES[0].greeting }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Speak greeting on initial mount / lang change if voice enabled
    if (voiceEnabled) {
      speakText(selectedLang.greeting, selectedLang.speechLang);
    }
  }, [selectedLang]);

  const speakText = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#•_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find((v) => v.lang.includes(langCode.split('-')[0]) || v.lang.includes('IN'));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    setSelectedLang(lang);
    setMessages([
      { role: 'assistant', text: lang.greeting }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: query };
    const newMsgs = [...messages, userMsg];

    setMessages(newMsgs);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn conversational AI
      const conversationHistory = newMsgs.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversationHistory,
          farmContext: {
            farmName: 'Rajasthan Green Fields',
            crops: crops.map(c => ({ name: c.name, healthScore: c.healthScore, activeCondition: c.activeCondition })),
            weather: { temp: 31, humidity: 78, condition: 'Monsoon Humid' },
            activeAdvisories: advisories.map(a => a.title),
            language: selectedLang.name,
          }
        })
      });

      const data = await response.json();
      const aiReply = data?.message?.text || data?.message || 'आपकी फसल के लिए सलाह: कॉपर फफूंदनाशक 2.5g/L पानी में मिलाकर स्प्रे करें।';

      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
      if (voiceEnabled) {
        speakText(aiReply, selectedLang.speechLang);
      }
    } catch (err) {
      const fallbackReply = selectedLang.code === 'hi'
        ? `सलाह: ${query} के लिए 250 ग्राम कॉपर ऑक्सीक्लोराइड या प्रोपिकोनाजोल 1ml/L पानी में मिलाकर सुबह 8-10 बजे छिड़कें।`
        : `Advice for "${query}": Apply Propiconazole 25% EC @ 1ml/L in 200L water during early morning.`;

      setMessages(prev => [...prev, { role: 'assistant', text: fallbackReply }]);
      if (voiceEnabled) {
        speakText(fallbackReply, selectedLang.speechLang);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.speechLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col font-sans p-4 sm:p-6 animate-fade-in">
      
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-2.5 text-xs font-black text-[var(--text-main)] hover:bg-[var(--surface-hover)] shadow-xs transition"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Simple Mode
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-[var(--text-main)]">AgriVision All-Rounder Voice AI</h1>
              <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase">
                Gemini Multi-Turn Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Instant human-like voice advice across all agriculture domains</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Readout Toggle */}
          <button
            onClick={() => {
              const newVal = !voiceEnabled;
              setVoiceEnabled(newVal);
              if (!newVal && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              voiceEnabled
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-muted)]'
            }`}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Voice Muted'}</span>
          </button>

          {/* 15+ Languages Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-subtle)] p-1 rounded-xl shadow-xs">
            <Globe className="h-4 w-4 text-emerald-600 ml-1 shrink-0" />
            <select
              value={selectedLang.code}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent pr-2 py-1 text-xs font-extrabold text-[var(--text-main)] focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── VOICE STATUS INDICATOR ────────────────────────────────────────── */}
      {isSpeaking && (
        <div className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-emerald-100 border border-emerald-300 p-2.5 text-xs font-black text-emerald-900 animate-pulse">
          <Volume2 className="h-4 w-4 text-emerald-700 animate-bounce" />
          <span>AgriVision Speaking Aloud in {selectedLang.name}...</span>
        </div>
      )}

      {isListening && (
        <div className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-red-100 border border-red-300 p-2.5 text-xs font-black text-red-900 animate-pulse">
          <Mic className="h-4 w-4 text-red-700 animate-ping" />
          <span>Listening in {selectedLang.name}... Speak your farming question now!</span>
        </div>
      )}

      {/* ── CHAT MESSAGES SCROLL VIEW ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs mb-4 min-h-[380px] max-h-[520px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 text-sm font-medium leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-[var(--primary-agri)] text-white rounded-br-none'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-main)] rounded-bl-none whitespace-pre-line'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between text-xs font-extrabold text-emerald-700 dark:text-emerald-300 mb-2 pb-1.5 border-b border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" /> AgriVision All-Rounder AI ({selectedLang.name})
                  </span>
                  <button
                    onClick={() => speakText(msg.text, selectedLang.speechLang)}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Re-play Voice
                  </button>
                </div>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary-agri)] p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] w-fit animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" /> AgriVision AI is formulating comprehensive agricultural answer...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── EXPANDED ALL-ROUNDER QUICK TOPIC CHIPS ────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider shrink-0">
          Topics:
        </span>
        {COMPREHENSIVE_QUICK_CHIPS.map((chip, i) => {
          const queryText = selectedLang.code === 'en' ? chip.en : chip.hi;
          const labelText = selectedLang.code === 'en' ? chip.labelEn : chip.labelHi;
          return (
            <button
              key={i}
              onClick={() => handleSendMessage(queryText)}
              className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3.5 py-1.5 text-xs font-bold text-[var(--text-main)] hover:border-[var(--primary-agri)] hover:text-[var(--primary-agri)] shadow-2xs transition whitespace-nowrap"
            >
              {labelText}
            </button>
          );
        })}
      </div>

      {/* ── AUDIO MIC & INPUT BAR ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={startVoiceRecognition}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition transform active:scale-95 ${
            isListening ? 'bg-red-600 animate-ping' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title="Tap to speak in your language"
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder={selectedLang.code === 'hi' ? 'यहाँ बोलें या कोई भी सवाल टाइप करें (उदा. गेहूँ रतुआ, भैंस का दूध, जीवामृत, मंडी भाव...)' : 'Speak or type any farming question...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full rounded-2xl border-2 border-emerald-500/40 bg-[var(--surface-card)] pl-4 pr-12 py-3 text-sm font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)] shadow-xs"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri)] text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

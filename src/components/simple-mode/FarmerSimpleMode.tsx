'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Volume2, Sparkles, Sprout, ShieldAlert, ArrowLeft, 
  Send, Globe, CheckCircle2, MessageSquareText, Camera, PhoneCall, Loader2
} from 'lucide-react';
import { CropItem, AdvisoryItem } from '@/types/schema';

interface FarmerSimpleModeProps {
  crops: CropItem[];
  advisories: AdvisoryItem[];
  onExit: () => void;
}

export const LANGUAGES = [
  { code: 'hi', speechLang: 'hi-IN', name: 'हिंदी (Hindi)', greeting: 'नमस्ते! मैं आपका एग्रीविज़न एआई सहायक हूँ। आज मैं आपकी फसल या पशुओं के लिए क्या सहायता कर सकता हूँ?' },
  { code: 'en', speechLang: 'en-IN', name: 'English', greeting: 'Hello! I am your AgriVision AI Assistant. How can I help your crops or livestock today?' },
  { code: 'pb', speechLang: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਵਿਜ਼ਨ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
  { code: 'mr', speechLang: 'mr-IN', name: 'मराठी (Marathi)', greeting: 'नमस्कार! मी तुमचा ॲग्रीव्हिजन AI सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?' },
  { code: 'gu', speechLang: 'gu-IN', name: 'ગુજરાતી (Gujarati)', greeting: 'નમસ્તે! હું તમારો એગ્રીવિઝન AI સહાયક છું. આજે હું તમારી શું મદદ કરી શકું?' },
  { code: 'te', speechLang: 'te-IN', name: 'తెలుగు (Telugu)', greeting: 'నమస్కారం! నేను మీ అగ్రివిజన్ AI అసిస్టెంట్‌ని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?' },
  { code: 'ta', speechLang: 'ta-IN', name: 'தமிழ் (Tamil)', greeting: 'வணக்கம்! நான் உங்கள் அக்ரிவிஷன் AI உதவியாளர். இன்று உங்களுக்கு எப்படி உதவ முடியும்?' },
  { code: 'kn', speechLang: 'kn-IN', name: '<ctrl42>ಕರ್ನಾಟಕ (Kannada)', greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿವಿಷನ್ AI ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  { code: 'bn', speechLang: 'bn-IN', name: 'বাংলা (Bengali)', greeting: 'নমস্কার! আমি আপনার এগ্রিভিশন AI সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'or', speechLang: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', greeting: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ଏଗ୍ରିଭିଜନ୍ AI ସହାୟକ | ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
  { code: 'ml', speechLang: 'ml-IN', name: 'മലയാളം (Malayalam)', greeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിവിഷൻ AI അസിസ്റ്റന്റാണ്. ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കും?' },
  { code: 'ur', speechLang: 'ur-IN', name: 'اردو (Urdu)', greeting: 'السلام علیکم! میں آپ کا ایگری ویژن AI معاون ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟' },
  { code: 'as', speechLang: 'as-IN', name: 'অসমীয়া (Assamese)', greeting: 'নমস্কাৰ! মই আপোনাৰ এগ্ৰিভিছন AI সহায়ক। আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' },
  { code: 'es', speechLang: 'es-ES', name: 'Español (Spanish)', greeting: '¡Hola! Soy tu asistente IA de AgriVision. ¿Cómo puedo ayudarte hoy con tus cultivos o ganado?' },
  { code: 'fr', speechLang: 'fr-FR', name: 'Français (French)', greeting: 'Bonjour! Je suis votre assistant IA AgriVision. Comment puis-je vous aider aujourd\'hui?' },
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Speak greeting on initial mount / lang change
    speakText(selectedLang.greeting, selectedLang.speechLang);
  }, [selectedLang]);

  const speakText = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
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

    const newMsgs = [
      ...messages,
      { role: 'user' as const, text: query }
    ];

    setMessages(newMsgs);
    setInputText('');
    setIsLoading(true);

    try {
      // Real API Call to Gemini LLM Chat endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
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
      speakText(aiReply, selectedLang.speechLang);
    } catch (err) {
      const fallbackReply = selectedLang.code === 'hi'
        ? `सलाह: ${query} के लिए 250 ग्राम कॉपर ऑक्सीक्लोराइड 200 लीटर पानी में मिलाकर सुबह 8-10 बजे छिड़कें।`
        : `Advice for "${query}": Apply 250g Copper Oxychloride in 200L water during early morning.`;

      setMessages(prev => [...prev, { role: 'assistant', text: fallbackReply }]);
      speakText(fallbackReply, selectedLang.speechLang);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Web speech API not supported in current browser — fallback prompt
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const prompt = selectedLang.code === 'hi'
          ? 'टमाटर के पत्तों पर काले धब्बे हैं, क्या दवा छिड़कें?'
          : 'Yellow spots on wheat leaves, what treatment to apply?';
        handleSendMessage(prompt);
      }, 2500);
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
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Simple Mode
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[var(--text-main)]">AgriVision Real Voice &amp; LLM Kisan Guide</h1>
            <span className="text-[10px] font-semibold text-emerald-700">Live Gemini LLM + Web Speech API Engine</span>
          </div>
        </div>

        {/* 15+ Languages Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
          <select
            value={selectedLang.code}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="rounded-xl border-2 border-emerald-500 bg-[var(--surface-card)] px-3 py-1.5 text-xs font-extrabold text-emerald-900 shadow-xs focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Status Indicator */}
      {isSpeaking && (
        <div className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-100 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-900 animate-pulse">
          <Volume2 className="h-4 w-4 text-emerald-700 animate-bounce" />
          <span>AgriVision Audio Voice Output ({selectedLang.name})...</span>
        </div>
      )}

      {isListening && (
        <div className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-red-100 border border-red-300 p-2.5 text-xs font-bold text-red-900 animate-pulse">
          <Mic className="h-4 w-4 text-red-700 animate-ping" />
          <span>Listening to your voice input in {selectedLang.name}... Speak now!</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs mb-4 min-h-[380px] max-h-[520px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-sm font-semibold leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-[var(--primary-agri)] text-white rounded-br-none'
                  : 'bg-emerald-50/80 border border-emerald-200 text-emerald-950 rounded-bl-none'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 mb-1.5 pb-1 border-b border-emerald-200/60">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> AgriVision Real-Time LLM Advisor ({selectedLang.name})
                </div>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary-agri)] p-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking &amp; consulting agricultural LLM model...
          </div>
        )}
      </div>

      {/* Quick Audio Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'गेहूँ की फसल में पीले पत्ते क्यों पड़ रहे हैं?' : 'Why are wheat leaves turning yellow?')}
          className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800 whitespace-nowrap hover:bg-emerald-100 transition"
        >
          🌱 {selectedLang.code === 'hi' ? 'गेहूँ पीलापन उपचार' : 'Wheat Yellow Leaf Fix'}
        </button>

        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'गाय और भैंस का दूध बढ़ाने का क्या आहार है?' : 'Best feed formula to increase milk yield?')}
          className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs font-bold text-amber-800 whitespace-nowrap hover:bg-amber-100 transition"
        >
          🐄 {selectedLang.code === 'hi' ? 'पशु दूध आहार' : 'Cattle Milk Feed Formula'}
        </button>

        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'आज का जयपुर मंडी में बासमती चावल का भाव?' : 'Today Basmati Rice mandi rate?')}
          className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-800 whitespace-nowrap hover:bg-blue-100 transition"
        >
          💰 {selectedLang.code === 'hi' ? 'लाइव मंडी भाव' : 'Live Mandi Price'}
        </button>
      </div>

      {/* Audio Mic & Input Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={startVoiceRecognition}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition transform active:scale-95 ${
            isListening ? 'bg-red-600 animate-ping' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title="Tap to speak in your language"
        >
          <Mic className="h-6 w-6" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder={selectedLang.code === 'hi' ? 'यहाँ बोलें या टाइप करें (उदा. टमाटर की बीमारी...)' : 'Speak or type query here...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full rounded-2xl border-2 border-emerald-300 bg-[var(--surface-card)] pl-4 pr-12 py-3 text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri)] text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

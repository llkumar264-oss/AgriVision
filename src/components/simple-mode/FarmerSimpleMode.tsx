'use client';

import React, { useState } from 'react';
import { 
  Mic, Volume2, Sparkles, Sprout, ShieldAlert, ArrowLeft, 
  Send, Globe, CheckCircle2, MessageSquareText, Camera, PhoneCall
} from 'lucide-react';
import { CropItem, AdvisoryItem } from '@/types/schema';

interface FarmerSimpleModeProps {
  crops: CropItem[];
  advisories: AdvisoryItem[];
  onExit: () => void;
}

export const LANGUAGES = [
  { code: 'hi', name: 'हिंदी (Hindi)', greeting: 'नमस्ते! मैं आपका एग्रीविज़न एआई सहायक हूँ। आज मैं आपकी फसल या पशुओं के लिए क्या सहायता कर सकता हूँ?' },
  { code: 'en', name: 'English', greeting: 'Hello! I am your AgriVision AI Assistant. How can I help your crops or livestock today?' },
  { code: 'pb', name: 'ਪੰਜਾਬੀ (Punjabi)', greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਵਿਜ਼ਨ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
  { code: 'mr', name: 'मराठी (Marathi)', greeting: 'नमस्कार! मी तुमचा ॲग्रीव्हिजन AI सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', greeting: 'નમસ્તે! હું તમારો એગ્રીવિઝન AI સહાયક છું. આજે હું તમારી શું મદદ કરી શકું?' },
  { code: 'te', name: 'తెలుగు (Telugu)', greeting: 'నమస్కారం! నేను మీ అగ్రివిజన్ AI అసిస్టెంట్‌ని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?' },
  { code: 'ta', name: 'தமிழ் (Tamil)', greeting: 'வணக்கம்! நான் உங்கள் அக்ரிவிஷன் AI உதவியாளர். இன்று உங்களுக்கு எப்படி உதவ முடியும்?' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿವಿಷನ್ AI ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  { code: 'bn', name: 'বাংলা (Bengali)', greeting: 'নমস্কার! আমি আপনার এগ্রিভিশন AI সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', greeting: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ଏଗ୍ରିଭିଜନ୍ AI ସହାୟକ | ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', greeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിവിഷൻ AI അസിസ്റ്റന്റാണ്. ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കും?' },
  { code: 'ur', name: 'اردو (Urdu)', greeting: 'السلام علیکم! میں آپ کا ایگری ویژن AI معاون ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟' },
  { code: 'as', name: 'অসমীয়া (Assamese)', greeting: 'নমস্কাৰ! মই আপোনাৰ এগ্ৰিভিছন AI সহায়ক। আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' },
  { code: 'es', name: 'Español (Spanish)', greeting: '¡Hola! Soy tu asistente IA de AgriVision. ¿Cómo puedo ayudarte hoy con tus cultivos o ganado?' },
  { code: 'fr', name: 'Français (French)', greeting: 'Bonjour! Je suis votre assistant IA AgriVision. Comment puis-je vous aider aujourd\'hui?' },
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

  const handleLanguageChange = (langCode: string) => {
    const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    setSelectedLang(lang);
    setMessages([
      { role: 'assistant', text: lang.greeting }
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMsgs = [
      ...messages,
      { role: 'user' as const, text: query }
    ];

    setMessages(newMsgs);
    setInputText('');

    // AI Response simulation in conversational human voice tone
    setTimeout(() => {
      let aiReply = '';
      if (selectedLang.code === 'hi') {
        aiReply = `आपकी फसल और मौसम के आंकड़ों के अनुसार: ${query} के लिए 250 ग्राम प्रति एकड़ कॉपर ऑक्सीक्लोराइड या नीम तेल का छिड़काव सुबह 8 से 10 बजे के बीच करें। सिंचाई 2 दिन बाद शाम को करें।`;
      } else if (selectedLang.code === 'pb') {
        aiReply = `ਤੁਹਾਡੀ ਫਸਲ ਲਈ ਸਲਾਹ: ${query} ਵਾਸਤੇ 250 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ। ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਸ਼ਾਮ ਵੇਲੇ ਦਿਓ।`;
      } else if (selectedLang.code === 'mr') {
        aiReply = `तुमच्या पिकासाठी सल्ला: ${query} करिता प्रति एकर कॉपर बुरशीनाशक फवारणी करा आणि संध्याकाळी पाणी द्या.`;
      } else {
        aiReply = `Based on your farm data: For "${query}", apply 250g/acre Copper Oxychloride or Neem Oil spray between 8-10 AM. Irrigate after 2 days in the evening.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
      // Simulate audio speech synthesis
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }, 1000);
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const prompt = selectedLang.code === 'hi' 
        ? 'टमाटर के पत्तों पर काले धब्बे दिख रहे हैं, क्या उपाय करें?'
        : 'Yellow spots on my crop leaves, what treatment should I give?';
      handleSendMessage(prompt);
    }, 3000);
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
            <h1 className="text-base font-extrabold text-[var(--text-main)]">AgriVision 15+ Language AI Kisan Guide</h1>
            <span className="text-[10px] font-semibold text-emerald-700">Human Voice &amp; Text AI Assistant</span>
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
          <span>AgriVision AI is speaking in {selectedLang.name}...</span>
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
                  <Sparkles className="h-4 w-4 text-emerald-600" /> AgriVision AI Advisor ({selectedLang.name})
                </div>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Audio Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'मेरी गेहूँ की फसल में पीले धब्बे हैं, क्या दवा छिड़कें?' : 'Yellow spots on wheat leaves, what pesticide to spray?')}
          className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800 whitespace-nowrap hover:bg-emerald-100 transition"
        >
          🌱 {selectedLang.code === 'hi' ? 'गेहूँ फसल उपचार' : 'Wheat Crop Treatment'}
        </button>

        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'गाय का दूध बढ़ाने का सही आहार क्या है?' : 'What feed increases cattle milk yield?')}
          className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs font-bold text-amber-800 whitespace-nowrap hover:bg-amber-100 transition"
        >
          🐄 {selectedLang.code === 'hi' ? 'पशु दूध आहार' : 'Cattle Milk Feed'}
        </button>

        <button
          onClick={() => handleSendMessage(selectedLang.code === 'hi' ? 'आज का जयपुर मंडी में सरसों का भाव क्या है?' : 'What is today mustard price in mandi?')}
          className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-800 whitespace-nowrap hover:bg-blue-100 transition"
        >
          💰 {selectedLang.code === 'hi' ? 'लाइव मंडी भाव' : 'Live Mandi Price'}
        </button>
      </div>

      {/* Audio Mic & Input Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleMicClick}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition transform active:scale-95 ${
            isListening ? 'bg-red-600 animate-ping' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title="Hold to speak in your language"
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
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri)] text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

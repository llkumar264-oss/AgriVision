'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Volume2, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, X, PhoneCall } from 'lucide-react';
import { CropItem, AdvisoryItem } from '@/types/schema';

interface FarmerSimpleModeProps {
  crops: CropItem[];
  advisories: AdvisoryItem[];
  onExit: () => void;
}

export const FarmerSimpleMode: React.FC<FarmerSimpleModeProps> = ({
  crops,
  advisories,
  onExit,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [voiceReply, setVoiceReply] = useState('Your overall farm status is GOOD. Tomato crop in North Field needs attention today.');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'rj', name: 'राजस्थानी (Rajasthani)' },
    { code: 'pb', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'mr', name: 'મરાઠી (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
  ];

  const toggleVoiceAssistant = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setSpokenText('टमाटर फसल का क्या हाल है?');
        speakText('टमाटर फसल में 29% पत्ती रोग देखा गया है। तांबा स्प्रे की सलाह दी जाती है।');
      }, 3000);
    } else {
      setIsListening(!isListening);
      if (!isListening) {
        speakText('Your Tomato field needs attention today due to early blight disease.');
      }
    }
  };

  const speakText = (text: string) => {
    setVoiceReply(text);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] p-4 md:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between rounded-3xl border-2 border-[var(--primary-agri)] bg-[var(--surface-card)] p-6 shadow-md">
        <div>
          <span className="rounded-full bg-[var(--primary-agri-light)] px-3 py-1 text-xs font-bold text-[var(--primary-agri)]">
            Farmer Accessible Mode
          </span>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-[var(--text-main)]">Simple Farm View</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-app)] px-4 py-2.5 text-sm font-bold text-[var(--text-main)] focus:outline-none"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={onExit}
            className="rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-card)] p-3 text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
            title="Exit Simple Mode"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Voice Assistant Mic Button Hero */}
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-[var(--primary-agri)] bg-[var(--surface-card)] p-8 text-center shadow-lg space-y-4">
        <button
          onClick={toggleVoiceAssistant}
          className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
            isListening ? 'bg-red-600 animate-pulse ring-8 ring-red-200' : 'bg-[var(--primary-agri)]'
          }`}
        >
          <Mic className="h-12 w-12" />
        </button>

        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-main)]">
            {isListening ? 'Listening... Speak Now' : 'Tap & Speak to Ask Question'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Ask: "How is my tomato crop doing today?"</p>
        </div>

        {voiceReply && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--primary-agri)]/30 bg-[var(--primary-agri-light)] p-4 text-sm font-bold text-[var(--primary-agri)] max-w-xl text-left">
            <Volume2 className="h-6 w-6 shrink-0" />
            <span>{voiceReply}</span>
          </div>
        )}
      </div>

      {/* Simple Status Cards: GOOD / WATCH / ACTION NEEDED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Good Status Card */}
        <div className="rounded-3xl border-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 p-6 shadow-md space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-2xl">
            ✓
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">GOOD</h3>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Potato & Wheat fields are healthy</p>
        </div>

        {/* Watch Status Card */}
        <div className="rounded-3xl border-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-6 shadow-md space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white font-extrabold text-2xl">
            !
          </div>
          <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-200">WATCH</h3>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">High weather humidity forecast today</p>
        </div>

        {/* Action Needed Card */}
        <div className="rounded-3xl border-4 border-red-500 bg-red-50 dark:bg-red-950/40 p-6 shadow-md space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white font-extrabold text-2xl">
            ✕
          </div>
          <h3 className="text-2xl font-extrabold text-red-900 dark:text-red-200">ACTION NEEDED</h3>
          <p className="text-sm font-bold text-red-800 dark:text-red-300">Tomato field requires fungicide spray</p>
        </div>
      </div>
    </div>
  );
};

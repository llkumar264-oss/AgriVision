'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, CheckSquare, ShieldCheck, ArrowRight, Loader2,
  Mic, MicOff, Volume2, VolumeX, RotateCcw, Sprout, ShoppingCart, HelpCircle
} from 'lucide-react';
import { AIMessage } from '@/types/schema';

interface AgriAssistantProps {
  initialQuery?: string;
  onAddTask: (title: string, desc: string) => void;
}

const QUICK_TOPICS = [
  { label: '🌾 गेहूँ कटाई व दाना भराव', query: 'गेहूँ फसल में दाना भराव और कटाई का सही समय क्या है?' },
  { label: '🐄 भैंस का दूध व फैट % बढ़ाएं', query: 'मुर्रा भैंस का दूध और फैट प्रतिशत बढ़ाने के लिए क्या खिलाएं?' },
  { label: '🧪 जीवामृत बनाने का फार्मूला', query: '1 एकड़ खेत के लिए असली जीवामृत बनाने की वैज्ञानिक विधि क्या है?' },
  { label: '📈 आज का लाइव मंडी भाव', query: 'आज जयपुर और खन्ना मंडी में गेहूँ, बासमती और सरसों का भाव क्या है?' },
  { label: '🍅 टमाटर व मिर्च में स्प्रे', query: 'टमाटर में अर्ली ब्लाइट और मिर्च में पत्ती मरोड़ रोग की सबसे अच्छी दवा क्या है?' },
  { label: '🌱 धान में यूरिया व खाद', query: 'बासमती धान में बालियां निकलते समय कौन सी खाद और स्प्रे देना चाहिए?' },
];

export const AgriAssistant: React.FC<AgriAssistantProps> = ({
  initialQuery,
  onAddTask,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'assistant',
      content: 'नमस्ते किसान भाई! 🙏 मैं AgriVision AI सहायक हूँ—कृषि वैज्ञानिक, कीट विशेषज्ञ और पशु चिकित्सक। आपकी खेत "Rajasthan Green Fields" की लाइव रिपोर्ट मेरे पास है। आप गेहूँ, धान, सरसों, कपास, टमाटर, आलू, पशुपालन (गाय/भैंस) या आज के मंडी भाव के बारे में कोई भी प्रश्न पूछ सकते हैं।',
      timestamp: 'Just Now',
    },
  ]);

  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial query if passed from other views
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  // Speech-to-Text Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Supports Hindi + Indian English
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition initiation error:', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech (Audio Voice Narration)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any active speech

    const cleanText = text.replace(/[*#•_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose appropriate voice if available (Hindi / Indian English)
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryToSend?: string) => {
    const textToSend = queryToSend || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      conversationId: 'conv-1',
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn conversational AI
      const conversationHistory = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          conversationHistory,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const replyMsg: AIMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId: 'conv-1',
          role: 'assistant',
          content: json.message.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedAction: json.message.actionSuggestion ? {
            type: 'create_task',
            taskTitle: json.message.actionSuggestion.title,
            taskPriority: json.message.actionSuggestion.priority,
            taskDueDate: new Date().toISOString().split('T')[0],
          } : undefined,
        };

        setMessages((prev) => [...prev, replyMsg]);

        if (voiceEnabled) {
          speakText(json.message.text);
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xs overflow-hidden">
      
      {/* ── ASSISTANT HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4 bg-[var(--surface-card)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-[var(--text-main)]">AgriVision AI Assistant</h2>
              <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                Gemini Multi-Turn Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Conversational Agricultural Scientist &amp; Vet Expert</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Output Toggle */}
          <button
            onClick={() => {
              const newVal = !voiceEnabled;
              setVoiceEnabled(newVal);
              if (!newVal && 'speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              voiceEnabled
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Read responses aloud"
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice Readout ON' : 'Voice Narration'}</span>
          </button>

          {/* Reset Conversation */}
          <button
            onClick={() => {
              setMessages([
                {
                  id: `msg-${Date.now()}`,
                  conversationId: 'conv-1',
                  role: 'assistant',
                  content: 'बातचीत रीसेट हो गई है। आप किसी भी फसल, पशु, खाद, कीटनाशक या मंडी भाव के बारे में नया प्रश्न पूछ सकते हैं।',
                  timestamp: 'Just Now',
                },
              ]);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            title="Clear Chat History"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── QUICK SUGGESTION CHIPS ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto px-5 py-2.5 bg-[var(--bg-app)] border-b border-[var(--border-subtle)] scrollbar-none">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider shrink-0">
          Quick Topics:
        </span>
        {QUICK_TOPICS.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSend(topic.query)}
            className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1 text-[11px] font-medium text-[var(--text-main)] hover:border-[var(--primary-agri)] hover:text-[var(--primary-agri)] transition shadow-2xs whitespace-nowrap"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* ── MESSAGES SCROLL AREA ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-[var(--primary-agri)] text-white'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}
              >
                {isUser ? 'RK' : <Bot className="h-4 w-4" />}
              </div>

              <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[var(--primary-agri)] text-white rounded-tr-none'
                      : 'bg-[var(--surface-card)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Speak individual message audio button */}
                {!isUser && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] hover:text-emerald-600 px-1 transition"
                  >
                    <Volume2 className="h-3 w-3" /> Listen Audio
                  </button>
                )}

                {/* Recommended Action Confirmation Card */}
                {msg.recommendedAction && (
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3.5 shadow-xs space-y-2 text-xs animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Recommended Farm Action
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        {msg.recommendedAction.taskPriority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">{msg.recommendedAction.taskTitle}</p>
                    <button
                      onClick={() => onAddTask(msg.recommendedAction!.taskTitle, 'Created from AgriVision AI Assistant recommendation')}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                    >
                      <CheckSquare className="h-3.5 w-3.5" /> Confirm &amp; Add to Farm Tasks
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-[var(--text-muted)] block text-right px-1">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] w-fit text-xs text-[var(--text-muted)] animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary-agri)]" />
            <span>AgriVision AI is analyzing crop telemetry and formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT BAR ──────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleFormSubmit}
        className="border-t border-[var(--border-subtle)] p-3.5 bg-[var(--surface-card)] flex items-center gap-2"
      >
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={startSpeechRecognition}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
            isListening
              ? 'bg-red-600 text-white animate-ping'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
          }`}
          title="Speak your question (Hindi / English)"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-emerald-600" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'बोलिए, सुन रहा हूँ... (Listening...)' : 'फसल, रोग, पशु आहार, खाद या मंडी भाव के बारे में पूछें...'}
          className="flex-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-4 py-3 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white shadow-md transition hover:bg-[var(--primary-agri-hover)] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

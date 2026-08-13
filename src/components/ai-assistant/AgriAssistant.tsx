'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckSquare, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { AIMessage } from '@/types/schema';

interface AgriAssistantProps {
  initialQuery?: string;
  onAddTask: (title: string, desc: string) => void;
}

export const AgriAssistant: React.FC<AgriAssistantProps> = ({
  initialQuery,
  onAddTask,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'assistant',
      content: 'Hello Rajesh! I am Agri Assistant, pre-loaded with live context from Rajasthan Green Fields. How can I help optimize your farm operations today?',
      timestamp: '09:00 AM',
    },
  ]);

  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      conversationId: 'conv-1',
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentInput,
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
      }
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xs overflow-hidden">
      {/* Assistant Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-4 bg-[var(--surface-card)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri)] text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)]">Agri Assistant</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Context-aware Farm Intelligence Model</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--primary-agri)] bg-[var(--primary-agri-light)] px-2.5 py-1 rounded-full">
          <ShieldCheck className="h-3 w-3" /> Live Farm Telemetry Active
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-[var(--primary-agri)] text-white'
                  : 'bg-[var(--primary-agri-light)] text-[var(--primary-agri)]'
              }`}
            >
              {msg.role === 'user' ? 'RK' : <Bot className="h-4 w-4" />}
            </div>

            <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary-agri)] text-white rounded-tr-none'
                    : 'bg-[var(--bg-app)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {/* Recommended Action Confirmation Button */}
              {msg.recommendedAction && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 shadow-xs space-y-2 text-xs animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-main)]">AI Recommended Action</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--critical-bg)] text-[var(--critical-red)]">
                      {msg.recommendedAction.taskPriority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">{msg.recommendedAction.taskTitle}</p>
                  <button
                    onClick={() => onAddTask(msg.recommendedAction!.taskTitle, 'Generated via Agri Assistant recommendation')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary-agri)] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                  >
                    <CheckSquare className="h-3.5 w-3.5" /> Confirm & Create Task
                  </button>
                </div>
              )}

              <span className="text-[10px] text-[var(--text-muted)] block text-right px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-2">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary-agri)]" />
            <span>Agri Assistant analyzing farm metrics...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="border-t border-[var(--border-subtle)] p-3 bg-[var(--surface-card)] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask why crop health dropped, weather risks, or recommended sprays..."
          className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-4 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-agri)] text-white transition hover:bg-[var(--primary-agri-hover)] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

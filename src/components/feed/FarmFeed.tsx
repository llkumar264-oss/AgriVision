'use client';

import React, { useState } from 'react';
import { 
  Rss, ThumbsUp, MessageSquare, Sparkles, Plus, CheckCircle2, AlertTriangle, Share2
} from 'lucide-react';
import { FarmFeedPost } from '@/types/schema';
import { INITIAL_FEED } from '@/lib/mock-data';

interface FarmFeedProps {
  onAddTask: (title: string, description: string) => void;
  onOpenAssistant: (query: string) => void;
}

export const FarmFeed: React.FC<FarmFeedProps> = ({ onAddTask, onOpenAssistant }) => {
  const [feedPosts, setFeedPosts] = useState<FarmFeedPost[]>(INITIAL_FEED);

  const handleLike = (id: string) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === id) {
        const userLiked = !p.userLiked;
        return {
          ...p,
          userLiked,
          likesCount: userLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Rss className="h-4 w-4" /> Live Crop &amp; Livestock Intelligence Feed
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">Multicrop Farm Activity Feed</h1>
          <p className="text-xs text-[var(--text-muted)]">Real-time agricultural scans, disease diagnosis &amp; high-yield success stories across 35+ crops</p>
        </div>
      </div>

      {/* Feed Cards */}
      <div className="space-y-5 max-w-2xl">
        {feedPosts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.farmerAvatar} alt={post.farmerName} className="h-10 w-10 rounded-full object-cover border border-emerald-200" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-main)]">{post.farmerName}</h3>
                  <span className="text-[10px] text-[var(--text-muted)]">{post.farmName} • {post.timestamp}</span>
                </div>
              </div>

              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                {post.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-[var(--text-main)]">{post.targetName}</h2>
              <p className="text-xs text-[var(--text-main)]/90 leading-relaxed">{post.description}</p>
            </div>

            {/* AI Analysis Box */}
            {post.aiAnalysis && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> AI Scan Finding: {post.aiAnalysis.condition}
                  </span>
                  <span>{post.aiAnalysis.confidence}% Match</span>
                </div>
                <p className="text-[11px] text-amber-800">Severity: {post.aiAnalysis.severity}. Immediate bio-fungicide treatment recommended.</p>
              </div>
            )}

            {/* Image */}
            <div className="h-64 w-full rounded-xl overflow-hidden bg-[var(--bg-app)]">
              <img src={post.imageUrl} alt={post.targetName} className="h-full w-full object-cover" />
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 font-bold transition ${post.userLiked ? 'text-emerald-700' : 'hover:text-[var(--text-main)]'}`}
              >
                <ThumbsUp className={`h-4 w-4 ${post.userLiked ? 'fill-emerald-600 text-emerald-700' : ''}`} />
                <span>{post.likesCount} Likes</span>
              </button>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-gray-500" /> {post.commentsCount} Comments
                </span>

                <button
                  onClick={() => onOpenAssistant(`How should I treat ${post.targetName} based on this feed finding: ${post.description}?`)}
                  className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Consult AI
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

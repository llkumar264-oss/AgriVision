'use client';

import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Bookmark, Share2, Sparkles, 
  CheckSquare, History, Plus, Filter, UserCheck, Sprout
} from 'lucide-react';
import { FarmFeedPost } from '@/types/schema';
import { INITIAL_FEED } from '@/lib/mock-data';

interface FarmFeedProps {
  onAddTask: (title: string, desc: string) => void;
  onOpenAssistant: (query: string) => void;
}

export const FarmFeed: React.FC<FarmFeedProps> = ({ onAddTask, onOpenAssistant }) => {
  const [posts, setPosts] = useState<FarmFeedPost[]>(INITIAL_FEED);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [newPostText, setNewPostText] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const filters = ['All', 'Crops', 'Livestock', 'Diseases', 'Treatments', 'Observations'];

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.userLiked;
        return {
          ...p,
          userLiked: liked,
          likesCount: liked ? p.likesCount + 1 : p.likesCount - 1,
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-main)]">Farm Activity Feed</h1>
          <p className="text-xs text-[var(--text-muted)]">Visual observations, AI diagnostic captures & farm updates</p>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
        >
          <Plus className="h-4 w-4" /> Share Observation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition shrink-0 ${
              activeFilter === f
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xs overflow-hidden transition hover:border-[var(--border-strong)]"
          >
            {/* Post Author Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <img
                  src={post.farmerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                  alt={post.farmerName}
                  className="h-9 w-9 rounded-full object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--text-main)]">{post.farmerName}</span>
                    <span className="rounded bg-[var(--primary-agri-light)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--primary-agri)]">
                      {post.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">{post.farmName} • {post.timestamp}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{post.targetName}</span>
            </div>

            {/* Post Image */}
            <div className="relative w-full h-80 sm:h-96 bg-black/90">
              <img src={post.imageUrl} alt={post.targetName} className="w-full h-full object-cover" />
              
              {/* AI Overlay Badge if exists */}
              {post.aiAnalysis && (
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/70 p-3 backdrop-blur-md text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">AI Pathology Result</span>
                    <span className="font-bold text-xs">{post.aiAnalysis.condition}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-300 block">Confidence</span>
                    <span className="font-extrabold text-xs text-emerald-300 tabular-nums">{post.aiAnalysis.confidence}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Post Content & Actions */}
            <div className="p-4 space-y-3">
              {/* Interaction Bar */}
              <div className="flex items-center justify-between text-xs border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-medium transition ${
                      post.userLiked ? 'text-red-500' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.userLiked ? 'fill-red-500' : ''}`} />
                    <span className="tabular-nums">{post.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium">
                    <MessageCircle className="h-4 w-4" />
                    <span className="tabular-nums">{post.commentsCount}</span>
                  </button>
                  <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddTask(`Inspect ${post.targetName}`, post.description)}
                    className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                  >
                    <CheckSquare className="h-3 w-3" /> Create Task
                  </button>
                  <button
                    onClick={() => onOpenAssistant(`Explain AI analysis for ${post.targetName}`)}
                    className="flex items-center gap-1 rounded-lg border border-[var(--primary-agri)]/30 bg-[var(--primary-agri-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-agri)]"
                  >
                    <Sparkles className="h-3 w-3" /> Ask AI
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-main)] leading-relaxed">{post.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

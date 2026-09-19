'use client';

import React, { useState } from 'react';
import { 
  Users, MessageSquare, ThumbsUp, TrendingUp, TrendingDown, 
  CheckCircle2, Plus, Search, Tag, Share2, Sparkles, X, MapPin
} from 'lucide-react';
import { CommunityPost, MandiPriceItem } from '@/types/schema';
import { INITIAL_COMMUNITY_POSTS, INITIAL_MANDI_PRICES } from '@/lib/mock-data';

interface CommunityHubProps {
  onOpenAssistant?: (query: string) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onOpenAssistant }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [mandiPrices] = useState<MandiPriceItem[]>(INITIAL_MANDI_PRICES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Post Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('Crop Pathology');

  const categories = ['All', 'Crop Pathology', 'Live Mandi Price', 'Organic Farming', 'Livestock Care', 'Equipment Share'];

  const filteredPosts = posts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => {
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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      farmerName: 'Rajesh Kumar (You)',
      villageState: 'Sanganer, Jaipur, Rajasthan',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      category,
      title,
      content,
      likesCount: 1,
      commentsCount: 0,
      userLiked: true,
      timestamp: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" /> Kisan Farmer Community &amp; Knowledge Network
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">Farmers Helping Farmers</h1>
          <p className="text-xs text-[var(--text-muted)]">Share crop solutions, organic techniques &amp; real-time mandi prices across 15+ states</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition shrink-0"
        >
          <Plus className="h-4 w-4" /> Post Question or Update
        </button>
      </div>

      {/* ── LIVE MANDI PRICES TICKER CAROUSEL ────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" /> Today's Live Mandi Commodity Rates (₹ / Quintal)
          </h2>
          <span className="text-[10px] text-[var(--text-muted)]">Updated 10 mins ago</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mandiPrices.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[var(--text-muted)] block truncate">{item.mandiName}</span>
              <p className="text-xs font-bold text-[var(--text-main)] truncate">{item.commodity}</p>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-extrabold text-emerald-700">₹{item.modalPrice}</span>
                <span className={`text-[10px] font-bold flex items-center ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.trend === 'up' ? <TrendingUp className="h-3 w-3 inline" /> : item.trend === 'down' ? <TrendingDown className="h-3 w-3 inline" /> : null}
                  {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Community Posts Feed */}
      <div className="space-y-4 max-w-3xl">
        {filteredPosts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-3">
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatarUrl} alt={post.farmerName} className="h-9 w-9 rounded-full object-cover border border-emerald-200" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1">
                    {post.farmerName}
                    {post.verifiedSolution && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified Solution
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-emerald-600" /> {post.villageState} • {post.timestamp}
                  </span>
                </div>
              </div>
              <span className="rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 px-2.5 py-1 border border-emerald-100">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-[var(--text-main)]">{post.title}</h2>
              <p className="text-xs text-[var(--text-main)]/90 leading-relaxed">{post.content}</p>
              {post.imageUrl && (
                <div className="h-56 w-full rounded-xl overflow-hidden bg-[var(--bg-app)]">
                  <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Post Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center gap-1.5 font-semibold transition ${post.userLiked ? 'text-emerald-700 font-extrabold' : 'hover:text-[var(--text-main)]'}`}
              >
                <ThumbsUp className={`h-4 w-4 ${post.userLiked ? 'fill-emerald-600 text-emerald-700' : ''}`} />
                <span>{post.likesCount} Helpful</span>
              </button>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-gray-500" /> {post.commentsCount} Comments
                </span>
                {onOpenAssistant && (
                  <button
                    onClick={() => onOpenAssistant(`Give me more details about this farmer solution: ${post.title}`)}
                    className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Ask AI
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">Share Question or Community Update</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Topic Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                >
                  <option value="Crop Pathology">Crop Pathology</option>
                  <option value="Live Mandi Price">Live Mandi Price</option>
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Livestock Care">Livestock Care</option>
                  <option value="Equipment Share">Equipment Share</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Yellowing on wheat leaves after 2nd watering..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Details &amp; Experience</label>
                <textarea
                  rows={4}
                  placeholder="Describe your query, crop variety, village location, or recommendation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
              >
                Publish to Farmer Network
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

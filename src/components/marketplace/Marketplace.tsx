'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Tag, Star, MapPin, DollarSign, 
  MessageSquare, CheckCircle2, ShieldAlert, Sparkles, Filter, 
  ArrowRight, X, TrendingDown, RefreshCw, Layers, Plus, Store
} from 'lucide-react';
import { MarketplaceItem, MarketCategory, BargainOffer } from '@/types/schema';
import { INITIAL_MARKETPLACE_ITEMS } from '@/lib/mock-data';

interface MarketplaceProps {
  onOpenAssistant?: (query: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onOpenAssistant }) => {
  const [items, setItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Bargaining Modal State
  const [activeBargainItem, setActiveBargainItem] = useState<MarketplaceItem | null>(null);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [bargainStatus, setBargainStatus] = useState<'idle' | 'negotiating' | 'accepted' | 'countered' | 'rejected'>('idle');
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'seller'; text: string; price?: number }[]>([]);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string>('');

  // Sell Item Modal State
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [sellTitle, setSellTitle] = useState('');
  const [sellCategory, setSellCategory] = useState<MarketCategory>('Harvested Crops');
  const [sellPrice, setSellPrice] = useState<number>(2450);
  const [sellUnit, setSellUnit] = useState('Quintal (100kg)');
  const [sellLocation, setSellLocation] = useState('Jaipur Mandi, Rajasthan');
  const [sellDescription, setSellDescription] = useState('Freshly harvested A-Grade organic crop. Ready for immediate loading.');

  const categories = ['All', 'Harvested Crops', 'Seeds', 'Fertilizers', 'Protection', 'Machinery', 'Livestock', 'Feed'];

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBargain = (item: MarketplaceItem) => {
    setActiveBargainItem(item);
    setOfferedPrice(Math.round(item.price * 0.85));
    setBargainStatus('idle');
    setChatMessages([
      {
        sender: 'seller',
        text: `Namaste! I am ${item.sellerName} from ${item.sellerLocation}. Listed price for ${item.title} is ₹${item.price} per ${item.unit}. What is your target offer?`
      }
    ]);
  };

  const handleSendBargainOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBargainItem || offeredPrice <= 0) return;

    const minPrice = activeBargainItem.minAcceptablePrice || Math.round(activeBargainItem.price * 0.82);
    
    // User message
    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: `I would like to offer ₹${offeredPrice} for this ${activeBargainItem.unit}.`, price: offeredPrice }
    ];

    if (offeredPrice >= activeBargainItem.price) {
      setBargainStatus('accepted');
      newMessages.push({
        sender: 'seller',
        text: `Offer accepted! ₹${offeredPrice} matches or exceeds our listing price. Proceeding to checkout.`,
        price: offeredPrice
      });
    } else if (offeredPrice >= minPrice) {
      // Accept offer
      setBargainStatus('accepted');
      newMessages.push({
        sender: 'seller',
        text: `Deal agreed! We accept your reasonable offer of ₹${offeredPrice} per ${activeBargainItem.unit}. You save ₹${activeBargainItem.price - offeredPrice}!`,
        price: offeredPrice
      });
    } else {
      // Counter offer
      const fairCounter = Math.round((offeredPrice + activeBargainItem.price) / 2);
      setBargainStatus('countered');
      setCounterPrice(fairCounter);
      newMessages.push({
        sender: 'seller',
        text: `₹${offeredPrice} is a bit too low due to transport & packaging costs. Best I can offer you is ₹${fairCounter} per ${activeBargainItem.unit}. Would you accept?`,
        price: fairCounter
      });
    }

    setChatMessages(newMessages);
  };

  const handleAcceptCounter = () => {
    if (!activeBargainItem) return;
    setBargainStatus('accepted');
    setOfferedPrice(counterPrice);
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: `Agreed! I accept your counter offer of ₹${counterPrice}.` },
      { sender: 'seller', text: `Excellent! Deal locked at ₹${counterPrice}. Ready for checkout.` }
    ]);
  };

  const handleBuyNow = (itemTitle: string, finalPrice: number) => {
    setActiveBargainItem(null);
    setOrderSuccessMsg(`Order placed successfully for ${itemTitle} at ₹${finalPrice}! Delivery within 48 hours.`);
    setTimeout(() => setOrderSuccessMsg(''), 5000);
  };

  const handleListProductForSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle) return;

    const newItem: MarketplaceItem = {
      id: `mkt-custom-${Date.now()}`,
      title: sellTitle,
      category: sellCategory,
      price: sellPrice,
      originalPrice: Math.round(sellPrice * 1.15),
      unit: sellUnit,
      sellerName: 'Rajesh Kumar (You)',
      sellerRating: 4.9,
      sellerLocation: sellLocation,
      imageUrl: sellCategory === 'Harvested Crops'
        ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80',
      description: sellDescription,
      inStock: true,
      allowBargain: true,
      minAcceptablePrice: Math.round(sellPrice * 0.88),
      tag: 'Government Certified',
    };

    setItems([newItem, ...items]);
    setShowSellModal(false);
    setOrderSuccessMsg(`Your listing "${sellTitle}" at ₹${sellPrice}/${sellUnit} is now LIVE on AgriVision Marketplace!`);
    setTimeout(() => setOrderSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-850 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-xs">
            <Store className="h-3.5 w-3.5" /> 75+ Harvested Crops, Inputs &amp; Livestock Buy/Sell Hub
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Direct Mandi Crop &amp; Agri Input Marketplace</h1>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Buy &amp; sell harvested grains, vegetables, certified seeds, bio-pesticides, solar machinery &amp; animals. Use real-time bargaining!
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowSellModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-amber-600 transition"
          >
            <Plus className="h-4 w-4" /> Sell My Crop / Input
          </button>

          {onOpenAssistant && (
            <button
              onClick={() => onOpenAssistant('What harvested crop mandi rates are highest right now?')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs border border-white/20 hover:bg-white/20 transition"
            >
              <Sparkles className="h-4 w-4 text-emerald-300" /> Mandi AI Rates
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {orderSuccessMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{orderSuccessMsg}</span>
        </div>
      )}

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                  : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search 75+ crops, inputs, sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
        </div>
      </div>

      {/* Items Count Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
        <span>Showing {filteredItems.length} verified listings</span>
        <span>Filter: {selectedCategory}</span>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md transition duration-200"
          >
            <div className="space-y-3">
              {/* Product Image & Badges */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[var(--bg-app)]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                  {item.tag && (
                    <span className="rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.allowBargain && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-xs shadow-xs">
                    <MessageSquare className="h-3 w-3" /> Bargain Eligible
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-1 group-hover:text-[var(--primary-agri)] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Seller Info & Rating */}
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[130px] font-medium">{item.sellerName}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{item.sellerRating}</span>
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-extrabold text-[var(--text-main)]">₹{item.price}</span>
                  <span className="text-xs text-[var(--text-muted)] font-normal"> / {item.unit}</span>
                </div>
                {item.originalPrice && (
                  <span className="text-xs text-[var(--text-muted)] line-through">₹{item.originalPrice}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {item.allowBargain ? (
                  <button
                    onClick={() => handleOpenBargain(item)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" /> Bargain Rate
                  </button>
                ) : (
                  <button
                    disabled
                    className="rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-medium text-gray-400 cursor-not-allowed"
                  >
                    Fixed Rate
                  </button>
                )}

                <button
                  onClick={() => handleBuyNow(item.title, item.price)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-[var(--primary-agri)] py-2 text-xs font-bold text-white hover:bg-[var(--primary-agri-hover)] transition shadow-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BARGAINING NEGOTIATION MODAL ────────────────────────────────────── */}
      {activeBargainItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  <MessageSquare className="h-3 w-3" /> Live Farmer Price Negotiation
                </div>
                <h2 className="text-base font-bold text-[var(--text-main)] line-clamp-1">{activeBargainItem.title}</h2>
                <p className="text-xs text-[var(--text-muted)]">Seller: {activeBargainItem.sellerName} ({activeBargainItem.sellerLocation})</p>
              </div>
              <button
                onClick={() => setActiveBargainItem(null)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Item Card Brief */}
            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-app)] p-3 border border-[var(--border-subtle)] text-xs">
              <div className="space-y-0.5">
                <span className="text-[var(--text-muted)]">Listed Price:</span>
                <p className="font-extrabold text-sm text-[var(--text-main)]">₹{activeBargainItem.price} / {activeBargainItem.unit}</p>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[var(--text-muted)]">Suggested Bargain:</span>
                <p className="font-bold text-emerald-600">₹{Math.round(activeBargainItem.price * 0.85)} - ₹{Math.round(activeBargainItem.price * 0.92)}</p>
              </div>
            </div>

            {/* Negotiation Chat Box */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] min-h-[160px] max-h-[220px]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[var(--primary-agri)] text-white rounded-br-none'
                        : 'bg-white border border-[var(--border-subtle)] text-[var(--text-main)] shadow-xs rounded-bl-none'
                    }`}
                  >
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                    {msg.price && (
                      <span className="mt-1 block font-extrabold text-[11px] opacity-90">
                        Price Tag: ₹{msg.price}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] mt-1 px-1">
                    {msg.sender === 'user' ? 'You' : activeBargainItem.sellerName}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar / Counter Offer Control */}
            {bargainStatus === 'accepted' ? (
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-center">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                  🎉 Deal Locked at ₹{offeredPrice} per {activeBargainItem.unit}!
                </div>
                <button
                  onClick={() => handleBuyNow(activeBargainItem.title, offeredPrice)}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  Complete Purchase at Negotiated Rate (₹{offeredPrice})
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendBargainOffer} className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                {bargainStatus === 'countered' && (
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs">
                    <span className="font-semibold text-amber-900">Seller Counter Offer: ₹{counterPrice}</span>
                    <button
                      type="button"
                      onClick={handleAcceptCounter}
                      className="rounded-lg bg-amber-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-amber-700 transition"
                    >
                      Accept Counter
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[var(--text-muted)]">₹</span>
                    <input
                      type="number"
                      min={Math.round(activeBargainItem.price * 0.5)}
                      max={activeBargainItem.price}
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-7 pr-3 py-2 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                      placeholder="Enter offer price in ₹"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--primary-agri)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-agri-hover)] transition shrink-0"
                  >
                    Submit Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── SELL CROP / PRODUCT MODAL ────────────────────────────────────── */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">List Harvested Crop or Input for Sale</h2>
              <button onClick={() => setShowSellModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleListProductForSale} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Product / Crop Title</label>
                <input
                  type="text"
                  placeholder="e.g. Harvested HD-2967 Sharbati Wheat, Organic Tomatoes..."
                  value={sellTitle}
                  onChange={(e) => setSellTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Category</label>
                  <select
                    value={sellCategory}
                    onChange={(e) => setSellCategory(e.target.value as MarketCategory)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  >
                    <option value="Harvested Crops">Harvested Crops</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Protection">Protection</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Feed">Feed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Quintal (100kg), kg, bag"
                    value={sellUnit}
                    onChange={(e) => setSellUnit(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Mandi / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur Mandi"
                    value={sellLocation}
                    onChange={(e) => setSellLocation(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sellDescription}
                  onChange={(e) => setSellDescription(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-extrabold text-white shadow-md hover:bg-amber-600 transition"
              >
                Publish Listing to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

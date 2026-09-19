'use client';

import React, { useState } from 'react';
import { Sprout, Image as ImageIcon } from 'lucide-react';

interface AgriImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'crop' | 'livestock' | 'seed' | 'fertilizer' | 'general';
}

const DEFAULT_FALLBACKS = {
  crop: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  livestock: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
  seed: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  fertilizer: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
  general: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
};

export const AgriImage: React.FC<AgriImageProps> = ({
  src,
  alt = 'Agricultural item',
  className = '',
  fallbackType = 'crop',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [useSvgFallback, setUseSvgFallback] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    } else {
      setUseSvgFallback(true);
    }
  };

  if (useSvgFallback || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-3 select-none ${className}`}>
        <Sprout className="h-8 w-8 mb-1 text-emerald-400 opacity-80" />
        <span className="text-[10px] font-extrabold text-emerald-200 text-center line-clamp-1 px-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={hasError ? DEFAULT_FALLBACKS[fallbackType] : src}
      alt={alt}
      onError={handleError}
      className={`object-cover ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

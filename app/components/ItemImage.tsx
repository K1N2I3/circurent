'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ItemImageProps {
  item: {
    image: string;
    imageUrl?: string;
    name: string;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ItemImage({ item, size = 'medium', className = '' }: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl lg:text-7xl',
    large: 'text-9xl lg:text-[12rem]',
  };

  // If no imageUrl or image failed to load, show emoji
  if (!item.imageUrl || imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className={sizeClasses[size]}>{item.image}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={sizeClasses[size]}>{item.image}</span>
        </div>
      )}
      <Image
        src={item.imageUrl}
        alt={item.name}
        fill
        className={`object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}


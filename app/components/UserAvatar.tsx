'use client';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  // Get first letter of name (or first letter of first word if multiple words)
  const getInitial = (name: string): string => {
    if (!name || name.trim().length === 0) return '?';
    const trimmed = name.trim();
    // If name has multiple words, use first letter of first word
    const firstWord = trimmed.split(/\s+/)[0];
    return firstWord.charAt(0).toUpperCase();
  };

  const initial = getInitial(name);
  
  // Generate color based on name (consistent color for same name)
  const getColor = (name: string): string => {
    const colors = [
      'bg-primary-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-cyan-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-black shadow-lg ${className}`}
    >
      {initial}
    </div>
  );
}


// Type definitions and utility functions that can be used in both client and server
// This file should NOT import Node.js modules like 'fs' or 'path'

export interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  username: string; // Unique username (required, cannot be duplicated)
  email: string;
  password: string; // 实际应用中应该存储哈希
  name?: string; // Display name (optional, can be duplicated, editable in profile)
  address?: AddressData; // Changed from string to AddressData object
  avatarUrl?: string; // User's custom avatar image URL
  createdAt: string;
}

// Helper function to get display name (name if exists, otherwise username)
export function getDisplayName(user: { name?: string; username: string }): string {
  return user.name?.trim() || user.username;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  image: string; // emoji or image URL
  imageUrl?: string; // actual image URL
  available: boolean;
  ownerName: string; // Name of the person renting out this item
  userId?: string; // ID of the user who owns this item (for user-created items)
}

export interface Rental {
  id: string;
  userId: string;
  itemId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'paypal' | 'credit_card';
  paymentId?: string;
  createdAt: string;
}


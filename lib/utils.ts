import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

export const CATEGORIES = [
  { key: 'webDev', label: 'Web Development', icon: '💻' },
  { key: 'mobileDev', label: 'Mobile Development', icon: '📱' },
  { key: 'design', label: 'Graphic Design', icon: '🎨' },
  { key: 'writing', label: 'Writing & Translation', icon: '✍️' },
  { key: 'marketing', label: 'Digital Marketing', icon: '📣' },
  { key: 'video', label: 'Video & Animation', icon: '🎬' },
  { key: 'data', label: 'Data & Analytics', icon: '📊' },
  { key: 'seo', label: 'SEO & SEM', icon: '🔍' },
  { key: 'social', label: 'Social Media', icon: '📲' },
  { key: 'accounting', label: 'Accounting & Finance', icon: '💰' },
] as const

export const SAMPLE_GIGS = [
  {
    id: '1',
    title: 'I will design a professional logo for your business',
    category: 'design',
    sellerId: 'u1',
    sellerName: 'Ahmed Raza',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    sellerUsername: 'ahmedraza',
    cnicVerified: true,
    tier1Price: 2500,
    tier2Price: 5000,
    tier3Price: 10000,
    tier1DeliveryDays: 3,
    avgRating: '4.9',
    totalReviews: 127,
    totalOrders: 342,
    isSponsored: true,
    images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'],
    status: 'active',
  },
  {
    id: '2',
    title: 'I will build a responsive Next.js website',
    category: 'webDev',
    sellerId: 'u2',
    sellerName: 'Sara Khan',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3d8?w=100&h=100&fit=crop',
    sellerUsername: 'sarakhan',
    cnicVerified: true,
    tier1Price: 15000,
    tier2Price: 30000,
    tier3Price: 60000,
    tier1DeliveryDays: 7,
    avgRating: '5.0',
    totalReviews: 89,
    totalOrders: 201,
    isSponsored: false,
    images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop'],
    status: 'active',
  },
  {
    id: '3',
    title: 'I will write SEO-optimized Urdu & English content',
    category: 'writing',
    sellerId: 'u3',
    sellerName: 'Fatima Malik',
    sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    sellerUsername: 'fatimamalik',
    cnicVerified: false,
    tier1Price: 1500,
    tier2Price: 3000,
    tier3Price: 6000,
    tier1DeliveryDays: 2,
    avgRating: '4.7',
    totalReviews: 54,
    totalOrders: 119,
    isSponsored: true,
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'],
    status: 'active',
  },
  {
    id: '4',
    title: 'I will manage your social media accounts professionally',
    category: 'social',
    sellerId: 'u4',
    sellerName: 'Usman Ali',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    sellerUsername: 'usmanali',
    cnicVerified: true,
    tier1Price: 5000,
    tier2Price: 10000,
    tier3Price: 20000,
    tier1DeliveryDays: 30,
    avgRating: '4.8',
    totalReviews: 33,
    totalOrders: 78,
    isSponsored: false,
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'],
    status: 'active',
  },
  {
    id: '5',
    title: 'I will create a Flutter mobile app for iOS and Android',
    category: 'mobileDev',
    sellerId: 'u5',
    sellerName: 'Zara Sheikh',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    sellerUsername: 'zarashekh',
    cnicVerified: true,
    tier1Price: 25000,
    tier2Price: 50000,
    tier3Price: 100000,
    tier1DeliveryDays: 14,
    avgRating: '4.9',
    totalReviews: 41,
    totalOrders: 95,
    isSponsored: false,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'],
    status: 'active',
  },
  {
    id: '6',
    title: 'I will do digital marketing & Google Ads campaign',
    category: 'marketing',
    sellerId: 'u6',
    sellerName: 'Bilal Hassan',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    sellerUsername: 'bilalhassan',
    cnicVerified: true,
    tier1Price: 8000,
    tier2Price: 15000,
    tier3Price: 30000,
    tier1DeliveryDays: 7,
    avgRating: '4.6',
    totalReviews: 22,
    totalOrders: 56,
    isSponsored: true,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'],
    status: 'active',
  },
]

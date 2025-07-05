export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
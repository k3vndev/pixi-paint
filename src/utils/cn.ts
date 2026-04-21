import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Utility function to merge Tailwind CSS classes. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a Chilean RUT (Rol Único Tributario)
 * @param rut RUT string in format 12345678-9 or 12.345.678-9
 */
export function validateRut(rut: string): boolean {
  if (!/^[0-9]+[-|‐][0-9kK]{1}$/.test(rut.replace(/\./g, ''))) return false;
  
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  const dv = cleanRut.slice(-1);
  const body = cleanRut.slice(0, -1);
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDv = 11 - (sum % 11);
  const dvChar = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
  
  return dvChar === dv;
}

/**
 * Formats a string into a Chilean RUT mask (12.345.678-9)
 */
export function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length <= 1) return clean;
  
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  
  let formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

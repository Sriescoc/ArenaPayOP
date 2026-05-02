import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

/**
 * Premium OTP input component with 6 individual digit boxes.
 * Supports auto-focus, paste from clipboard, and backspace navigation.
 */
export function OtpInput({ length = 6, onComplete, disabled = false, error = false }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Reset values when error changes to allow re-entry
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setValues(new Array(length).fill(''));
        inputRefs.current[0]?.focus();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [error, length]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, length);
      const newValues = [...values];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < length) {
          newValues[index + i] = pasted[i];
        }
      }
      setValues(newValues);
      
      const nextIndex = Math.min(index + pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      const completeValue = newValues.join('');
      if (completeValue.length === length && /^\d+$/.test(completeValue)) {
        onComplete(completeValue);
      }
      return;
    }

    // Single character
    const digit = value.replace(/\D/g, '');
    if (!digit && value !== '') return;

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const completeValue = newValues.join('');
    if (completeValue.length === length && /^\d+$/.test(completeValue)) {
      onComplete(completeValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      const newValues = new Array(length).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newValues[i] = pasted[i];
      }
      setValues(newValues);
      
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      if (pasted.length === length) {
        onComplete(pasted);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {values.map((val, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: error ? [1, 1.05, 0.95, 1] : 1,
          }}
          transition={{ 
            delay: i * 0.05, 
            duration: error ? 0.4 : 0.2,
          }}
        >
          <input
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={length} // allows paste
            value={val}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`
              w-11 h-14 sm:w-14 sm:h-16 
              text-center text-xl sm:text-2xl font-black text-white 
              bg-[#0a0e17] border-2 rounded-xl 
              outline-none transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-500 bg-red-500/10 text-red-400' 
                : val 
                  ? 'border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.15)]' 
                  : 'border-[#1f2937] focus:border-[#00ff66]'
              }
            `}
          />
        </motion.div>
      ))}
    </div>
  );
}

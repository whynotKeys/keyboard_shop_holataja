import React, { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function CheckboxButton({ checked, onChange, label, className, ...props }: CheckboxButtonProps) {
  return (
    <label className={`flex items-center cursor-pointer ${className ?? ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" {...props} />
      <div
        className={`
      w-5 h-5
      rounded
      border-2
      transition-colors
      bg-white
      flex
      justify-center
      items-center
      ${checked ? 'border-primary' : 'border-gray'}
      peer-focus-visible:ring-2
    `}
      >
        {checked && <Check size={14} color="var(--color-primary)" strokeWidth={3} />}
      </div>
      <span className="ml-2 text-secondary align-top">{label}</span>
    </label>
  );
}

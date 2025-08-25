import { ChevronDown } from 'lucide-react';
import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  showLabel?: boolean;
  options: string[];
  id: string;
  name: string;
  selectedValue: string;
  error?: boolean;
  errorMessage?: string;
  size?: 'medium' | 'small';
  placeholder?: string;
}

function Select({
  label,
  showLabel,
  options,
  id,
  name,
  selectedValue,
  // error = false,
  disabled,
  size = 'medium',
  placeholder,
  className,
  ...props
}: SelectProps) {
  const disabledStyle = disabled ? 'bg-disabled text-darkgray' : '';

  return (
    <div className="flex justify-between items-center gap-4 relative">
      {label && (
        <label className={showLabel ? 'shrink-0 label-m' : 'sr-only'} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={selectedValue}
        className={`w-full ps-4 pe-12 ${size === 'medium' ? 'py-2.5' : 'py-1.5'} bg-white rounded-md outline-1 outline-gray focus:outline-primary appearance-none ${disabledStyle} ${className}`}
        {...props}
      >
        <option value={placeholder}>{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4" size={16} color="var(--color-secondary)" />
    </div>
  );
}

export default Select;

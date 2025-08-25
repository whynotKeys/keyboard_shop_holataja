import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | ReactNode;
  size?: 'full' | 'large' | 'medium' | 'small';
  select?: boolean;
  outlined?: boolean;
  icon?: boolean;
  submit?: boolean;
}

function Button({ children, size, select, outlined, icon, submit, disabled, onClick, className, ...props }: ButtonProps) {
  const bg = icon ? 'transparent' : select || outlined ? 'bg-white' : disabled ? 'bg-disabled' : 'bg-primary';
  const color = disabled ? 'text-darkgray' : select || icon ? 'text-text' : outlined ? 'text-primary' : 'text-white';
  const border = outlined && disabled ? 'border-1 border-disabled' : outlined ? 'border-1 border-primary' : select ? 'border-1 border-gray' : '';
  const width = size === 'full' ? 'w-full' : size === 'large' ? 'w-[17.5rem]' : icon ? 'aspect-square' : 'w-auto';
  const height = size === 'medium' ? 'h-10' : size === 'small' ? 'h-8' : 'h-12';
  const padding = icon ? 'p-0' : size === 'medium' ? 'px-5' : size === 'small' ? 'px-4' : 'px-6';
  const hover = select ? '' : outlined ? 'hover:bg-accent' : icon ? '' : 'hover:bg-hover';
  const fontSize = size === 'small' ? 'text-sm' : '';
  const fontWeight = select ? 'font-medium' : 'font-bold';

  return (
    <button
      className={`${bg} ${color} ${border} ${width} ${height} ${padding} ${fontSize} ${hover} ${fontWeight} ${className} inline-flex justify-center items-center rounded-lg  transition duration-200 ease-in-out cursor-pointer disabled:pointer-events-none`}
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

'use client';

type InputSize = 'small' | 'medium';

//input요소를 인터페이스에 확장 일부 속성 제외
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'id'> {
  label?: string;
  id: string;
  placeholder?: string;
  type: string;
  size?: InputSize;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  gap?: string;
}

//인터페이스 확장으로 value, onChange 속성 사용 가능
export default function Input({
  label,
  id,
  placeholder,
  type,
  value,
  onChange,
  error = false,
  disabled = false,
  errorMessage,
  className,
  size = 'medium',
  gap,
  ...props
}: InputProps) {
  //인풋 요소 기본 스타일 세팅
  const sizeStyles = {
    container: 'flex justify-between items-center',
    small: {
      label: 'shrink-0 label-s',
      input: 'w-full px-4 py-1.5 outline-1 outline-gray rounded-md focus:outline-primary bg-white',
    },
    medium: {
      label: 'shrink-0 label-m',
      input: 'w-full px-4 py-2.5 outline-1 outline-gray rounded-md focus:outline-primary bg-white',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;
  const errorStyle = error ? 'placeholder:text-negative outline-negative' : 'placeholder:text-gray-400';
  const disabledStyle = disabled ? '!bg-disabled text-darkgray' : '';

  return (
    <div className={`${sizeStyles.container} ${gap}`}>
      {label && (
        <label className={`min-w-[93px] ${currentSize.label}`} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={`${currentSize.input} ${errorStyle} ${disabledStyle} ${className}`}
        id={id}
        type={type}
        placeholder={error ? errorMessage || placeholder : placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

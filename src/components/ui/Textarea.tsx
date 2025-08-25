import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  error?: boolean;
  errorMessage?: string;
}

function Textarea({ id, name, error = false, errorMessage, disabled, placeholder, ...props }: TextareaProps) {
  const errorStyle = error ? 'placeholder:text-negative outline-negative' : 'placeholder:text-gray-400';
  const disabledStyle = disabled ? 'bg-disabled text-darkgray' : ' ';

  return (
    <textarea
      id={id}
      name={name}
      className={`w-full px-4 py-2.5 outline-1 outline-gray bg-white rounded-md focus:outline-primary min-h-36 resize-none ${errorStyle} ${disabledStyle}`}
      placeholder={error ? errorMessage || placeholder : placeholder}
      {...props}
    ></textarea>
  );
}

export default Textarea;

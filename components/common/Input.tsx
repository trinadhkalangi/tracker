
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={props.name} className="mb-1 font-semibold text-gray-700">{label}</label>
      <input
        id={props.name}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
      />
    </div>
  );
};

export default Input;

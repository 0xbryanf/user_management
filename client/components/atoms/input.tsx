import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => (
  <input
    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm outline-none ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
    {...props}
  />
);

export default Input;

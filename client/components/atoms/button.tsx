import React from "react";

const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 hover:cursor-pointer px-3 py-2 text-base font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    {...props}
  >
    {children}
  </button>
);

export default Button;

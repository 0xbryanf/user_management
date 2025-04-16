import React from "react";

const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={className} {...props}>
    {children}
  </button>
);

export default Button;

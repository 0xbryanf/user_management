import React from "react";

const Label = ({
  htmlFor,
  children
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900">
    {children}
  </label>
);

export default Label;

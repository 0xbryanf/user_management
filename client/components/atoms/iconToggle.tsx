import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface IconToggleProps {
  isVisible: boolean;
  onClick: () => void;
}

const IconToggle = ({ isVisible, onClick }: IconToggleProps) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-3 top-2 hover:cursor-pointer text-gray-500 hover:text-indigo-600"
  >
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);

export default IconToggle;

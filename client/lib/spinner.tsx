import React from "react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 border-r-blue-400 rounded-full animate-spin bg-white shadow"
        role="status"
      />
    </div>
  );
}

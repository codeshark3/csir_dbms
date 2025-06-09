import React from "react";

const Loader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
    <svg
      className="mb-4 h-10 w-10 animate-spin text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="text-lg text-gray-700">{message}</span>
  </div>
);

export default Loader;

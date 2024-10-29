import React from 'react';

const HighlightedText = ({ children }: { children: React.ReactNode }) => (
    <span className="text-gray-900 bg-gray-100 py-0.5 px-1 rounded font-medium text-sm">
    {children}
  </span>
);

export default HighlightedText;
import React from "react";

const LayoutSelector = ({ layouts, selectedLayout, setSelectedLayout }) => (
  <select
    className="mt-6 px-3 py-2 rounded border border-gray-300 w-full max-w-xs sm:max-w-sm"
    value={selectedLayout}
    onChange={(e) => setSelectedLayout(e.target.value)}
  >
    {layouts.map((layout) => (
      <option key={layout.value} value={layout.value}>
        {layout.label}
      </option>
    ))}
  </select>
);

export default LayoutSelector;
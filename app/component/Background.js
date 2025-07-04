import React from "react";

const Background = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 flex flex-col">
    {children}
  </div>
);

export default Background;
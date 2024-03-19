import React from "react";

export default function Highlight({ children, color }) {
  return (
    <span
      style={{
        borderRadius: "2px",
        color: color,
        padding: "0.2rem",
      }}
    >
      {children}
    </span>
  );
}

// components/ThemeDropdown.js
"use client";

import { useEffect, useState } from "react";

export default function ThemeDropdown() {
  const [theme, setTheme] = useState("bumblebee");
  const themes = ["light", "dark", "cupcake", "bumblebee", "pastel", "winter"];

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const handleThemeChange = (t) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-sm m-1 capitalize">
        Theme: {theme}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {themes.map((t) => (
          <li key={t}>
            <button onClick={() => handleThemeChange(t)} className="capitalize">
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

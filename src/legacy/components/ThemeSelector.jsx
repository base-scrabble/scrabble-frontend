import { useState } from "react";

export default function ThemeSelector({ onChange }) {
  const themes = ["light", "dark", "blue", "green"];
  const [selected, setSelected] = useState(themes[0]);

  const handleChange = (theme) => {
    setSelected(theme);
    if (onChange) onChange(theme);
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Select Theme</h3>
      <div className="flex space-x-2">
        {themes.map((theme) => (
          <button
            key={theme}
            className={`px-3 py-1 rounded ${
              selected === theme ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleChange(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}

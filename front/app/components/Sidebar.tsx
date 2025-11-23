"use client";

import { useState } from "react";

const platforms = [
  { id: "youtube", label: "YouTube" },
  { id: "twitch", label: "Twitch" },
  { id: "afreecatv", label: "AfreecaTV" },
];

export default function Sidebar() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-64 h-full rounded-lg hidden md:flex flex-col bg-[#121212]">
      <div className="bg-[#121212] rounded-lg p-6 h-full">
        <div className="flex items-center space-x-2 mb-6 text-gray-400 hover:text-white transition-colors cursor-pointer">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h2 className="text-base font-bold">라이브러리</h2>
        </div>

        <div className="space-y-2">
          <div className="mb-4 px-2 py-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              필터
            </span>
          </div>
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleToggle(platform.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all duration-200 group ${
                selectedPlatforms.includes(platform.id)
                  ? "bg-[#2a2a2a] text-white"
                  : "hover:bg-[#1a1a1a] text-gray-400 hover:text-white"
              }`}
            >
              <span className="font-medium">{platform.label}</span>
              {selectedPlatforms.includes(platform.id) && (
                <svg
                  className="w-4 h-4 text-[#1DB954]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

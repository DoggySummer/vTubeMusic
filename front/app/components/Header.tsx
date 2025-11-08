"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직은 나중에 구현
    console.log("검색:", searchQuery);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ backgroundColor: "#1E2022", borderColor: "#2a2d30" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">VTubeMusic</h1>
          </div>
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="영상 제목, 혹은 아티스트를 검색해주세요"
                className="w-full px-4 py-2 pl-10 rounded-lg text-white placeholder-gray-400 text-base focus:outline-none transition-all box-border"
                style={{
                  backgroundColor: "#1E2022",
                  borderColor: "#3a3d40",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "2px solid white";
                  e.target.style.outlineOffset = "0px";
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none";
                }}
              />
            </div>
          </form>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
            style={{
              backgroundColor: "#1E2022",
              borderColor: "#2a2d30",
              borderWidth: "1px",
            }}
            aria-label="다크모드 토글"
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

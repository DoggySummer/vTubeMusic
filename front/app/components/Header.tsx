"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // URL 인코딩하여 아티스트 페이지로 이동
      const encodedName = encodeURIComponent(searchQuery.trim());
      router.push(`/artist/${encodedName}`);
    }
  };

  return (
    <header className="top-0 z-50 w-full bg-[#121212]">
      <div className="container mx-auto px-4 py-4">
        <div className="relative flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="absolute left-0 flex items-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              VTubeMusic
            </h1>
          </div>

          {/* 검색창 - 중앙 정렬 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400 group-focus-within:text-white transition-colors"
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
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어떤 버튜버가 당신을 기다리나요?"
                className="block w-full pl-12 pr-4 py-4 rounded-full leading-5 bg-[#242424] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-[#2a2a2a] transition-all text-base"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}

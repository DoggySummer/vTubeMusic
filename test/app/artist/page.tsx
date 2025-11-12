"use client";

import { useState } from "react";
import Image from "next/image";

type Platform = "soop" | "chzzk" | "youtube";

export default function ArtistPage() {
  const [name, setName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [broadcastLinks, setBroadcastLinks] = useState<{
    soop?: string;
    chzzk?: string;
    youtube?: string;
  }>({});

  const platforms: { key: Platform; label: string; icon: string }[] = [
    { key: "soop", label: "숲", icon: "/soop.png" },
    { key: "chzzk", label: "치지직", icon: "/chzzk.png" },
    { key: "youtube", label: "유튜브", icon: "/yotubue.svg" },
  ];

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        // 선택 해제 시 해당 플랫폼의 링크도 제거
        const newLinks = { ...broadcastLinks };
        delete newLinks[platform];
        setBroadcastLinks(newLinks);
        return prev.filter((p) => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleLinkChange = (platform: Platform, link: string) => {
    setBroadcastLinks((prev) => ({
      ...prev,
      [platform]: link,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = {
      name,
      platforms: selectedPlatforms,
      links: broadcastLinks,
    };

    // 콘솔에 JSON 형식으로 출력
    console.log(JSON.stringify(result, null, 2));

    alert("저장되었습니다!");
  };

  const handleReset = () => {
    setName("");
    setSelectedPlatforms([]);
    setBroadcastLinks({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">아티스트 등록</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="아티스트 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 플랫폼 타입 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              플랫폼 타입
            </label>
            <div className="flex flex-col gap-3">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.key);
                return (
                  <div key={platform.key} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => togglePlatform(platform.key)}
                      className={`w-full flex items-center justify-center gap-3 px-4 py-3 border-2 rounded-lg transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={platform.icon}
                        alt={platform.label}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium">{platform.label}</span>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* 선택된 플랫폼에 대한 링크 입력 */}
                    {isSelected && (
                      <div className="ml-2">
                        <input
                          type="url"
                          value={broadcastLinks[platform.key] || ""}
                          onChange={(e) =>
                            handleLinkChange(platform.key, e.target.value)
                          }
                          placeholder={`${platform.label} 방송국 링크를 입력하세요`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all"
            >
              저장하기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all"
            >
              초기화
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

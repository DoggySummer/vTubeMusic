"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

type Platform = "soop" | "chzzk" | "youtube";

export default function GroupPage() {
  const [groupName, setGroupName] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [youtubeLink, setYoutubeLink] = useState("");

  const platforms: {
    key: Platform;
    label: string;
    icon: string;
    value: string;
  }[] = [
    { key: "soop", label: "숲", icon: "/soop.png", value: "1" },
    { key: "chzzk", label: "치지직", icon: "/chzzk.png", value: "2" },
    { key: "youtube", label: "유튜브", icon: "/yotubue.svg", value: "3" },
  ];

  const getPlatformValue = (platformKey: Platform): string => {
    const platform = platforms.find((p) => p.key === platformKey);
    return platform?.value || "";
  };

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      platform_id: string;
      link: string;
    }) => {
      try {
        const response = await fetch("http://localhost:3200/group/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let errorMessage = "요청에 실패했습니다.";
          try {
            const error = await response.json();
            errorMessage = error.error || error.message || errorMessage;
          } catch {
            errorMessage = `서버 오류: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        return response.json();
      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          throw new Error(
            "서버에 연결할 수 없습니다. 백엔드 서버가 http://localhost:3200에서 실행 중인지 확인해주세요."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      alert("저장되었습니다!");
      handleReset();
    },
    onError: (error: Error) => {
      alert(`오류가 발생했습니다: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      alert("플랫폼을 선택해주세요.");
      return;
    }

    const platformValue = getPlatformValue(platform as Platform);

    mutation.mutate({
      name: groupName,
      platform_id: platformValue,
      link: youtubeLink,
    });
  };

  const handleReset = () => {
    setGroupName("");
    setPlatform("");
    setYoutubeLink("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">그룹 등록</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 그룹 이름 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              그룹 이름
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="그룹 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 플랫폼 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              플랫폼
            </label>
            <div className="flex flex-col gap-3">
              {platforms.map((platformOption) => (
                <label
                  key={platformOption.key}
                  className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    platform === platformOption.key
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={platformOption.key}
                    checked={platform === platformOption.key}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    required
                  />
                  <Image
                    src={platformOption.icon}
                    alt={platformOption.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span className="font-medium">{platformOption.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 유튜브 링크 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              유튜브 링크
            </label>
            <input
              id="youtubeLink"
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="유튜브 링크를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "저장 중..." : "저장하기"}
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

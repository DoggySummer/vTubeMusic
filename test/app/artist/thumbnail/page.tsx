"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

interface ChannelInfo {
  channelName: string;
  channelImage: string;
  channelImageUrl: string;
}

export default function ThumbnailPage() {
  const [url, setUrl] = useState("");
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidChannelUrl = (url: string): boolean => {
    // 다양한 YouTube 채널 URL 형식 확인
    // https://www.youtube.com/channel/CHANNEL_ID
    // https://www.youtube.com/@channelhandle
    // https://www.youtube.com/c/channelname
    // https://www.youtube.com/user/username
    // https://youtube.com/channel/CHANNEL_ID (www 없이)

    const patterns = [
      /youtube\.com\/channel\/[^\/\?\n&#]+/,
      /youtube\.com\/@[^\/\?\n&#]+/,
      /youtube\.com\/c\/[^\/\?\n&#]+/,
      /youtube\.com\/user\/[^\/\?\n&#]+/,
    ];

    return patterns.some((pattern) => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setChannelInfo(null);

    if (!isValidChannelUrl(url)) {
      setError("유효한 YouTube 채널 URL이 아닙니다. 채널 URL을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/youtube/channel?channelUrl=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "채널 정보를 가져오는데 실패했습니다.");
      }

      setChannelInfo(data);
      setName(data.channelName); // 채널 정보를 불러올 때 이름 초기화
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setChannelInfo(null);
    setName("");
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("클립보드에 복사되었습니다!");
    });
  };

  const mutation = useMutation({
    mutationFn: async (data: { name: string; thumbnail: string }) => {
      try {
        const response = await fetch("http://localhost:3200/artist/thumbnail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.status === "success") {
          return result;
        }

        // status가 success가 아닌 경우 에러 처리
        const errorMessage =
          result.error || result.message || "요청에 실패했습니다.";
        throw new Error(errorMessage);
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
    },
    onError: (error: Error) => {
      alert(`오류가 발생했습니다: ${error.message}`);
    },
  });

  const handleAdd = () => {
    if (!channelInfo) {
      alert("채널 정보를 먼저 불러와주세요.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    mutation.mutate({
      name: name.trim(),
      thumbnail: channelInfo.channelImageUrl,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          유튜버 썸네일 정보
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              YouTube URL
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube 채널 URL을 입력하세요 (예: https://www.youtube.com/@channelname)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "불러오는 중..." : "확인"}
          </button>
        </form>

        {loading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-600">채널 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {channelInfo && (
          <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              채널 정보
            </h2>

            {/* 채널 이미지 */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                <Image
                  src={channelInfo.channelImage}
                  alt={channelInfo.channelName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 채널 이름 */}
            <div className="space-y-2">
              <label
                htmlFor="channelName"
                className="block text-sm font-medium text-gray-700"
              >
                유튜버 이름
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="channelName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="유튜버 이름을 입력하세요"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
                />
                <button
                  onClick={() => copyToClipboard(name)}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all"
                  title="이름 복사"
                >
                  복사
                </button>
              </div>
            </div>

            {/* 이미지 URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지 URL
              </label>
              <div className="flex items-center gap-2">
                <p className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-sm break-all">
                  {channelInfo.channelImageUrl}
                </p>
                <button
                  onClick={() => copyToClipboard(channelInfo.channelImageUrl)}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all whitespace-nowrap"
                  title="URL 복사"
                >
                  복사
                </button>
              </div>
            </div>

            {/* 추가하기 버튼 */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={mutation.isPending}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "추가 중..." : "추가하기"}
            </button>

            {/* 초기화 버튼 */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all"
            >
              처음부터
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

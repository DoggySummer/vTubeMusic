"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoInfo {
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
}

type Platform = "soop" | "chzzk" | "youtube" | null;
type VideoType = "original" | "cover" | null;

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [selectedVideoType, setSelectedVideoType] = useState<VideoType>(null);

  const extractVideoId = (url: string): string | null => {
    // 다양한 YouTube URL 형식 처리
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID

    // v= 파라미터로 추출 (가장 일반적)
    const vParamMatch = url.match(/[?&]v=([^&\n?#]+)/);
    if (vParamMatch && vParamMatch[1]) {
      return vParamMatch[1];
    }

    // youtu.be 형식
    const youtuBeMatch = url.match(/youtu\.be\/([^&\n?#]+)/);
    if (youtuBeMatch && youtuBeMatch[1]) {
      return youtuBeMatch[1];
    }

    // embed 형식
    const embedMatch = url.match(/youtube\.com\/embed\/([^&\n?#]+)/);
    if (embedMatch && embedMatch[1]) {
      return embedMatch[1];
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoInfo(null);

    const id = extractVideoId(url);
    setVideoId(id);

    if (!id) {
      setError("유효한 YouTube URL이 아닙니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/youtube?videoId=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "영상 정보를 가져오는데 실패했습니다.");
      }

      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    alert("저장되었습니다!");
  };

  const handleReset = () => {
    setUrl("");
    setVideoId(null);
    setVideoInfo(null);
    setError(null);
    setSelectedPlatform(null);
    setSelectedVideoType(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold text-center">
          YouTube 비디오 ID 추출
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube URL을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            확인
          </button>
        </form>
        {loading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-600">영상 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {videoInfo && (
          <div className="mt-4 flex gap-4">
            {/* 영상 정보 */}
            <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <div className="space-y-4">
                {/* 썸네일 */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 영상 제목 */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {videoInfo.title}
                  </h2>
                </div>

                {/* 제작자 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">제작자:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {videoInfo.channelTitle}
                  </span>
                </div>

                {/* 통계 정보 */}
                <div className="flex items-center space-x-6 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.477.853l5-2.5a1 1 0 00.523-.853v-5.834a1 1 0 00-1.477-.853l-5 2.5a1 1 0 00-.523.853z" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      조회수: {videoInfo.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      좋아요: {videoInfo.likeCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 비디오 ID */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">비디오 ID:</p>
                  <p className="text-sm font-mono text-gray-700">{videoId}</p>
                </div>
              </div>
            </div>

            {/* 플랫폼 및 타입 선택 */}
            <div className="w-64 space-y-4">
              {/* 플랫폼 선택 라디오 버튼 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  플랫폼 선택
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlatform("soop")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                      selectedPlatform === "soop"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src="/soop.png"
                      alt="숲"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="font-medium">숲</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlatform("chzzk")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                      selectedPlatform === "chzzk"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src="/chzzk.png"
                      alt="치지직"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="font-medium">치지직</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlatform("youtube")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                      selectedPlatform === "youtube"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src="/yotubue.svg"
                      alt="유튜브"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="font-medium">유튜브</span>
                  </button>
                </div>
              </div>

              {/* 타입 선택 라디오 버튼 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영상 타입
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVideoType("original")}
                    className={`px-4 py-3 border-2 rounded-lg transition-all font-medium ${
                      selectedVideoType === "original"
                        ? "border-blue-500 bg-blue-50 shadow-md text-blue-700"
                        : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    오리지널
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVideoType("cover")}
                    className={`px-4 py-3 border-2 rounded-lg transition-all font-medium ${
                      selectedVideoType === "cover"
                        ? "border-blue-500 bg-blue-50 shadow-md text-blue-700"
                        : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    커버곡
                  </button>
                </div>
              </div>

              {/* 저장하기 및 처음부터 버튼 */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all"
                >
                  저장하기
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all"
                >
                  처음부터
                </button>
              </div>
            </div>
          </div>
        )}

        {videoId === null && url && !loading && !error && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-600">
              유효한 YouTube URL이 아닙니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

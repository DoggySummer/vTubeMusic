"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

interface VideoInfo {
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

type VideoType = "original" | "cover" | "concert" | null;

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoType, setSelectedVideoType] = useState<VideoType>(null);
  const [artistName, setArtistName] = useState("");
  const [songName, setSongName] = useState("");

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

  const getVideoTypeValue = (type: VideoType): string => {
    switch (type) {
      case "original":
        return "1";
      case "cover":
        return "2";
      case "concert":
        return "3";
      default:
        return "";
    }
  };

  const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPublishedDate = (publishedAt: string): string => {
    const date = new Date(publishedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const mutation = useMutation({
    mutationFn: async (data: {
      vId: string;
      artist_name: string;
      uploaded_at: string;
      type: string;
      image: string;
      link: string;
      title: string;
      name: string;
    }) => {
      try {
        const response = await fetch("http://localhost:3200/song/add", {
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

  const handleSave = () => {
    if (!videoId) {
      alert("비디오 ID가 없습니다. 먼저 YouTube URL을 확인해주세요.");
      return;
    }

    if (!artistName) {
      alert("아티스트 이름을 입력해주세요.");
      return;
    }

    if (!songName) {
      alert("노래 이름을 입력해주세요.");
      return;
    }

    if (!selectedVideoType) {
      alert("영상 타입을 선택해주세요.");
      return;
    }

    if (!videoInfo) {
      alert("영상 정보를 불러오지 못했습니다.");
      return;
    }

    const requestData = {
      vId: videoId,
      artist_name: artistName,
      uploaded_at: formatPublishedDate(videoInfo.publishedAt),
      type: getVideoTypeValue(selectedVideoType),
      image: videoInfo.thumbnail,
      link: url,
      title: videoInfo.title,
      name: songName,
    };

    mutation.mutate(requestData);
  };

  const handleReset = () => {
    setUrl("");
    setVideoId(null);
    setVideoInfo(null);
    setError(null);
    setSelectedVideoType(null);
    setArtistName("");
    setSongName("");
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

                {/* 비디오 ID 및 업로드 날짜 */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">비디오 ID:</p>
                      <p className="text-sm font-mono text-gray-700">
                        {videoId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">업로드 날짜:</p>
                      <p className="text-sm text-gray-700">
                        {formatPublishedDate(videoInfo.publishedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 타입 및 입력 선택 */}
            <div className="w-64 space-y-4">
              {/* 아티스트 이름 입력 */}
              <div className="space-y-2">
                <label
                  htmlFor="artistName"
                  className="block text-sm font-medium text-gray-700"
                >
                  아티스트 이름
                </label>
                <input
                  id="artistName"
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="아티스트 이름을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 노래 이름 입력 */}
              <div className="space-y-2">
                <label
                  htmlFor="songName"
                  className="block text-sm font-medium text-gray-700"
                >
                  노래 이름
                </label>
                <input
                  id="songName"
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="노래 이름을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  <button
                    type="button"
                    onClick={() => setSelectedVideoType("concert")}
                    className={`px-4 py-3 border-2 rounded-lg transition-all font-medium ${
                      selectedVideoType === "concert"
                        ? "border-blue-500 bg-blue-50 shadow-md text-blue-700"
                        : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    콘서트
                  </button>
                </div>
              </div>

              {/* 저장하기 및 처음부터 버튼 */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "저장 중..." : "저장하기"}
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

"use client";

import { useState, useEffect, use } from "react";
import { getArtist } from "@/app/lib/api";
import Image from "next/image";

interface ArtistPageProps {
  params: Promise<{ name: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const [artist, setArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchArtist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getArtist(decodedName);
        // 응답 구조: { status: "success", artist: { ... } }
        if (data && data.artist) {
          setArtist(data.artist);
        } else {
          // 만약 바로 artist 객체가 오거나 다른 구조일 경우 대비
          setArtist(data);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [decodedName, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">아티스트를 찾을 수 없습니다.</p>
          <p className="text-gray-400 text-sm">{decodedName}</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">아티스트 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 아티스트 헤더 섹션 - Spotify 스타일 */}
      <div className="relative w-full pt-20 px-8 pb-8 bg-linear-to-b from-[#535353] to-[#121212]">
        <div className="flex flex-col md:flex-row items-end gap-6 z-10 relative">
          {/* 아티스트 이미지 - 그림자 효과 */}
          <div className="shrink-0">
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-[#121212]/20 bg-[#333]">
              {artist.thumbnail ? (
                <Image
                  src={artist.thumbnail}
                  alt={artist.name || decodedName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                  <span className="text-4xl font-bold">
                    {(artist.name || decodedName)[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 텍스트 정보 */}
          <div className="flex flex-col gap-1 md:mb-2 w-full">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-1 text-white/90">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-blue-400 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Verified Artist
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mt-2 mb-4 line-clamp-1">
              {artist.name || decodedName}
            </h1>
            {artist.group && (
              <p className="text-lg md:text-xl text-gray-200 font-medium">
                {artist.group.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 및 액션 섹션 */}
      <div className="flex-1 p-8 bg-[#121212]">
        {/* 액션 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {/* 재생 버튼 (데코레이션) */}
          <button className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg text-black mr-2">
            <svg className="w-7 h-7 ml-1 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* 팔로우 버튼 (데코레이션) */}
          <button className="px-6 py-2 border border-gray-500 rounded-full hover:border-white hover:text-white text-gray-300 transition-all font-bold text-sm uppercase tracking-wider">
            Follow
          </button>

          {/* 실제 링크 버튼 */}
          {artist.platform_link && (
            <a
              href={artist.platform_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 border border-gray-500 rounded-full hover:border-white hover:bg-white/10 transition-all font-bold text-sm uppercase tracking-wider text-gray-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Channel
            </a>
          )}
          {artist.youtube_link && (
            <a
              href={artist.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 border border-gray-500 rounded-full hover:border-white hover:bg-white/10 transition-all font-bold text-sm uppercase tracking-wider text-gray-300 hover:text-white"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              YouTube
            </a>
          )}
        </div>

        {/* 하단 컨텐츠 영역 */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">인기 트랙</h2>
            {artist.song && artist.song.length > 0 ? (
              <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide snap-x snap-mandatory">
                {artist.song.map((song: any) => {
                  let typeLabel = "";
                  let typeColor = "";
                  switch (song.type) {
                    case "1":
                      typeLabel = "Original";
                      typeColor = "bg-blue-600";
                      break;
                    case "2":
                      typeLabel = "Cover";
                      typeColor = "bg-green-600";
                      break;
                    case "3":
                      typeLabel = "Concert";
                      typeColor = "bg-purple-600";
                      break;
                    default:
                      typeLabel = "Unknown";
                      typeColor = "bg-gray-600";
                  }

                  return (
                    <div
                      key={song.id}
                      className="shrink-0 w-72 group cursor-pointer snap-start"
                      onClick={() =>
                        song.link && window.open(song.link, "_blank")
                      }
                    >
                      {/* 카드 이미지 */}
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 shadow-lg group-hover:shadow-xl transition-shadow bg-[#333]">
                        {song.image ? (
                          <Image
                            src={song.image}
                            alt={song.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <svg
                              className="w-10 h-10 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                              />
                            </svg>
                          </div>
                        )}

                        {/* 타입 뱃지 */}
                        <div
                          className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded ${typeColor} bg-opacity-90 shadow-sm z-10`}
                        >
                          {typeLabel}
                        </div>

                        {/* 재생 버튼 오버레이 */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg text-black transform scale-90 group-hover:scale-100 transition-transform">
                            <svg
                              className="w-6 h-6 ml-1 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 카드 정보 */}
                      <div>
                        <h3 className="text-white font-bold text-lg truncate group-hover:text-[#1DB954] transition-colors">
                          {song.name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate mt-1">
                          {song.uploaded_at}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#181818]/50 rounded-md p-8 text-center text-gray-500">
                트랙 정보를 불러올 수 없습니다.
              </div>
            )}
          </div>

          {artist.description && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">소개</h2>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                {artist.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

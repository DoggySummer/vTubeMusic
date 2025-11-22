import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelUrl = searchParams.get("channelUrl");

  if (!channelUrl) {
    return NextResponse.json(
      { error: "채널 URL이 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    // 채널 URL에서 채널 ID 또는 핸들 추출
    let channelId: string | null = null;
    let handle: string | null = null;

    // 형식 1: https://www.youtube.com/channel/CHANNEL_ID
    const channelIdMatch = channelUrl.match(/youtube\.com\/channel\/([^\/\?\n&#]+)/);
    if (channelIdMatch && channelIdMatch[1]) {
      channelId = channelIdMatch[1];
    }

    // 형식 2: https://www.youtube.com/@handle
    const handleMatch = channelUrl.match(/youtube\.com\/@([^\/\?\n&#]+)/);
    if (handleMatch && handleMatch[1]) {
      handle = "@" + handleMatch[1];
    }

    // 형식 3: https://www.youtube.com/c/channelname 또는 /user/username
    const customMatch = channelUrl.match(/youtube\.com\/(?:c|user)\/([^\/\?\n&#]+)/);
    if (customMatch && customMatch[1] && !channelId && !handle) {
      // 커스텀 URL이나 사용자명인 경우 검색 API 사용
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(customMatch[1])}&type=channel&key=${apiKey}&part=snippet&maxResults=1`
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].id.channelId;
        }
      }
    }

    if (!channelId && !handle) {
      return NextResponse.json(
        { error: "유효한 채널 URL이 아닙니다." },
        { status: 400 }
      );
    }

    // 채널 정보 가져오기
    let channelResponse;
    if (channelId) {
      channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${apiKey}&part=snippet`
      );
    } else if (handle) {
      // 핸들로 채널 정보 가져오기 (최신 API)
      channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?forHandle=${handle}&key=${apiKey}&part=snippet`
      );
    } else {
      return NextResponse.json(
        { error: "채널을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (!channelResponse.ok) {
      // 핸들 API가 실패하면 검색 API로 시도
      if (handle) {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(handle)}&type=channel&key=${apiKey}&part=snippet&maxResults=1`
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.items && searchData.items.length > 0) {
            const foundChannelId = searchData.items[0].id.channelId;
            channelResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?id=${foundChannelId}&key=${apiKey}&part=snippet`
            );
          }
        }
      }

      if (!channelResponse.ok) {
        throw new Error(`YouTube API 오류: ${channelResponse.status}`);
      }
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: "채널을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const channel = channelData.items[0];
    const snippet = channel.snippet;

    return NextResponse.json({
      channelName: snippet.title,
      channelImage: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
      channelImageUrl: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
    });
  } catch (error) {
    console.error("YouTube API 오류:", error);
    return NextResponse.json(
      { error: "채널 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


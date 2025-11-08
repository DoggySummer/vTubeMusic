import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId가 필요합니다." },
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
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,statistics`
    );

    if (!response.ok) {
      throw new Error(`YouTube API 오류: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "영상을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;

    return NextResponse.json({
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      viewCount: parseInt(statistics.viewCount || "0", 10),
      likeCount: parseInt(statistics.likeCount || "0", 10),
    });
  } catch (error) {
    console.error("YouTube API 오류:", error);
    return NextResponse.json(
      { error: "영상 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


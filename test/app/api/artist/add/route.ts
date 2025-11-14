import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, platform_link } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name이 필요합니다." },
        { status: 400 }
      );
    }

    if (!platform_link) {
      return NextResponse.json(
        { error: "platform_link가 필요합니다." },
        { status: 400 }
      );
    }

    // 여기에 실제 데이터베이스 저장 로직을 추가하세요
    // 예시: 데이터베이스에 저장
    console.log("아티스트 저장:", { name, platform_link });

    return NextResponse.json(
      { message: "아티스트가 성공적으로 저장되었습니다.", name, platform_link },
      { status: 200 }
    );
  } catch (error) {
    console.error("아티스트 저장 오류:", error);
    return NextResponse.json(
      { error: "아티스트 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


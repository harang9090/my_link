import { ImageResponse } from "next/og";

// Next.js 메타태그 자동 설정을 위한 이미지 크기 및 포맷 스펙
export const alt = "마이링크 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Noto Sans KR 한글 폰트 로더 (필요한 글자만 서브셋하여 경량 로드)
async function getKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(
      text
    )}`;
    const css = await fetch(cssUrl, {
      headers: {
        // truetype/woff 포맷 유도를 위한 User-Agent
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
    }).then((res) => res.text());

    const match = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff)'\)/);
    if (match && match[1]) {
      const fontRes = await fetch(match[1]);
      if (fontRes.ok) {
        return await fontRes.arrayBuffer();
      }
    }
  } catch (error) {
    console.error("Noto Sans KR 폰트 로드 중 오류:", error);
  }
  return null;
}

type Props = {
  params: Promise<{ username: string }> | { username: string };
};

// 정적 빌드 지원을 위한 기본 파라미터 (output: export 호환)
export function generateStaticParams() {
  return [
    { username: "demo" },
    { username: "creator" },
  ];
}

export default async function OpenGraphImage({ params }: Props) {
  const resolvedParams = await params;
  const rawUsername = resolvedParams?.username || "creator";
  const decodedUsername = decodeURIComponent(rawUsername);

  // 폰트에 포함할 한글 텍스트 (로고 + 사용자명 + 안내문구)
  const fullText = `마이링크 나를 표현하는 단 하나의 프로필 링크 ${decodedUsername}`;
  const fontData = await getKoreanFont(fullText);

  const fonts = fontData
    ? [
        {
          name: "Noto Sans KR",
          data: fontData,
          weight: 700 as const,
          style: "normal" as const,
        },
      ]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5B5FC7", // 요구사항: 보라색 배경 (#5B5FC7)
          padding: "48px 64px",
          fontFamily: fonts ? "Noto Sans KR, sans-serif" : "sans-serif",
          position: "relative",
        }}
      >
        {/* 부드러운 오버레이 글로우 원형 배경 효과 */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0) 70%)",
          }}
        />

        {/* 메인 카드 프레임 */}
        <div
          style={{
            width: "100%",
            maxWidth: "1040px",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "36px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "48px 56px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* 1. 상단: 서비스 로고 ("마이링크" MyLink) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                display: "flex",
                alignItems: "center",
              }}
            >
              🔗
            </div>
            <span
              style={{
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              마이링크
            </span>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "18px",
                fontWeight: 700,
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                padding: "2px 10px",
                borderRadius: "8px",
              }}
            >
              MyLink
            </span>
          </div>

          {/* 2. 중앙: 사용자 이름 & 프로필 정보 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
            }}
          >
            {/* 아바타 아이콘 */}
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "48px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <span
                style={{
                  fontSize: "44px",
                }}
              >
                👤
              </span>
            </div>

            {/* 사용자 이름 (params에서 추출) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "56px",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-1px",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {decodedUsername}
              </h1>
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "36px",
                  fontWeight: 700,
                }}
              >
                님의 마이링크
              </span>
            </div>

            {/* 태그라인 */}
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "24px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              나를 표현하는 단 하나의 프로필 링크
            </p>
          </div>

          {/* 3. 하단: 링크 주소 & 배지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "monospace",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🌐</span>
              <span>mylink.to/{rawUsername}</span>
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 700,
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                padding: "8px 20px",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              프로필 바로가기 →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import UserProfileClient from "./UserProfileClient";

// output: "export" 정적 빌드를 위한 사전 생성 파라미터
export function generateStaticParams() {
  return [
    { username: "demo" },
    { username: "creator" },
  ];
}

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const decoded = decodeURIComponent(username);

  return {
    title: `${decoded}님의 프로필 | 마이링크 (MyLink)`,
    description: `${decoded}님의 모든 활동과 링크를 한눈에 확인하세요.`,
    // Next.js App Router가 같은 폴더의 opengraph-image.tsx를 감지하여
    // 자동으로 openGraph.images 메타태그를 생성 및 주입합니다.
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-slate-100">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">프로필을 불러오는 중...</p>
          </div>
        }
      >
        <UserProfileClient username={username} />
      </Suspense>
    </main>
  );
}

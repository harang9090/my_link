"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfileByUsername, type UserProfile } from "@/lib/profile";

export default function UserProfileClient({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      setLoading(true);
      const data = await getProfileByUsername(username);
      if (isMounted) {
        setProfile(data);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-pulse">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 dark:bg-zinc-800" />
        <div className="h-6 w-36 mx-auto bg-slate-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-4 w-24 mx-auto bg-slate-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-20 w-full bg-slate-100 dark:bg-zinc-800/60 rounded-2xl" />
      </div>
    );
  }

  if (!username || !profile) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="text-4xl">🔍</div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight">프로필을 찾을 수 없습니다</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {username
              ? `@${username} 사용자의 프로필이 존재하지 않거나 아직 생성되지 않았습니다.`
              : "조회할 username이 지정되지 않았습니다."}
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/mypage"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition shadow text-sm"
          >
            내 프로필 만들러 가기
          </Link>
          <Link href="/" className="text-xs text-slate-500 hover:underline pt-2">
            ← 메인 홈으로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6 relative">
      {/* 공유 버튼 */}
      <button
        onClick={handleCopy}
        title="링크 복사"
        className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-600 dark:text-slate-300 transition cursor-pointer"
      >
        {copied ? "✔ 복사됨" : "🔗 공유"}
      </button>

      {/* Profile Avatar */}
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg">
        <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden">
          {profile.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              {profile.displayName.slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
        <p className="text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">
          @{profile.username}
        </p>
      </div>

      {/* Bio */}
      <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-2xl p-5 border border-slate-100 dark:border-zinc-800">
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed break-keep whitespace-pre-wrap text-left sm:text-center">
          {profile.bio || "등록된 소개글이 없습니다."}
        </p>
      </div>

      {/* 하단 링크 & 마이링크 홍보 */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400">
        <Link href="/" className="hover:text-indigo-500 transition flex items-center gap-1 font-medium">
          <span>🔗</span>
          <span>MyLink</span>
        </Link>
        <Link
          href="/mypage"
          className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-100 transition"
        >
          나도 프로필 만들기 ✨
        </Link>
      </div>

      {/* Creator Signature */}
      <div className="pt-1 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5 font-medium tracking-tight">
        <span>created with 💜</span>
        <span>·</span>
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          from.hyeon
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  getUserProfile,
  saveUserProfile,
  checkUsernameAvailability,
  generateDefaultUsername,
  type UserProfile,
} from "@/lib/profile";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form states
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  // Validation & status states
  const [originalUsername, setOriginalUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{
    checked: boolean;
    available?: boolean;
    checking?: boolean;
    message?: string;
  }>({ checked: false });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // 1. Firebase Auth 상태 감지 및 프로필 자동 로드
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // 기존 저장된 프로필 가져오기
        const existingProfile = await getUserProfile(currentUser.uid);

        if (existingProfile && existingProfile.username) {
          setUsername(existingProfile.username);
          setOriginalUsername(existingProfile.username);
          setDisplayName(
            existingProfile.displayName ||
              currentUser.displayName ||
              existingProfile.username
          );
          setBio(existingProfile.bio || "");
          setUsernameStatus({
            checked: true,
            available: true,
            message: "현재 사용 중인 본인의 username입니다.",
          });
        } else {
          // 최초 로그인 시: username은 이메일 앞부분으로 자동 생성, displayName은 구글 이름 기본값
          const defaultUsername = generateDefaultUsername(currentUser.email);
          const defaultDisplayName =
            currentUser.displayName || defaultUsername;
          const defaultBio =
            "안녕하세요! 저의 개발자 프로필 페이지에 오신 것을 환영합니다.";

          setUsername(defaultUsername);
          setOriginalUsername("");
          setDisplayName(defaultDisplayName);
          setBio(defaultBio);

          // 자동 생성된 기본 username 중복 검사 실행
          validateUsername(defaultUsername, currentUser.uid);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. username 중복 체크 함수
  const validateUsername = useCallback(
    async (targetUsername: string, uid?: string) => {
      const clean = targetUsername.trim().toLowerCase();
      if (!clean) {
        setUsernameStatus({
          checked: true,
          available: false,
          message: "username을 입력해 주세요.",
        });
        return false;
      }

      // 본인이 원래 쓰던 username인 경우 통과
      if (originalUsername && clean === originalUsername.toLowerCase()) {
        setUsernameStatus({
          checked: true,
          available: true,
          message: "현재 사용 중인 본인의 username입니다.",
        });
        return true;
      }

      setUsernameStatus({ checked: false, checking: true });
      const result = await checkUsernameAvailability(clean, uid || user?.uid);

      if (result.available) {
        setUsernameStatus({
          checked: true,
          available: true,
          message: "사용 가능한 멋진 username입니다! ✨",
        });
        return true;
      } else {
        setUsernameStatus({
          checked: true,
          available: false,
          message: result.error || "이미 사용 중인 username입니다.",
        });
        return false;
      }
    },
    [originalUsername, user?.uid]
  );

  // username 변경 핸들러
  const handleUsernameChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(sanitized);
    setUsernameStatus({ checked: false });
    setSaveSuccess(false);
    setErrorMessage("");
  };

  // Google 로그인
  const handleGoogleLogin = async () => {
    try {
      setErrorMessage("");
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error("로그인 실패:", err);
      const msg =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUsername("");
      setDisplayName("");
      setBio("");
      setSaveSuccess(false);
      setErrorMessage("");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  // 프로필 저장 핸들러
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    // 1. username 중복 최종 확인
    const isAvailable = await validateUsername(username, user.uid);
    if (!isAvailable) {
      setSaving(false);
      setErrorMessage(
        usernameStatus.message || "username을 다시 확인해 주세요."
      );
      return;
    }

    if (!displayName.trim()) {
      setSaving(false);
      setErrorMessage("표시 이름을 입력해 주세요.");
      return;
    }

    // 2. Firestore에 저장 (users/{userId}/profile 경로 포함)
    const result = await saveUserProfile(user.uid, {
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      bio: bio.trim(),
      email: user.email || "",
      photoURL: user.photoURL || "",
    });

    setSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setOriginalUsername(username.trim().toLowerCase());
      // 3초 후 성공 알림 숨김
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setErrorMessage(result.error || "프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // 공유 링크 복사
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile?u=${username}`
      : `https://my-link-hyeon.web.app/profile?u=${username}`;

  const handleCopyLink = () => {
    if (!username) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">인증 상태를 확인하고 있습니다...</p>
        </div>
      </main>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">마이페이지 로그인</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              내 프로필 정보(username, 표시이름, 소개글)를 수정하려면 로그인이 필요합니다.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-left">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-2xl font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google 계정으로 계속하기
          </button>

          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← 메인 프로필 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 로그인 완료된 경우: 마이페이지 프로필 편집 폼
  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-slate-100">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 상단 네비게이션 헤더 */}
        <header className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition"
          >
            <span>🔗</span>
            <span>MyLink</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                  {displayName ? displayName.charAt(0) : "U"}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-300">
                {user.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition text-slate-600 dark:text-slate-400"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* 안내 및 공유 링크 복사 배너 */}
        {originalUsername && (
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                🌐 내 공유 URL
              </span>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-200 break-all">
                {shareUrl}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none text-xs px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow cursor-pointer whitespace-nowrap"
              >
                {copied ? "복사 완료! ✔" : "링크 복사"}
              </button>
              <Link
                href={`/profile?u=${originalUsername}`}
                className="flex-1 sm:flex-none text-xs px-3.5 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 font-medium rounded-xl transition text-slate-700 dark:text-slate-200 text-center whitespace-nowrap"
              >
                프로필 보기 ↗
              </Link>
            </div>
          </div>
        )}

        {/* 프로필 수정 폼 카드 */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <h1 className="text-2xl font-bold tracking-tight">프로필 설정</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              공유 URL용 username, 표시 이름, 소개글을 원하는 내용으로 변경해 보세요.
            </p>
          </div>

          {/* 성공 메시지 */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
              <span className="text-xl">🎉</span>
              <div>
                <p className="font-semibold">프로필이 성공적으로 저장되었습니다!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Firebase Firestore (<code>users/{user.uid}/profile</code>)에 안전하게 반영되었습니다.
                </p>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">저장 중 문제가 발생했습니다.</p>
                <p className="text-xs">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. username 필드 (공유 URL용) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <span>username (공유 URL용)</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  영문 소문자, 숫자, _, - 만 사용
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-mono text-sm select-none">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  onBlur={() => validateUsername(username, user.uid)}
                  placeholder="hyeon_dev"
                  className="w-full pl-8 pr-28 py-3 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => validateUsername(username, user.uid)}
                  disabled={usernameStatus.checking || !username}
                  className="absolute right-2 px-3 py-1.5 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-xs font-medium rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {usernameStatus.checking ? "확인 중..." : "중복 확인"}
                </button>
              </div>

              {/* username 검증 상태 메시지 */}
              {usernameStatus.checked && (
                <p
                  className={`text-xs font-medium flex items-center gap-1.5 mt-1 ${
                    usernameStatus.available
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  <span>{usernameStatus.available ? "✔" : "✖"}</span>
                  <span>{usernameStatus.message}</span>
                </p>
              )}
            </div>

            {/* 2. displayName 필드 (표시 이름) */}
            <div className="space-y-2">
              <label
                htmlFor="displayName"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              >
                <span>displayName (표시 이름)</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="김하연"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* 3. bio 필드 (소개글) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="bio"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  bio (소개글)
                </label>
                <span className="text-xs text-slate-400">
                  {bio.length} / 200자
                </span>
              </div>
              <textarea
                id="bio"
                rows={4}
                maxLength={200}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="문제 해결과 지속적인 성장을 즐기는 개발자입니다."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* 저장 버튼 */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || (usernameStatus.checked && !usernameStatus.available)}
                className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <span>프로필 저장하기</span>
                )}
              </button>

              <Link
                href="/"
                className="px-5 py-3.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-medium rounded-2xl transition text-center text-sm"
              >
                취소
              </Link>
            </div>
          </form>
        </div>

        {/* 실시간 미리보기 카드 */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            실시간 프로필 미리보기
          </h2>
          <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-md text-center space-y-4 opacity-95">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-md">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={displayName || "Preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                    {displayName ? displayName.slice(0, 2) : "하연"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">
                {displayName || "표시 이름 미리보기"}
              </h3>
              <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                @{username || "username"}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-keep">
              {bio || "소개글이 여기에 표시됩니다."}
            </div>

            {/* Creator Signature Preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5 font-medium tracking-tight">
              <span>created with 💜</span>
              <span>·</span>
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                from.hyeon
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

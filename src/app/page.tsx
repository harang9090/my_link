export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        {/* Profile Avatar */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg">
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              하연
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">김하연</h1>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            대학생 &amp; 바이브 코더
          </p>
        </div>

        {/* Bio */}
        <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed break-keep">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
        </div>

        {/* Tags */}
        <div className="pt-2 flex justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-900">
            ✨ 바이브 코딩
          </span>
          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-100 dark:border-purple-900">
            🎓 대학생
          </span>
          <span className="px-3 py-1 bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 text-xs font-semibold rounded-full border border-pink-100 dark:border-pink-900">
            🚀 배움의 즐거움
          </span>
        </div>
      </div>
    </main>
  );
}

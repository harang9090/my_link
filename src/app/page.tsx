import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[130px] rounded-full dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/20" />
        <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-[120px] rounded-full dark:from-blue-900/20 dark:to-indigo-950/20" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-zinc-950/75 border-b border-slate-200/70 dark:border-zinc-800/70 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <span className="text-base">🔗</span>
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              마이링크{" "}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 ml-1">
                MyLink
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/mypage"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white px-3 py-2 rounded-lg transition-colors hidden sm:inline-block"
            >
              내 링크 관리
            </Link>
            <Link
              href="/mypage"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all duration-200"
            >
              <span>시작하기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Hero Text & Call-To-Action */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>✨ 나를 표현하는 가장 세련된 방법</span>
                </div>

                {/* Hero Title & Tagline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                    모든 링크를 하나로, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      마이링크
                    </span>
                    로 완성하세요
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep">
                    인스타그램, 유튜브, 블로그, 포트폴리오까지. <br className="hidden sm:inline" />
                    흩어져 있는 나의 모든 것을 단 1분 만에 감각적인 단 하나의 프로필 링크에 담아보세요.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/mypage"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                  >
                    <span>지금 무료로 내 링크 만들기</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      🚀
                    </span>
                  </Link>

                  <a
                    href="#features"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/80 shadow-sm transition-all duration-200"
                  >
                    <span>주요 기능 둘러보기</span>
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>

                {/* Key Benefits Pills */}
                <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>100% 무료 서비스</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1분 간편 가입 &amp; 설정</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>반응형 모바일 최적화</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Mockup Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Glowing backdrop circle */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-[36px] blur-xl opacity-30 dark:opacity-40 animate-pulse" />

                  {/* Device / Card Frame */}
                  <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-[32px] p-6 shadow-2xl space-y-6">
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80 text-xs text-slate-400">
                      <span className="font-mono">mylink.to/creator</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Profile Avatar & Info */}
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2.5px] shadow-md">
                        <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                            ML
                          </span>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          마이링크 크리에이터
                        </h2>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          @mylink_official
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 leading-relaxed">
                        안녕하세요! 마이링크로 연결되는 저의 작업물과 소통 채널들을 소개합니다 ✨
                      </p>
                    </div>

                    {/* Interactive Sample Links Mockup */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">💼</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            포트폴리오 &amp; 이력서
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all">
                          →
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">📝</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            기술 블로그 바로가기
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all">
                          →
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 hover:border-pink-400 dark:hover:border-pink-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">📸</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            인스타그램 &amp; 일상
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all">
                          →
                        </span>
                      </div>
                    </div>

                    {/* Preview CTA Button in Card */}
                    <div className="pt-1 space-y-2">
                      <Link
                        href="/mypage"
                        className="block w-full py-2.5 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-colors border border-indigo-100 dark:border-indigo-900"
                      >
                        나도 이 템플릿으로 만들기 →
                      </Link>
                      <div className="text-[11px] text-center text-slate-400 dark:text-zinc-500 font-medium">
                        created with 💜 · <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">from.hyeon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-white/60 dark:bg-zinc-900/50 border-y border-slate-200/60 dark:border-zinc-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Core Features
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                누구나 손쉽게 만드는 나만의 링크
              </p>
              <p className="text-base text-slate-600 dark:text-zinc-400">
                복잡한 코딩이나 디자인 지식 없이도 몇 번의 클릭만으로 개성 넘치는 페이지를 만들 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-7 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  1분 만에 끝나는 생성
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed break-keep">
                  소셜 로그인 후 원하는 고유 아이디(username)만 입력하면 나만의 프로필 페이지가 즉시 생성됩니다.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-7 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  감각적인 카드 디자인
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed break-keep">
                  모바일, 태블릿, 데스크톱 어디서든 아름답게 보이는 트렌디한 카드 형태의 UI를 기본 제공합니다.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-7 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  자유로운 링크 공유
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed break-keep">
                  생성된 단 하나의 주소를 인스타그램 소개글, 유튜브 설명란, 명함, 이메일 서명 등에 자유롭게 활용하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                지금 바로 나만의 마이링크를 시작해보세요
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto break-keep">
                복잡한 과정 없이, 단 하나의 링크로 당신의 모든 활동을 사람들에게 보여줄 수 있습니다.
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/mypage"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>무료로 내 마이링크 만들기</span>
                <span>✨</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 dark:border-zinc-800/80 py-8 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-zinc-300">🔗 마이링크 (MyLink)</span>
            <span>·</span>
            <span>나만의 올인원 프로필 링크 서비스</span>
            <span>·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">from.hyeon</span>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} MyLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

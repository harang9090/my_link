# 🔗 MyLink (`my_link`)

> 개발자 김하연의 개인 미니 프로필 링크 페이지입니다.  
> 모던하고 미니멀한 카드 디자인으로 제작되었으며, 라이트/다크 모드를 모두 지원합니다.

---

## ✨ 주요 특징 (Features)

- **🎨 모던하고 감각적인 UI**: 부드러운 그라데이션 아바타와 둥근 카드 레이아웃
- **🌓 다크 모드 완벽 지원**: 시스템 테마 및 사용자 설정에 맞춰 자동 전환되는 다크/라이트 테마
- **📱 완전 반응형 디자인**: 모바일과 데스크톱 화면 모두에 최적화된 유연한 레이아웃
- **⚡ 초고속 렌더링**: Next.js App Router를 활용한 뛰어난 로딩 속도 및 SEO 최적화

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Tooling**: ESLint, PostCSS

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

또는 Windows 환경의 경우 폴더 내 `start_dev.bat` 파일을 더블 클릭하여 바로 실행할 수 있습니다.

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## 📁 프로젝트 구조 (Project Structure)

```text
my_link/
├── public/                 # 정적 리소스 (아이콘, 이미지 등)
├── src/
│   └── app/
│       ├── layout.tsx      # 루트 레이아웃 & 메타데이터
│       ├── page.tsx        # 메인 프로필 페이지
│       └── globals.css     # Tailwind CSS 전역 스타일
├── .gitignore              # Git 제외 파일 목록
├── package.json            # 프로젝트 의존성 및 스크립트
├── tsconfig.json           # TypeScript 설정
└── README.md               # 프로젝트 안내 문서
```

---

## 📄 라이선스 (License)

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

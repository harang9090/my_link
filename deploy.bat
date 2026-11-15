@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo   Firebase 호스팅 로그인 및 배포를 시작합니다
echo ========================================================
echo.
echo [1단계] Firebase 로그인을 진행합니다...
echo 브라우저 창이 열리면 Google 계정으로 로그인해 주세요.
echo.
call npx.cmd firebase-tools login
echo.
echo [2단계] 최신 코드를 빌드하고 Firebase로 배포합니다...
call npm.cmd run deploy
echo.
echo ========================================================
echo   배포가 완료되었습니다!
echo   웹 주소: https://my-link-hyeon.web.app
echo ========================================================
echo.
pause

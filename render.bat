@echo off
if "%~1"=="" (
    echo.
    echo   GUESSLIX Video Renderer
    echo   =======================
    echo   Kullanim: render.bat dosya-adi [long/short/both]
    echo   Ornek:    render.bat sample-flags long
    echo   Ornek:    render.bat logo-quiz-100 both
    echo.
    echo   Dosya src/data/ klasorunde olmali (uzantisiz yaz).
    echo   Mod belirtilmezse "both" kullanilir.
    echo.
    exit /b 1
)

set DATAFILE=%~1
set MODE=%~2
if "%MODE%"=="" set MODE=both

if not exist "src\data\%DATAFILE%.json" (
    echo [HATA] src\data\%DATAFILE%.json bulunamadi!
    exit /b 1
)

echo [GUESSLIX] %DATAFILE%.json aktif ediliyor...
copy /Y "src\data\%DATAFILE%.json" "src\data\active-quiz.json" >nul

if not exist "out" mkdir out

if "%MODE%"=="long" goto render_long
if "%MODE%"=="short" goto render_short
if "%MODE%"=="both" goto render_both
echo [HATA] Gecersiz mod: %MODE% (long/short/both kullanin)
exit /b 1

:render_long
echo [GUESSLIX] Long video render ediliyor...
call npx remotion render LongQuiz "out/%DATAFILE%-long.mp4"
goto done

:render_short
echo [GUESSLIX] Short video render ediliyor...
call npx remotion render ShortQuiz "out/%DATAFILE%-short.mp4"
goto done

:render_both
echo [GUESSLIX] Long video render ediliyor...
call npx remotion render LongQuiz "out/%DATAFILE%-long.mp4"
echo [GUESSLIX] Short video render ediliyor...
call npx remotion render ShortQuiz "out/%DATAFILE%-short.mp4"
goto done

:done
echo.
echo [GUESSLIX] Tamamlandi! Videolar out/ klasorunde:
if exist "out\%DATAFILE%-long.mp4" echo   - out/%DATAFILE%-long.mp4
if exist "out\%DATAFILE%-short.mp4" echo   - out/%DATAFILE%-short.mp4
echo.
echo v2 flag premium icin:
echo   npm run render:flags-long   -^> out/flags-197-long.mp4
echo   npm run render:flags-short  -^> out/flags-10-short.mp4

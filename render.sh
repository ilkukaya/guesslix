#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
    echo ""
    echo "  GUESSLIX Video Renderer"
    echo "  ======================="
    echo "  Kullanim: ./render.sh dosya-adi [long|short|both]"
    echo "  Ornek:    ./render.sh sample-flags long"
    echo "  Ornek:    ./render.sh logo-quiz-100 both"
    echo ""
    echo "  Dosya src/data/ klasorunde olmali (uzantisiz yaz)."
    echo "  Mod belirtilmezse \"both\" kullanilir."
    echo ""
    exit 1
fi

DATAFILE="$1"
MODE="${2:-both}"

if [ ! -f "src/data/${DATAFILE}.json" ]; then
    echo "[HATA] src/data/${DATAFILE}.json bulunamadi!"
    exit 1
fi

echo "[GUESSLIX] ${DATAFILE}.json aktif ediliyor..."
cp "src/data/${DATAFILE}.json" "src/data/active-quiz.json"

mkdir -p out

if [ "$MODE" = "long" ] || [ "$MODE" = "both" ]; then
    echo "[GUESSLIX] Long video render ediliyor..."
    npx remotion render LongQuiz "out/${DATAFILE}-long.mp4"
fi

if [ "$MODE" = "short" ] || [ "$MODE" = "both" ]; then
    echo "[GUESSLIX] Short video render ediliyor..."
    npx remotion render ShortQuiz "out/${DATAFILE}-short.mp4"
fi

echo ""
echo "[GUESSLIX] Tamamlandi! Videolar out/ klasorunde:"
[ -f "out/${DATAFILE}-long.mp4" ] && echo "  - out/${DATAFILE}-long.mp4"
[ -f "out/${DATAFILE}-short.mp4" ] && echo "  - out/${DATAFILE}-short.mp4"
echo ""

# v2 flag premium commands (dogrudan npm run ile de calistirabilirsin):
#   npm run render:flags-long   -> out/flags-197-long.mp4
#   npm run render:flags-short  -> out/flags-10-short.mp4

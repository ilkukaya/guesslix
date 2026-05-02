# Guesslix — Remotion Quiz Video Generator

## Kurulum (3 adım)

### Adım 1: ZIP'i çıkart
Bu ZIP dosyasını masaüstüne veya istediğin bir yere çıkart.
İçinde `guesslix` klasörü olacak.

### Adım 2: Terminal aç ve kur
Windows: klasöre sağ tıkla → "Open in Terminal" veya VS Code'da Terminal aç
Mac: klasöre sağ tıkla → "Open Terminal Here"

```bash
cd guesslix
npm install
```

Bu komut tüm dependency'leri indirir. 1-2 dakika sürebilir.

### Adım 3: Remotion Studio'yu aç
```bash
npm run dev
```

Tarayıcıda otomatik açılır: http://localhost:3000
Sol tarafta 2 composition göreceksin:
- **LongQuiz** (16:9, 1920x1080) — YouTube longform
- **ShortQuiz** (9:16, 1080x1920) — YouTube Shorts

Play butonuna bas, videoyu izle!

## Video Render (MP4 olarak kaydetmek)

```bash
# Longform video render
npm run render:long

# Shorts video render  
npm run render:short
```

MP4 dosyası `out/` klasöründe oluşur.

## Yeni Quiz Oluşturmak

`src/data/sample-flags.json` dosyasını düzenle veya yeni JSON dosyaları ekle.
Format:

```json
{
  "quizId": "logos-001",
  "category": "guess_the_logo",
  "questions": [
    {
      "id": 1,
      "type": "emoji_decode",
      "emoji": "🍎",
      "questionText": "Which company's logo is this?",
      "options": ["Apple", "Samsung", "Google", "Microsoft"],
      "correctIndex": 0,
      "timerSeconds": 5,
      "difficulty": "easy",
      "funFact": "Apple's first logo featured Isaac Newton under a tree."
    }
  ]
}
```

---

## v3 Flag Premium Format — Kullanım

v3 ("Atlas") editorial-cinematic bayrak quiz formatı. v1 (universal quiz)
yanında ikinci composition seti olarak çalışır.

**Compositionlar**
- `LongQuizV3` — 1920×1080, 197 ülke, ~19m 50s
- `ShortQuizV3` — 1080×1920, 10 ülke, ~65s (YT Shorts uyumlu)

**Önizleme**
```bash
npm run dev
# studio'da LongQuizV3 veya ShortQuizV3 seç
```

**Render**
```bash
npm run render:flags-long    # → out/flags-197-long.mp4
npm run render:flags-short   # → out/flags-10-short.mp4
```

**Veri**
197 ülkenin tamamı `src/data/flags-197.json`'da, zorluk eğrisine göre sıralı:
1-30 kolay, 31-100 orta, 101-170 zor, 171-197 sadist.
Daha kısa bir quiz için `Root.tsx`'te `maxQuestions` değerini değiştir.

**Tasarım dili**
- Editorial palette: deep navy + gold + ivory + coral/mint accents
- Bayrak büyük ve serbest (bounded card yok)
- "Ghost countdown" — 4-3-2-1 büyük şeffaf rakam bayrağın arkasında
- Slim üst timer bar — soldan sağa drain eder
- Continent-directional sweep-in: bayrak kıtanın yönünden gelir
- Country reveal: outline + solid kinetic typography
- Color bars reveal: bayrağın 3 ana rengi alttan büyür
- Outro: 5 katmanlı tier ladder ("TOURIST → ATLAS")

**Ses dosyaları (mevcut)**
v3, halihazırdaki `public/audio/` setini kullanır:
`whoosh.wav`, `tick.wav`, `tick_fast.wav`, `pop.wav`, `correct.wav`,
`intro_boom.wav`, `fanfare.wav`, `bgm.wav`. Yeni dosya gerekmiyor.

## Sorun Giderme

**"npm not found"** → Node.js kurulu değil. nodejs.org'dan indir.
**Port 3000 meşgul** → Başka bir terminal'de çalışan proje var, onu kapat.
**Emoji görünmüyor** → Bilgisayarında emoji fontu lazım (Windows 10+ ve Mac'te varsayılan var).

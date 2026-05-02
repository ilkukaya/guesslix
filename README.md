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

## v2 Flag Premium Format — Kullanım

### Genel Bakış

`LongQuizV2` ve `ShortQuizV2` compositionları, 197 ülkeyi kapsayan yüksek kaliteli bir bayrak quiz formatı sunar. Tasarım referansı: "The Quiz Place" kanalının 5.6M izlenen 197 bayrak videosu.

### Yeni compositionlar

| Composition  | Boyut       | FPS | Soru  | Süre     |
|-------------|-------------|-----|-------|----------|
| LongQuizV2  | 1920×1080   | 30  | 197   | ~19.8 dk |
| ShortQuizV2 | 1080×1920   | 30  | 10    | ~68 sn   |

### Preview (Studio)

```bash
npm run dev
```

Studio'da `LongQuizV2` ve `ShortQuizV2` compositionlarını seçerek önizleyebilirsin.

### Render

```bash
# 197 soru, 1920×1080 — out/flags-197-long.mp4
npm run render:flags-long

# 10 soru (Shorts), 1080×1920 — out/flags-10-short.mp4
npm run render:flags-short
```

> **Not:** 197 soruluk render yaklaşık 35.700 frame içerir. `--concurrency=4` ile render süresi makul tutulur ancak yine de uzun sürer. Güçlü bir makinede yaklaşık 15–30 dakika.

### Görsel sistem

- **Renk paleti:** `src/theme.ts` dosyasında CSS değişkenleri olarak tanımlı
- **Tipografi:** Anton (başlıklar/sayaç) + Inter (gövde), Google Fonts üzerinden yüklenir
- **Arka plan:** Yavaş animasyonlu mesh gradient (`MeshBackground`) + film grain overlay (`GrainOverlay`)
- **Bayraklar:** `flag-icons` npm paketi üzerinden CSS sınıflarıyla render edilir

### Veri kaynağı

`src/data/flags-197.json` — 197 ülkenin tamamını içerir:

```json
{
  "id": 1,
  "country": "United States",
  "countryCode": "us",
  "primaryColors": ["#B22234", "#FFFFFF", "#3C3B6E"],
  "difficulty": "easy",
  "continent": "Americas",
  "funFact": "The 50 stars represent the 50 states..."
}
```

**Zorluk dağılımı:**
- `easy` (1–30): ABD, İngiltere, Fransa, Japonya, vb.
- `medium` (31–100): Polonya, Endonezya, Etiyopya, Kazakistan, vb.
- `hard` (101–170): Kuzey Kore, Kamboçya, Vanuatu, Solomon Adaları, vb.
- `sadist` (171–197): Komor, Kiribati, Tuvalu, Nauru, Palau, Vatikan, vb.

### Gerekli ses dosyaları

Aşağıdaki ses dosyaları `public/audio/` klasörüne eklenmelidir:

| Dosya                    | Kullanım                              |
|--------------------------|---------------------------------------|
| `tick.wav`               | Her saniye sayacı (mevcut ✅)         |
| `reveal.wav`             | Cevap açıklanırken (mevcut ✅)        |
| `intro_whoosh.wav`       | Intro ekranı                          |
| `outro.wav`              | Outro ekranı                          |

Mevcut `public/audio/` klasöründe `tick.wav` ve `fanfare.wav` zaten bulunmaktadır. `intro_whoosh.wav` için `whoosh.wav`'ı, `outro.wav` için `fanfare.wav`'ı yeniden adlandırabilir ya da yeni dosyalar ekleyebilirsin.

### Yeni dosyalar (v2)

```
src/
├── theme.ts                              ← Renk paleti ve font token'ları
├── types/flagQuiz.ts                     ← FlagQuestion, FlagQuizV2Props tipleri
├── data/flags-197.json                   ← 197 ülke verisi
├── components/shared/
│   ├── MeshBackground.tsx                ← Animasyonlu mesh gradient arka plan
│   ├── GrainOverlay.tsx                  ← Film grain dokusu
│   ├── CounterPill.tsx                   ← Soru numarası pill'i
│   ├── TimerRingV2.tsx                   ← SVG dairesel sayaç
│   ├── FlagDisplay.tsx                   ← flag-icons ile bayrak gösterimi
│   ├── FlagQuestionScene.tsx             ← 180 frame'lik soru sahnesi
│   ├── IntroSceneV2.tsx                  ← 90 frame'lik intro
│   └── OutroSceneV2.tsx                  ← 150 frame'lik outro
└── compositions/
    ├── LongQuizV2.tsx                    ← 16:9 tam uzunluk composition
    └── ShortQuizV2.tsx                   ← 9:16 Shorts composition
```

---

## Sorun Giderme

**"npm not found"** → Node.js kurulu değil. nodejs.org'dan indir.
**Port 3000 meşgul** → Başka bir terminal'de çalışan proje var, onu kapat.
**Emoji görünmüyor** → Bilgisayarında emoji fontu lazım (Windows 10+ ve Mac'te varsayılan var).

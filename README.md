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

## Sorun Giderme

**"npm not found"** → Node.js kurulu değil. nodejs.org'dan indir.
**Port 3000 meşgul** → Başka bir terminal'de çalışan proje var, onu kapat.
**Emoji görünmüyor** → Bilgisayarında emoji fontu lazım (Windows 10+ ve Mac'te varsayılan var).

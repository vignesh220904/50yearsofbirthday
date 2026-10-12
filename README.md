# 50 Years of Love, Memories & Moments
### Celebrating M. Buvaneswari (Buvana) — Golden Jubilee (1976 – 2026)

A cinematic, interactive, and emotional 50th birthday celebration website built exclusively with **HTML5, CSS3, and Vanilla JavaScript**.

Designed for display across mobile devices, tablets, desktop screens, and presentation projection at the birthday celebration at **Palmshore Restaurant, Ekkatuthangal, Chennai** on **27 October 2026**.

---

## 🌟 Visual Design & Brand Identity

- **Palette**: Ramar Blue (`#2457A7`), Royal Blue (`#174EA6`), Midnight Blue (`#07162E`), Sky Blue (`#8BCBFA`), Champagne Gold (`#E6D3A2`), Pearl White (`#F7FAFF`), and Silver Mist (`#C8D6E8`).
- **Typography**: *Playfair Display* & *Cormorant Garamond* for serif headings; *Inter* for body typography.
- **Atmosphere**: Subtle floating canvas particles, animated SVG fluttering butterflies, glassmorphic panels, and 3D perspective transforms.

---

## 📖 The Seven Chapters

### Chapter 01 — Cinematic Welcome
- Opening screen with gentle floating particles and animated butterflies.
- Portrait showcase of Buvana with golden filigree frame and blue back-glow.
- Event metadata: **27 October 2026** at **Palmshore Restaurant, Ekkatuthangal, Chennai**.
- Primary CTA **"BEGIN HER STORY"** with smooth scroll and interactive ambient music control.

### Chapter 02 — Her Life Journey
- 12 chronological chapters spanning five decades:
  1. Childhood (1976)
  2. Schooling (1979–1993)
  3. College & Education (1993–1997)
  4. Sacred Marriage (1997)
  5. Early Family Life & First Bikes (1997)
  6. Motherhood (1998 Vikky & 2002 Varshu)
  7. First Home at 3rd Main Road (2004)
  8. Career & MBA Distance Education (2006 & 2012)
  9. Children's Milestones (Salangai Poojai, Arangetram, Graduations)
  10. Family Achievements & First Car
  11. Recent Celebrations & Engagements
  12. Turning 50 Golden Jubilee
- Integrated with original family photographs and requested historical illustrations (School chudi uniform, Birth of Vikky, Birth of Varshu, MBA milestone desk).

### Chapter 03 — 50 Reasons Why We Love You
- Exactly 50 numbered heartfelt tribute cards.
- Interactive operator controls: *Next Reason*, *Previous Reason*, *Reveal All 50 (Grid View)*, and *Reset*.
- Fully editable via `data/reasons.json`.

### Chapter 04 — Key Memories & Photo Gallery
- Over 400 original family photographs organized across categories:
  - *Childhood, Education, Marriage, Family, Travel, Celebrations, Recent Memories, and Candid Moments*.
- Responsive image grid with progressive lazy loading.
- Fullscreen Lightbox viewer with Next, Previous, Close, Counter, and Keyboard arrow support.

### Chapter 05 — Family Video Wishes
- Dedicated video tribute cards for family members (Husband, Vikky, Varshu, Elders, Relatives, Friends).
- Native HTML5 `<video>` player ensuring only one video plays at a time.
- Custom poster thumbnails, quote cards, duration badges, and helpful upload fallback indicators.
- Editable via `data/wishes.json`.

### Chapter 06 — Age 1 to 50 Transition
- Chronological photo reel transitioning from childhood (Age 1) through school, college, marriage, motherhood, to Age 50.
- Interactive controls: *Play Journey (Autoplay)*, *Pause*, *Replay*, *Prev*, *Next*, *Scrubber Timeline*, and *Skip to Finale*.
- Dynamic stage labels and age badges.

### Chapter 07 — 50 Gifts & Grand Celebration
- Operator-controlled 3D blue gift box with silver ribbon.
- Click to animate box opening (lid tilts open in 3D perspective with golden particle bursts).
- Displays **GIFT 01 OF 50** through **GIFT 50 OF 50**, title, giver, and personal message.
- Grand Finale screen with celebration headline:
  > **HAPPY 50TH BIRTHDAY, BUVANA!**  
  > *“Fifty years of love, strength, kindness, laughter, and beautiful memories. Our family is brighter because of you. We love you — today, tomorrow, and always.”*
- High-resolution family photo, interactive confetti cannon trigger, and replay navigation.

---

## 📁 Project Structure

```text
50yearsofbirthday/
├── index.html                  # Main grand experience containing all 7 chapters
├── pages/                      # Standalone direct-link pages
│   ├── journey.html
│   ├── reasons.html
│   ├── memories.html
│   ├── wishes.html
│   ├── age-transition.html
│   └── finale.html
├── css/                        # Modular Vanilla CSS
│   ├── variables.css           # Color tokens & design system
│   ├── global.css              # Typography & layout foundation
│   ├── components.css          # Navigation, buttons, lightbox, audio widget
│   ├── chapters.css            # Styles for Chapters 01 to 07
│   ├── animations.css          # Keyframes, butterflies, particles, reduced-motion
│   └── responsive.css          # Mobile, tablet, desktop, and 4K stage displays
├── js/                         # Vanilla JavaScript modules
│   ├── app.js                  # Master application entrypoint
│   ├── content.js              # Data store & JSON loader
│   ├── effects.js              # Canvas particles, butterflies, audio & confetti
│   ├── navigation.js           # Chapter routing, progress bar, presentation mode
│   ├── timeline.js             # Life Journey chapter renderer
│   ├── gallery.js              # Filterable photo gallery & fullscreen lightbox
│   ├── video-player.js         # Video controller & single playback manager
│   ├── age-transition.js       # Age 1–50 photo journey player
│   └── gift-reveal.js          # 3D gift box reveal & 50 reasons logic
├── data/                       # Content JSON data
│   ├── timeline.json           # 23 verified milestones
│   ├── reasons.json            # Exactly 50 reasons why we love Buvana
│   ├── wishes.json             # Video message slots & quotes
│   ├── gifts.json              # Exactly 50 gifts for the celebration
│   ├── photo_inventory.json    # Complete inventory of 404 family photos
│   └── asset_mapping.json      # Categorized photo mappings
├── assets/                     # Web-ready optimized media
│   ├── photos/                 # WebP optimized family photos
│   ├── thumbnails/             # High-speed gallery thumbnails
│   ├── illustrations/          # AI family memory illustrations & video posters
│   ├── audio/                  # Background music track
│   └── videos/                 # Family video MP4 uploads
├── scripts/                    # Automation & audit scripts
│   ├── audit_and_process_assets.py
│   ├── generate_video_placeholders.py
│   └── generate_standalone_pages.py
├── Age 1 to 50/                # Original unedited family photos (Preserved)
├── Life journey/               # Original unedited family photos (Preserved)
└── Memory gallery/             # Original unedited family photos (Preserved)
```

---

## 🚀 Running Locally

You can run this project with any static HTTP server:

### Option A: Using Python (Built-in)
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option B: Using VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

### Presentation Mode (For Live Event Display)
- Press the **P** key on your keyboard or click the **📺** TV icon in the navigation header to enter fullscreen presentation mode.
- Top navigation is automatically hidden to provide a clean cinematic display for event guests and live stage screens.

---

## 🔒 Privacy & Preservation
- All 404 original source photographs remain untouched in their original folders.
- No third-party tracking scripts or heavy frontend frameworks are used.

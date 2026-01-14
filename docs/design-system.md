# Palette Design System

> UI/UX 구현을 위한 컨텍스트 문서. Tailwind 기본값 외 커스텀 패턴만 정의.

## Tailwind Config 확장

### Colors
```js
// tailwind.config.js - colors 확장
colors: {
  palette: {
    bg: '#F7F5EF',           // 따뜻한 베이지 배경
    card: '#FCFBF8',         // 오프화이트 카드
    text: '#3E362E',         // 다크 웜 브라운 (primary)
    muted: '#70665C',        // 미디엄 웜 브라운 (secondary)
    gold: '#A6926D',         // 골드 액센트 (primary action)
    'gold-dark': '#857252',  // 골드 hover
    border: '#E6E2D6',       // 연한 보더
    cream: '#F0EBE0',        // 크레딧 정보 배경
  },
  danger: '#D9534F',
}
```

### Fonts
```js
// Google Fonts: Playfair Display (serif), Lato (sans-serif)
fontFamily: {
  display: ['Playfair Display', 'serif'],  // 헤딩, 브랜드
  body: ['Lato', 'sans-serif'],            // 본문, UI
}
```

### Shadows
```js
boxShadow: {
  card: '0 4px 20px rgba(62, 54, 46, 0.04)',
  'card-hover': '0 12px 30px rgba(62, 54, 46, 0.08)',
  float: '0 8px 32px rgba(62, 54, 46, 0.1)',
  mentor: '0 4px 15px rgba(166, 146, 109, 0.1)',
  toolbar: '0 4px 15px rgba(0,0,0,0.3)',
}
```

---

## Component Patterns

### Header
- 높이: `60px` (compact) / `auto` (standard)
- 하단 보더: `border-b border-palette-text/[0.08]`
- 배경: `bg-palette-bg`
- 브랜드: `font-display text-2xl font-semibold tracking-tight`
- 네비 hover: `text-palette-gold`

### Cards (Artwork Grid)
```
그리드: grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-10
카드:   rounded-xl shadow-card border border-palette-text/[0.03]
hover:  -translate-y-2 shadow-card-hover (0.3s)
이미지: h-60 object-cover / hover: scale-105 (0.5s)
본문:   p-7
```

### Badges

| Type | Position | Style |
|------|----------|-------|
| Score Pill | `top-3 right-3` | `bg-palette-gold text-white rounded-full px-2.5 py-1.5 text-sm font-bold` |
| Card Badge | `top-3 left-3` | `bg-white/90 backdrop-blur-sm rounded px-2.5 py-1.5 text-xs font-bold` |
| Mentor Badge | `top-[-10px] left-5` | `bg-palette-text text-palette-bg uppercase text-xs font-bold rounded px-2.5 py-0.5` |

### Buttons

| Type | Style |
|------|-------|
| Primary | `bg-palette-gold hover:bg-palette-gold-dark text-white font-bold rounded-md uppercase tracking-wide` |
| Secondary | `bg-palette-card border border-palette-gold text-palette-gold hover:bg-palette-gold hover:text-white font-bold rounded-md uppercase tracking-widest` |
| Action | `border border-palette-border text-palette-muted hover:border-palette-gold hover:text-palette-gold rounded flex items-center gap-2` |

### Forms
- 입력: `border-palette-border rounded-md focus:border-palette-gold focus:outline-none`
- 레이블 (일반): `font-bold text-palette-text`
- 레이블 (검색): `text-xs text-palette-gold uppercase tracking-wide font-bold`
- 업로드 영역: `border-2 border-dashed border-palette-gold rounded-lg bg-palette-gold/5 hover:bg-palette-gold/10`

### Hero Search
```
컨테이너: bg-palette-card/85 backdrop-blur-md rounded-xl shadow-float
          border border-white/40 max-w-[800px]
hero 높이: h-[520px]
이미지 필터: brightness-95 sepia-[0.15] contrast-90
```

### Comment System
```
멘토 댓글: bg-white border border-palette-gold rounded-lg shadow-mentor p-6
일반 댓글: py-4 border-b border-gray-100
```

### Canvas/Studio (Mentor Feedback)
```
툴바 (수직): bg-palette-text rounded-lg shadow-toolbar p-2.5 flex-col gap-2.5
툴 버튼:     w-10 h-10 bg-white/10 hover:bg-white/20 active:bg-palette-gold rounded text-palette-bg
뷰 컨트롤:   bg-white rounded-full shadow-float px-4 py-2
```

### Credit Info Bar
```
bg-palette-cream border border-palette-border rounded-md p-4
잔액: font-bold text-palette-gold-dark
비용: font-bold text-danger
```

---

## Interaction States

| Element | Hover | Focus | Active |
|---------|-------|-------|--------|
| Link | `text-palette-gold` | - | - |
| Card | `-translate-y-2 shadow-card-hover` | - | - |
| Card Image | `scale-105` | - | - |
| Button | 배경 darken | - | - |
| Input | - | `border-palette-gold` | - |
| Border | `border-palette-gold` | - | - |
| Tool Button | `bg-white/20` | - | `bg-palette-gold text-white` |

---

## Design Principles

1. **Warm Palette**: 모든 색상은 따뜻한 톤 사용 (베이지, 브라운, 골드). 차가운 그레이 지양.
2. **Typography Hierarchy**: 헤딩/브랜드는 Playfair Display, UI/본문은 Lato.
3. **Elevation**: 카드는 subtle shadow, 멘토 피드백과 floating 요소만 강한 shadow.
4. **Border Radius**: 카드/컨테이너 `12px`, 버튼/인풋 `4-6px`, 필 `50px`.
5. **Mentor Distinction**: 골드 보더 + floating 배지로 멘토 콘텐츠 강조.

---

## Layout Breakpoints

```
Content max-width:
  - 메인 콘텐츠: 1200px
  - 폼 페이지: 800px
  - 디테일 뷰: 1100px (grid: 1.5fr 1fr)
```

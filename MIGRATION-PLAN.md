# GSC Indexed Pages Migration Plan

## Background

The old static HTML site at `F:\网站\connections hint\` has 22 pages indexed in Google Search Console (GSC). The new Next.js site at `F:\网站\游戏网站\connectionshint\` needs to either:
- **Keep existing pages** if they already exist in the new site (only add content if needed)
- **Recreate missing pages** with original content from the old site
- **301 redirect** only `/nyt-connections-hint` → `/connections-hint`

---

## Page Inventory & Status

### Already Exist in New Site (No Action Needed)

| # | Old URL | New Site Page | Status |
|---|---------|--------------|--------|
| 1 | `/` | `app/[locale]/page.tsx` | Exists |
| 2 | `/about-us` | `app/[locale]/about/page.tsx` | Exists (path is `/about`, need redirect from `/about-us`) |
| 3 | `/privacy-policy` | `app/[locale]/privacy-policy/page.tsx` | Exists |
| 4 | `/terms-of-service` | `app/[locale]/terms-of-service/page.tsx` | Exists |
| 5 | `/connections-hint-today` | `app/[locale]/connections-hint-today/page.tsx` | Exists |
| 6 | `/how-to-play` | `app/[locale]/how-to-play-connections/page.tsx` | Exists (path is `/how-to-play-connections`, need redirect from `/how-to-play`) |

### Need 301 Redirect

| # | Old URL | Redirect To | Notes |
|---|---------|------------|-------|
| 7 | `/nyt-connections-hint` | `/connections-hint` | Already has listing page |
| 8 | `/about-us` | `/about` | Path changed |
| 9 | `/how-to-play` | `/how-to-play-connections` | Path changed |

### Need to Create (16 Pages)

| # | Old URL | Old File | Page Type | Priority |
|---|---------|----------|-----------|----------|
| 10 | `/guides/beginner-guide` | `guides/beginner-guide.html` | Guide (LearningResource) | HIGH |
| 11 | `/guides/strategy-tips` | `guides/strategy-tips.html` | Guide (HowTo) | HIGH |
| 12 | `/guides/common-mistakes` | `guides/common-mistakes.html` | Guide | HIGH |
| 13 | `/guides/category-types` | `guides/category-types.html` | Guide | HIGH |
| 14 | `/guides/why-so-hard` | `guides/why-so-hard.html` | Guide | HIGH |
| 15 | `/guides/advanced-techniques` | `guides/advanced-techniques.html` | Guide | HIGH |
| 16 | `/4-letters` | `4-letters.html` | Wordle Game | MEDIUM |
| 17 | `/5-letters` | `5-letters.html` | Wordle Game | MEDIUM |
| 18 | `/6-letters` | `6-letters.html` | Wordle Game | MEDIUM |
| 19 | `/7-letters` | `7-letters.html` | Wordle Game | MEDIUM |
| 20 | `/8-letters` | `8-letters.html` | Wordle Game | MEDIUM |
| 21 | `/9-letters` | `9-letters.html` | Wordle Game | MEDIUM |
| 22 | `/10-letters` | `10-letters.html` | Wordle Game | MEDIUM |
| 23 | `/11-letters` | `11-letters.html` | Wordle Game | MEDIUM |
| 24 | `/contact` | `contact.html` | Contact Form | LOW |
| 25 | `/share` | `share.html` | Social Share | LOW |
| 26 | `/nyt-connections-hints-answers-august-20-2025` | `nyt-connections-hints-answers-august-20-2025.html` | Daily Article | LOW |

---

## Implementation Details

### Phase 1: Redirects (in `next.config.mjs`)

Add `redirects()` to next.config.mjs:

```js
async redirects() {
  return [
    { source: '/nyt-connections-hint', destination: '/connections-hint', permanent: true },
    { source: '/about-us', destination: '/about', permanent: true },
    { source: '/how-to-play', destination: '/how-to-play-connections', permanent: true },
  ];
}
```

### Phase 2: Guide Pages (6 pages)

**Location**: `app/[locale]/guides/[slug]/page.tsx`

Create a dynamic route for guide pages. Each guide should:
- Use the new site's design system (deep blue/indigo theme, JetBrains Mono headings, grid-bg)
- Preserve ALL original content from the old HTML pages
- Include breadcrumb navigation
- Include table of contents (TOC) sidebar
- Include JSON-LD structured data (LearningResource / HowTo schema)
- Include meta tags (title, description, keywords) from old pages
- Include related guides section at bottom
- Include CTA section

**Guide Content Source** (from old site `F:\网站\connections hint\guides\`):

1. **beginner-guide** — Complete beginner's guide: What is Connections, Basic Rules, Game Interface, Difficulty Levels (Yellow/Green/Blue/Purple), First Steps Strategy, Essential Strategies, Common Mistakes, Practice Examples
2. **strategy-tips** — Expert strategies: Scanning Strategy, Smart Difficulty Approach, Pattern Recognition (Semantic/Wordplay/Cultural), Strategic Elimination Method, Common Category Types, Advanced Pro Tips
3. **common-mistakes** — Common errors: Jumping on first pattern, Not shuffling, Wasting mistakes, Ignoring word context, Overthinking
4. **category-types** — All category types: Food & Drink, Actions & Verbs, Professional Terms, Wordplay Categories, with examples
5. **why-so-hard** — Psychology behind difficulty: Word ambiguity, complex patterns, psychological tricks
6. **advanced-techniques** — Expert-level: Pattern recognition methods, pro tips for hardest puzzles

**Guide Index Page**: `app/[locale]/guides/page.tsx`
- Grid of all 6 guides with icons, descriptions, difficulty levels
- Clean listing page with links to each guide

### Phase 3: Letter Wordle Game Pages (8 pages)

**Location**: `app/[locale]/[n]-letters/page.tsx` (or similar dynamic route)

Each page needs:
- A playable Wordle game with the specified word length (4-11 letters)
- Port `universal-wordle.js` logic to a React client component
- Game board with grid rows matching word length
- On-screen keyboard with color feedback (correct/present/absent)
- New Game and Get Hint buttons
- SEO content section below the game (from old HTML pages)
- Word lists embedded from old `universal-wordle.js` (4-11 letter word arrays)

**Key Technical Decisions**:
- Create `components/wordle/WordleGame.tsx` as a "use client" component
- Port the `UniversalWordleGame` class to React hooks
- Word lists: Extract from `universal-wordle.js` into `data/wordle-words.ts`
- Style with Tailwind matching the site's dark theme

**Shared Game Component Structure**:
```
components/wordle/
  WordleGame.tsx      — Main game component (client)
  WordleBoard.tsx     — Game board grid
  WordleKeyboard.tsx  — On-screen keyboard
data/
  wordle-words.ts     — Word lists for 4-11 letters
app/[locale]/
  4-letters/page.tsx
  5-letters/page.tsx
  6-letters/page.tsx
  7-letters/page.tsx
  8-letters/page.tsx
  9-letters/page.tsx
  10-letters/page.tsx
  11-letters/page.tsx
```

### Phase 4: Contact Page

**Location**: `app/[locale]/contact/page.tsx`

Content from old `contact.html`:
- Email support: support@connectionshint.com
- Feature requests: feedback@connectionshint.com
- Bug reports: bugs@connectionshint.com
- Contact form (Name, Email, Subject dropdown, Message)
- Quick help links to How to Play and FAQ
- Response time info

**Note**: Contact form can be static (no backend submission) initially, matching old site behavior.

### Phase 5: Share Page

**Location**: `app/[locale]/share/page.tsx`

Content from old `share.html`:
- Social share buttons (Twitter, Facebook, LinkedIn, Reddit, WhatsApp)
- Copy link functionality
- Email share button
- "Why Share" reasons grid (Brain Training, Competition, Free, Play Anywhere)
- Referral benefits section
- Sharing tips section

### Phase 6: Daily Article Page

**Location**: `app/[locale]/nyt-connections-hints-answers-august-20-2025/page.tsx`

This is a one-off article page for puzzle #801 (August 20, 2025). Content from old HTML:
- Title: "NYT Connections hints and answers for August 20, 2025 - Puzzle #801 Guide"
- Meta description about monochrome items, paired objects, rotating mechanisms, curved implements
- Article content with hints and answers for that specific puzzle

**Alternative**: Could redirect to `/connections-hint/2025-08-20` if data exists in puzzles.json.

---

## Todolist

### Setup & Configuration
- [ ] 1. Add 301 redirects in `next.config.mjs` for `/nyt-connections-hint`, `/about-us`, `/how-to-play`

### Guide Pages (Phase 2)
- [ ] 2. Create guides index page: `app/[locale]/guides/page.tsx`
- [ ] 3. Create dynamic guide route: `app/[locale]/guides/[slug]/page.tsx`
- [ ] 4. Create guide content for `beginner-guide` (port all HTML content)
- [ ] 5. Create guide content for `strategy-tips` (port all HTML content)
- [ ] 6. Create guide content for `common-mistakes` (port all HTML content)
- [ ] 7. Create guide content for `category-types` (port all HTML content)
- [ ] 8. Create guide content for `why-so-hard` (port all HTML content)
- [ ] 9. Create guide content for `advanced-techniques` (port all HTML content)
- [ ] 10. Add JSON-LD structured data to guide pages
- [ ] 11. Add guides link to header navigation and footer

### Wordle Game Pages (Phase 3)
- [ ] 12. Extract word lists from `universal-wordle.js` into `data/wordle-words.ts`
- [ ] 13. Create `components/wordle/WordleGame.tsx` client component
- [ ] 14. Create `components/wordle/WordleBoard.tsx` (game grid)
- [ ] 15. Create `components/wordle/WordleKeyboard.tsx` (on-screen keyboard)
- [ ] 16. Create `app/[locale]/4-letters/page.tsx` with SEO content
- [ ] 17. Create `app/[locale]/5-letters/page.tsx` with SEO content
- [ ] 18. Create `app/[locale]/6-letters/page.tsx` with SEO content
- [ ] 19. Create `app/[locale]/7-letters/page.tsx` with SEO content
- [ ] 20. Create `app/[locale]/8-letters/page.tsx` with SEO content
- [ ] 21. Create `app/[locale]/9-letters/page.tsx` with SEO content
- [ ] 22. Create `app/[locale]/10-letters/page.tsx` with SEO content
- [ ] 23. Create `app/[locale]/11-letters/page.tsx` with SEO content
- [ ] 24. Add Wordle games link to header/footer navigation

### Contact & Share Pages (Phase 4-5)
- [ ] 25. Create `app/[locale]/contact/page.tsx` with original content
- [ ] 26. Create `app/[locale]/share/page.tsx` with original content

### Daily Article Page (Phase 6)
- [ ] 27. Handle `/nyt-connections-hints-answers-august-20-2025` — either create page or redirect to `/connections-hint/2025-08-20`

### Verification
- [ ] 28. Build project successfully (`pnpm build`)
- [ ] 29. Verify all new pages render correctly
- [ ] 30. Verify all redirects work
- [ ] 31. Commit and push

---

## Design Guidelines

All new pages must follow the existing site design:
- **Theme**: Deep blue/indigo (slate-900 backgrounds, blue-500/600 accents)
- **Headings**: JetBrains Mono font (`font-heading`)
- **Layout**: Max width 6xl, consistent padding
- **Components**: Use existing site components (Header, Footer, breadcrumbs)
- **Dark mode**: Slate-900 bg, slate-300/400 text, blue/cyan accents
- **Grid background**: Use `grid-bg` pattern where appropriate
- **Cards**: Rounded borders, slate-800/700 backgrounds, hover effects

## File References

- Old site: `F:\网站\connections hint\`
- New site: `F:\网站\游戏网站\connectionshint\`
- Old game logic: `F:\网站\connections hint\universal-wordle.js`
- Old guide pages: `F:\网站\connections hint\guides\*.html`

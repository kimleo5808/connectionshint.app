# ConnectionsHint Expansion Requirements

## Purpose

This document defines the next content expansion phase for `connectionshint.app`.
The goal is to add high-value pages without deleting existing content, without removing index coverage, and without turning the site into a shallow template farm.

This is a planning and implementation requirements document for an engineering/content agent.
It is intentionally specific so execution can start without redoing strategy work.

## Project Context

The site already has these core page types:

- Home
- Today hint page
- Date-based archive page
- Date detail page
- FAQ
- How to play
- Guides
- Blog posts

Existing data and component layers already support a large part of the planned work.

### Existing reusable data layer

Source: `lib/connections-data.ts`

- `getLatestPuzzle()`
- `getPuzzleByDate(date)`
- `getAllPuzzles()`
- `getRecentPuzzles(count)`
- `getPuzzlesByMonth(yearMonth)`
- `getAvailableMonths()`
- `getPuzzleCount()`

### Existing puzzle model

Source: `types/connections.ts`

- `ConnectionsPuzzle.id`
- `ConnectionsPuzzle.date`
- `ConnectionsPuzzle.answers`

This means the new pages can be built mostly by composing existing data, not by inventing a new storage model.

### Existing reusable UI components

Sources: `components/connections/*`

- `HintCardList`
- `AnswerReveal`
- `PuzzleCard`
- `PuzzleCardCompact`
- `MonthSection`
- `PuzzleGridStatic`

## Product Goals

1. Close clear content gaps that competitors already cover.
2. Add deeper evergreen pages that most daily-answer competitors do not do well.
3. Strengthen internal linking between today, archive, historical puzzles, and study pages.
4. Improve long-term SEO and AdSense quality signals by publishing more useful, editorially framed pages.

## Constraints

1. Do not delete existing pages or content as part of this expansion.
2. Do not add `noindex` to existing page groups.
3. Do not ship thin pages with only repeated template copy.
4. Every new page must have a clear user job, not just a keyword variation.
5. Prefer reusing existing data and UI before inventing new structures.

## Non-Goals

- Redesigning the entire site
- Replacing the current archive architecture
- Adding new external data sources
- Launching non-Connections games in this phase

## Competitor-Informed Direction

Competitor research showed two dominant patterns:

1. Vertical Connections sites cover:
   - today
   - yesterday
   - archive
   - answers
   - rules
   - sports edition

2. Media sites dominate:
   - daily answer articles
   - category pages
   - occasional tips and hardest-puzzle roundups

The site should not try to win only by publishing another generic "today answer" page.
The stronger angle is:

- deeper archive utility
- puzzle-number lookup
- monthly archive summaries
- difficulty analysis
- pattern and trap library

## Scope for This Phase

Build the first expansion wave around these page groups:

1. Yesterday page
2. Puzzle number page
3. Monthly archive page
4. Difficulty hub
5. Patterns hub
6. First three pattern subpages

## Page Requirements

### 1. Yesterday Page

#### Route

- `/connections-hint-yesterday`

#### Primary user intent

- "I want yesterday's puzzle"
- "I missed yesterday and want hints without full spoilers immediately"

#### Content requirements

- H1 focused on yesterday's Connections puzzle
- one short editorial intro
- progressive hints block
- full answer reveal block
- short "why this puzzle was tricky" section
- links to:
  - today
  - full archive
  - current month archive

#### Data requirements

- latest puzzle
- previous puzzle
- optional recent puzzle list

#### Reuse candidates

- `HintCardList`
- `AnswerReveal`
- date detail page layout patterns

#### Acceptance notes

- must not feel like a copy of the today page with only the date swapped
- should include explicit yesterday framing in title, H1, intro, and CTA

### 2. Puzzle Number Page

#### Route

- `/connections-number/[id]`

#### Primary user intent

- "I searched for Connections #1002"
- "I remember the puzzle number, not the date"

#### Content requirements

- title includes puzzle number and date
- quick facts block
- progressive hints
- full answers
- short puzzle review
- links to previous and next puzzle numbers
- link to containing month archive

#### Data requirements

- full puzzle list or efficient id lookup
- previous and next puzzle by id

#### Reuse candidates

- date detail page structure
- `HintCardList`
- `AnswerReveal`
- `PuzzleCardCompact`

#### Acceptance notes

- must expose both number and date clearly
- should not create duplicate-feeling metadata relative to date pages

### 3. Monthly Archive Page

#### Routes

- `/connections-hint/[year]/[month]`

Example:

- `/connections-hint/2026/03`

#### Primary user intent

- "I want past puzzles from a specific month"
- "I want to study patterns across a month"

#### Content requirements

- month-specific H1
- short intro describing the month archive use case
- month snapshot block
- full list of puzzles for the month
- month review section
- common pattern summary
- tricky puzzle highlights
- links to difficulty and pattern pages
- prev/next month navigation

#### Data requirements

- `getPuzzlesByMonth`
- `getAvailableMonths`
- light monthly aggregation from puzzle answers

#### Reuse candidates

- current archive structure
- `MonthSection`
- `PuzzleCard`

#### Acceptance notes

- cannot be a bare date list
- must include editorial summary at the month level

### 4. Difficulty Hub

#### Route

- `/connections-difficulty`

#### Primary user intent

- "Which Connections puzzles are hardest?"
- "Why are some boards harder than others?"

#### Content requirements

- clear difficulty framework
- explanation of how the site judges difficulty
- hardest recent puzzles list
- sections for:
  - overlap between groups
  - fill-in-the-blank categories
  - wordplay categories
  - purple-group late-game difficulty
  - culture or niche-knowledge groups
- links to relevant pattern pages
- links to example date pages

#### Data requirements

- all puzzles
- derived difficulty heuristics
- derived pattern classification

#### Reuse candidates

- analysis helpers in `app/[locale]/connections-hint/[date]/page.tsx`
- `PuzzleCardCompact`

#### Acceptance notes

- must define a site-specific framework, not generic filler prose
- should include real puzzle examples

### 5. Patterns Hub

#### Route

- `/connections-patterns`

#### Primary user intent

- "What kinds of categories appear in Connections?"
- "How do I study recurring puzzle patterns?"

#### Content requirements

- hub-style H1 and intro
- pattern cards grid
- explanation of how to study patterns without spoiling too early
- recent example puzzles grouped by pattern
- links to relevant guides and archive pages

#### Initial pattern categories

- fill-in-the-blank
- wordplay
- common traps
- structured sets
- phrase-based categories
- pop culture or knowledge groups

#### Data requirements

- all puzzles
- pattern classification rules
- selected examples

#### Reuse candidates

- guide content themes from `data/guides.ts`
- `PuzzleCardCompact`

#### Acceptance notes

- should act as a true navigation hub, not a single long article

### 6. Pattern Subpages

#### Routes

- `/connections-patterns/fill-in-the-blank`
- `/connections-patterns/wordplay`
- `/connections-patterns/common-traps`

#### Shared content requirements

- strong H1
- short user-first intro
- pattern explanation
- recognition signals
- common mistakes
- real past puzzle examples
- internal links back to:
  - patterns hub
  - archive
  - difficulty
  - related date pages

#### Page-specific requirements

##### Fill in the Blank

- explain invisible shared phrase logic
- show how players misgroup unrelated-looking words

##### Wordplay

- cover prefix/suffix/letter/sound/spelling style groups
- explain why semantic grouping fails here

##### Common Traps

- explain red herrings and one-away mistakes
- show examples of plausible fake groups

## Global Content Rules

These rules apply to every new page in this phase.

1. The first paragraph must explain what the page helps the user do.
2. Each page must have at least 3 meaningful internal links.
3. Each page must include at least one editorial summary block, not just raw puzzle data.
4. Metadata must be page-specific and natural, not formula spam.
5. Example puzzles should be real historical entries from the site, not invented examples when real ones are available.
6. Any ranking or difficulty label must have a stated rationale.

## Information Architecture Rules

The new pages should reinforce this internal linking structure:

- today -> yesterday
- today -> puzzle number page
- today -> current month archive
- date detail -> related pattern page
- monthly archive -> difficulty hub
- pattern page -> example date pages
- difficulty hub -> pattern pages

## Suggested Implementation Order

### Phase 1

1. Yesterday page
2. Puzzle number page
3. Monthly archive page

### Phase 2

4. Difficulty hub
5. Patterns hub

### Phase 3

6. Fill-in-the-blank page
7. Wordplay page
8. Common traps page

## Sprint Plan

### Sprint 1: High-ROI Utility Pages

Goal:
Ship the fastest pages with the clearest user demand and the highest reuse of current code.

Included pages:

1. Yesterday page
2. Puzzle number page
3. Monthly archive page

Primary outcomes:

- close obvious content gaps
- improve archive discoverability
- create stronger internal links around daily traffic

Definition of done:

- all three page groups route correctly
- metadata is unique
- sitemap includes new routes
- page-to-page links are in place
- build passes

### Sprint 2: Evergreen Analysis Layer

Goal:
Add pages that move the site beyond "daily answers" into a more defensible study resource.

Included pages:

1. Difficulty hub
2. Patterns hub

Primary outcomes:

- establish editorial depth
- create reusable taxonomy for future content
- support more internal linking from archive/detail pages

Definition of done:

- difficulty framework is explicitly documented in-page
- pattern taxonomy is visible and navigable
- each hub links to real puzzle examples
- build passes

### Sprint 3: Pattern Detail Pages

Goal:
Deepen the new patterns section with focused evergreen subpages.

Included pages:

1. Fill-in-the-blank
2. Wordplay
3. Common traps

Primary outcomes:

- strengthen long-tail coverage
- create better study paths from archive and difficulty pages
- increase editorial uniqueness across the site

Definition of done:

- each page includes explanation, mistakes, and real examples
- each page links back to archive, difficulty, and patterns hub
- build passes

## Priority Matrix

### Priority P0

- Yesterday page
- Puzzle number page
- Monthly archive page

Reason:

These have the strongest demand signal and the lowest implementation risk.

### Priority P1

- Difficulty hub
- Patterns hub

Reason:

These create the strongest differentiation from daily-answer competitors.

### Priority P2

- Fill-in-the-blank
- Wordplay
- Common traps

Reason:

These depend on the pattern taxonomy and are best built after the hub structure is stable.

## Detailed Todo List

### Foundation

- [ ] Audit current route structure and choose final route paths for all new pages
- [ ] Confirm canonical strategy so puzzle-number pages and date pages do not conflict semantically
- [ ] Extract reusable helper functions for:
  - previous/next puzzle lookup
  - puzzle lookup by id
  - monthly puzzle aggregation
  - pattern classification
  - lightweight difficulty scoring
- [ ] Identify which sections of the current date detail page can be reused without duplicating template-heavy copy
- [ ] Define a consistent metadata style for new page groups
- [ ] Define a shared CTA pattern for new page groups
- [ ] Decide where new pages surface in existing navigation without clutter

### Yesterday Page

- [ ] Create route and page shell
- [ ] Load latest puzzle and derive yesterday puzzle
- [ ] Add metadata and canonical settings
- [ ] Add H1 and intro copy
- [ ] Reuse progressive hints UI
- [ ] Reuse full answer reveal UI
- [ ] Add short puzzle recap block
- [ ] Add links to today, archive, and month archive
- [ ] Add structured data if appropriate
- [ ] Add to sitemap
- [ ] Add a fallback behavior if there is not enough historical data

### Puzzle Number Page

- [ ] Create route and page shell
- [ ] Add helper to resolve puzzle by `id`
- [ ] Add `generateStaticParams` strategy for all available puzzle ids
- [ ] Add previous/next puzzle number navigation
- [ ] Add metadata with both number and date
- [ ] Add quick facts block
- [ ] Reuse progressive hints UI
- [ ] Reuse full answer reveal UI
- [ ] Add short review block
- [ ] Add related month link
- [ ] Add sitemap entries

### Monthly Archive Page

- [ ] Create year/month route structure
- [ ] Validate year/month params safely
- [ ] Load puzzles for the selected month
- [ ] Add `generateStaticParams` for available months
- [ ] Add metadata using month label and puzzle count
- [ ] Add month intro copy
- [ ] Render month puzzle list
- [ ] Add month snapshot block
- [ ] Add month review block
- [ ] Add common pattern summary block
- [ ] Add previous/next month navigation
- [ ] Add links to difficulty and patterns pages
- [ ] Add sitemap entries

### Difficulty Hub

- [ ] Define explicit difficulty heuristics
- [ ] Implement a helper that scores or tags puzzle difficulty
- [ ] Select a reasonable recent puzzle window for rankings
- [ ] Decide whether difficulty labels are numeric, tiered, or descriptive only
- [ ] Create page shell and metadata
- [ ] Write the difficulty framework intro
- [ ] Render hardest recent puzzles list
- [ ] Add section for main difficulty drivers
- [ ] Add section focused on purple groups
- [ ] Link to related pattern pages
- [ ] Link to supporting historical puzzle examples

### Patterns Hub

- [ ] Define the initial pattern taxonomy
- [ ] Create pattern classifier helper
- [ ] Decide whether a puzzle can belong to multiple pattern buckets or only one primary bucket
- [ ] Create page shell and metadata
- [ ] Write hub intro
- [ ] Build pattern card grid
- [ ] Add explanation of how to study patterns
- [ ] Add recent example puzzle links by pattern
- [ ] Add links to guides and archive

### Pattern Subpages

- [ ] Create route shell for each initial pattern page
- [ ] Write intro copy for each page
- [ ] Add recognition signals section for each page
- [ ] Add common mistakes section for each page
- [ ] Add real historical examples for each page
- [ ] Add CTA block for archive/difficulty/related patterns
- [ ] Add metadata for each page
- [ ] Add sitemap entries

### Navigation and Surfacing

- [ ] Add links from home where appropriate
- [ ] Add links from archive page to new month pages
- [ ] Add links from date detail pages to relevant pattern pages
- [ ] Add links from today page to yesterday and puzzle-number pages
- [ ] Add links from footer or guide surfaces if useful without clutter

### Quality and Review

- [ ] Check that no page feels auto-generated or repetitive
- [ ] Check that all new pages have meaningful intros
- [ ] Check that internal links form a usable study loop
- [ ] Check metadata uniqueness across new routes
- [ ] Check sitemap coverage
- [ ] Check mobile layout and readability
- [ ] Check build success
- [ ] Check structured data consistency where used

## Engineering Notes

### Recommended helper additions

- `getPuzzleById(id)`
- `getPreviousPuzzle(date or id)`
- `getNextPuzzle(date or id)`
- `getMonthSummary(yearMonth)`
- `classifyPuzzlePatterns(puzzle)`
- `scorePuzzleDifficulty(puzzle)`

These should be small, deterministic, and reusable across routes.

### Recommended content-computation strategy

Prefer computed summaries over hardcoded copy where the summary can be made specific using real puzzle data.
However, avoid fake precision. If a pattern or difficulty judgment is weak, phrase it as a qualitative observation instead of a numerical claim.

### Metadata guidance

Avoid repeating one formula across every route.
Use the page's real job:

- yesterday = review yesterday's board
- number page = lookup by puzzle id
- month page = review a month of puzzles
- difficulty = understand hard boards
- pattern page = learn a recurring category type

### Routing guidance

Keep route naming stable, readable, and clearly separable from existing date-based pages.
Do not make the new routes feel like duplicates of current archive/detail paths.

## Chinese Execution Summary

### 这份文档给执行者的中文说明

这一轮新增页面的核心不是继续堆“今日答案”类页面，而是补齐站点的信息架构，让用户能从单日查询自然进入归档、题型、难度和复盘路径。

### 中文优先级

#### 第一优先级

- `Yesterday`
- `Puzzle Number`
- `Monthly Archive`

原因：

这三类页面最接近现有数据结构，开发成本最低，回报最快。

#### 第二优先级

- `Difficulty`
- `Patterns Hub`

原因：

这两类页面最能提升站点深度，减少“只是 daily hints 站”的感觉。

#### 第三优先级

- `Fill-in-the-Blank`
- `Wordplay`
- `Common Traps`

原因：

需要先把 patterns taxonomy 和内容框架定清楚，再做子页更稳。

### 中文执行原则

1. 每个新页面都必须先回答“这个页面对用户有什么用”。
2. 不要把页面做成只有列表和模板段落的薄页。
3. 尽量用真实历史题做例子。
4. 先复用现有组件和数据，不要先扩底层。
5. 如果一个页面内容不够，就缩范围做深，不要用泛化文案硬撑。

## Deliverables

The completion target for this phase is:

1. New page routes implemented
2. Metadata added
3. Internal linking added
4. Sitemap updated
5. Reused components integrated cleanly
6. Editorial copy added for each page type

## Minimum Acceptance Criteria

This phase is complete only if:

1. All first-wave routes exist and build successfully.
2. Each page has unique metadata and clear user-facing purpose.
3. Each page has at least one non-template summary block.
4. Internal linking between daily, archive, difficulty, and pattern pages works.
5. The implementation preserves existing content and indexability.

## Notes for the Implementing Agent

1. Reuse existing data and UI aggressively.
2. Avoid inventing new datasets unless absolutely necessary.
3. Keep copy concise and useful.
4. If a page risks becoming thin, reduce scope and deepen the surviving sections instead of padding with generic prose.
5. Treat difficulty and pattern pages as editorial products, not as keyword containers.

import { BlogPost } from "@/types/blog";

type StaticPageKey = "about" | "privacy-policy" | "terms-of-service";

type StaticPageContent = {
  title: string;
  description: string;
  body: string;
};

export const STATIC_PAGE_CONTENT: Record<StaticPageKey, StaticPageContent> = {
  about: {
    title: "About ConnectionsHint",
    description:
      "How ConnectionsHint provides daily hints and answers for the NYT Connections puzzle",
    body: `> Updated on 2026-02-12

# About ConnectionsHint

\`ConnectionsHint\` is an independent fan site dedicated to helping players solve the daily NYT Connections puzzle. We provide progressive hints, full answers, and a complete archive of every puzzle since the game launched in June 2023.

## What ConnectionsHint does

We operate a daily hint and answer service for the NYT Connections word puzzle:

- Publish **progressive hints** for each day's puzzle, from vague clues to near-giveaways, so you choose how much help you want
- Maintain a **complete archive** of every Connections puzzle with full answers and group themes
- Provide **strategy guides and tips** to help you improve your solving skills
- Automatically update puzzle data daily so you always have the latest information

## How our hints work

Each puzzle has four groups, and we provide three levels of hints per group:

1. **Hint Level 1** - A vague thematic clue to point you in the right direction
2. **Hint Level 2** - The category name is revealed so you can identify which words fit
3. **Hint Level 3** - Two of the four words are revealed, making it easier to find the remaining two

This progressive system lets you get just enough help to stay challenged without fully spoiling the puzzle.

## Our update process

We use internal tools to prepare each daily page, then review the published puzzle details, group names, and hint presentation before updates go live. Public puzzle references help us verify timing and accuracy, but the goal of this site is to present that information in a clearer, spoiler-aware format for players.

## What makes ConnectionsHint different

- **No spoilers by default** - All answers are hidden behind reveal buttons so you never accidentally see the solution
- **Progressive hints** - Unlike sites that just show answers, we give you graduated clues to preserve the puzzle experience
- **Complete archive** - Every puzzle since June 2023, searchable and browsable by date
- **Clean design** - No pop-ups, no autoplay videos, no fake countdown timers. Just the hints and answers you need

## Content scope and limitations

This site provides hints, answers, and educational content related to the NYT Connections puzzle. We do not provide access to the actual game - you can play the official puzzle at [nytimes.com/games/connections](https://www.nytimes.com/games/connections).

## No affiliation

\`ConnectionsHint\` is an independent website and is **not affiliated with, endorsed by, or sponsored by** The New York Times Company. "NYT Connections" and "Connections" are trademarks of The New York Times Company. All trademarks belong to their respective owners.

## Contact

For corrections, suggestions, or general questions: \`hello@connectionshint.app\``,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Privacy policy for connectionshint.app",
    body: `> Updated on 2026-02-12

# Privacy Policy

This Privacy Policy explains what data we collect on \`connectionshint.app\` and how we use it. We are committed to keeping your experience private and transparent.

## Information we may collect

- **Analytics data** - page views, device type, browser, referral source, and country-level location
- **Email inquiries** - if you contact us directly via our support address
- **Technical logs** - server-side logs used for security monitoring and site performance

We do not collect names, physical addresses, payment information, or any game account details.

## How we use information

- Operate and improve the website experience
- Detect abuse, spam, and maintain service stability
- Respond to direct support or correction requests
- Understand aggregate usage trends (e.g., which pages are most visited)

We never sell, rent, or share personal data with third parties for marketing purposes.

## Cookies and analytics

We use analytics tools to understand aggregate traffic patterns and site performance. We may also load advertising services such as Google AdSense when ads are enabled on the site. Those services may use cookies or similar technologies according to their own policies and browser settings.

## Data retention

We keep technical and analytics data only as long as reasonably required for operations and security - typically no longer than 90 days for server logs. Email correspondence is retained only to maintain context for ongoing support threads.

## Third-party links

This site links to external sources including The New York Times. Their privacy practices are governed by their own policies. We encourage you to review those policies when visiting linked sites.

## Children's privacy

\`connectionshint.app\` is a general-audience informational site. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.

## Your rights

Depending on your jurisdiction, you may have the right to:

- **Access** - request a copy of any personal data we hold about you
- **Deletion** - request that we delete your personal data
- **Correction** - request that we correct inaccurate data

To exercise any of these rights, contact us at the address below.

## Contact

For privacy questions: \`hello@connectionshint.app\``,
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Terms of service for connectionshint.app",
    body: `> Updated on 2026-02-12

# Terms of Service

By using \`connectionshint.app\`, you agree to these terms. If you do not agree, please discontinue use of the site.

## 1. Informational use only

Content on this site is provided for informational and educational purposes. We provide hints, answers, and strategy guides for the NYT Connections puzzle. We do not guarantee the accuracy or completeness of any information. Puzzle data may change or be corrected at any time.

## 2. No affiliation

\`ConnectionsHint\` is an independent website and is **not affiliated with, endorsed by, or sponsored by** The New York Times Company. "NYT Connections" and "Connections" are trademarks of The New York Times Company. All trademarks belong to their respective owners.

## 3. Acceptable use

You agree not to:

- Abuse the site or attempt unauthorized access to any part of the service
- Use automated scraping, bots, or crawlers that harm service availability or performance
- Misrepresent this website as an official New York Times service
- Reproduce, redistribute, or republish our content without attribution

## 4. Intellectual property

The original content on \`connectionshint.app\` - including written guides, hint text, page designs, and editorial commentary - is the property of ConnectionsHint. Puzzle data (group names and word lists) originates from The New York Times and is reproduced here under fair use for commentary and educational purposes.

## 5. Limitation of liability

\`ConnectionsHint\` is provided "as is" without warranties of any kind. We are not liable for any damages, losses, or inconveniences arising from:

- Incorrect or outdated puzzle information
- Inability to access the site due to technical issues
- Actions taken based on information provided on this site
- Downtime, errors, or interruptions in service

## 6. External services

Links to third-party websites (including The New York Times) are provided for reference. We are not responsible for external content, availability, or policy changes on those platforms.

## 7. Changes to terms

We may update these terms as the site evolves. Material changes will be noted with an updated date at the top of this page. Continued use of the site after changes are posted means acceptance of the updated terms.

## Contact

Questions about these terms: \`hello@connectionshint.app\``,
  },
};

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    locale: "en",
    title: "Solving NYT Connections by Ear: An Audio Practice Guide",
    description:
      "Reading the grid aloud and using text-to-speech can reveal hidden Connections groups you'd miss on screen. Here's how to practice the puzzle by ear.",
    image: "/images/connections-audio-practice-cover.svg",
    slug: "/connections-audio-practice-guide",
    tags: "connections,nyt connections,audio,text to speech,accessibility,practice,tips",
    date: new Date("2026-07-07"),
    visible: "published",
    pin: false,
    content: `## Your Ears Notice What Your Eyes Miss

Most people play NYT Connections silently, scanning the grid with their eyes. But a lot of the puzzle's cleverness is *sound-based* - rhymes, homophones, and words that share a hidden spoken syllable. When you only read, you can miss these entirely.

Say the 16 words out loud and suddenly "BASS," "BOW," and "LEAD" reveal their double pronunciations. Hearing a category read aloud often makes the connection click in a way that staring at the screen never does.

![Three ways to use audio when practicing Connections: read aloud, listen hands-free, and accessibility](/images/connections-audio-methods.svg)

## Three Ways to Practice by Ear

### 1. Read the Grid Aloud

Before your first guess, simply read all 16 words out loud. This slows you down just enough to catch:

- **Homophones** - words that sound alike but mean different things
- **Rhyme groups** - a category built on matching sounds
- **Hidden words** - saying "CARPET" aloud makes the "PET" inside easier to hear

### 2. Listen Hands-Free

If you like solving on a commute or while doing chores, you can turn puzzle hints into audio and listen instead of reading. Text-to-speech tools like [AnySpeech](https://anyspeech.io/) convert written text into natural-sounding voice, so you can play a category clue in your headphones and think through the answer before you ever look at the screen. It's a low-pressure way to keep your pattern-recognition sharp between daily puzzles.

### 3. Make It Accessible

Audio isn't just a training trick - it's essential for players with low vision or those who simply learn better by listening. Reading hints aloud (or generating a voice version of them) keeps the daily puzzle open to everyone, not only people who can comfortably read a dense grid.

## A Quick Audio-First Routine

1. **Open the puzzle** and read all 16 words aloud once, slowly.
2. **Group by sound** - note any words that rhyme or share a spoken root.
3. **Listen to category hints** as audio if you're away from the screen.
4. **Confirm visually**, then lock in your safest group first.

## Try It on Today's Puzzle

Give the audio approach a shot: read the words aloud, trust your ears, and see how many extra connections you catch. Start with [today's Connections hints](/connections-hint-today), or dig into our [complete archive](/connections-hint) for more practice.`,
    metadata: {},
  },
  {
    locale: "en",
    title: "Playing Connections and Wordle Together: A Daily Word-Game Routine",
    description:
      "NYT Connections and Wordle train different skills. Learn how to pair them into one daily routine that sharpens both your vocabulary and your pattern recognition.",
    image: "/images/connections-and-wordle-cover.svg",
    slug: "/connections-and-wordle-routine",
    tags: "connections,nyt connections,wordle,word games,routine,tips,daily puzzle",
    date: new Date("2026-07-07"),
    visible: "published",
    pin: false,
    content: `## Two Puzzles, Two Different Workouts

Wordle and NYT Connections are the two most popular daily word games, but they exercise very different parts of your brain. Playing both every day is like doing cardio and strength training - each one covers a gap the other leaves open.

Wordle is a game of **deduction and letter probability**: you have six guesses to find a five-letter word, using color feedback to narrow the field. Connections is a game of **lateral thinking and categorization**: you sort 16 words into four hidden groups, resisting the traps designed to mislead you.

![A side-by-side comparison of NYT Connections and Wordle](/images/connections-vs-wordle-compare.svg)

## Why Pair Them?

The two games reinforce each other in ways that make you a better solver overall:

- **Wordle warms up your vocabulary.** Digging for words that fit a letter pattern keeps a broad word bank active in your memory - exactly the bank Connections forces you to search.
- **Connections trains flexible thinking.** Learning to see that "BASS" could be a fish *or* a sound makes you more alert to the double meanings Wordle answers sometimes exploit.
- **Both reward routine.** A short daily habit builds pattern recognition faster than occasional marathon sessions.

## A Simple Daily Routine

Here's a five-minute routine that gets the most out of both games:

1. **Start with Wordle** as a warm-up. It's quick and gets your word-retrieval engine running.
2. **Note any tricky words** you discovered - unusual spellings or double meanings often reappear in Connections.
3. **Move to Connections** while your brain is already in word mode.
4. **Scan all 16 words first**, then sort them into four visual buckets before guessing.
5. **Review both boards** afterward and ask what tripped you up.

## Get Hints Without Spoiling the Fun

Some days a puzzle just won't crack, and that's fine - a nudge is better than a broken streak. For Wordle, [WordleHint](https://wordlehint.info/) offers progressive clues and answers so you can get just enough help without seeing the full solution. For Connections, our own [daily hints](/connections-hint-today) work the same way, revealing categories step by step instead of dumping the answer.

The goal with both is the same: use hints to *learn* the patterns, not to skip them. Over time you'll need fewer nudges as your instincts sharpen.

## Build the Habit

Consistency beats intensity. Even on busy days, running through both puzzles takes only a few minutes and keeps your streaks - and your skills - alive.

Ready to play? Grab [today's Connections hints](/connections-hint-today), then browse our [complete archive](/connections-hint) when you want extra practice.`,
    metadata: {},
  },
  {
    locale: "en",
    title: "How Visual Aids Help You Master NYT Connections",
    description:
      "Turn the NYT Connections grid into a visual puzzle. Learn how color-coding, simple diagrams, and AI-generated images can help you spot hidden groups faster.",
    image: "/images/connections-visual-aids-cover.svg",
    slug: "/connections-visual-aids-guide",
    tags: "connections,nyt connections,visual aids,tips,strategy,puzzle,images",
    date: new Date("2026-07-07"),
    visible: "published",
    pin: true,
    content: `## Why Your Brain Loves a Visual Puzzle

NYT Connections is a word game, but the best solvers treat it like a *visual* one. When you look at the 16-word grid, you're not just reading definitions - you're hunting for patterns, and patterns are far easier to spot when you can see them laid out clearly.

The official grid already uses four colors - yellow, green, blue, and purple - to reveal groups after you solve them. You can borrow that same idea *before* you guess, using it as a mental (or literal) sorting system.

![The four difficulty colors in NYT Connections, from easiest yellow to hardest purple](/images/connections-color-groups.svg)

## The Four Colors Are a Difficulty Map

Every Connections puzzle sorts its four groups by difficulty, and the colors tell you exactly what to expect:

- **Yellow** - The easiest, most obvious group. Start here.
- **Green** - Fairly easy, a clear but slightly less obvious theme.
- **Blue** - Tricky, often relying on wordplay or niche knowledge.
- **Purple** - The hardest, full of hidden words, puns, and clever twists.

Knowing this order is itself a visual aid. If a group feels *too* easy, it's probably yellow. If it feels like a stretch, you may be looking at purple.

## Turn the Grid Into Visual Buckets

Here's a simple workflow that makes the grid work for you instead of against you. Read every word first, then mentally (or on paper) drag words into four buckets before you commit to a single guess.

![A four-step visual workflow for solving a Connections puzzle](/images/connections-solve-workflow.svg)

The key insight is that you should **never guess from a blank slate**. By the time you tap four words, you've already sorted all 16 into a rough visual layout, which dramatically cuts down on careless mistakes.

## Using AI Images to Learn Categories

If you want to sharpen your pattern recognition away from the daily puzzle, a fun trick is to *visualize* the categories themselves. Connections loves themed groups - "types of bread," "characters from a sitcom," "things that are round" - and turning those themes into pictures builds stronger mental associations.

Tools like [ImgVeo](https://imgveo.com/) let you generate AI images and short clips from a simple text prompt, so you can quickly picture a category ("four kinds of knots," "famous bridges," "shades of blue") and train your brain to see the connection at a glance. It's a lightweight way to practice the exact skill Connections tests: linking words to a shared concept.

You can also use generated visuals to build your own practice cards - render an image for a theme, cover the answer, and see how fast you can name the four items that belong together.

## Practical Tips for Visual Solving

1. **Sketch a 4x4 grid** if you're playing on paper - physically moving words between rows mimics the color system.
2. **Group by "feel" first**, then verify. Your gut often spots the yellow group instantly.
3. **Isolate the leftovers.** Once three groups feel solid, the remaining four words must form the last group - a purely visual process of elimination.
4. **Study finished boards.** After each puzzle, look at the revealed color layout and ask why each trap word was placed where it was.

## Keep Practicing

Visual thinking turns Connections from a guessing game into a solvable system. The more you train your eye to sort words into colored buckets, the faster your daily solves become.

Ready to put it into practice? Try [today's puzzle hints](/connections-hint-today) or browse our [complete archive](/connections-hint) to test your new visual approach.`,
    metadata: {},
  },
  {
    locale: "en",
    title: "10 Proven Strategies to Solve NYT Connections Every Time",
    description:
      "Master the NYT Connections puzzle with these 10 expert strategies. Learn how to identify groups, avoid traps, and improve your daily solve rate.",
    image: "/images/connections-strategies-guide-cover.webp",
    slug: "/connections-strategies-guide",
    tags: "connections,nyt connections,strategy,tips,puzzle,word game,guide",
    date: new Date("2026-02-10"),
    visible: "published",
    pin: true,
    content: `## Why Strategy Matters in Connections

NYT Connections isn't just about vocabulary - it's about pattern recognition, lateral thinking, and managing risk. The best solvers don't just know more words; they think more systematically about how words relate to each other.

Here are 10 strategies that will immediately improve your solve rate.

## 1. Scan All 16 Words First

Before making any guess, read every word carefully. Don't jump at the first connection you see. Many players lose lives because they rush into an obvious-looking group without checking if those words might belong elsewhere.

**Tip:** Spend 30 seconds just reading and thinking before you tap anything.

## 2. Start with the Yellow Group

The Yellow group is always the easiest. It's designed to be the most straightforward connection. Starting here gives you the best odds of a correct first guess, and removing 4 words makes the remaining 12 easier to sort.

## 3. Watch for Words with Multiple Meanings

Connections loves double meanings. A word like "BASS" could fit in a music group or a fishing group. "PITCH" could be baseball, music, or sales. When you see a word that seems to fit two groups, flag it mentally - it's probably in the less obvious one.

Common trap words include:

- **MATCH** - sports, fire, dating
- **SET** - tennis, math, collection
- **BANK** - money, river, pool shot
- **SPRING** - season, water, coil

## 4. Look for the Purple Pattern Early

The Purple group is always the trickiest. Common Purple patterns include:

- **Hidden words**: Each word contains a smaller word (e.g., "CARPET" contains "PET")
- **Add a word**: Each word pairs with a common word (e.g., ___ BALL: BASKET, BASE, FOOT, SNOW)
- **Remove a letter**: Each word becomes another word when a letter is removed
- **Cultural references**: All items from a specific TV show, movie, or song

Identifying the Purple pattern early helps you avoid accidentally putting Purple words into other groups.

## 5. Use Process of Elimination

Once you're confident about 3 words in a group, look at what's left. The 4th word must be whatever completes the group from the remaining options. This is especially powerful when you're down to 8 words (2 groups left).

## 6. Count Your Categories

Before guessing, mentally sort all 16 words into potential categories. If you can cleanly divide them into exactly 4 groups of 4, you're probably right. If you have 5 in one group and 3 in another, something is off - re-examine the 5-word group for a trap.

## 7. Think About Difficulty Progression

Remember the difficulty order: Yellow -> Green -> Blue -> Purple. If your first guess feels incredibly obvious, that's fine - it should be Yellow. If your second guess still feels easy, it might actually be the wrong group.

## 8. Don't Overthink the Yellow Group

A common mistake is being too clever with the easy group. If four words obviously share a connection, they probably do. Yellow groups are meant to be straightforward - things like "Types of cheese" or "Words that mean 'big'."

## 9. Save Your Mistakes for the Hard Groups

You get 4 mistakes total. Don't waste them on guesses you're unsure about early on. Be confident in your first 1-2 guesses (Yellow and Green), and save your mistake buffer for the trickier Blue and Purple groups.

## 10. Learn from Past Puzzles

The Connections puzzle follows patterns. By reviewing past puzzles in our [archive](/connections-hint), you'll start recognizing common category types and trap techniques. The more puzzles you study, the faster you'll spot patterns in new ones.

---

## Ready to Practice?

Check out [today's puzzle hints](/connections-hint-today) or browse our [complete archive](/connections-hint) to sharpen your skills. Remember: the goal isn't just to solve the puzzle - it's to solve it with as few hints as possible!`,
    metadata: {},
  },
  {
    locale: "en",
    title: "Common Patterns in NYT Connections Puzzles You Should Know",
    description:
      "Discover the most common category types and patterns used in NYT Connections puzzles. Recognizing these patterns will help you solve puzzles faster.",
    image: "/images/common-connections-patterns.webp",
    slug: "/common-connections-patterns",
    tags: "connections,nyt connections,patterns,categories,tips,puzzle",
    date: new Date("2026-02-08"),
    visible: "published",
    pin: false,
    content: `## Recognizing Patterns is the Key

After analyzing hundreds of NYT Connections puzzles, clear patterns emerge in how categories are designed. Knowing these patterns gives you a significant advantage because you can quickly identify what type of connection the puzzle designers are going for.

## Category Type 1: "Things That ___"

One of the most common category types. All four words can follow or precede a common word.

**Examples from past puzzles:**

- ___ BOARD: CARD, CHALK, DART, SKATE
- FIRE ___: ARM, PLACE, SIDE, WORK
- ___ LIGHT: DAY, FLASH, HIGH, SPOT

**How to spot it:** If you notice several words that could pair with the same word, you've likely found this pattern. Try mentally adding common words before or after each item.

## Category Type 2: "Members of a Set"

Four items that belong to the same well-known group or list.

**Examples:**

- Beatles members: JOHN, PAUL, GEORGE, RINGO
- Monopoly tokens: CAR, DOG, HAT, IRON
- Suits in a deck: CLUB, DIAMOND, HEART, SPADE

**How to spot it:** Look for proper nouns or items that feel like they belong to a specific, finite list.

## Category Type 3: "Synonyms"

Four words that all mean roughly the same thing.

**Examples:**

- Words meaning "steal": BOOST, LIFT, PINCH, SWIPE
- Words meaning "nonsense": BALONEY, BUNK, HOGWASH, MALARKEY
- Words meaning "happy": CONTENT, GLAD, PLEASED, SATISFIED

**How to spot it:** If multiple words seem interchangeable in a sentence, they might be synonyms grouped together.

## Category Type 4: "Hidden Words"

Each word contains a hidden smaller word. This is a classic Purple (hardest) category.

**Examples:**

- Hidden animals: **CAT**ALOG, S**CROW**, **BEAR**D, COM**MOLE**
- Hidden colors: **RED**IRECT, **BLUE**PRINT, **TAN**GENT, **GOLD**EN

**How to spot it:** This pattern almost always appears in Purple. If you can't figure out what connects four seemingly random words, look inside each word for a hidden pattern.

## Category Type 5: "Pop Culture References"

All four items relate to a specific movie, TV show, song, or cultural phenomenon.

**Examples:**

- Characters from "Friends": CHANDLER, JOEY, MONICA, ROSS
- Taylor Swift albums: LOVER, FOLKLORE, REPUTATION, MIDNIGHTS

**How to spot it:** These are harder if you're not familiar with the reference. If words seem random but are all proper nouns or specific items, consider pop culture connections.

## Category Type 6: "Parts of Something"

Four words that are all components of a larger thing.

**Examples:**

- Parts of a shoe: HEEL, LACE, SOLE, TONGUE
- Parts of a book: CHAPTER, COVER, PAGE, SPINE
- Parts of a guitar: BRIDGE, FRET, NECK, PICK

**How to spot it:** Think about physical objects and their components. If words could all describe parts of the same thing, you've found this pattern.

## Category Type 7: "Wordplay and Puns"

Words that, when modified slightly, create a pattern. This is usually Blue or Purple difficulty.

**Examples:**

- Add "S" to get a new word: CARE -> CARES, MILE -> MILES
- Words that rhyme with numbers: ATE (8), FINE (9), HEAVEN (7)

**How to spot it:** The hardest to identify. If nothing else seems to work, try manipulating the words - adding letters, removing letters, or saying them aloud.

## The Meta-Pattern

Here's the most important insight: **every puzzle has one obvious group and one tricky group**. The puzzle designers intentionally create overlap between categories to test your ability to distinguish similar-looking groups.

When you feel stuck, ask yourself: "Which words could fit in more than one group?" Those crossover words are the key to unlocking the puzzle.

---

## Keep Practicing

The more puzzles you solve, the better you get at recognizing these patterns. Browse our [puzzle archive](/connections-hint) to study past puzzles, or check [today's hints](/connections-hint-today) when you need a nudge in the right direction.`,
    metadata: {},
  },
  {
    locale: "en",
    title: "Beginner's Guide to NYT Connections: Everything You Need to Know",
    description:
      "New to NYT Connections? This complete beginner's guide covers the rules, color system, how to play, and tips to get started solving puzzles today.",
    image: "/images/beginners-guide-connections.webp",
    slug: "/beginners-guide-connections",
    tags: "connections,nyt connections,beginner,guide,how to play,rules,tutorial",
    date: new Date("2026-02-05"),
    visible: "published",
    pin: false,
    content: `## What is NYT Connections?

NYT Connections is a daily word puzzle published by The New York Times. Launched in June 2023, it has quickly become one of the most popular daily word games alongside Wordle.

Each day, you're presented with a grid of 16 words. Your goal is to sort these words into four groups of four, where each group shares a hidden connection. Sounds simple, right? The catch is that the puzzle is designed to mislead you - words are intentionally chosen to appear like they could belong to multiple groups.

## How the Game Works

### The Setup

When you open the puzzle, you see 16 words arranged in a 4x4 grid. These words are shuffled randomly - their position on the grid has no significance.

### The Objective

Find four groups of four words. Each group shares a connection - a category like "Types of bread," "Words that follow 'back'," or "Characters from The Office."

### Making Guesses

Select four words you think belong together and submit your guess. If you're correct, those words are removed from the grid and the category is revealed. If you're wrong, you lose one of your four allowed mistakes.

### Win or Lose

- **Win:** You correctly identify all four groups
- **Lose:** You use up all 4 mistakes before finding all groups

### After the Game

Once the puzzle is over (win or lose), all answers are revealed. You can share your results as a colored emoji grid, similar to Wordle shares.

## Understanding the Color System

Each group is color-coded by difficulty. This is revealed after you solve (or fail) each group:

### Yellow - Easiest

The most straightforward connection. If you're a native English speaker, you should be able to spot this one relatively quickly. Examples: "Types of fruit," "Words meaning 'big'."

### Green - Moderate

Requires a bit more thought, but the connection is still fairly clear once you see it. Examples: "Things found in a wallet," "Olympic sports."

### Blue - Tricky

The connection is less obvious. Might involve cultural knowledge, secondary word meanings, or less intuitive groupings. Examples: "Things that can precede 'house'," "Sitcom characters."

### Purple - Hardest

This is where the real challenge lives. Purple groups often involve wordplay, hidden patterns, or abstract connections. Examples: "Words containing a body part" or "___ of the art."

## Your First Puzzle: Step by Step

Here's how to approach your first Connections puzzle:

**Step 1:** Read all 16 words without guessing anything. Just absorb them.

**Step 2:** Look for the most obvious group. Are there four words that clearly share a simple connection? That's probably Yellow.

**Step 3:** Submit your most confident guess first. Getting the easy group right gives you momentum and removes words from the board.

**Step 4:** With 12 words remaining, look for the next clearest group. Work from easiest to hardest.

**Step 5:** When you're down to 8 words, you only need to figure out 2 groups. Try both combinations mentally before guessing.

**Step 6:** The last 4 words automatically form the final group. You don't need to guess them.

## Common Beginner Mistakes

### Mistake 1: Guessing Too Fast

The biggest beginner mistake is submitting a guess the moment you spot a possible connection. Take time to check if those words might fit better elsewhere.

### Mistake 2: Ignoring the Purple Group

Many beginners focus so much on finding obvious groups that they accidentally put Purple words into wrong categories. The Purple group exists to create confusion - acknowledge it early.

### Mistake 3: Not Using Elimination

When you're down to 8 words, you don't need to identify both remaining groups - just one. The other is whatever's left. Use this to your advantage.

### Mistake 4: Giving Up Too Early

Even if you've used 3 of your 4 mistakes, keep going. You can still win with your last attempt if you've been learning from your wrong guesses.

## Where to Play

The official NYT Connections puzzle is available at [nytimes.com/games/connections](https://www.nytimes.com/games/connections). A new puzzle is released every day at midnight Eastern Time.

## Need Help?

If you're stuck on today's puzzle, we offer [progressive hints](/connections-hint-today) that let you get just enough help without fully spoiling the answer. You can also learn from past puzzles in our [archive](/connections-hint) or read our [strategy guide](/blog/connections-strategies-guide) for more advanced tips.

Welcome to the Connections community - and happy puzzling!`,
    metadata: {},
  },
];

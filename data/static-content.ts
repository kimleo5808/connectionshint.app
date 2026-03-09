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

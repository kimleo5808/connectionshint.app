import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";

/* ------------------------------------------------------------------ */
/*  Theme definitions                                                  */
/* ------------------------------------------------------------------ */

export interface CategoryTheme {
  slug: string;
  title: string;
  label: string;
  description: string;
  /** Keywords to match in group labels (case-insensitive) */
  keywords: string[];
  /** Hero description for the theme detail page */
  heroDescription: string;
  /** SEO keywords */
  seoKeywords: string[];
  /** Icon emoji */
  icon: string;
  /** Color classes for border accent */
  accent: string;
  /** Unique strategy tips for this theme */
  strategyTips: { title: string; content: string }[];
  /** Common traps specific to this theme */
  commonTraps: { title: string; description: string }[];
  /** Intro paragraph for the strategy section */
  strategyIntro: string;
}

export const CATEGORY_THEMES: CategoryTheme[] = [
  {
    slug: "food-drink",
    title: "Food & Drink Categories in Connections",
    label: "Food & Drink",
    description:
      "Every Connections puzzle that featured food, drink, cooking, or dining-related categories.",
    heroDescription:
      "Food and drink are among the most frequent category themes in NYT Connections. From types of pasta to cocktail ingredients, these groups test your culinary vocabulary and your ability to separate everyday food words from their non-food meanings.",
    keywords: [
      "FOOD", "DRINK", "FRUIT", "VEGETABLE", "MEAT", "FISH", "PASTA",
      "BREAD", "CHEESE", "WINE", "BEER", "COCKTAIL", "DESSERT", "CANDY",
      "SPICE", "HERB", "SAUCE", "SOUP", "CAKE", "PIE", "COFFEE", "TEA",
      "JUICE", "NUT", "GRAIN", "RICE", "SUSHI", "PIZZA", "BURGER",
      "SANDWICH", "SALAD", "ICE CREAM", "CHOCOLATE", "COOK", "BAKE",
      "FRY", "GRILL", "RESTAURANT", "CHEF", "RECIPE", "INGREDIENT",
      "FLAVOR", "TASTE", "SWEET", "SOUR", "BITTER", "SAVORY",
      "APPLE", "BANANA", "ORANGE", "GRAPE", "LEMON", "LIME", "BERRY",
      "CHERRY", "PEACH", "MELON", "MANGO", "AVOCADO", "TOMATO",
      "POTATO", "ONION", "PEPPER", "GARLIC", "MUSHROOM",
    ],
    icon: "🍕",
    accent: "border-l-orange-500",
    seoKeywords: [
      "connections food categories",
      "nyt connections food puzzles",
      "connections fruit groups",
      "connections cooking categories",
    ],
    strategyIntro:
      "Food categories are deceptively tricky because many food words have non-food meanings. 'Turkey' is a country, 'Date' is a calendar word, and 'Ginger' is a name. The key is looking at all 16 words holistically before assuming any word belongs to a food group.",
    strategyTips: [
      {
        title: "Check for Double Meanings First",
        content:
          "Words like 'Sage' (herb or wise person), 'Basil' (herb or name), 'Olive' (fruit or name), and 'Clove' (spice or a section of garlic) are classic Connections traps. Before locking a word into a food group, ask if it has a stronger non-food connection to other words on the board.",
      },
      {
        title: "Think Beyond Categories",
        content:
          "NYT editors love using food words in structural patterns. A word like 'Apple' might not be in a fruit group at all — it could be in a 'tech companies' group or a '___ pie' fill-in-the-blank category. Read the full board before committing.",
      },
      {
        title: "Group by Specificity",
        content:
          "If you see multiple food words, try to determine how specific the category is. 'Types of pasta' is more specific than 'Italian food'. The more specific the grouping, the more likely it is the correct one — Connections rewards precision.",
      },
    ],
    commonTraps: [
      {
        title: "Fruit Words as Names or Colors",
        description:
          "Orange (color), Cherry (name), Plum (color), Olive (name/color) — these words regularly appear in non-food categories.",
      },
      {
        title: "Food in Compound Words",
        description:
          "Words like 'Honeymoon', 'Butterfingers', or 'Peppermint' contain food words but belong to completely different categories.",
      },
      {
        title: "Cooking Verbs with Multiple Uses",
        description:
          "'Grill' (interrogate), 'Roast' (comedy), 'Toast' (celebration) — cooking actions that are used metaphorically in other contexts.",
      },
    ],
  },
  {
    slug: "movies-tv",
    title: "Movies & TV Categories in Connections",
    label: "Movies & TV",
    description:
      "Connections puzzles featuring film, television, actors, directors, and entertainment categories.",
    heroDescription:
      "Movies and television provide rich material for Connections puzzles. Whether it is actor last names, film franchises, TV show titles, or character names, these categories test your pop culture knowledge alongside your word association skills.",
    keywords: [
      "MOVIE", "FILM", "ACTOR", "ACTRESS", "DIRECTOR", "OSCAR",
      "EMMY", "HOLLYWOOD", "NETFLIX", "HBO", "DISNEY", "PIXAR",
      "MARVEL", "STAR WARS", "BOND", "BATMAN", "SUPERHERO",
      "COMEDY", "DRAMA", "HORROR", "THRILLER", "SEQUEL",
      "SERIES", "SHOW", "EPISODE", "SEASON", "TV", "TELEVISION",
      "SITCOM", "CARTOON", "ANIMATED", "DOCUMENTARY", "SCREEN",
      "CINEMA", "BOX OFFICE", "PREMIERE", "TRAILER",
    ],
    icon: "🎬",
    accent: "border-l-purple-500",
    seoKeywords: [
      "connections movie categories",
      "nyt connections tv groups",
      "connections film puzzles",
      "connections actor categories",
    ],
    strategyIntro:
      "Movie and TV categories often overlap with name-based groups. An actor's last name might also be a common English word, or a film title might contain words that fit another category entirely. The key is identifying whether the board is testing your entertainment knowledge or using entertainment words as red herrings.",
    strategyTips: [
      {
        title: "Separate Names from Words",
        content:
          "Actor last names like 'Stone', 'Fox', 'Banks', and 'Freeman' are all common English words. When you see these on a board, check whether they form a stronger connection as people or as vocabulary.",
      },
      {
        title: "Look for Franchise Patterns",
        content:
          "Connections loves using franchise-based groups: 'Marvel characters', 'Disney princesses', 'Bond films'. If you spot two words that clearly belong to the same franchise, look for two more before submitting.",
      },
      {
        title: "Consider Era and Genre",
        content:
          "Sometimes the category is not just 'movies' but 'movies from the 1990s' or 'horror movie villains'. The specificity often lives in the genre or time period, not just the medium.",
      },
    ],
    commonTraps: [
      {
        title: "Actor Names as Common Words",
        description:
          "'Berry' (Halle), 'Pitt' (Brad), 'Stone' (Emma), 'Wilde' (Olivia) — these last names are everyday words that could fit food, geography, or adjective groups.",
      },
      {
        title: "Movie Titles with Generic Words",
        description:
          "'Frozen', 'Up', 'Drive', 'Her' — single-word movie titles that look like they belong in other categories.",
      },
    ],
  },
  {
    slug: "sports",
    title: "Sports Categories in Connections",
    label: "Sports",
    description:
      "Connections puzzles with sports teams, athletes, equipment, terminology, and athletic categories.",
    heroDescription:
      "Sports categories in Connections range from team names and athlete surnames to equipment, positions, and scoring terminology. These groups reward fans who can think across multiple sports while watching for words that have non-sports meanings.",
    keywords: [
      "SPORT", "TEAM", "PLAYER", "COACH", "GAME", "MATCH", "SCORE",
      "GOAL", "POINT", "WIN", "LOSS", "CHAMPION", "LEAGUE", "SEASON",
      "NBA", "NFL", "MLB", "NHL", "FIFA", "OLYMPIC", "SOCCER",
      "FOOTBALL", "BASKETBALL", "BASEBALL", "HOCKEY", "TENNIS",
      "GOLF", "BOXING", "WRESTLING", "SWIMMING", "RUNNING",
      "TRACK", "FIELD", "COURT", "PITCH", "STADIUM",
      "QUARTERBACK", "PITCHER", "GOALIE", "REFEREE",
      "TOUCHDOWN", "HOME RUN", "SLAM DUNK", "ACE",
      "BALL", "BAT", "RACKET", "CLUB", "NET",
    ],
    icon: "⚽",
    accent: "border-l-green-500",
    seoKeywords: [
      "connections sports categories",
      "nyt connections sports puzzles",
      "connections team names",
      "connections athletic groups",
    ],
    strategyIntro:
      "Sports categories are common in Connections and especially tricky because so many sports terms have other meanings. 'Net' is a sports object and a tech term. 'Pitch' belongs to sports, music, and sales. The key is figuring out whether the board is using sports words literally or structurally.",
    strategyTips: [
      {
        title: "Think Across Sports",
        content:
          "A group might not be 'basketball terms' but 'things in multiple sports' — like 'court' (tennis and basketball), 'pitch' (cricket and soccer), 'match' (tennis and boxing). Cross-sport vocabulary is a favorite NYT trick.",
      },
      {
        title: "Watch for Team Name Patterns",
        content:
          "Team names are animals, colors, or occupations. 'Eagles', 'Reds', 'Packers' — these words have non-sports meanings that might be the actual category.",
      },
      {
        title: "Positions and Equipment Overlap",
        content:
          "A word like 'Driver' could be a golf club or a NASCAR role. 'Wing' is a hockey position and a part of a building. Consider all possible sports contexts before committing.",
      },
    ],
    commonTraps: [
      {
        title: "Team Names as Animals",
        description:
          "'Bears', 'Eagles', 'Tigers', 'Dolphins' — these could be a sports team group or an animal group. Look for the one reading that accounts for all four words.",
      },
      {
        title: "Sports Verbs in Other Contexts",
        description:
          "'Strike' (bowling and labor), 'Pitch' (baseball and business), 'Draft' (NFL and writing) — these action words regularly cross into non-sports categories.",
      },
    ],
  },
  {
    slug: "music",
    title: "Music Categories in Connections",
    label: "Music",
    description:
      "Connections puzzles featuring musical instruments, genres, artists, songs, and music theory terms.",
    heroDescription:
      "Music is a versatile category in Connections puzzles, covering everything from instrument types and genre names to artist surnames and song titles. These groups test both your music knowledge and your ability to spot when music words are being used in completely different contexts.",
    keywords: [
      "MUSIC", "SONG", "BAND", "ARTIST", "SINGER", "ALBUM",
      "GENRE", "ROCK", "POP", "JAZZ", "BLUES", "COUNTRY",
      "HIP HOP", "RAP", "CLASSICAL", "PUNK", "METAL",
      "GUITAR", "PIANO", "DRUM", "VIOLIN", "BASS", "TRUMPET",
      "FLUTE", "SAXOPHONE", "HARMONY", "MELODY", "RHYTHM",
      "CHORD", "NOTE", "KEY", "SCALE", "TEMPO", "BEAT",
      "LYRIC", "VERSE", "CHORUS", "BRIDGE", "CONCERT",
      "TOUR", "GRAMMY", "RECORD", "VINYL", "TRACK",
    ],
    icon: "🎵",
    accent: "border-l-pink-500",
    seoKeywords: [
      "connections music categories",
      "nyt connections music puzzles",
      "connections instrument groups",
      "connections music genre categories",
    ],
    strategyIntro:
      "Music categories often rely on the dual nature of music terms. 'Bass' is a fish and an instrument. 'Key' opens a door and defines a song. 'Record' is a vinyl and an achievement. The best approach is to count how many words on the board could plausibly be music-related, and then decide whether that count matches a group of exactly four.",
    strategyTips: [
      {
        title: "Instruments Have Other Meanings",
        content:
          "'Drum' (container), 'Organ' (body part), 'Triangle' (shape), 'Bell' (name) — instrument words are classic misdirection. Check if four instruments form a clean group or if they're scattered as red herrings.",
      },
      {
        title: "Genre Names as Adjectives",
        content:
          "'Blues' (sad), 'Punk' (attitude), 'Soul' (essence), 'Country' (nation) — genre names work as standalone words. The category might be feelings or places, not music.",
      },
      {
        title: "Song Titles as Phrases",
        content:
          "If a board has words that are famous song titles, check whether the connection is 'songs by [artist]' or whether those words form a different pattern entirely.",
      },
    ],
    commonTraps: [
      {
        title: "Music Terms as Everyday Words",
        description:
          "'Note' (message), 'Rest' (relax), 'Bar' (place), 'Staff' (employees) — music notation terms that have more common non-music meanings.",
      },
      {
        title: "Artist Names as Words",
        description:
          "'Drake' (duck), 'Prince' (royalty), 'Queen' (royalty), 'Seal' (animal) — musician names that are also common nouns.",
      },
    ],
  },
  {
    slug: "nature-animals",
    title: "Nature & Animals Categories in Connections",
    label: "Nature & Animals",
    description:
      "Connections puzzles with animals, plants, weather, geography, and natural world categories.",
    heroDescription:
      "Nature and animal categories are among the most common in Connections, and for good reason — animal names, plant types, and weather words are rich with double meanings that make perfect puzzle material.",
    keywords: [
      "ANIMAL", "BIRD", "FISH", "DOG", "CAT", "HORSE", "BEAR",
      "LION", "TIGER", "EAGLE", "HAWK", "WHALE", "SHARK",
      "SNAKE", "SPIDER", "BEE", "ANT", "BUTTERFLY",
      "TREE", "FLOWER", "PLANT", "GARDEN", "FOREST", "JUNGLE",
      "OCEAN", "RIVER", "MOUNTAIN", "DESERT", "ISLAND",
      "WEATHER", "RAIN", "SNOW", "STORM", "WIND", "CLOUD",
      "SUN", "MOON", "STAR", "EARTH", "NATURE", "WILD",
      "ROSE", "LILY", "DAISY", "VIOLET", "IRIS",
    ],
    icon: "🌿",
    accent: "border-l-teal-500",
    seoKeywords: [
      "connections animal categories",
      "nyt connections nature puzzles",
      "connections animal groups",
      "connections plant categories",
    ],
    strategyIntro:
      "Nature and animal words are double-meaning goldmines. Nearly every animal name doubles as a verb, adjective, or proper noun — 'Crane' lifts things, 'Robin' is a name, 'Hawk' means to sell aggressively. When you see nature words on the board, immediately check for non-nature alternatives.",
    strategyTips: [
      {
        title: "Animal Names as Verbs",
        content:
          "'Duck' (avoid), 'Ram' (push), 'Badger' (pester), 'Crane' (stretch) — many animal names are also actions. Check if the board is grouping animals or actions.",
      },
      {
        title: "Flower Names as People Names",
        content:
          "'Rose', 'Lily', 'Daisy', 'Violet', 'Iris', 'Jasmine' — these are flowers and names. The category might be 'girls' names' rather than a botanical group.",
      },
      {
        title: "Look for Habitat Groupings",
        content:
          "Sometimes the connection is not 'animals' but 'things found in the ocean' or 'Arctic animals'. The specificity matters — broad categories rarely work in Connections.",
      },
    ],
    commonTraps: [
      {
        title: "Animals as Team Names",
        description:
          "'Bears', 'Eagles', 'Dolphins', 'Jaguars' — these are animals and NFL teams. One reading usually wins.",
      },
      {
        title: "Weather Words as Emotions",
        description:
          "'Stormy' (turbulent), 'Sunny' (cheerful), 'Cloudy' (confused), 'Cold' (unfriendly) — weather adjectives that describe moods.",
      },
    ],
  },
  {
    slug: "geography-places",
    title: "Geography & Places Categories in Connections",
    label: "Geography & Places",
    description:
      "Connections puzzles featuring countries, cities, landmarks, and geographical terminology.",
    heroDescription:
      "Geography categories in Connections puzzle go beyond simple country lists. Expect city names that are also common words, landmarks used as metaphors, and geographical terms embedded in compound phrases.",
    keywords: [
      "COUNTRY", "CITY", "STATE", "CAPITAL", "CONTINENT",
      "PARIS", "LONDON", "TOKYO", "ROME", "BERLIN",
      "INDIA", "CHINA", "BRAZIL", "EGYPT", "TURKEY",
      "ISLAND", "MOUNTAIN", "RIVER", "LAKE", "OCEAN",
      "NORTH", "SOUTH", "EAST", "WEST", "COAST",
      "MAP", "BORDER", "REGION", "PROVINCE", "TERRITORY",
      "EUROPEAN", "ASIAN", "AFRICAN", "AMERICAN",
    ],
    icon: "🌍",
    accent: "border-l-cyan-500",
    seoKeywords: [
      "connections geography categories",
      "nyt connections country puzzles",
      "connections city groups",
      "connections places categories",
    ],
    strategyIntro:
      "Geography words in Connections are almost always misdirection candidates. 'Turkey' is a country and a bird. 'Chile' is a country and a pepper. 'Georgia' is a state, a country, and a name. Always check the non-geographic reading first.",
    strategyTips: [
      {
        title: "Country Names with Dual Meanings",
        content:
          "'Jordan' (name/country), 'Chad' (name/country), 'Georgia' (state/country/name), 'China' (country/porcelain) — these are the most commonly used misdirection words in geographic categories.",
      },
      {
        title: "Cities Inside Words",
        content:
          "Connections loves hiding city names inside larger words: 'PARIS' in 'comparison', 'ROME' in 'promote'. If you see a city name on the board, check if it appears inside other words too.",
      },
      {
        title: "Cardinal Directions as Modifiers",
        content:
          "'East' could be a direction, a part of a compass, or the beginning of a compound word like 'Eastwood'. Check whether direction words on the board modify other words.",
      },
    ],
    commonTraps: [
      {
        title: "Place Names as Food",
        description:
          "'Turkey' (country/bird), 'Chile' (country/pepper), 'Hamburg' (city/burger origin), 'Bologna' (city/meat) — food and geography constantly overlap.",
      },
      {
        title: "States as Common Words",
        description:
          "'Virginia' (name), 'Washington' (name), 'Oregon' (trail), 'Maine' (main) — US states with non-geographic meanings.",
      },
    ],
  },
  {
    slug: "wordplay-language",
    title: "Wordplay & Language Categories in Connections",
    label: "Wordplay & Language",
    description:
      "Connections puzzles built around puns, prefixes, suffixes, hidden words, and language structure.",
    heroDescription:
      "Wordplay categories are where Connections gets hardest. These groups reward players who stop thinking about what words mean and start thinking about what words do — their spelling, their structure, and the phrases they create.",
    keywords: [
      "___", "...", "STARTS WITH", "ENDS WITH", "BEGINS WITH",
      "PREFIX", "SUFFIX", "RHYME", "PALINDROME", "ANAGRAM",
      "HOMOPHONE", "HIDDEN", "SPELL", "LETTER", "VOWEL",
      "CONSONANT", "SYLLABLE", "ABBREVIATION", "ACRONYM",
      "BEFORE", "AFTER", "DOUBLE", "SILENT",
    ],
    icon: "🔤",
    accent: "border-l-violet-500",
    seoKeywords: [
      "connections wordplay categories",
      "nyt connections language puzzles",
      "connections prefix suffix groups",
      "connections hidden word categories",
    ],
    strategyIntro:
      "Wordplay categories are the primary reason people fail Connections puzzles. When a board stops rewarding topic matching and starts rewarding letter patterns, most players are caught off guard. The key is recognizing the shift early — if no four words seem to share a clean topic, look at their structure instead.",
    strategyTips: [
      {
        title: "Check for Hidden Words",
        content:
          "If you cannot find four words that share a topic, look inside the words themselves. Can you find a color, animal, or number hidden in each word? For example, 'reDRUM', 'monARCH', and 'pLATOon' each contain a hidden word.",
      },
      {
        title: "Test Common Phrases",
        content:
          "Fill-in-the-blank is the most common wordplay pattern. Try adding '___ time', '___ line', '___ point', or other common suffixes to see if four words complete the same phrase.",
      },
      {
        title: "Look at First and Last Letters",
        content:
          "Some categories group words by shared starting letters, ending sounds, or phonetic patterns. If four words all start with 'SH' or all end with '-TION', that is likely the connection.",
      },
    ],
    commonTraps: [
      {
        title: "Treating Wordplay as Topic",
        description:
          "The biggest mistake is assuming all groups are thematic. If three groups are topics and the fourth is a structural pattern, the structural group usually ends up in purple.",
      },
      {
        title: "Missing Fill-in-the-Blank Patterns",
        description:
          "Words that seem unrelated by topic might all complete the same phrase: '___ break', '___ down', 'out of ___'. Test blank positions before giving up.",
      },
    ],
  },
  {
    slug: "science-tech",
    title: "Science & Technology Categories in Connections",
    label: "Science & Tech",
    description:
      "Connections puzzles with scientific terms, technology companies, programming concepts, and STEM vocabulary.",
    heroDescription:
      "Science and technology categories in Connections draw from a wide pool — chemical elements, programming terms, tech company names, space vocabulary, and more. These categories reward STEM knowledge while testing whether you can distinguish technical terms from everyday language.",
    keywords: [
      "SCIENCE", "TECHNOLOGY", "COMPUTER", "SOFTWARE", "HARDWARE",
      "PROGRAMMING", "CODE", "DATA", "ALGORITHM", "NETWORK",
      "INTERNET", "WEB", "APP", "DIGITAL", "CLOUD",
      "APPLE", "GOOGLE", "AMAZON", "MICROSOFT", "META",
      "ELEMENT", "ATOM", "MOLECULE", "CELL", "DNA",
      "PLANET", "STAR", "GALAXY", "ORBIT", "ROCKET",
      "ELECTRIC", "ENERGY", "POWER", "SIGNAL", "WAVE",
      "ROBOT", "AI", "MACHINE", "CHIP", "SCREEN",
    ],
    icon: "🔬",
    accent: "border-l-sky-500",
    seoKeywords: [
      "connections science categories",
      "nyt connections technology puzzles",
      "connections tech company groups",
      "connections stem categories",
    ],
    strategyIntro:
      "Science and tech categories are tricky because so many tech terms are borrowed from everyday English. 'Cloud' is weather and computing. 'Python' is a snake and a language. 'Apple' is a fruit and a company. When you see tech-sounding words, always check for the non-tech reading.",
    strategyTips: [
      {
        title: "Tech Companies Have Normal Names",
        content:
          "'Apple' (fruit), 'Amazon' (river), 'Oracle' (fortune teller), 'Shell' (seashell) — company names are chosen to be memorable words. Check both readings.",
      },
      {
        title: "Element Names as Adjectives",
        content:
          "'Iron' (determination), 'Lead' (guide), 'Mercury' (planet/god), 'Gold' (color/medal) — chemical elements often have more common non-science meanings.",
      },
      {
        title: "Space Words in Everyday Use",
        content:
          "'Eclipse' (overshadow), 'Orbit' (path), 'Launch' (start), 'Satellite' (peripheral) — space terminology is frequently used metaphorically.",
      },
    ],
    commonTraps: [
      {
        title: "Programming Terms as Actions",
        description:
          "'Push' (git and physical), 'Branch' (tree and code), 'Merge' (combine), 'Fork' (utensil and repo) — coding terms with everyday equivalents.",
      },
      {
        title: "Planet Names as Mythology",
        description:
          "'Mars' (god of war), 'Venus' (goddess/tennis player), 'Mercury' (god/element/planet) — planets named after gods create triple-meaning confusion.",
      },
    ],
  },
  {
    slug: "body-health",
    title: "Body & Health Categories in Connections",
    label: "Body & Health",
    description:
      "Connections puzzles featuring body parts, medical terms, fitness concepts, and health vocabulary.",
    heroDescription:
      "Body and health categories appear frequently in Connections because body part names are some of the most versatile words in English. A 'palm' is a hand part, a tree, and a reading method. These categories reward anatomical awareness and creative thinking about double meanings.",
    keywords: [
      "BODY", "HEART", "BRAIN", "LUNG", "LIVER", "KIDNEY",
      "BONE", "MUSCLE", "SKIN", "BLOOD", "EYE", "EAR",
      "NOSE", "MOUTH", "HAND", "FOOT", "ARM", "LEG",
      "HEAD", "BACK", "NECK", "SHOULDER", "KNEE", "ELBOW",
      "FINGER", "THUMB", "PALM", "WRIST", "ANKLE",
      "TOOTH", "TONGUE", "NAIL", "RIB", "SPINE",
      "HEALTH", "DOCTOR", "NURSE", "MEDICINE", "HOSPITAL",
    ],
    icon: "🫀",
    accent: "border-l-rose-500",
    seoKeywords: [
      "connections body categories",
      "nyt connections body part puzzles",
      "connections health groups",
      "connections anatomy categories",
    ],
    strategyIntro:
      "Body part categories are a Connections staple because almost every body part word has another meaning. 'Crown' is a tooth and royalty. 'Temple' is a head part and a building. The solving trick is to count how many body words appear on the board — if there are more than four, some are red herrings.",
    strategyTips: [
      {
        title: "Body Parts as Verbs",
        content:
          "'Shoulder' (carry), 'Elbow' (push), 'Toe' (the line), 'Rib' (tease) — body parts that double as actions. Check whether the board is grouping nouns or verbs.",
      },
      {
        title: "Facial Features as Names",
        content:
          "'Iris' (eye part/flower/name), 'Temple' (head/building), 'Bridge' (nose/structure) — facial anatomy terms with architectural or botanical alternatives.",
      },
      {
        title: "Count to Four",
        content:
          "If you see six body part words on the board, only four belong to the body category. The other two are misdirection — figure out which two are stronger elsewhere.",
      },
    ],
    commonTraps: [
      {
        title: "Body Parts in Compound Words",
        description:
          "'Headband', 'Armchair', 'Kneecap', 'Backbone' — sometimes the body part is part of a compound, and the real group is compound words or '___ cap' phrases.",
      },
      {
        title: "Organs as Non-Body Words",
        description:
          "'Heart' (center/love), 'Liver' (one who lives), 'Kidney' (bean shape) — organs with metaphorical or alternative meanings.",
      },
    ],
  },
  {
    slug: "fashion-clothing",
    title: "Fashion & Clothing Categories in Connections",
    label: "Fashion & Clothing",
    description:
      "Connections puzzles with clothing items, fabric types, fashion brands, and style terminology.",
    heroDescription:
      "Fashion and clothing categories in Connections combine everyday wardrobe items with fabric names, style terminology, and brand references. These categories often overlap with color groups and material-based categories.",
    keywords: [
      "SHIRT", "PANTS", "DRESS", "JACKET", "COAT", "SHOE",
      "BOOT", "HAT", "CAP", "TIE", "BELT", "SCARF",
      "GLOVE", "SOCK", "SKIRT", "SUIT", "VEST", "SWEATER",
      "COTTON", "SILK", "WOOL", "DENIM", "LEATHER", "LINEN",
      "VELVET", "SATIN", "LACE", "FASHION", "STYLE", "TREND",
      "DESIGNER", "BRAND", "FABRIC", "PATTERN", "STRIPE",
      "PLAID", "POLKA DOT", "COLLAR", "SLEEVE", "POCKET", "HEEL",
    ],
    icon: "👔",
    accent: "border-l-fuchsia-500",
    seoKeywords: [
      "connections clothing categories",
      "nyt connections fashion puzzles",
      "connections fabric groups",
      "connections clothing item categories",
    ],
    strategyIntro:
      "Clothing categories are straightforward on the surface but tricky in practice. Many clothing items are also non-clothing things: a 'cap' limits something, a 'tie' connects things, a 'suit' is a legal case. The key is checking whether the board has exactly four clean clothing items or if some are planted misdirection.",
    strategyTips: [
      {
        title: "Accessories vs. Main Garments",
        content:
          "The category might be specifically 'accessories' (belt, scarf, tie, hat) rather than all clothing. Pay attention to the specificity of the group — a broad 'clothing' category is rare in Connections.",
      },
      {
        title: "Fabric Names as Adjectives",
        content:
          "'Silky' (smooth), 'Woolly' (vague), 'Steely' (determined) — fabric-derived adjectives might be the real category, not the fabrics themselves.",
      },
      {
        title: "Clothing as Metaphor",
        content:
          "'Dress' (prepare), 'Iron' (press/metal), 'Press' (push/media), 'Suit' (legal action) — clothing words used as verbs have caught many players.",
      },
    ],
    commonTraps: [
      {
        title: "Headwear Names as Other Things",
        description:
          "'Cap' (limit), 'Crown' (royalty), 'Hood' (neighborhood), 'Beret' (specifically French) — hat-type words with non-fashion meanings.",
      },
      {
        title: "Shoe Types as Brands or Actions",
        description:
          "'Pump' (gas/water), 'Mule' (animal), 'Wedge' (shape/golf club), 'Platform' (stage) — shoe styles that are everyday words.",
      },
    ],
  },
  {
    slug: "numbers-math",
    title: "Numbers & Math Categories in Connections",
    label: "Numbers & Math",
    description:
      "Connections puzzles involving numbers, mathematical concepts, counting, and numerical patterns.",
    heroDescription:
      "Numbers and math categories in Connections go beyond simple arithmetic. Expect groups based on number words hidden in other words, mathematical terms used metaphorically, and numbers that share a non-obvious property.",
    keywords: [
      "NUMBER", "MATH", "ONE", "TWO", "THREE", "FOUR", "FIVE",
      "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ZERO", "HUNDRED",
      "THOUSAND", "MILLION", "BILLION", "HALF", "QUARTER",
      "DOUBLE", "TRIPLE", "PAIR", "DOZEN", "SCORE",
      "PLUS", "MINUS", "TIMES", "DIVIDE", "EQUAL",
      "PRIME", "SQUARE", "ROOT", "FRACTION", "DECIMAL",
      "AVERAGE", "SUM", "TOTAL", "COUNT", "ODD", "EVEN",
    ],
    icon: "🔢",
    accent: "border-l-indigo-500",
    seoKeywords: [
      "connections number categories",
      "nyt connections math puzzles",
      "connections number groups",
      "connections mathematical categories",
    ],
    strategyIntro:
      "Number categories are deceptively hard because numbers hide inside words and connect to so many systems: sports jersey numbers, playing card values, addresses, ages, and more. When you see number-adjacent words, think about what specific system they belong to.",
    strategyTips: [
      {
        title: "Numbers Hidden in Words",
        content:
          "'forTEN', 'sEIGHT', 'canINE', 'ONE-st' — hidden number categories are a classic purple group pattern. If you cannot find a thematic connection, look for numbers inside the spelling.",
      },
      {
        title: "Math Terms as Everyday Words",
        content:
          "'Odd' (strange), 'Even' (level), 'Mean' (cruel/average), 'Root' (plant/math) — mathematical vocabulary has extensive non-math usage.",
      },
      {
        title: "Number Systems",
        content:
          "The group might be 'prime numbers', 'Fibonacci numbers', or 'perfect squares' — not just 'numbers'. Check for mathematical properties that link exactly four items.",
      },
    ],
    commonTraps: [
      {
        title: "Ordinal Words as Names",
        description:
          "'Pierce' (14th president), 'Lincoln' (16th), 'Madison' (4th) — president-associated words where the hidden connection is their number, not their name.",
      },
      {
        title: "Quantity Words as Adjectives",
        description:
          "'Single' (unmarried), 'Double' (duplicate), 'Gross' (disgusting/144), 'Score' (music/20) — counting words with lifestyle meanings.",
      },
    ],
  },
  {
    slug: "colors",
    title: "Color Categories in Connections",
    label: "Colors",
    description:
      "Connections puzzles built around colors, shades, hues, and color-related vocabulary.",
    heroDescription:
      "Color categories are one of the most common and most deceptive category types in Connections. Color words appear in names, phrases, team names, and compound words constantly — making them perfect misdirection material.",
    keywords: [
      "RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE",
      "BLACK", "WHITE", "PINK", "BROWN", "GRAY", "GREY",
      "GOLD", "SILVER", "BRONZE", "CRIMSON", "SCARLET",
      "NAVY", "TEAL", "CORAL", "IVORY", "JADE", "RUBY",
      "AMBER", "VIOLET", "INDIGO", "MAROON", "MAGENTA",
      "COLOR", "SHADE", "HUE", "TONE", "TINT", "DYE",
    ],
    icon: "🎨",
    accent: "border-l-rose-500",
    seoKeywords: [
      "connections color categories",
      "nyt connections color puzzles",
      "connections shade groups",
      "connections color word categories",
    ],
    strategyIntro:
      "Color words are the ultimate Connections misdirection tool. Every color has multiple non-color meanings: 'Navy' is a military branch, 'Olive' is a fruit and a name, 'Jade' is a stone and a name. When you see colors on a board, your first instinct should be to check if they are being used as colors at all.",
    strategyTips: [
      {
        title: "Colors as Names",
        content:
          "'Scarlett' (Johansson), 'Amber' (alert), 'Ruby' (gem/name), 'Violet' (flower/name) — color words that double as proper names appear in almost every other puzzle.",
      },
      {
        title: "Color + Noun Compounds",
        content:
          "'Blackbird', 'Greenback', 'Redwood', 'Blueberry' — colors combine with other words to form compounds. The real group might be '___ bird' or '___ berry', not colors.",
      },
      {
        title: "Shades vs. Base Colors",
        content:
          "If you see 'Crimson', 'Scarlet', 'Ruby', and 'Cherry' — these are all shades of red, not just random color words. The specificity matters.",
      },
    ],
    commonTraps: [
      {
        title: "Colors Hidden in Words",
        description:
          "'pINKy', 'bLUEprint', 'gREENade', 'yELLOW' — colors hidden inside other words is a common purple group pattern.",
      },
      {
        title: "Gemstone Colors",
        description:
          "'Ruby' (red), 'Sapphire' (blue), 'Emerald' (green), 'Amethyst' (purple) — these could be a colors group or a gemstones group. Determining the intended category is key.",
      },
    ],
  },
  {
    slug: "history-culture",
    title: "History & Culture Categories in Connections",
    label: "History & Culture",
    description:
      "Connections puzzles referencing historical events, cultural figures, mythology, and time periods.",
    heroDescription:
      "History and culture categories in Connections draw from mythology, historical figures, cultural milestones, and time-period vocabulary. These groups test general knowledge while layering in the double-meaning complexity that makes Connections challenging.",
    keywords: [
      "KING", "QUEEN", "PRINCE", "PRINCESS", "EMPEROR",
      "PRESIDENT", "WAR", "BATTLE", "REVOLUTION", "EMPIRE",
      "ANCIENT", "MEDIEVAL", "RENAISSANCE", "MODERN",
      "GREEK", "ROMAN", "EGYPTIAN", "VIKING", "AZTEC",
      "ZEUS", "APOLLO", "ATHENA", "VENUS", "MARS",
      "MYTHOLOGY", "LEGEND", "HERO", "GODDESS", "GOD",
      "CROWN", "THRONE", "CASTLE", "KNIGHT", "SWORD",
      "DYNASTY", "ERA", "CENTURY", "AGE", "PERIOD",
    ],
    icon: "🏛️",
    accent: "border-l-amber-700",
    seoKeywords: [
      "connections history categories",
      "nyt connections culture puzzles",
      "connections mythology groups",
      "connections historical categories",
    ],
    strategyIntro:
      "History and culture categories are layered — a word like 'Apollo' is simultaneously a Greek god, a NASA program, a movie (Rocky), and a music venue. The challenge is determining which historical or cultural frame the puzzle is using. Start by counting how many words fit each frame and see which one gives you exactly four.",
    strategyTips: [
      {
        title: "Mythology Overlaps with Everything",
        content:
          "Greek and Roman god names appear as planets (Mars, Venus), days of the week (Saturday from Saturn), months (January from Janus), and brands (Nike, Amazon). Count your options carefully.",
      },
      {
        title: "Royalty as General Vocabulary",
        content:
          "'King' (chess/name/Martin Luther), 'Queen' (chess/band/playing card), 'Crown' (tooth/achievement) — royal terms serve many non-royal purposes.",
      },
      {
        title: "Historical Figures by Last Name",
        content:
          "Names like 'Lincoln', 'Washington', 'Franklin' are presidents, cities, and everyday words. The board might group them by office, not by name.",
      },
    ],
    commonTraps: [
      {
        title: "Greek Gods as Modern References",
        description:
          "'Mercury' (planet/element/Queen singer), 'Nike' (shoe brand), 'Amazon' (company/river), 'Apollo' (NASA/movie) — mythology terms with stronger modern associations.",
      },
      {
        title: "War Terms as Everyday Language",
        description:
          "'Campaign' (marketing), 'Draft' (writing/beer), 'Siege' (mindset), 'Rank' (position) — military vocabulary used in business and daily life.",
      },
    ],
  },
  {
    slug: "games-toys",
    title: "Games & Toys Categories in Connections",
    label: "Games & Toys",
    description:
      "Connections puzzles featuring board games, card games, video games, toys, and play-related categories.",
    heroDescription:
      "Games and toys categories in Connections leverage the rich vocabulary of board games, card games, video games, and childhood toys. These groups often overlap with number categories (dice, cards), color categories (board game pieces), and strategy vocabulary.",
    keywords: [
      "GAME", "PLAY", "BOARD", "CARD", "DICE", "CHESS",
      "POKER", "BRIDGE", "MONOPOLY", "SCRABBLE", "RISK",
      "CLUE", "TROUBLE", "SORRY", "LIFE", "OPERATION",
      "PAWN", "KING", "QUEEN", "BISHOP", "KNIGHT", "ROOK",
      "ACE", "JACK", "JOKER", "TRUMP", "WILD",
      "TOY", "DOLL", "PUZZLE", "LEGO", "MARIO",
      "LEVEL", "SCORE", "PLAYER", "WINNER", "LOSER",
    ],
    icon: "🎲",
    accent: "border-l-yellow-500",
    seoKeywords: [
      "connections game categories",
      "nyt connections board game puzzles",
      "connections chess groups",
      "connections card game categories",
    ],
    strategyIntro:
      "Games vocabulary is full of everyday words repurposed as game terms. 'Operation' is a board game and a surgery. 'Life' is a board game and... life. 'Risk' is a board game and a danger. The trick is recognizing when four game names share a more specific connection than just 'games'.",
    strategyTips: [
      {
        title: "Chess Pieces as Other Things",
        content:
          "'Bishop' (religious figure), 'Knight' (medieval warrior), 'Rook' (crow/castle), 'Queen' (royalty) — chess pieces overlap heavily with royalty and medieval vocabulary.",
      },
      {
        title: "Board Game Names as Concepts",
        content:
          "'Risk' (danger), 'Operation' (surgery/military), 'Clue' (hint), 'Trouble' (problem), 'Sorry' (apology), 'Life' (existence) — these are common words first, board games second.",
      },
      {
        title: "Card Terms in Other Contexts",
        content:
          "'Ace' (expert/tennis), 'Jack' (name/car jack), 'Trump' (surname/to surpass), 'Wild' (nature/uncontrolled) — card game terms with strong non-card meanings.",
      },
    ],
    commonTraps: [
      {
        title: "Game Genres as Activities",
        description:
          "'Puzzle' (mystery), 'Shooter' (photographer), 'Strategy' (planning), 'Adventure' (travel) — game genres that describe non-gaming activities.",
      },
      {
        title: "Video Game Characters as Names",
        description:
          "'Mario' (name), 'Link' (connection), 'Cloud' (weather/tech), 'Sonic' (speed) — character names that are common English words.",
      },
    ],
  },
  {
    slug: "compound-phrases",
    title: "Compound Words & Phrases in Connections",
    label: "Compound Words & Phrases",
    description:
      "Connections puzzles where groups are formed by compound words, common phrases, or shared word combinations.",
    heroDescription:
      "Compound word and phrase-based categories are the backbone of Connections puzzle difficulty. These groups ask you to stop thinking about word meanings and start thinking about word combinations — what comes before or after each word to form a common phrase.",
    keywords: [
      "___", "...", "BREAK", "DOWN", "UP", "OUT",
      "OVER", "BACK", "LINE", "POINT", "HAND", "TOP",
      "LIGHT", "FIRE", "WATER", "HOUSE", "DAY", "TIME",
      "HEAD", "BALL", "STONE", "BOARD", "BOOK", "DOOR",
    ],
    icon: "🔗",
    accent: "border-l-emerald-600",
    seoKeywords: [
      "connections compound words",
      "connections phrase categories",
      "nyt connections fill in blank",
      "connections word combination groups",
    ],
    strategyIntro:
      "Compound and phrase categories account for most of the difficulty in Connections. When four words all complete the same phrase (like '___ break' or 'fire ___'), recognizing the pattern requires you to mentally test combinations rather than rely on topic knowledge. This is the single most important skill to develop.",
    strategyTips: [
      {
        title: "Test Common Prefixes",
        content:
          "Try adding 'fire', 'water', 'sun', 'over', 'out', 'back', 'head', or 'hand' before each word on the board. If four words all work with the same prefix, that is likely a group.",
      },
      {
        title: "Test Common Suffixes",
        content:
          "Similarly, try adding 'man', 'board', 'house', 'light', 'line', 'stone', 'work', or 'break' after each word. Suffix-based compounds are equally common.",
      },
      {
        title: "Two-Word Phrases",
        content:
          "Some groups are not compounds but two-word phrases: 'blind ___' (spot, side, date, fold). Each word completes a different phrase starting with the same word.",
      },
    ],
    commonTraps: [
      {
        title: "Words That Fit Multiple Compounds",
        description:
          "'Light' works with 'house', 'weight', 'year', 'bulb', and 'ning'. When a word fits multiple compound patterns, the challenge is finding which specific pattern gives you exactly four words.",
      },
      {
        title: "Mixing Topic with Structure",
        description:
          "Players often see a topic connection and miss the structural one. If 'Fire', 'Water', 'Light', and 'Power' are on the board, they might not be 'elements' — they might each precede 'house'.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Matching logic                                                     */
/* ------------------------------------------------------------------ */

/** Check if a group label matches a theme's keywords */
export function groupMatchesTheme(
  group: ConnectionsGroup,
  theme: CategoryTheme
): boolean {
  const label = group.group.toUpperCase();
  const members = group.members.map((m) => m.toUpperCase());

  // Check group label
  for (const keyword of theme.keywords) {
    if (label.includes(keyword)) return true;
  }

  // For broader themes, also check member words
  for (const member of members) {
    for (const keyword of theme.keywords) {
      if (member === keyword) return true;
    }
  }

  return false;
}

/** Get all puzzles that have at least one group matching a theme */
export function getPuzzlesForTheme(
  puzzles: ConnectionsPuzzle[],
  theme: CategoryTheme
): ConnectionsPuzzle[] {
  return puzzles.filter((puzzle) =>
    puzzle.answers.some((group) => groupMatchesTheme(group, theme))
  );
}

/** Count matched groups for a theme across all puzzles */
export function getThemeStats(
  puzzles: ConnectionsPuzzle[],
  theme: CategoryTheme
): { puzzleCount: number; groupCount: number } {
  let groupCount = 0;
  let puzzleCount = 0;

  for (const puzzle of puzzles) {
    let hasMatch = false;
    for (const group of puzzle.answers) {
      if (groupMatchesTheme(group, theme)) {
        groupCount++;
        hasMatch = true;
      }
    }
    if (hasMatch) puzzleCount++;
  }

  return { puzzleCount, groupCount };
}

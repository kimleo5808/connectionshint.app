import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";

interface BoardNotes {
  clues: Record<string, string>;
  trap: string;
}

const notes: Record<string, BoardNotes> = {
  "2026-11-12": {
    clues: {
      '"GADZOOKS!"': "Imagine an old comic strip. What could the startled character shout in the speech balloon?",
      "STARTING WITH VARIATIONS": "Read the first word of each phrase. Each suggests something moving away from its previous state.",
      "ENDING IN WAYS TO COOK THINGS": "Read only the last word. A chef could use each as an instruction.",
      "STARTING WITH BEST PICTURE OSCAR WINNERS": "Cut off the last word of each entry and picture the film poster that remains.",
    },
    trap: "DOC BROWN, MARTY MCFLY and FLUX CAPACITOR all point to Back to the Future. Try splitting the names instead. BROWN is a cooking verb, MARTY is a Best Picture winner and FLUX describes change.",
  },
  "2026-11-13": {
    clues: {
      "USE THE INTERNET": "Think of what your thumb or cursor does between opening a browser and closing it.",
      "MEDIA ATTENTION": "A publicist might promise a client more of any of these.",
      "THINGS THAT ARE TOWED": "What supplies the motion? Look for four things that travel behind something else.",
      "BRAIN ___": "An ice-cream headache and a tricky riddle have something in common when you name them.",
    },
    trap: "SURF, WAVES and WATER SKIER suggest a day at the beach. WATER SKIER has a more precise partner in GLIDER: both can be pulled along. SURF works in a browser, and WAVES follows BRAIN.",
  },
  "2026-11-14": {
    clues: {
      "CUTTING-EDGE": "A reviewer comparing a prototype with last year's model might reach for these adjectives.",
      "LOCATIONS FOR AN INSTITUTION": "Look for places where a university or research organization might house its people.",
      "STRATEGY BOARD GAMES": "Sit two opponents across a table. Here GO belongs on the box.",
      "BABY GEAR WITH FIRST LETTER CHANGED": "Change just the opening letter of a tile. Would the new word fit on a baby registry?",
    },
    trap: "BATTLE sounds at home beside STRATEGO and CHESS, but it needs a letter swap: BATTLE becomes RATTLE. The same test turns TRIB into CRIB and MOTTLE into BOTTLE.",
  },
  "2026-11-15": {
    clues: {
      "UNMATCHED": "A sportscaster reaching for the record book could use any of these to describe a performance.",
      "WEDDING WEBSITE SECTIONS": "You're a guest opening a couple's website before the big day. Look for its menu headings.",
      "___ PLANE": "A geometer and an air traveler use the same following word in very different ways.",
      "ENDING IN VEGETABLES IN THE ALLIUM FAMILY": "Read the tails of the longer words aloud. A produce seller might recognize what is hiding there.",
    },
    trap: "TRAVEL and JET feel like natural partners. Try them on a wedding website: TRAVEL names a section for guests, while JET joins ASTRAL and CARTESIAN when you add PLANE. The travel theme doesn't explain those other two.",
  },
  "2026-11-16": {
    clues: {
      "SUMMER ___": "A child might spend July at one of these, and a movie studio might time a big release for the same months.",
      "SPRING ___": "Think of thawing weather. Its name can introduce both a household chore and a young bird.",
      "WINTER ___": "A familiar holiday song and something you put on your hands share an opening word.",
      "FALL ___": "Read ASLEEP as the second half of an action. The missing verb also starts a phrase about romance.",
    },
    trap: "CHICKEN, SAUSAGE, MELON and ONION could all go on a shopping list. Test the word before each: spring chicken and spring onion work together, but summer sausage and winter melon belong to different sets.",
  },
  "2026-11-17": {
    clues: {
      "CONVENE": "Imagine people arriving separately for a meeting. What do they do once everyone gets there?",
      'THINGS IN "SING A SONG OF SIXPENCE"': "Follow the bird into a nursery rhyme. What else turns up in its lyrics?",
      'FILMS WITH "!" IN THE TITLE': "Picture these names on a cinema marquee. Something is missing from the very end of each title.",
      "ENDING IN BOWLING TERMS": "Read the tail of each entry as if you were looking down a lane in rented shoes.",
    },
    trap: "HELP, COME TOGETHER, BLACKBIRD and PENNY LANE can all be read as Beatles titles. Here COME TOGETHER means assemble, BLACKBIRD belongs in the nursery rhyme, HELP needs its movie-title exclamation mark and PENNY LANE ends in bowling's LANE.",
  },
  "2026-11-18": {
    clues: {
      "DESCRIPTORS FOR A LEMON": "Imagine a still life. Describe the same piece of fruit by shape, color and what happens when you bite it.",
      "THINGS BEES PRODUCE": "Stand beside a hive. Count what you might hear as well as what you might find inside.",
      "CITIES IN FRANCE": "Read NICE again as a name you might see on a train ticket.",
      "___ FRY": "A voice coach and a short-order cook can finish two different expressions with the same little word.",
    },
    trap: "DIJON, HONEY, FRENCH and YELLOW all bring mustard to mind. The board splits them four ways: DIJON is a city, HONEY comes from bees, FRENCH precedes FRY and YELLOW describes a lemon. VOCAL works with FRY too: vocal fry is a low, creaky way of speaking.",
  },
};

export function firstClue(date: string, group: ConnectionsGroup): string {
  const clue = notes[date]?.clues[group.group];
  if (clue) return clue;
  const initials = group.members.map(word => Array.from(word)[0]).sort();
  if (group.members.every(word => Array.from(word).length === 1)) {
    return "Look at the shapes of the individual characters and how you would use each one.";
  }
  return `Check the initials of a possible set: this group's four entries start with ${initials.join(", ")}.`;
}

export function reviewedTrap(puzzle: ConnectionsPuzzle): string | undefined {
  const board = notes[puzzle.date];
  return board && puzzle.answers.every(group => board.clues[group.group]) ? board.trap : undefined;
}

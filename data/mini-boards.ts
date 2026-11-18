import type { ConnectionsGroup, ConnectionsLevel } from "@/types/connections";

type Trio = [label: string, first: string, second: string, third: string];

export interface MiniBoard {
  groups: ConnectionsGroup[];
  hint: string;
  explanation: string;
}

function mini(groups: [Trio, Trio, Trio], hint: string, explanation: string): MiniBoard {
  const levels: ConnectionsLevel[] = [0, 1, 3];
  return { hint, explanation, groups: groups.map(([group, ...members], i) => ({ level: levels[i], group, members })) };
}

export const miniBoards = [
  mini([
    ["At a gift-wrapping station", "BOW", "RIBBON", "TAPE"],
    ["Recorded music formats", "CASSETTE", "VINYL", "CD"],
    ["Attached parts of a violin", "BRIDGE", "PEG", "CHIN REST"],
  ], "Ask which things are attached to an instrument while you play it.",
    "A bow is used with a violin, but the bridge, peg and chin rest stay attached. TAPE can suggest music too. Let CASSETTE take that seat and the parcel has all three wrapping supplies."),
  mini([
    ["Pie fillings", "PECAN", "APPLE", "CHERRY"],
    ["Computer input devices", "MOUSE", "KEYBOARD", "TRACKPAD"],
    ["Big ___", "DIPPER", "BEN", "TOE"],
  ], "Think about what your hand actually operates at a computer.",
    "APPLE suggests a computer brand. A mouse, keyboard and trackpad each let you give a computer input. APPLE fits the pie row, and BIG goes before each of the last three tiles."),
  mini([
    ["Things with teeth", "COMB", "GEAR", "ZIPPER"],
    ["Words before BRUSH", "HAIR", "PAINT", "TOOTH"],
    ["Draw with a pencil", "SKETCH", "TRACE", "DOODLE"],
  ], "Picture the edge of a comb, then look for that feature on other objects.",
    "TOOTH names the feature, while COMB, GEAR and ZIPPER have teeth. PAINT looks at home with drawing verbs until you build hairbrush, paintbrush and toothbrush."),
  mini([
    ["Sewing machine parts", "BOBBIN", "NEEDLE", "PRESSER FOOT"],
    ["Parts of a pendulum clock", "DIAL", "HAND", "PENDULUM"],
    ["Words before POINT", "BALL", "FOCAL", "MATCH"],
  ], "A projecting point could describe several objects. Try POINT as the end of an expression.",
    "Needlepoint is a real word, so NEEDLE is tempting beside BALL and MATCH. FOCAL completes focal point. That frees the needle to stitch with the bobbin and presser foot."),
  mini([
    ["Punctuation marks", "COLON", "DASH", "PERIOD"],
    ["Units of time", "HOUR", "MINUTE", "WEEK"],
    ["Words before GLASS", "SHOT", "SPY", "WINE"],
  ], "One time unit could go into a glass compound. See what the other two time units need.",
    "A period can last an unspecified time, whereas an hour, minute and week are named units. HOUR suggests hourglass, but SHOT, SPY and WINE can take GLASS without breaking the time group."),
  mini([
    ["Chess pieces", "BISHOP", "KNIGHT", "ROOK"],
    ["Features of a castle", "DRAWBRIDGE", "MOAT", "TOWER"],
    ["Words joined to FALL", "NIGHT", "SNOW", "WATER"],
  ], "Two tiles sound identical. Pay attention to the one with a silent letter.",
    "A rook looks like a tower, and KNIGHT sounds like NIGHT. Spelling settles the latter choice: nightfall joins snowfall and waterfall. The knight can return to the chessboard."),
  mini([
    ["Kinds of tree", "ASH", "ELM", "FIR"],
    ["Animal coverings", "FEATHERS", "FUR", "SCALES"],
    ["Paper ___", "CLIP", "CUT", "TRAIL"],
  ], "Two different spellings share one pronunciation. Only one of them grows roots.",
    "FIR grows on the tree side and FUR covers an animal. PAPER may bring trees to mind, but here it goes before CLIP, CUT and TRAIL, in three expressions with very different meanings."),
  mini([
    ["Forms of bread", "BAGEL", "BAGUETTE", "ROLL"],
    ["Camera functions", "FLASH", "FOCUS", "ZOOM"],
    ["Drum ___", "KIT", "SOLO", "STICK"],
  ], "A drummer might ask for a roll. Check which other row would miss it.",
    "A drum roll is enough to make ROLL sound musical. BAGEL and BAGUETTE need a third bread, while drum kit, drum solo and drumstick already make a complete trio."),
  mini([
    ["In a play script", "ACT", "DIALOGUE", "SCENE"],
    ["Take a quick look", "GLANCE", "GLIMPSE", "PEEK"],
    ["Tools for reading a map", "COMPASS ROSE", "LEGEND", "SCALE"],
  ], "A legend can be a story or something you consult on paper.",
    "A LEGEND might sound like a story for the stage. On a map it explains symbols, the SCALE tells you distance and the COMPASS ROSE shows direction."),
  mini([
    ["Animals with shells", "NAUTILUS", "SNAIL", "TURTLE"],
    ["Sea ___", "CUCUMBER", "HORSE", "URCHIN"],
    ["Kitchen volume measures", "CUP", "PINT", "TEASPOON"],
  ], "Try saying SEA before a tile that looks like a vegetable.",
    "A sea turtle makes TURTLE a convincing fourth possibility for the sea expressions. CUCUMBER, HORSE and URCHIN already fill those places. A turtle has a shell, just like the snail and nautilus."),
  mini([
    ["Parts of a flower", "PETAL", "SEPAL", "STAMEN"],
    ["Parts of a bicycle", "CRANK", "PEDAL", "SPOKE"],
    ["Words before LINE", "CHORUS", "FINISH", "PUNCH"],
  ], "Imagine repairing a bicycle and dissecting a flower. Which spelling goes in which tray?",
    "PEDAL belongs on the bicycle and PETAL belongs on the flower. FINISH can suggest a cycle race, but finish line, chorus line and punch line share the same final word."),
  mini([
    ["Parts of a river", "BANK", "BED", "MOUTH"],
    ["Inside the mouth", "GUMS", "TEETH", "TONGUE"],
    ["Words joined to ROOM", "CLASS", "MAIL", "SHOW"],
  ], "A mouth can open into a much bigger body of water.",
    "MOUTH is the place that contains teeth, tongue and gums. It is also the point where a river empties. BED suggests bedroom, but classroom, mailroom and showroom already complete the compounds."),
];

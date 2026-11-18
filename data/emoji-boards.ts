import type { ConnectionsGroup, ConnectionsLevel } from "@/types/connections";

type Tile = [symbol: string, name: string];
type Row = [category: string, first: Tile, second: Tile, third: Tile, fourth: Tile];

export interface EmojiBoard {
  groups: ConnectionsGroup[];
  symbols: Record<string, string>;
  hint: string;
  explanation: string;
}

function board(rows: [Row, Row, Row, Row], hint: string, explanation: string): EmojiBoard {
  const symbols: Record<string, string> = {};
  const groups = rows.map(([group, ...tiles], level) => {
    const members = tiles.map(([symbol, name]) => {
      symbols[name] = symbol;
      return name;
    });
    return { group, level: level as ConnectionsLevel, members };
  });
  return { groups, symbols, hint, explanation };
}

export const emojiBoards = [
  board([
    ["Fruit you can peel", ["🍌", "Banana"], ["🍊", "Tangerine"], ["🥭", "Mango"], ["🍍", "Pineapple"]],
    ["Attached to a string or strings", ["🪁", "Kite"], ["🎻", "Violin"], ["🪀", "Yo-yo"], ["🎸", "Guitar"]],
    ["Usually worn in pairs", ["🧤", "Gloves"], ["🧦", "Socks"], ["👞", "Shoe"], ["🛼", "Roller skate"]],
    ["Things with a face", ["🎲", "Die"], ["⏰", "Alarm clock"], ["⌚", "Watch"], ["🪙", "Coin"]],
  ], "Something you wear on your wrist has a part in common with a die.",
    "A watch and a clock each have a face. So does a die, and a coin has two. The watch is worn on its own, while shoes, socks, gloves and roller skates usually come in pairs."),
  board([
    ["Foods often cut into slices", ["🍕", "Pizza"], ["🍞", "Bread"], ["🍰", "Cake"], ["🍉", "Watermelon"]],
    ["Hoofed animals", ["🐎", "Horse"], ["🦓", "Zebra"], ["🐐", "Goat"], ["🐄", "Cow"]],
    ["Can have a zipper", ["🎒", "Backpack"], ["🧳", "Suitcase"], ["🧥", "Coat"], ["👖", "Jeans"]],
    ["Things with a neck", ["🦒", "Giraffe"], ["🎸", "Guitar"], ["🍾", "Bottle"], ["👕", "T-shirt"]],
  ], "A guitar player, a tailor and a bottle maker all use the same word for a part.",
    "A giraffe has hooves, but four other animals already fill that row. Its long neck connects it to the guitar's fretted neck, the bottle's narrow neck and the neck of the T-shirt."),
  board([
    ["Usually made from paper", ["✉️", "Envelope"], ["📓", "Notebook"], ["📅", "Calendar"], ["📰", "Newspaper"]],
    ["Tools for household repairs", ["🔧", "Wrench"], ["🔨", "Hammer"], ["🪛", "Screwdriver"], ["🪠", "Plunger"]],
    ["Ocean hunters", ["🦭", "Seal"], ["🐬", "Dolphin"], ["🐙", "Octopus"], ["🦑", "Squid"]],
    ["Things with teeth", ["🦈", "Shark"], ["🗝️", "Key"], ["⚙️", "Gear"], ["🪮", "Comb"]],
  ], "A comb shares a feature with something that opens a lock.",
    "The gear, key and comb all have edges with teeth. The shark has literal teeth and could also join the ocean hunters. Seal, dolphin, octopus and squid complete that group without it."),
  board([
    ["Features of the head", ["👂", "Ear"], ["👃", "Nose"], ["👁️", "Eye"], ["👄", "Mouth"]],
    ["In a sewing kit", ["🪡", "Needle"], ["🧵", "Thread"], ["✂️", "Scissors"], ["🧷", "Safety pin"]],
    ["Vehicles that run on rails", ["🚋", "Tram"], ["🚇", "Metro"], ["🚝", "Monorail"], ["🚂", "Locomotive"]],
    ["Put BALL after the picture name", ["🦶", "Foot"], ["🧺", "Basket"], ["❄️", "Snow"], ["🔥", "Fire"]],
  ], "A basket and a foot can both start the name of a sport.",
    "Foot, basket, snow and fire make football, basketball, snowball and fireball. The foot looks like a fifth body part until ear, nose, eye and mouth narrow that category to features of the head."),
  board([
    ["Headwear", ["🧢", "Cap"], ["🎩", "Top hat"], ["🪖", "Helmet"], ["👒", "Sun hat"]],
    ["Things with wings", ["🦋", "Butterfly"], ["🦇", "Bat"], ["✈️", "Airplane"], ["🐝", "Bee"]],
    ["Instruments with strings", ["🎻", "Violin"], ["🎸", "Guitar"], ["🪕", "Banjo"], ["🎹", "Piano"]],
    ["Things with a crown", ["🦷", "Tooth"], ["⌚", "Watch"], ["🍍", "Pineapple"], ["🌳", "Tree"]],
  ], "Think of the leafy top of a pineapple and the small knob on the side of a watch.",
    "A tree has a crown of branches, a pineapple has a crown of leaves, and a tooth has a crown above the gum. A watch's crown is the small knob used to set the time. The piano hides its strings inside."),
  board([
    ["Weather phenomena", ["❄️", "Snow"], ["🌪️", "Tornado"], ["🌫️", "Fog"], ["⚡", "Lightning"]],
    ["Things you can read", ["📖", "Book"], ["📰", "Newspaper"], ["🗺️", "Map"], ["✉️", "Letter"]],
    ["Garments with sleeves", ["👔", "Dress shirt"], ["👘", "Kimono"], ["🥋", "Martial arts uniform"], ["👚", "Blouse"]],
    ["Put RAIN before the picture name", ["🎀", "Bow"], ["🧥", "Coat"], ["💧", "Drop"], ["⛈️", "Storm"]],
  ], "Try one weather word before the ribbon and then before the coat.",
    "Rainbow, raincoat, raindrop and rainstorm all begin alike. The storm can suggest the weather row and the coat has sleeves, but both of those groups already have four members."),
];

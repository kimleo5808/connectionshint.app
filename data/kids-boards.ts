import type { ConnectionsGroup, ConnectionsLevel } from "@/types/connections";

type Row = [category: string, words: [string, string, string, string], hint: string, explanation: string];
export type KidsBoard = {
  title: string;
  difficulty: "Starter" | "Explorer";
  groups: (ConnectionsGroup & { hint: string; explanation: string })[];
};

function board(title: string, difficulty: KidsBoard["difficulty"], rows: [Row, Row, Row, Row]): KidsBoard {
  return { title, difficulty, groups: rows.map(([group, members, hint, explanation], i) =>
    ({ group, members, hint, explanation, level: i as ConnectionsLevel })) };
}

export const kidsBoards = [
  board("Pack your bag", "Starter", [
    ["Pencil case supplies", ["PENCIL", "ERASER", "RULER", "CRAYON"], "Imagine opening a little zip case at your desk.", "You can keep all four tools in a pencil case for drawing, measuring or fixing a mark."],
    ["Sounds farm animals make", ["MOO", "OINK", "NEIGH", "BAA"], "Say the short words aloud as if you were in a barn.", "A cow moos, a pig oinks, a horse neighs and a sheep baas."],
    ["Fruit you can peel", ["BANANA", "ORANGE", "LEMON", "LIME"], "Think about what you take off the outside of some fruit.", "Each fruit has a peel around the part we usually eat."],
    ["Worn on your feet", ["BOOTS", "SANDALS", "SLIPPERS", "SOCKS"], "Look down before stepping outside.", "You put all four on your feet, even though only three are shoes."],
  ]),
  board("Out the window", "Starter", [
    ["Things in the sky at night", ["MOON", "STARS", "MARS", "VENUS"], "Where might you point a telescope after dark?", "The Moon, stars and the planets Mars and Venus can all be seen in the night sky."],
    ["Things you can sit on", ["CHAIR", "STOOL", "BENCH", "SOFA"], "Picture giving a tired visitor a place to rest.", "Each piece of furniture gives someone a seat."],
    ["Parts of your face", ["NOSE", "CHIN", "CHEEK", "LIP"], "Look in a mirror and point to each word you recognize.", "You can point to your nose, chin, cheek and lip on your face."],
    ["Ways to make music with your mouth", ["HUM", "SING", "WHISTLE", "YODEL"], "Imagine performing a tune without holding an instrument.", "You can make a tune with your mouth by humming, singing, whistling or yodeling."],
  ]),
  board("At the table", "Starter", [
    ["Things for eating a meal", ["FORK", "SPOON", "PLATE", "BOWL"], "Imagine setting a place for a guest.", "These are things you might set on a table before you serve food."],
    ["Playground equipment", ["SLIDE", "SWING", "SEESAW", "MONKEY BARS"], "Imagine visiting a park at recess.", "Each is a piece of playground equipment you can play on."],
    ["Young animals", ["KITTEN", "PUPPY", "CALF", "LAMB"], "A grown cow would stand beside one of these.", "These are the names for a young cat, dog, cow and sheep."],
    ["Basic flat shapes", ["CIRCLE", "SQUARE", "TRIANGLE", "OVAL"], "Try tracing the outline in the air with a finger.", "Each word names a flat shape you can draw around."],
  ]),
  board("Outside today", "Starter", [
    ["Kinds of falling weather", ["RAIN", "SNOW", "HAIL", "SLEET"], "Look for things that could land on your coat during a storm.", "All four can fall from a cloud as water or ice."],
    ["Things that roll on roads", ["BUS", "VAN", "TAXI", "TRUCK"], "Picture waiting at a crossing.", "Each vehicle carries people or things along a road on wheels."],
    ["Wear on your head", ["CAP", "HELMET", "CROWN", "BEANIE"], "Think about where a king might put something shiny.", "All four sit on a person's head."],
    ["Actions with a book", ["READ", "BROWSE", "SKIM", "REREAD"], "Try each verb with the words ‘a story’ after it.", "You can read, browse, skim or reread the words in a book."],
  ]),
  board("By the water", "Starter", [
    ["Sea animals", ["OCTOPUS", "CRAB", "LOBSTER", "SHRIMP"], "Picture a rock pool or a reef.", "You can find all four of these animals in the sea."],
    ["Days of the week", ["MONDAY", "FRIDAY", "SUNDAY", "TUESDAY"], "Where would you look to see when a trip begins?", "All four are names you see across the top of a weekly calendar."],
    ["Things on a bed", ["SHEET", "PILLOW", "BLANKET", "QUILT"], "Picture a cozy place to sleep.", "These are things you can arrange on your bed when you make it."],
    ["Ways to travel on foot", ["WALK", "RUN", "MARCH", "TIPTOE"], "How could you cross a room without using wheels?", "All four tell you how to move using your feet."],
  ]),
  board("Make some noise", "Starter", [
    ["Musical instruments", ["FLUTE", "DRUM", "HARP", "TUBA"], "What could a band bring onto a stage?", "Each instrument makes music when someone plays it."],
    ["Parts of a tree", ["ROOT", "TRUNK", "BRANCH", "LEAF"], "Imagine drawing a tree from underground to its very top.", "All four names belong to parts of a tree."],
    ["Foods made from milk", ["CHEESE", "YOGURT", "BUTTER", "ICE CREAM"], "Think about what a dairy farm supplies.", "The dairy versions of these foods all start with milk or cream."],
    ["Words for colors", ["RED", "BLUE", "PINK", "GREEN"], "Imagine choosing paints to fill a rainbow.", "Each word names a color you could choose from a paint box."],
  ]),
  board("After dark", "Explorer", [
    ["Animals often active at night", ["BAT", "OWL", "MOTH", "RACCOON"], "Picture watching for living things after the sun goes down.", "Many bats, owls, moths and raccoons come out at night to find food."],
    ["Marked places on a baseball field", ["BASE", "MOUND", "PLATE", "FOUL LINE"], "What stays on the field when the players leave?", "A base, the pitcher's mound, home plate and a foul line all mark places on the field."],
    ["Ways to move or rest in water", ["FLOAT", "DIVE", "SWIM", "WADE"], "Imagine a pool where you can stand up in the shallow end.", "You can float on water, dive into it, swim through it or wade in it."],
    ["Put RAIN before these words", ["DROP", "BOW", "COAT", "FALL"], "See whether a word for wet weather can start four longer words.", "Raindrop, rainbow, raincoat and rainfall each start with rain."],
  ]),
  board("Look up close", "Explorer", [
    ["Parts of a bird", ["BEAK", "WING", "TALON", "FEATHER"], "What would you label on a drawing of an eagle?", "Each is a part of a bird, from its beak to the talons on its feet."],
    ["Parts of a story", ["PLOT", "SETTING", "CHARACTER", "ENDING"], "Think about what an author plans before writing.", "A storyteller chooses who appears, where it happens, what happens and how it ends."],
    ["Words before BRUSH", ["TOOTH", "HAIR", "NAIL", "PAINT"], "What small tool might you find in a bathroom or an art room?", "A toothbrush, hairbrush, nailbrush and paintbrush are four different brushes."],
    ["Things you can fasten", ["ZIPPER", "BUTTON", "BUCKLE", "SNAP"], "How does a jacket, bag or belt stay shut?", "You can fasten a zipper, a button, a buckle or a snap."],
  ]),
  board("A chilly day", "Explorer", [
    ["Put SNOW before these words", ["FLAKE", "CONE", "MAN", "BALL"], "Try putting the same wintry word in front of four tiles.", "Snowflake, snow cone, snowman and snowball all begin with snow."],
    ["Things with laces", ["SNEAKERS", "SKATES", "CLEATS", "HIKING BOOTS"], "Imagine tying a bow before heading outside.", "These kinds of footwear often have laces you can tie."],
    ["Parts of a bicycle", ["PEDAL", "CHAIN", "SADDLE", "SPOKE"], "What could you point to on a bike parked by the door?", "Each is an attached part of a bicycle."],
    ["Ways to shape dough", ["ROLL", "KNEAD", "STRETCH", "TWIST"], "Imagine making bread with your hands.", "You can change the shape of soft dough with each of these actions."],
  ]),
  board("At the harbor", "Explorer", [
    ["Parts of a sailboat", ["SAIL", "MAST", "HULL", "RUDDER"], "Imagine labeling a boat from the top down to the water.", "The sail catches wind, the mast holds it up, the hull floats and the rudder steers."],
    ["Words from a shopping trip", ["SALE", "PRICE", "COUPON", "RECEIPT"], "Picture getting an item for less than its usual price.", "A sale and a coupon can lower a price, and the receipt records the purchase."],
    ["Insects", ["BEETLE", "ANT", "BEE", "MOTH"], "Which living things grow up to have six legs?", "Each is an insect with six legs as an adult."],
    ["Words meaning small", ["TINY", "LITTLE", "MINI", "SMALL"], "Think about how you might describe a toy that fits in your palm.", "Each word can describe something small in size."],
  ]),
  board("Follow the trail", "Explorer", [
    ["Things that have a tongue", ["SHOE", "BELL", "FROG", "PERSON"], "One part of a lace-up shoe has the same name as something in your mouth.", "A frog and a person have tongues, a shoe has a flap called a tongue, and a bell's clapper is also called its tongue."],
    ["Animal tracks you might find", ["HOOFPRINT", "PAWPRINT", "CLAW MARK", "TAIL DRAG"], "Imagine examining marks in mud after an animal passes.", "An animal can leave each of these marks as it moves."],
    ["Put STAR before these words", ["FISH", "LIGHT", "DUST", "GAZE"], "Think of something shining far away in the night sky.", "Starfish, starlight, stardust and stargaze all begin with star."],
    ["Tools that make things look bigger", ["TELESCOPE", "MICROSCOPE", "MAGNIFIER", "BINOCULARS"], "What could make a tiny bug or a faraway bird look bigger?", "Each tool can make an object look bigger so you can see more detail."],
  ]),
  board("The last page", "Explorer", [
    ["Parts of a book", ["SPINE", "COVER", "PAGE", "INDEX"], "Imagine running a finger along a book on a shelf.", "A book can have a spine, a cover, pages and an index to help you find subjects."],
    ["Words before BOX", ["LUNCH", "TOOL", "MAIL", "SHOE"], "Try naming a container for something you take to school.", "Lunchbox, toolbox, mailbox and shoebox are names for containers."],
    ["Ways to join paper", ["STAPLE", "GLUE", "TAPE", "CLIP"], "How could you keep two loose sheets together?", "You can staple, glue, tape or clip two pieces of paper together."],
    ["Things with a face", ["CLOCK", "WATCH", "COIN", "DIE"], "Consider the side of a number cube with three dots.", "A clock or watch has a face for reading time, and a coin or die has faces on its sides."],
  ]),
];

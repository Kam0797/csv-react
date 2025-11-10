import { Category } from "../category";

const enterArr = [
  "movie",
  "park",
  "netflix",
  "prime",
  "video",
  "theatre",
  "stadium",
  "wonderlaa",
  "game",
  "ps4",
  "ps5",
  "gta",
  "minecraft",
];

const enterSupportArr = ["ticket", "tickets", "amazon", "black", "thunder"];

const entertainmentCat = new Category("entertainment", enterArr, 7);
const entertainment2Cat = new Category("entertainment", enterSupportArr, 5);

export { entertainmentCat, entertainment2Cat };

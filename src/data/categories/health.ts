import { Category } from "../category";

const healthArr = [
  "gym",
  "hospital",
  "doctor",
  "supplements",
  "supplement",
  "protien",
  "medicine",
];

const healthSupp = ["member", "membership", "fee"];

const healthCat = new Category("health", healthArr, 7);
const health2Cat = new Category("health", healthSupp, 5);

export { healthCat, health2Cat };

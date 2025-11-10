import { Category } from "../category";

const recArr = [
  "rent",
  "insurance",
  "premium",
  "subscription",
  "netflix",
  "spotify",
  "youtube",
  "recurring",
  "bank",
  "charges",
];

const recurringCat = new Category("recurring", recArr, 7);

export { recurringCat };

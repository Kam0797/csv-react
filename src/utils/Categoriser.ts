import type { Category } from "../data/category";


class Categoriser {

  private categories: Array<Category>

  constructor(categories:Array<Category>) {
    this.categories = categories
  }

  categorise(description:string) {
    const words = description.split(/\s+/).map(word => word.trim())

    const cats = new Map()
    for(const cat of this.categories) {
      const result = cat.guess(words)
      if(result.weight) {
        if(!cats.has(result.category)) cats.set(result.category,0)

        cats.set(result.category, cats.get(result.category)+result.weight)
      }
    }

    let likelyCats = []
    let maxWeight = - Infinity

    for(const [cat,weit] of cats) {
      if(weit > maxWeight) {
        maxWeight = weit 
        likelyCats = [cat]
      }
      else if (weit === maxWeight) {
        likelyCats.push(cat)
      }
    }
    console.info("desc: ", description,"allCats: ", likelyCats)

    return {
      category: likelyCats[0] ?? "others", // blindly selecting the first cat
      weight: maxWeight
    }
  }
}

export { Categoriser}
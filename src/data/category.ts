// IMPORTANT: Weights start at 7, secondary arr is given 5.


class Category {
  private name: string
  private keywords: Set<string>
  private weight: number

  constructor(name: string, keywords: Array<string>, weight: number) {
    this.name = name
    this.weight = weight
    this.keywords = new Set(keywords)
  }

  public guess(description: Array<string>, verbose:boolean = false) {
    const verboseStats = new Map()
    let totalWeight = 0
    description.forEach(word => {
      if(this.keywords.has(word)) {
        if(verbose) verboseStats.set(word, this.weight)
        totalWeight += this.weight
        
      }
    })
    return {
      category: this.name,
      weight: totalWeight,
      stats: verbose ? verboseStats : null
    }
  }
}

export {Category}
import { entertainment2Cat, entertainmentCat } from "../data/categories/entertainment";
import { foodCat } from "../data/categories/food";
import { health2Cat, healthCat } from "../data/categories/health";
import { recurringCat } from "../data/categories/recurring";
import { travelCat } from "../data/categories/travel";
import { utilitiesCat } from "../data/categories/utilities";
import { Categoriser } from "./Categoriser";
import type { ParamIndices } from "./FileParser";

class FinReport {
  private transactions: Array<Array<string>>;
  private params: ParamIndices;

  constructor(transactions: Array<Array<string>>, params: ParamIndices) {
    this.transactions = transactions;
    this.params = params;
  }

  calcIncomeAndExpense() { //fix ret type
    // console.log("TS", this.transactions, this.params);

    let income = 0;
    let expense = 0;

    for (const tran of this.transactions) {
      if (tran[this.params.typeIndex] == "credit") {
        income += Number(tran[this.params.amountIndex]);
      } else if (tran[this.params.typeIndex] == "debit") {
        expense += Number(tran[this.params.amountIndex]);
      }
      // console.log("LIVE type,amt::",tran[this.params.typeIndex],Number(tran[this.params.amountIndex]))
    }
    console.log("IE11", income, expense);
    return {income: income, expense: expense, saving: income-expense}
  }

  classifyExpenses(verbose:boolean = false) {

    const expenseCats = [ entertainmentCat, entertainment2Cat, foodCat, healthCat, health2Cat, travelCat, utilitiesCat]
    const recurringCats = [recurringCat]


    const expenseCategoriser = new Categoriser(expenseCats)
    const recurringCategoriser = new Categoriser(recurringCats)

    const classifiedExp = new Map()
    const recurringExp = []
    const stats = []
    
    const {descIndex, amountIndex, dateIndex, typeIndex} = this.params
     
    for(const tran of this.transactions){  // think about making a tran obj
      if(tran[typeIndex] == "credit") continue // skipping incomes
      const classTran = expenseCategoriser.categorise(tran[descIndex])
      const recTran = recurringCategoriser.categorise(tran[descIndex])

      classifiedExp.set(classTran.category,(classifiedExp.get(classTran.category) ?? 0) + Number(tran[amountIndex]))
      if(recTran.category == "recurring") recurringExp.push([tran[descIndex], tran[amountIndex]])
      if(verbose) {
        stats.push([tran[dateIndex], tran[descIndex], tran[amountIndex], classTran.category, recTran.category||null])
      }
    }

    const sortedExp = Array.from(classifiedExp).sort((a,b) => b[1]-a[1])
    // console.log("sorted: ",sortedExp.slice(0, sortedExp.length > 5 ? 5 : sortedExp.length))
    // console.log("rec: ", recurringExp)
    if(verbose) {
      console.info("Logs: ", stats)
    }

    return {
      success: true,
      data: {expenseCats: sortedExp, recuringExps: recurringExp},
      stats: verbose ? stats : null
    }

  }

  

  getReport() {}
}

export { FinReport };

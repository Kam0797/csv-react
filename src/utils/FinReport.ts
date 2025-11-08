import type { ParamIndices } from "./FileParser";

class FinReport {
  private transactions: Array<Array<string>>;
  private params: ParamIndices;

  constructor(transactions: Array<Array<string>>, params: ParamIndices) {
    this.transactions = transactions;
    this.params = params;
  }

  calcIncomeAndExpense(): object { //fix ret type
    console.log("TS", this.transactions, this.params);

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

  

  getReport() {}
}

export { FinReport };

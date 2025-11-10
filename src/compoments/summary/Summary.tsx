import { useEffect } from "react";
import "./Summary.css";
import { IconArrowLeftDashed } from "@tabler/icons-react";

// @ts-expect-error TODO create response obj, type aliases
export default function Summary({ report, setReport }) {
  useEffect(() => {
    console.log("WTF", report?.recurrentExps, report);
  }, [report]);

  return (
    <>
      <div
        className="summary-wrapper"
        style={{ transform: report ? "translateY(0)" : "" }}
      >
        <h1 className="summary-header">Your Finances</h1>
        <div className="summary-short">
          <div className="summary-header-2">Incomes - Expenses</div>
          <div className="normal">
            Income : <span>{report?.income}</span>
          </div>
          <div className="normal">
            Expenses : <span>{report?.expense}</span>
          </div>
          <div className="normal">
            Savings : <span>{report?.saving}</span>
          </div>
        </div>
        <div className="summary-cats">
          <div className="summary-header-2">Expense Categories</div>
          {report?.expenseCats.map(([cat, value]:[string, number]) => {
            const newCat = cat.slice(0, 1).toUpperCase() + cat.slice(1);
            return (
              <div className="normal">
                {newCat}:<span>{value}</span>
              </div>
            );
          })}
          <div className="cats-chart">
            {
              report?.expenseCats.map(([, value]:[string, number],index:number)=> {
                return <div key={index} className="chart-item" style={{width: `${report.expense * value / 100}%`}} />
              })
            }
          </div>
        </div>
        <div className="summary-recur">
          <span className="summary-header-2">Recurring Expenses</span>
          {report?.recurrentExps.map(([exp, value]:[string, number]) => {
            const newExp = exp.slice(0, 1).toUpperCase() + exp.slice(1);
            return (
              <div className="normal">
                {newExp}:{`\t`}
                <span>{value}</span>
              </div>
            );
          })}
        </div>
        <button className="back-button" onClick={() => setReport(null)}>
          <IconArrowLeftDashed />
          Back
        </button>
      </div>
    </>
  );
}

{
  /* <div className='summary-wrapper' style={{transform: report ? "translateY(-100%)": ''}}> */
}

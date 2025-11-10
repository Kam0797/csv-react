
import './FileGetter.css'
import { InputFile } from '../../utils/FileParser'
import { FinReport } from '../../utils/FinReport'

export default function FileGetter({setReport}:any) {

  // const [file, setFile] = useState<File | null>(null)

  async function handleFile(e:React.ChangeEvent<HTMLInputElement>):Promise<void> {
    const inputFile = e.target.files?.[0] || null
    if(!inputFile) return

    const csvFile = new InputFile(inputFile) // name csvFile better
    const csvData = await csvFile.parseCSV(3)
    let transactions = csvData.data //  see if you can make this const. see *1
    if(!csvData.success) {
      return
    }
    console.log(csvData.message)
    console.log(csvData.data)
    const params = csvFile.getParamIndices(transactions)
    if(!params.success) {
      return
    }
    if(transactions[0].includes("date") && transactions[0].includes("amount")) {
      transactions = transactions.slice(1,) // *1
    }

    const report = new FinReport(transactions, params)

    const IncExpReport = report.calcIncomeAndExpense()
    const catsReport = report.classifyExpenses()  

    // create a type alias
    const finalReport = {
      income: IncExpReport.income,
      expense: IncExpReport.expense,
      saving: IncExpReport.saving,

      expenseCats : catsReport.data.expenseCats,
      recurrentExps : catsReport.data.recuringExps
    }

    setReport(finalReport)

  }

  return(
    <>
      <div className='file-upload-wrapper'>
        <label htmlFor="upload-file" className='upload-file-ui'>
          <span className='upload-file'>
            Select file
          </span>
          <span className='upload-desc'>*supports .csv format</span>
        </label>
        <input type='file' accept='.csv,text/csv' id='upload-file' onChange={(e)=> handleFile(e)} />
      </div>
    </>
  )
}
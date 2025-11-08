
import { useEffect, useState } from 'react'
import './FileGetter.css'
import { InputFile } from '../../utils/FileParser'
import { FinReport } from '../../utils/FinReport'

export default function FileGetter() {

  // const [file, setFile] = useState<File | null>(null)

  async function handleFile(e:React.ChangeEvent<HTMLInputElement>):Promise<void> {
    const inputFile = e.target.files?.[0] || null
    if(!inputFile) return
    // setFile(inputFile)

    const csvFile = new InputFile(inputFile) // name csvFile better
    const csvData = await csvFile.parseCSV(3)
    const transactions = csvData.data
    if(!csvData.success) {
      return
    }
    console.log(csvData.message)
    console.log(csvData.data)
    const params = csvFile.getParamIndices(transactions)
    if(!params.success) {
      return
    }

    const report = new FinReport(transactions, params)

    



  }

  return(
    <>
      <div className='file-getter-wrapper'>
        Upload file
        <input type='file' accept='.csv,text/csv' className='file-upload' onChange={(e)=> handleFile(e)} />
      </div>
    </>
  )
}
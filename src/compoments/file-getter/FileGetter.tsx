
import { useEffect, useState } from 'react'
import './FileGetter.css'
import { InputFile } from '../../utils/FileChecker'

export default function FileGetter() {

  // const [file, setFile] = useState<File | null>(null)

  async function handleFile(e:React.ChangeEvent<HTMLInputElement>):Promise<void> {
    const inputFile = e.target.files?.[0] || null
    if(!inputFile) return
    // setFile(inputFile)

    const csvFile = new InputFile(inputFile) // name csvFile better
    const csvData = await csvFile.parseCSV(3)
    if(!csvData.success) {
      console.error(csvData.message)
    }
    else{
      console.log(csvData.message)
      console.log(csvData.data)
      await csvFile.detectParamIndices(csvData.data)
    }
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
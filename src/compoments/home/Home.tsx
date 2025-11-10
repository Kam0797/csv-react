import { IconArrowNarrowRightDashed, IconBuildingBank, IconFileAnalytics } from '@tabler/icons-react'
import FileGetter from '../file-getter/FileGetter'
import './Home.css'
import { useState } from 'react'
import Summary from '../summary/Summary'

export default function Home() {

  const [report, setReport] = useState(null)

  return(
    <>
      <div className='home-wrapper'>
        <div className='navbar'>
          <div className='navbar-left'>
          <span className='app-name'>Expenses Analyzr</span>
          </div>
          <div className='navbar-right'>
            <span className='backend-toggle'>
              TOG
            </span>
          </div>
        </div>
        <div className='home'>
          <div className='home-mascots'>
            <IconBuildingBank size={65} />
            <IconArrowNarrowRightDashed size={45} />
            <IconFileAnalytics size={65} />
          </div>
          <span className='home-description'>
            Drop your records, Get a clear Summary!
          </span>
          <div className='file-input-area'>
            <FileGetter setReport={setReport}/>
          </div>
        </div>
        <Summary report={report} setReport={setReport}/>
      </div>
    </>
  )
}
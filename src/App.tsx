import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileGetter from './compoments/file-getter/FileGetter'
import Home from './compoments/home/Home'

function App() {
  const [count, setCount] = useState()

  return (
    <>
      <Home />
    </>
  )
}

export default App

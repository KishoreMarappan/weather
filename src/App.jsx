import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Weather from './Weather'
import Lee1 from './Lee1.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Lee1/> */}
    
      <Weather/>
    </>
  )
}

export default App

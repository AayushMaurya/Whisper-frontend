import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Recorder from './REcorder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Recorder />
    </div>
  )
}

export default App

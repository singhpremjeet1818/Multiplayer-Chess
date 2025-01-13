import { BrowserRouter,Routes,Route } from 'react-router-dom'

import './App.css'
import Landing from './Components/Landing'
import Game from './Components/Game'


function App() {
 

  return (
    <>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/> 
        <Route path="/game" element={<Game/>}/> 
      </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App

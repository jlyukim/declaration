import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Card, cards } from './Components/Card'
import CardHand from './Components/CardHand'

import './Components/Card.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  console.log("Click")
  const [deckType, changeDeck] = useState("RegularCards")

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => changeDeck((deck) => deck=="RegularCards" ? "HighContrastPlayingCards" : "RegularCards")}>
          Toggle Deck
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div>
        <CardHand
          Cards={[
            { ...cards.defaultCard},
            { ...cards.defaultCard}
          ]}
          deckType={deckType}
          faceUp={true}
        />
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

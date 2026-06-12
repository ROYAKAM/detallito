import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-
  dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Para mi amor hermoso</h1>
      <h2>Te amo muuchisisisimo</h2>
      <switch>
        <route exact path="/" component{home} />
      </switch>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Contador de te amo {count}
        </button>
        <p>
          Con mucho amor para ti fecha de inicio:         
        </p>
      </div>
      <p className="home-descripcion">
         Proyecto iniciado el:<br></br> <strong> Martes 09 de Junio de 2026 09:50pm <br></br>(Desde tu cama)</strong>
      </p>
    </>
  )
}

export default App

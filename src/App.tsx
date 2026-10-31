import { useState } from 'react'
import packageJson from '../package.json'
import PdokMap from './components/PdokMap'
import FloodControls from './components/FloodControls'
import type { FloodStatus } from './components/FloodLayer'

export default function App() {
  const [floodEnabled, setFloodEnabled] = useState(false)
  const [floodLevel, setFloodLevel] = useState(2)
  const [floodStatus, setFloodStatus] = useState<FloodStatus>('idle')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Doorbraakkaart</h1>
        <span className="subtitle">
          Hoogtekaart van Nederland — klik op de kaart om de hoogte te zien, of simuleer een
          dijkdoorbraak
        </span>
      </header>
      <main className="app-main">
        <PdokMap
          floodEnabled={floodEnabled}
          floodLevel={floodLevel}
          onFloodStatusChange={setFloodStatus}
        />
        <FloodControls
          enabled={floodEnabled}
          level={floodLevel}
          status={floodStatus}
          onEnabledChange={setFloodEnabled}
          onLevelChange={setFloodLevel}
        />
      </main>
      <footer className="app-footer">
        Gemaakt door{' '}
        <a href="https://www.peterrombouts.nl/" target="_blank" rel="noopener noreferrer">
          Peter Rombouts
        </a>{' '}
        · Versie {packageJson.version}
      </footer>
    </div>
  )
}

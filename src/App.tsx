import { useEffect, useState } from 'react'
import packageJson from '../package.json'
import PdokMap from './components/PdokMap'
import FloodControls from './components/FloodControls'
import type { FloodStatus } from './components/FloodLayer'
import { translations, type Language } from './translations'

export default function App() {
  const [language, setLanguage] = useState<Language>('nl')
  const [floodEnabled, setFloodEnabled] = useState(false)
  const [floodLevel, setFloodLevel] = useState(2)
  const [floodStatus, setFloodStatus] = useState<FloodStatus>('idle')
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.title
  }, [language, t.title])

  return (
    <div className="app" lang={language}>
      <header className="app-header">
        <div className="app-header-content">
          <h1>{t.title}</h1>
          <span className="subtitle">{t.subtitle}</span>
        </div>
        <div className="language-switch" role="group" aria-label={t.languageSwitcher}>
          <button
            type="button"
            className={`language-button${language === 'nl' ? ' is-active' : ''}`}
            aria-label={t.dutchLanguage}
            aria-pressed={language === 'nl'}
            onClick={() => setLanguage('nl')}
          >
            <span aria-hidden="true">🇳🇱</span>
            <span>NL</span>
          </button>
          <button
            type="button"
            className={`language-button${language === 'en' ? ' is-active' : ''}`}
            aria-label={t.englishLanguage}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            <span aria-hidden="true">🇬🇧</span>
            <span>EN</span>
          </button>
        </div>
      </header>
      <main className="app-main">
        <PdokMap
          language={language}
          floodEnabled={floodEnabled}
          floodLevel={floodLevel}
          onFloodStatusChange={setFloodStatus}
        />
        <FloodControls
          language={language}
          enabled={floodEnabled}
          level={floodLevel}
          status={floodStatus}
          onEnabledChange={setFloodEnabled}
          onLevelChange={setFloodLevel}
        />
      </main>
      <footer className="app-footer">
        {t.madeBy}{' '}
        <a href="https://www.peterrombouts.nl/" target="_blank" rel="noopener noreferrer">
          Peter Rombouts
        </a>{' '}
        · Versie {packageJson.version}
      </footer>
    </div>
  )
}

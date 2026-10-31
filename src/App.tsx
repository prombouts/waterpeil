import { useEffect, useState } from 'react'
import packageJson from '../package.json'
import PdokMap from './components/PdokMap'
import FloodControls from './components/FloodControls'
import type { FloodStatus } from './components/FloodLayer'
import { translations, type Language } from './translations'

function LanguageFlag({ language }: { language: Language }) {
  if (language === 'nl') {
    return (
      <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true">
        <rect width="30" height="20" fill="#21468b" />
        <rect width="30" height="6.67" fill="#ae1c28" />
        <rect y="6.67" width="30" height="6.66" fill="#fff" />
      </svg>
    )
  }

  return (
    <svg className="language-flag" viewBox="0 0 60 30" aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  )
}

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
            title={t.dutchLanguage}
            aria-pressed={language === 'nl'}
            onClick={() => setLanguage('nl')}
          >
            <LanguageFlag language="nl" />
          </button>
          <button
            type="button"
            className={`language-button${language === 'en' ? ' is-active' : ''}`}
            aria-label={t.englishLanguage}
            title={t.englishLanguage}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            <LanguageFlag language="en" />
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
        <a href="https://www.peterrombouts.nl/" target="_blank" rel="noopener noreferrer">
          Peter Rombouts
        </a>{' '}
        · {t.version} {packageJson.version}
      </footer>
    </div>
  )
}

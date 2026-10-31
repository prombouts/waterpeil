import type { FloodStatus } from './FloodLayer'
import { translations, type Language } from '../translations'

interface FloodControlsProps {
  language: Language
  enabled: boolean
  level: number
  status: FloodStatus
  onEnabledChange: (enabled: boolean) => void
  onLevelChange: (level: number) => void
}

const MIN_LEVEL = -2
const MAX_LEVEL = 10
const STEP = 0.5

export default function FloodControls({
  language,
  enabled,
  level,
  status,
  onEnabledChange,
  onLevelChange,
}: FloodControlsProps) {
  const t = translations[language]

  return (
    <div className="flood-panel">
      <label className="flood-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
        <strong>{t.floodSimulation}</strong>
      </label>
      {enabled && (
        <>
          <label className="flood-level">
            {t.waterLevel}{' '}
            <strong>
              {level >= 0 ? '+' : ''}
              {level.toFixed(1)} m NAP
            </strong>
            <input
              type="range"
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              step={STEP}
              value={level}
              onChange={(e) => onLevelChange(Number(e.target.value))}
            />
          </label>
          <div className="flood-status">
            {status === 'loading' && t.loadingElevation}
            {status === 'error' && t.elevationError}
            {status === 'idle' && (
              <span className="flood-hint">{t.floodHint}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

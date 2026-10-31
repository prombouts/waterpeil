import type { FloodStatus } from './FloodLayer'

interface FloodControlsProps {
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
  enabled,
  level,
  status,
  onEnabledChange,
  onLevelChange,
}: FloodControlsProps) {
  return (
    <div className="flood-panel">
      <label className="flood-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
        <strong>Dijkdoorbraak-simulatie</strong>
      </label>
      {enabled && (
        <>
          <label className="flood-level">
            Waterpeil: <strong>{level >= 0 ? '+' : ''}{level.toFixed(1)} m NAP</strong>
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
            {status === 'loading' && 'Hoogtedata laden…'}
            {status === 'error' && 'Laden van hoogtedata mislukt.'}
            {status === 'zoom-out' && 'Zoom verder in om de simulatie te zien.'}
            {status === 'idle' && (
              <span className="flood-hint">
                Blauw = land onder het gekozen waterpeil (vereenvoudigd
                &ldquo;badkuip&rdquo;-model op basis van AHN-maaiveldhoogte).
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

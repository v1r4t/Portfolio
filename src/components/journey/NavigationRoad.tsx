import React from 'react'
import { NAV_STOPS } from '../../data/portfolio'
import { hornAudio } from '../../utils/audio'

interface NavigationRoadProps {
  currentStopIndex: number
  scrollProgress: number
  isDriving: boolean
  isRoadReady: boolean
  onSelectStop: (index: number) => void
}

export const NavigationRoad: React.FC<NavigationRoadProps> = ({
  currentStopIndex,
  scrollProgress,
  isDriving,
  isRoadReady,
  onSelectStop,
}) => {
  const handleTruckClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    hornAudio.playHorn('melody')
  }

  const wheelAngle = Math.round(scrollProgress * 2880)

  return (
    <>
      <nav
        className={`road ${isRoadReady ? 'is-road' : ''}`}
        role="navigation"
        aria-label="Sections"
        aria-hidden={!isRoadReady}
        style={{ opacity: isRoadReady ? 1 : 0, pointerEvents: isRoadReady ? 'auto' : 'none' }}
      >
        {NAV_STOPS.map((stop, index) => {
          const isActive = index === currentStopIndex
          return (
            <a
              key={stop.id}
              href={`#${stop.id}`}
              tabIndex={isRoadReady ? 0 : -1}
              onClick={(e) => {
                e.preventDefault()
                onSelectStop(index)
              }}
              className={`stop ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {stop.label}
            </a>
          )
        })}
      </nav>

      <div
        className={`truck ${isRoadReady ? 'is-in' : ''} ${isDriving ? 'is-driving' : ''}`}
        style={
          {
            '--p': scrollProgress.toFixed(4),
            '--wheel': `${wheelAngle}deg`,
            cursor: 'pointer',
            pointerEvents: isRoadReady ? 'auto' : 'none',
          } as React.CSSProperties
        }
        onClick={handleTruckClick}
        title="Click lorry to sound horn!"
        aria-hidden="true"
      >
        <div className="truck-arrival">
          <svg className="truck-svg" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <g className="truck-bounce">
              <rect x="26" y="10" width="42" height="12" rx="4" className="truck-accent" />
              <rect x="72" y="13" width="32" height="9" rx="3" className="truck-teal" />
              <rect x="12" y="20" width="112" height="56" rx="4" className="truck-body" />
              <rect x="12" y="20" width="112" height="6" className="truck-accent" />
              <rect x="12" y="70" width="112" height="6" className="truck-accent" />
              <rect x="20" y="30" width="40" height="34" rx="2" className="truck-teal" />
              <text x="40" y="57" textAnchor="middle" className="truck-flower">
                ✿
              </text>
              <text x="68" y="39" className="truck-text">
                HORN OK
              </text>
              <text x="68" y="48" className="truck-text">
                PLEASE
              </text>
              <path d="M70 55 L72 68 L84 68 L82 55 Z" fill="var(--t-blue)" stroke="var(--t-ink)" strokeWidth="1.5" />
              <path d="M90 60 Q100 48 108 60 Q100 64 90 60Z" fill="var(--t-red)" stroke="var(--t-ink)" strokeWidth="1.5" />
              <rect x="8" y="74" width="184" height="8" rx="2" className="truck-ink" />
              <path d="M124 34 L160 34 Q176 34 180 48 L184 74 L124 74 Z" className="truck-cab" />
              <path d="M132 41 L157 41 L160 55 L132 55 Z" className="truck-window" />
              <circle cx="139" cy="50" r="4" fill="var(--t-ink)" />
              <path d="M133 61 Q139 55 146 61" fill="none" stroke="var(--t-ink)" strokeWidth="2" />
              <path d="M158 60 L180 60 L181 66 L158 66 Z" fill="var(--t-red)" stroke="var(--t-ink)" strokeWidth="1.5" />
              <circle cx="178" cy="51" r="3" fill="var(--t-yellow)" stroke="var(--t-ink)" strokeWidth="1.5" />
              <rect x="164" y="73" width="26" height="7" rx="2" className="truck-accent" />
              <rect x="6" y="38" width="5" height="34" fill="var(--t-ink)" />
              <g className="puffs">
                <circle className="puff" cx="4" cy="34" r="4" />
                <circle className="puff" cx="2" cy="22" r="3" />
                <circle className="puff" cx="6" cy="12" r="2" />
              </g>
            </g>
            <g transform="translate(40 88)">
              <g className="wheel">
                <circle r="12" fill="var(--t-ink)" />
                <circle r="7" fill="var(--t-paper)" stroke="var(--t-ink)" strokeWidth="1.5" />
                <circle r="2.5" fill="var(--t-ink)" />
                <path d="M-7 0H7M0 -7V7" stroke="var(--t-ink)" strokeWidth="1.5" />
              </g>
            </g>
            <g transform="translate(158 88)">
              <g className="wheel">
                <circle r="12" fill="var(--t-ink)" />
                <circle r="7" fill="var(--t-paper)" stroke="var(--t-ink)" strokeWidth="1.5" />
                <circle r="2.5" fill="var(--t-ink)" />
                <path d="M-7 0H7M0 -7V7" stroke="var(--t-ink)" strokeWidth="1.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}

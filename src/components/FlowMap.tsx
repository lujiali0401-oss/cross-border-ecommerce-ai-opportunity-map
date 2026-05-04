import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'

export default function FlowMap() {
  const navigate = useNavigate()
  const { progress } = useAppContext()

  // Group into rows of 5, 4, 4
  const rows = [stages.slice(0, 5), stages.slice(5, 9), stages.slice(9, 13)]

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max space-y-3 p-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-0">
            {/* Row direction arrow for odd rows (RTL visual) */}
            {rowIdx > 0 && (
              <div
                className="flex items-center mr-2 ml-1"
                style={{ marginTop: 0 }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
                >
                  {rowIdx === 1 ? '↓' : '↓'}
                </div>
              </div>
            )}

            {row.map((stage, idx) => {
              const isVisited = progress.visitedStages.includes(stage.id)
              const isCompleted = progress.completedStages.includes(stage.id)
              const isLast = idx === row.length - 1

              return (
                <div key={stage.id} className="flex items-center">
                  <button
                    onClick={() => navigate(`/stage/${stage.id}`)}
                    className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 w-[96px]"
                    style={{
                      background: isCompleted
                        ? `${stage.color}12`
                        : isVisited
                        ? 'var(--surface-2)'
                        : 'transparent',
                      border: `1.5px solid ${isCompleted ? stage.color + '50' : isVisited ? 'var(--border-2)' : 'transparent'}`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 group-hover:scale-110"
                      style={{
                        background: isCompleted
                          ? `${stage.color}20`
                          : isVisited
                          ? `${stage.color}12`
                          : 'var(--surface-2)',
                        border: `2px solid ${isCompleted ? stage.color + '80' : isVisited ? stage.color + '40' : 'var(--border)'}`,
                        boxShadow: isCompleted ? `0 4px 14px ${stage.color}25` : undefined,
                      }}
                    >
                      {stage.icon}
                      {isCompleted && (
                        <div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: '#22C55E', border: '2px solid white' }}
                        >
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <p
                        className="text-[10px] font-mono mb-0.5"
                        style={{ color: 'var(--text-4)' }}
                      >
                        {String(stage.order).padStart(2, '0')}
                      </p>
                      <p
                        className="text-[11.5px] font-medium leading-tight transition-colors group-hover:text-cyan-700"
                        style={{ color: isVisited ? 'var(--text-1)' : 'var(--text-3)' }}
                      >
                        {stage.name}
                      </p>
                    </div>
                  </button>

                  {/* Connector arrow */}
                  {!isLast && (
                    <div className="flex items-center mt-[-20px] px-0.5">
                      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                        <line x1="0" y1="5" x2="22" y2="5" stroke="var(--border-2)" strokeWidth="1.5" strokeDasharray="3 2"/>
                        <path d="M20 2L24 5L20 8" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-5 mt-4 px-2 pt-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {[
          { icon: '⭕', label: '未访问', style: { border: '1.5px solid var(--border-2)', background: 'var(--surface-2)' } },
          { icon: '🔵', label: '已访问', style: { border: '1.5px solid #0E749080', background: '#ECFEFF' } },
          { icon: '✅', label: '已完成', style: { border: '1.5px solid #14B8A680', background: '#CCFBF1' } },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={item.style as CSSProperties} />
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{item.label}</span>
          </div>
        ))}
        <span className="text-[11px] ml-auto" style={{ color: 'var(--text-4)' }}>
          点击节点查看详情
        </span>
      </div>
    </div>
  )
}

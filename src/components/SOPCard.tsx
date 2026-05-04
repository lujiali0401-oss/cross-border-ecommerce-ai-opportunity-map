import { useState } from 'react'
import type { SOP } from '../types'
import { useAppContext } from '../App'

interface Props {
  sop: SOP
  stageId: string
  stageName?: string
  stageColor: string
}

export default function SOPCard({ sop, stageId, stageName, stageColor }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { toggleBookmark, isBookmarked } = useAppContext()
  const bookmarked = isBookmarked(sop.id)

  return (
    <div className="card overflow-hidden animate-slide-up transition-all">
      {/* Accent line */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${stageColor}, ${stageColor}30)` }} />

      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: `${stageColor}15`, color: stageColor, border: `1.5px solid ${stageColor}30` }}
            >
              {sop.steps?.length ?? 0}步
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>{sop.name}</h3>
              {sop.description && (
                <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-3)' }}>{sop.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toggleBookmark({ id: sop.id, stageId, stageName: stageName ?? '', type: 'sop', title: sop.name, description: sop.description ?? '' })}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: bookmarked ? '#F59E0B' : 'var(--text-4)', background: bookmarked ? '#FEF3C7' : 'transparent' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
            {sop.steps && sop.steps.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: expanded ? `${stageColor}15` : 'var(--surface-2)',
                  color: expanded ? stageColor : 'var(--text-3)',
                  border: `1px solid ${expanded ? stageColor + '30' : 'var(--border)'}`,
                }}
              >
                {expanded ? '收起' : `${sop.steps.length} 步骤`}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* IO tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {sop.inputs && sop.inputs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>输入</span>
              {sop.inputs.map((inp, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD' }}>
                  {inp}
                </span>
              ))}
            </div>
          )}
          {sop.outputs && sop.outputs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>输出</span>
              {sop.outputs.map((out, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' }}>
                  {out}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded steps */}
      {expanded && sop.steps && sop.steps.length > 0 && (
        <div className="border-t px-5 pb-5 pt-4 space-y-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-4)' }}>执行步骤</p>
          {sop.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                style={{ background: `${stageColor}20`, color: stageColor, border: `1px solid ${stageColor}40` }}
              >
                {i + 1}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {typeof step === 'string' ? step : step.action}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

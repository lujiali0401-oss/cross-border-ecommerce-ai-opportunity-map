import type { Role } from '../types'
import { useAppContext } from '../App'

interface Props {
  role: Role
  stageColor: string
  stageId: string
  stageName?: string
}

export default function RoleCard({ role, stageColor, stageId, stageName }: Props) {
  const { toggleBookmark, isBookmarked } = useAppContext()
  const bookmarked = isBookmarked(role.id)

  return (
    <div className="card p-5 animate-slide-up flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
            style={{ background: `${stageColor}15`, color: stageColor, border: `1.5px solid ${stageColor}30` }}
          >
            {role.title[0]}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{role.title}</h3>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}
            >
              {role.department}
            </span>
          </div>
        </div>
        <button
          onClick={() => toggleBookmark({ id: role.id, stageId, stageName: stageName ?? '', type: 'role', title: role.title, description: role.responsibilities?.[0] ?? '' })}
          className="p-1.5 rounded-lg transition-all flex-shrink-0"
          style={{ color: bookmarked ? '#F59E0B' : 'var(--text-4)', background: bookmarked ? '#FEF3C7' : 'transparent' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      {/* Responsibilities */}
      {role.responsibilities && role.responsibilities.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-4)' }}>核心职责</p>
          <ul className="space-y-1.5">
            {role.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: stageColor }} />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KPIs */}
      {role.kpis && role.kpis.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-4)' }}>KPI 指标</p>
          <div className="flex flex-wrap gap-1.5">
            {role.kpis.map((kpi, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: `${stageColor}10`, color: stageColor, border: `1px solid ${stageColor}25` }}
              >
                {kpi}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tools */}
      {role.tools && role.tools.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-4)' }}>常用工具</p>
          <div className="flex flex-wrap gap-1.5">
            {role.tools.map((tool, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md font-mono"
                style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

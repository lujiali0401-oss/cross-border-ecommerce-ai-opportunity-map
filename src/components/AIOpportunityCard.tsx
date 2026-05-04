import type { AIOpportunity } from '../types'
import { useAppContext } from '../App'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  automation: { label: '自动化', color: '#0E7490', bg: '#ECFEFF' },
  prediction: { label: '预测分析', color: '#F97316', bg: '#FFEDD5' },
  intelligence: { label: '智能决策', color: '#D97706', bg: '#FEF3C7' },
  generation: { label: '内容生成', color: '#059669', bg: '#D1FAE5' },
  optimization: { label: '优化调度', color: '#DC2626', bg: '#FFE4E6' },
  vision: { label: '视觉识别', color: '#0284C7', bg: '#E0F2FE' },
  AI: { label: 'AI', color: '#F97316', bg: '#FFEDD5' },
  RPA: { label: 'RPA', color: '#0E7490', bg: '#ECFEFF' },
  Automation: { label: '自动化', color: '#0F766E', bg: '#CCFBF1' },
  Analytics: { label: '数据分析', color: '#0891B2', bg: '#CFFAFE' },
  IoT: { label: 'IoT', color: '#0284C7', bg: '#E0F2FE' },
}

const LEVEL_CONFIG = {
  low: { label: '低', color: '#059669', bg: '#D1FAE5' },
  medium: { label: '中', color: '#D97706', bg: '#FEF3C7' },
  high: { label: '高', color: '#DC2626', bg: '#FFE4E6' },
}

interface Props {
  opportunity: AIOpportunity
  stageId: string
  stageName?: string
}

export default function AIOpportunityCard({ opportunity, stageId, stageName }: Props) {
  const { toggleBookmark, isBookmarked } = useAppContext()
  const bookmarked = isBookmarked(opportunity.id)
  const typeKey = opportunity.type as string
  const typeConfig = TYPE_CONFIG[typeKey] ?? { label: typeKey, color: '#6B7280', bg: '#F3F4F6' }
  const difficulty = LEVEL_CONFIG[opportunity.difficulty as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.medium
  const value = LEVEL_CONFIG[opportunity.impact as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.medium

  return (
    <div className="card p-5 card-hover animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="badge" style={{ background: typeConfig.bg, color: typeConfig.color, borderColor: `${typeConfig.color}30` }}>
              ✦ {typeConfig.label}
            </span>
            {opportunity.maturity && (
              <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>
                {opportunity.maturity}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
            {opportunity.title}
          </h3>
        </div>
        <button
          onClick={() => toggleBookmark({
            id: opportunity.id,
            stageId,
            stageName: stageName ?? '',
            type: 'ai_opportunity',
            title: opportunity.title,
            description: opportunity.description,
          })}
          className="flex-shrink-0 p-1.5 rounded-lg transition-all"
          style={{
            color: bookmarked ? '#F59E0B' : 'var(--text-4)',
            background: bookmarked ? '#FEF3C7' : 'transparent',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>
        {opportunity.description}
      </p>

      {/* Scores */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs">
          <span style={{ color: 'var(--text-4)' }}>实施难度</span>
          <span className="badge" style={{ background: difficulty.bg, color: difficulty.color, borderColor: `${difficulty.color}30` }}>
            {difficulty.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span style={{ color: 'var(--text-4)' }}>业务价值</span>
          <span className="badge" style={{ background: value.bg, color: value.color, borderColor: `${value.color}30` }}>
            {value.label}
          </span>
        </div>
      </div>

      {/* Tools */}
      {opportunity.tools && opportunity.tools.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {opportunity.tools.map((tool, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

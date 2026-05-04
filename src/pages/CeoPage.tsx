import { useState, useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useAppContext } from '../App'
import {
  maturityLevels, roiDimensions, matrixQuadrants, roadmapPhases, failureRisks,
} from '../data/ceo'

// ─── Section nav ───────────────────────────────────────────────
type Section = 'maturity' | 'roi' | 'matrix' | 'roadmap' | 'risks'
const SECTIONS: { id: Section; label: string; icon: string; color: string }[] = [
  { id: 'maturity', label: '成熟度模型', icon: '📶', color: '#0F3D5E' },
  { id: 'roi',      label: 'ROI 评估',   icon: '💰', color: '#059669' },
  { id: 'matrix',   label: '优先级矩阵', icon: '🎯', color: '#0E7490' },
  { id: 'roadmap',  label: '路线图',     icon: '🗺', color: '#D97706' },
  { id: 'risks',    label: '风险提醒',   icon: '⚠️', color: '#DC2626' },
]

// ─── Shared ────────────────────────────────────────────────────
function SectionMeta({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}12`, border: `1.5px solid ${color}25` }}>
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{title}</h2>
        <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Module 1: Maturity ────────────────────────────────────────
function MaturitySection({ noteStageId }: { noteStageId: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const { toggleBookmark, isBookmarked, saveNote, getNote } = useAppContext()
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  const handleSelect = (level: number) => {
    setSelected(prev => prev === level ? null : level)
    setNote(getNote(`ceo-maturity-${level}`))
  }

  const handleSaveNote = (level: number) => {
    saveNote(`ceo-maturity-${level}`, note)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta icon="📶" title="跨境电商数字化成熟度模型" color="#0F3D5E"
        desc="6 个阶段，帮助企业快速定位当前数字化水平，明确下一步方向" />

      {/* Level overview strip */}
      <div className="card p-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {maturityLevels.map(l => (
            <button key={l.level}
              onClick={() => handleSelect(l.level)}
              className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all group"
              style={{
                background: selected === l.level ? l.bg : 'var(--surface-2)',
                border: `1.5px solid ${selected === l.level ? l.border : 'var(--border)'}`,
                minWidth: 80,
              }}>
              <span className="text-xl">{l.icon}</span>
              <span className="text-[10px] font-bold font-mono"
                style={{ color: selected === l.level ? l.color : 'var(--text-4)' }}>
                L{l.level}
              </span>
              <span className="text-[10px] font-medium text-center leading-tight"
                style={{ color: selected === l.level ? l.color : 'var(--text-3)' }}>
                {l.name.split(' / ')[0]}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-4)' }}>
          ← 点击等级卡片查看详情
        </p>
      </div>

      {/* Detail cards */}
      <div className="space-y-3">
        {maturityLevels.map((l, i) => {
          const isOpen = selected === l.level
          const bookmarkId = `ceo-maturity-${l.level}`
          const bookmarked = isBookmarked(bookmarkId)
          return (
            <div key={l.level} className="card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, borderColor: isOpen ? l.border : undefined }}>
              {/* Header */}
              <button
                onClick={() => handleSelect(l.level)}
                className="w-full text-left p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-blue-50/30 group"
              >
                {/* Level badge */}
                <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: l.bg, border: `1.5px solid ${l.border}` }}>
                  <span className="text-lg leading-none">{l.icon}</span>
                  <span className="text-[9px] font-bold font-mono mt-0.5" style={{ color: l.color }}>L{l.level}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{l.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: l.bg, color: l.color, border: `1px solid ${l.border}` }}>
                      {l.tagline}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-3)' }}>
                    {l.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleBookmark({ id: bookmarkId, stageId: 'ceo', stageName: '决策视角', type: 'sop', title: `L${l.level} ${l.name}`, description: l.description }) }}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: bookmarked ? '#F59E0B' : 'var(--text-4)', background: bookmarked ? '#FEF3C7' : 'transparent' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="transition-transform duration-200"
                    style={{ color: 'var(--text-4)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t animate-fade-in" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x"
                    style={{ '--tw-divide-opacity': 1 } as CSSProperties}>
                    {/* Left */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <InfoBlock icon="🔎" title="典型表现" color={l.color} items={l.symptoms} itemBg={l.bg} itemBorder={l.border} />
                      <InfoBlock icon="⚠️" title="常见问题" color="#DC2626" items={l.problems} itemBg="#FFF5F5" itemBorder="#FECDD3" />
                    </div>
                    {/* Right */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <InfoBlock icon="✅" title="推荐下一步" color="#059669" items={l.nextSteps} itemBg="#F0FDF4" itemBorder="#A7F3D0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#0E7490' }}>
                          <span>💻</span> 推荐优先建设的系统
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {l.systems.map((s, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
                              style={{ background: '#ECFEFF', color: '#0E7490', border: '1px solid #A5F3FC' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#0F3D5E' }}>
                          <span>🤖</span> 优先落地自动化场景
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {l.automationScenes.map((s, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
                              style={{ background: '#ECFEFF', color: '#0F3D5E', border: '1px solid #BAE6FD' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      {/* Note */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#D97706' }}>
                          <span>📝</span> 我的备注
                        </p>
                        <textarea value={note} onChange={e => setNote(e.target.value)}
                          placeholder="记录你的判断、计划或问题…"
                          className="input w-full text-xs" rows={2} />
                        <div className="flex justify-end mt-2">
                          <button onClick={() => handleSaveNote(l.level)}
                            className="text-xs px-3 py-1.5 rounded-lg transition-all"
                            style={noteSaved
                              ? { background: '#D1FAE5', color: '#059669' }
                              : { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>
                            {noteSaved ? '✓ 已保存' : '保存备注'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InfoBlock({ icon, title, color, items, itemBg, itemBorder }:
  { icon: string; title: string; color: string; items: string[]; itemBg: string; itemBorder: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color }}>
        <span>{icon}</span> {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs px-3 py-2 rounded-xl leading-relaxed"
            style={{ background: itemBg, border: `1px solid ${itemBorder}`, color: 'var(--text-2)' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Module 2: ROI ─────────────────────────────────────────────
function ROISection() {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta icon="💰" title="ROI 评估框架" color="#059669"
        desc="10 个可量化维度，帮助 老板 和管理层在立项前估算数字化投资回报" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roiDimensions.map((d, i) => {
          const isOpen = expanded === d.id
          return (
            <div key={d.id} className="card overflow-hidden animate-slide-up card-hover"
              style={{ animationDelay: `${i * 40}ms` }}>
              <button onClick={() => setExpanded(isOpen ? null : d.id)}
                className="w-full text-left p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: d.bg, border: `1px solid ${d.color}25` }}>
                  {d.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{d.name}</p>
                  <p className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-3)' }}>{d.desc}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transition-transform flex-shrink-0 mt-1"
                  style={{ color: 'var(--text-4)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="border-t p-4 space-y-3 animate-fade-in"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <Row label="适用场景" value={d.scenes} color={d.color} bg={d.bg} />
                  <Row label="量化方式" value={d.measure} color="#0E7490" bg="#ECFEFF" />
                  <Row label="参考示例" value={d.example} color="#059669" bg="#D1FAE5" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="rounded-xl p-4 flex gap-3" style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs leading-relaxed" style={{ color: '#047857' }}>
          <strong>实战建议：</strong>不需要计算所有维度，选择 2-3 个最能说服决策层的指标，做保守估算，
          宁可低报 ROI 超预期，也不要高估 ROI 难以兑现。项目立项时就锁定目标值，上线后 3 个月复盘。
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>{label}</span>
      <p className="text-xs mt-1 px-3 py-2 rounded-lg leading-relaxed"
        style={{ background: bg, color: 'var(--text-2)' }}>{value}</p>
    </div>
  )
}

// ─── Module 3: Priority Matrix ─────────────────────────────────
function MatrixSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta icon="🎯" title="优先级矩阵：业务价值 × 落地难度" color="#0E7490"
        desc="帮助 老板 快速决策哪些场景先做、哪些后做、哪些暂时不做" />

      {/* Axis labels */}
      <div className="relative">
        {/* Y axis label */}
        <div className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 flex-col items-center gap-1" style={{ writingMode: 'vertical-rl' }}>
          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-4)' }}>业务价值</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {matrixQuadrants.map((q, i) => (
            <div key={q.id} className="card p-4 sm:p-5 animate-scale-in"
              style={{ animationDelay: `${i * 60}ms`, borderColor: q.border, background: `${q.bg}60` }}>
              {/* Quadrant header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{q.icon}</span>
                    <span className="text-sm font-bold" style={{ color: q.color }}>{q.title}</span>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: q.color }}>{q.subtitle}</p>
                </div>
              </div>
              <p className="text-[11px] px-2.5 py-1.5 rounded-lg mb-3 font-medium"
                style={{ background: q.bg, color: q.color, border: `1px solid ${q.border}` }}>
                💬 {q.action}
              </p>
              {/* Items */}
              <ul className="space-y-1.5">
                {q.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: q.color }} />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-xs" style={{ color: 'var(--text-1)' }}>{item.name}</span>
                      {item.scene !== '— ' && item.scene && (
                        <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-4)' }}>{item.scene}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* X axis label */}
        <div className="flex justify-center mt-3">
          <div className="flex items-center gap-8 text-[10px]" style={{ color: 'var(--text-4)' }}>
            <span>← 低难度</span>
            <span className="font-semibold">落地难度</span>
            <span>高难度 →</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 flex gap-3" style={{ background: '#EFF6FF', border: '1px solid #A5F3FC' }}>
        <span className="text-lg flex-shrink-0">🧭</span>
        <p className="text-xs leading-relaxed" style={{ color: '#1E3A8A' }}>
          <strong>决策建议：</strong>第一年重点攻「优先落地」象限，用快速成效建立内部信心和推进动力。
          同步规划「重点规划」象限的立项，以 12-18 个月为周期排期。「暂不建议」象限留待基础成熟后重新评估。
        </p>
      </div>
    </div>
  )
}

// ─── Module 4: Roadmap ─────────────────────────────────────────
function RoadmapSection() {
  const [expanded, setExpanded] = useState<number | null>(1)
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta icon="🗺" title="推荐数字化路线图" color="#D97706"
        desc="五阶段推进框架，从流程梳理到 AI 助手，每阶段有清晰目标、关键动作和验收标准" />

      {/* Timeline - desktop */}
      <div className="hidden sm:flex items-center gap-0 overflow-x-auto pb-2 mb-2">
        {roadmapPhases.map((p, i) => (
          <div key={p.phase} className="flex items-center flex-shrink-0">
            <button
              onClick={() => setExpanded(expanded === p.phase ? null : p.phase)}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all group"
              style={{
                background: expanded === p.phase ? p.bg : 'transparent',
                border: `1.5px solid ${expanded === p.phase ? p.color+'40' : 'transparent'}`,
              }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: p.bg, border: `2px solid ${p.color}40` }}>
                {p.icon}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono font-bold" style={{ color: p.color }}>阶段 {p.phase}</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-1)' }}>{p.name}</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-4)' }}>{p.duration}</p>
              </div>
            </button>
            {i < roadmapPhases.length - 1 && (
              <div className="flex items-center -mx-1" style={{ marginTop: -8 }}>
                <svg width="32" height="10" viewBox="0 0 32 10" fill="none">
                  <line x1="2" y1="5" x2="24" y2="5" stroke="var(--border-2)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M22 2L27 5L22 8" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail cards */}
      <div className="space-y-3">
        {roadmapPhases.map((p, i) => {
          const isOpen = expanded === p.phase
          return (
            <div key={p.phase} className="card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, borderColor: isOpen ? p.color+'40' : undefined }}>
              <button onClick={() => setExpanded(isOpen ? null : p.phase)}
                className="w-full text-left p-4 sm:p-5 flex items-center gap-4 transition-colors hover:bg-blue-50/30 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: p.bg, border: `1.5px solid ${p.color}40` }}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ background: p.bg, color: p.color }}>
                      阶段 {p.phase}
                    </span>
                    <span className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{p.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                      {p.duration}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-3)' }}>{p.goal}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transition-transform flex-shrink-0"
                  style={{ color: 'var(--text-4)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t animate-fade-in" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x"
                    style={{ '--tw-divide-opacity': 1 } as CSSProperties}>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: p.color }}>
                        🎯 阶段目标
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{p.goal}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mt-3 mb-2" style={{ color: '#059669' }}>
                        📦 关键输出物
                      </p>
                      <ul className="space-y-1">
                        {p.outputs.map((o, j) => (
                          <li key={j} className="text-[11px] px-2 py-1 rounded-lg"
                            style={{ background: '#D1FAE5', color: '#065F42' }}>{o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#0E7490' }}>
                        ⚡ 关键动作
                      </p>
                      <ul className="space-y-2">
                        {p.actions.map((a, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                              style={{ background: p.bg, color: p.color, border: `1px solid ${p.color}30` }}>
                              {j + 1}
                            </div>
                            <span className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#D97706' }}>
                        🏁 阶段完成信号
                      </p>
                      <div className="rounded-xl p-3" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                        <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                          "{p.successSign}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Module 5: Risks ───────────────────────────────────────────
function RisksSection() {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta icon="⚠️" title="数字化失败风险提醒" color="#DC2626"
        desc="10 个最常见的数字化推进失败原因，帮助 老板 和老板提前规避" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {failureRisks.map((r, i) => {
          const isOpen = expanded === r.id
          return (
            <div key={r.id} className="card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 40}ms`, borderColor: isOpen ? r.color+'40' : undefined }}>
              <button onClick={() => setExpanded(isOpen ? null : r.id)}
                className="w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-red-50/20 group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: r.bg, border: `1px solid ${r.color}30` }}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{r.name}</p>
                  <p className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-3)' }}>{r.desc}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transition-transform flex-shrink-0 mt-1"
                  style={{ color: 'var(--text-4)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="border-t animate-fade-in space-y-3 p-4"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <div className="rounded-xl p-3" style={{ background: '#FFF5F5', border: '1px solid #FECDD3' }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: '#DC2626' }}>⚡ 可能后果</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9F1239' }}>{r.consequence}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: '#059669' }}>🛡 规避建议</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#065F42' }}>{r.prevention}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Key insight */}
      <div className="card p-5" style={{ background: 'linear-gradient(135deg, #FFF5F5, #FEF3C7)', border: '1.5px solid #FDE68A' }}>
        <p className="text-sm font-bold mb-2" style={{ color: '#92400E' }}>🔑 最核心的一条</p>
        <p className="text-sm leading-relaxed" style={{ color: '#B45309' }}>
          所有失败原因，本质上都可以归结为一句话：<strong>数字化是管理变革，不是技术升级。</strong><br />
          系统只是工具，真正的难点是流程重塑、组织配合和持续运营。没有一把手持续推动和业务部门真心参与，
          再好的系统也会变成摆设。
        </p>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function CeoPage() {
  const [activeSection, setActiveSection] = useState<Section>('maturity')
  const { markVisited, markCompleted, progress } = useAppContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const PAGE_ID = 'ceo-decision'

  // Mark visited on mount
  useEffect(() => { markVisited(PAGE_ID) }, [])

  const isCompleted = progress.completedStages.includes(PAGE_ID)

  const handleSectionChange = (id: Section) => {
    setActiveSection(id)
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ── Hero ── */}
      <div className="card overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0F3D5E, #0E7490, #059669, #D97706, #DC2626)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ECFEFF, #ECFEFF)', border: '1.5px solid #C4B5FD' }}>
              👔
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="badge-violet badge">高层 · 决策层</span>
                <span className="badge-blue badge">老板 · 数字化负责人</span>
                <span className="badge-mint badge">信息化 · 战略规划</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
                高层决策视角
              </h1>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-2)' }}>
                帮助高层和 老板 判断企业数字化所处阶段、制定推进路线、评估 ROI、排定优先级，
                并提前识别最容易踩的坑。从"要不要做"到"怎么做"，给你一套完整决策框架。
              </p>
            </div>
            <button
              onClick={() => markCompleted(PAGE_ID)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hidden sm:block"
              style={isCompleted
                ? { background: '#D1FAE5', color: '#059669', border: '1.5px solid #A7F3D0' }
                : { background: 'var(--surface-2)', color: 'var(--text-3)', border: '1.5px solid var(--border)' }}>
              {isCompleted ? '✓ 已读完' : '标记已读'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {[
              { value: '6 级', label: '成熟度模型', color: '#0F3D5E', bg: '#ECFEFF' },
              { value: '10 项', label: 'ROI 维度',  color: '#059669', bg: '#D1FAE5' },
              { value: '4 象限', label: '优先级矩阵', color: '#0E7490', bg: '#ECFEFF' },
              { value: '5 阶段', label: '路线图',    color: '#D97706', bg: '#FEF3C7' },
              { value: '10 项', label: '风险提醒',  color: '#DC2626', bg: '#FFE4E6' },
            ].map(s => (
              <div key={s.label} className="stat-pill">
                <span className="text-base font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section nav ── */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => handleSectionChange(s.id)}
            className="flex flex-col items-start gap-1.5 p-3 sm:p-3.5 rounded-2xl text-left transition-all card-hover"
            style={activeSection === s.id
              ? { background: `${s.color}10`, border: `2px solid ${s.color}50`, boxShadow: `0 4px 16px ${s.color}18` }
              : { background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: '0 1px 3px rgba(14,90,180,0.06)' }}>
            <span className="text-lg sm:text-xl">{s.icon}</span>
            <span className="text-[11px] sm:text-xs font-semibold leading-tight"
              style={{ color: activeSection === s.id ? s.color : 'var(--text-2)' }}>
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div ref={contentRef}>
        {activeSection === 'maturity' && <MaturitySection noteStageId={PAGE_ID} />}
        {activeSection === 'roi'      && <ROISection />}
        {activeSection === 'matrix'   && <MatrixSection />}
        {activeSection === 'roadmap'  && <RoadmapSection />}
        {activeSection === 'risks'    && <RisksSection />}
      </div>
    </div>
  )
}

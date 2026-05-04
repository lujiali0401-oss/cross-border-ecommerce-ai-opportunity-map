import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'
import AIOpportunityCard from '../components/AIOpportunityCard'
import RoleCard from '../components/RoleCard'
import SOPCard from '../components/SOPCard'

type Tab = 'overview' | 'roles' | 'sop' | 'ai'

export default function StageDetail() {
  const { stageId } = useParams<{ stageId: string }>()
  const { markVisited, markCompleted, progress, saveNote, getNote } = useAppContext()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [noteContent, setNoteContent] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  const stage = stages.find(s => s.id === stageId)
  const currentIndex = stages.findIndex(s => s.id === stageId)
  const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

  useEffect(() => {
    if (stage) {
      markVisited(stage.id)
      setNoteContent(getNote(stage.id))
      setActiveTab('overview')
    }
  }, [stageId])

  if (!stage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>节点未找到</h2>
        <Link to="/" className="btn-primary mt-4">返回首页</Link>
      </div>
    )
  }

  const isCompleted = progress.completedStages.includes(stage.id)

  const handleSaveNote = () => {
    saveNote(stage.id, noteContent)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: '概览' },
    { id: 'roles', label: '岗位', count: stage.roles.length },
    { id: 'sop', label: 'SOP流程', count: stage.sops.length },
    { id: 'ai', label: 'AI机会', count: stage.aiOpportunities.length },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="transition-colors hover:text-cyan-700" style={{ color: 'var(--text-3)' }}>首页</Link>
        <span style={{ color: 'var(--text-4)' }}>/</span>
        <span style={{ color: 'var(--text-1)' }}>{stage.name}</span>
      </nav>

      {/* Hero card */}
      <div className="card overflow-hidden animate-slide-up">
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${stage.color}, ${stage.color}40)` }} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${stage.color}12`, border: `2px solid ${stage.color}30` }}
            >
              {stage.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                  style={{ background: `${stage.color}15`, color: stage.color }}
                >
                  {String(stage.order).padStart(2, '0')}
                </span>
                {isCompleted && (
                  <span className="badge" style={{ background: '#D1FAE5', color: '#059669', borderColor: '#A7F3D0' }}>
                    ✓ 已完成
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>{stage.name}</h1>
              <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>{stage.englishName}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{stage.description}</p>
            </div>

            <button
              onClick={() => markCompleted(stage.id)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={isCompleted
                ? { background: '#FEF3C7', color: '#D97706', border: '1.5px solid #FDE68A' }
                : { background: `${stage.color}12`, color: stage.color, border: `1.5px solid ${stage.color}30` }
              }
            >
              {isCompleted ? '↩ 标记未完成' : '✓ 标记完成'}
            </button>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: '涉及部门', value: stage.departments.join('、'), icon: '🏢' },
              { label: '核心目标', value: stage.objective, icon: '🎯' },
              { label: '数字化现状', value: stage.digitalMaturityCurrent, icon: '📊' },
              { label: '数字化目标', value: stage.digitalMaturityTarget, icon: '🚀' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="text-base mb-1">{item.icon}</div>
                <div className="text-[11px] mb-1" style={{ color: 'var(--text-4)' }}>{item.label}</div>
                <div className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text-1)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar animate-slide-up">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={activeTab === tab.id
                  ? { background: '#ECFEFF', color: '#0E7490' }
                  : { background: 'var(--border)', color: 'var(--text-3)' }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          {/* KPIs */}
          <div className="card p-5">
            <SectionTitle icon="📊" title="核心KPI指标" color={stage.color} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {stage.kpis.map((kpi, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${stage.color}15`, color: stage.color }}>
                    {i + 1}
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{typeof kpi === 'string' ? kpi : kpi.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pain points */}
          <div className="card p-5">
            <SectionTitle icon="⚠️" title="常见痛点挑战" color="#DC2626" />
            <div className="space-y-2">
              {stage.commonChallenges.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl p-3"
                  style={{ background: '#FFF5F5', border: '1px solid #FECDD3' }}>
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }}>⚡</span>
                  <span className="text-xs leading-relaxed" style={{ color: '#7F1D1D' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Systems */}
          <div className="card p-5">
            <SectionTitle icon="💻" title="涉及信息系统" color="#0284C7" />
            <div className="flex flex-wrap gap-2">
              {stage.systemsInvolved.map((sys, i) => (
                <span key={i} className="badge-sky badge">{sys}</span>
              ))}
            </div>
          </div>

          {/* Digital maturity */}
          <div className="card p-5">
            <SectionTitle icon="🚀" title="数字化成熟度" color="#0F3D5E" />
            <div className="space-y-3">
              <div className="rounded-xl p-4" style={{ background: '#ECFEFF', border: '1px solid #A5F3FC' }}>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#1E40AF' }}>📊 当前现状</p>
                <p className="text-xs leading-relaxed" style={{ color: '#1E3A8A' }}>{stage.digitalMaturityCurrent}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#065F42' }}>🚀 数字化目标</p>
                <p className="text-xs leading-relaxed" style={{ color: '#064E36' }}>{stage.digitalMaturityTarget}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <SectionTitle icon="📝" title="我的笔记" color="#F97316" />
            <textarea
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="记录你的思考、问题或洞察..."
              className="input"
              rows={4}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: 'var(--text-4)' }}>{noteContent.length} 字</span>
              <button
                onClick={handleSaveNote}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${noteSaved ? '' : 'btn-primary'}`}
                style={noteSaved ? { background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' } : {}}
              >
                {noteSaved ? '✓ 已保存' : '保存笔记'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {stage.roles.map(role => (
            <RoleCard key={role.id} role={role} stageColor={stage.color} stageId={stage.id} stageName={stage.name} />
          ))}
        </div>
      )}

      {activeTab === 'sop' && (
        <div className="space-y-3 animate-fade-in">
          {stage.sops.map(sop => (
            <SOPCard key={sop.id} sop={sop} stageColor={stage.color} stageId={stage.id} stageName={stage.name} />
          ))}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
            {['automation','prediction','intelligence','generation','optimization','vision'].map(type => {
              const count = stage.aiOpportunities.filter(a => a.type === type).length
              if (!count) return null
              const icons: Record<string, string> = { automation:'⚙️', prediction:'🔮', intelligence:'🧠', generation:'✨', optimization:'📈', vision:'👁️' }
              const labels: Record<string, string> = { automation:'自动化', prediction:'预测分析', intelligence:'智能决策', generation:'内容生成', optimization:'优化调度', vision:'视觉识别' }
              return (
                <div key={type} className="card p-3 text-center">
                  <div className="text-lg mb-1">{icons[type]}</div>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{labels[type]}</div>
                  <div className="text-lg font-bold" style={{ color: stage.color }}>{count}</div>
                </div>
              )
            })}
          </div>
          {stage.aiOpportunities.map(opp => (
            <AIOpportunityCard key={opp.id} opportunity={opp} stageId={stage.id} stageName={stage.name} />
          ))}
        </div>
      )}

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        {prevStage ? (
          <Link to={`/stage/${prevStage.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all group"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>←</span>
            <div>
              <div className="text-[10px]" style={{ color: 'var(--text-4)' }}>上一阶段</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-1)' }}>{prevStage.name}</div>
            </div>
          </Link>
        ) : <div />}

        <Link to="/" className="text-xs transition-colors hover:text-cyan-700" style={{ color: 'var(--text-4)' }}>
          返回流程图
        </Link>

        {nextStage ? (
          <Link to={`/stage/${nextStage.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-right group"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <div>
              <div className="text-[10px]" style={{ color: 'var(--text-4)' }}>下一阶段</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-1)' }}>{nextStage.name}</div>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

function SectionTitle({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

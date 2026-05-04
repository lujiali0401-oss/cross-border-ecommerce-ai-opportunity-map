import { Link } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'

export default function ProgressPage() {
  const { progress, bookmarks, resetProgress } = useAppContext()

  const visited = progress.visitedStages.length
  const completed = progress.completedStages.length
  const total = stages.length
  const pct = Math.round((completed / total) * 100)
  const days = progress.startedAt
    ? Math.max(1, Math.floor((Date.now() - new Date(progress.startedAt).getTime()) / 86400000))
    : 0

  const totalAI = stages.reduce((s, st) => s + st.aiOpportunities.length, 0)
  const totalSOP = stages.reduce((s, st) => s + st.sops.length, 0)
  const totalRoles = stages.reduce((s, st) => s + st.roles.length, 0)

  const stats = [
    { label: '已完成节点', value: `${completed}/${total}`, pct: (completed / total) * 100, color: '#10B981', bg: '#D1FAE5', icon: '✅' },
    { label: '已访问节点', value: `${visited}/${total}`, pct: (visited / total) * 100, color: '#0E7490', bg: '#ECFEFF', icon: '👁️' },
    { label: '收藏内容', value: `${bookmarks.length}`, pct: (bookmarks.length / (totalSOP + totalAI)) * 100, color: '#F59E0B', bg: '#FEF3C7', icon: '🔖' },
    { label: '学习天数', value: `${days} 天`, pct: Math.min(days / 30 * 100, 100), color: '#14B8A6', bg: '#ECFEFF', icon: '📅' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: '#ECFEFF', border: '1.5px solid #BAE6FD' }}>
              📈
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>学习进度</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                {progress.startedAt
                  ? `开始于 ${new Date(progress.startedAt).toLocaleDateString('zh-CN')}，已坚持 ${days} 天`
                  : '开始你的跨境电商知识探索'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('确定重置所有进度吗？此操作不可撤销。')) resetProgress()
            }}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50"
            style={{ color: 'var(--text-4)', border: '1px solid var(--border)' }}
          >
            重置
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
        {stats.map((s, i) => (
          <div key={s.label} className="card p-4 text-center animate-scale-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold font-mono mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.label}</div>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(s.pct, 100)}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="card p-5 animate-slide-up">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>总体完成进度</h3>
          <span className="text-2xl font-bold font-mono" style={{ color: '#0E7490' }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0E7490, #14B8A6)' }}
          />
        </div>
        <div className="flex items-center gap-5 mt-3">
          {[
            { dot: '#10B981', label: `已完成 ${completed}` },
            { dot: '#0E7490', label: `进行中 ${visited - completed}` },
            { dot: '#E2EAF8', label: `未访问 ${total - visited}`, border: '#C8D8F0' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.dot, border: item.border ? `1.5px solid ${item.border}` : undefined }} />
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage list */}
      <div className="card p-5 animate-slide-up">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)' }}>各节点状态</h3>
        <div className="space-y-1">
          {stages.map(stage => {
            const isVisited = progress.visitedStages.includes(stage.id)
            const isCompleted = progress.completedStages.includes(stage.id)
            return (
              <Link
                key={stage.id}
                to={`/stage/${stage.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-blue-50 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    background: isCompleted ? `${stage.color}15` : isVisited ? 'var(--surface-2)' : 'var(--surface-2)',
                    border: `1.5px solid ${isCompleted ? stage.color + '50' : 'var(--border)'}`,
                  }}
                >
                  {stage.icon}
                </div>
                <span className="flex-1 text-sm transition-colors group-hover:text-cyan-700" style={{ color: 'var(--text-1)' }}>
                  <span className="font-mono text-[10px] mr-2" style={{ color: 'var(--text-4)' }}>{String(stage.order).padStart(2, '0')}</span>
                  {stage.name}
                </span>
                {isCompleted
                  ? <span className="badge-mint badge text-[10px]">✓ 完成</span>
                  : isVisited
                  ? <span className="badge-blue badge text-[10px]">进行中</span>
                  : <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>未访问</span>
                }
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-4)' }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Knowledge stats */}
      <div className="card p-5 animate-slide-up">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)' }}>知识库规模</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'AI应用场景', value: totalAI, icon: '🤖', color: '#14B8A6', bg: '#ECFEFF' },
            { label: 'SOP流程', value: totalSOP, icon: '📋', color: '#0E7490', bg: '#ECFEFF' },
            { label: '岗位角色', value: totalRoles, icon: '👥', color: '#10B981', bg: '#D1FAE5' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-4 text-center" style={{ background: item.bg, border: `1px solid ${item.color}25` }}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-bold mb-0.5 font-mono" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[11px]" style={{ color: item.color + 'aa' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {completed === total ? (
        <div className="card p-8 text-center animate-scale-in" style={{ border: '2px solid #A7F3D0', background: '#F0FDF8' }}>
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#065F42' }}>恭喜完成全部学习！</h3>
          <p className="text-sm mb-5" style={{ color: '#047A54' }}>你已掌握跨境电商完整业务流程的 AI 自动化机会知识体系</p>
          <Link to="/" className="btn-primary" style={{ background: '#059669' }}>回顾流程图</Link>
        </div>
      ) : (
        <div className="card p-6 text-center animate-scale-in">
          <div className="text-3xl mb-2">{completed === 0 ? '🚀' : completed < 7 ? '💪' : '🎯'}</div>
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
            {completed === 0 ? '开始你的学习之旅' : completed < 7 ? '继续保持！' : '快完成了！'}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>还有 {total - completed} 个节点待探索</p>
          <Link to={`/stage/${stages.find(s => !progress.completedStages.includes(s.id))?.id ?? stages[0].id}`} className="btn-primary">
            继续学习 →
          </Link>
        </div>
      )}
    </div>
  )
}

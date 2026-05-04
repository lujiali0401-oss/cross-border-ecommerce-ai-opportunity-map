import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../App'
import { stages } from '../data/stages'

type FilterType = 'all' | 'sop' | 'ai_opportunity' | 'role'

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useAppContext()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = bookmarks.filter(b => {
    const matchType = filter === 'all' || b.type === filter
    const q = searchQuery.toLowerCase()
    const matchSearch = b.title.toLowerCase().includes(q) || (b.description ?? '').toLowerCase().includes(q)
    return matchType && matchSearch
  })

  const typeStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
    sop: { label: 'SOP流程', color: '#0E7490', bg: '#ECFEFF', border: '#A5F3FC' },
    ai: { label: '决策/AI', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    ai_opportunity: { label: 'AI机会', color: '#F97316', bg: '#FFEDD5', border: '#FDBA74' },
    role: { label: '岗位角色', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
            🔖
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>我的收藏</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>已收藏 {bookmarks.length} 个内容</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
        <div className="tab-bar flex-shrink-0">
          {(['all', 'sop', 'ai_opportunity', 'role'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`tab-btn ${filter === f ? 'active' : ''}`}>
              {f === 'all' ? `全部 (${bookmarks.length})` :
               f === 'sop' ? `SOP (${bookmarks.filter(b => b.type === 'sop').length})` :
               f === 'role' ? `岗位 (${bookmarks.filter(b => b.type === 'role').length})` :
               `AI (${bookmarks.filter(b => b.type === 'ai_opportunity').length})`}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜索收藏内容..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input flex-1"
          style={{ resize: 'none' }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center animate-scale-in">
          <div className="text-5xl mb-3">{bookmarks.length === 0 ? '🔖' : '🔍'}</div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-1)' }}>
            {bookmarks.length === 0 ? '还没有收藏' : '没有匹配内容'}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
            {bookmarks.length === 0 ? '浏览各业务节点时，点击 🔖 保存重要内容' : '调整搜索关键词或筛选条件'}
          </p>
          {bookmarks.length === 0 && <Link to="/" className="btn-primary">开始浏览</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bookmark, i) => {
            const stage = stages.find(s => s.id === bookmark.stageId)
            const ts = typeStyle[bookmark.type] ?? typeStyle.sop
            return (
              <div key={bookmark.id} className="card p-4 card-hover animate-slide-up group" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color }}>
                    {bookmark.type === 'ai_opportunity' || bookmark.type === 'ai' ? '🤖' : bookmark.type === 'sop' ? '📋' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="badge" style={{ background: ts.bg, color: ts.color, borderColor: ts.border }}>
                        {ts.label}
                      </span>
                      {stage && (
                        <Link to={`/stage/${stage.id}`} className="text-xs hover:text-cyan-700 transition-colors" style={{ color: 'var(--text-3)' }}>
                          {stage.icon} {stage.name}
                        </Link>
                      )}
                    </div>
                    <p className="text-sm font-medium transition-colors group-hover:text-cyan-700" style={{ color: 'var(--text-1)' }}>
                      {bookmark.title}
                    </p>
                    {bookmark.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-3)' }}>{bookmark.description}</p>
                    )}
                    <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-4)' }}>
                      {new Date(bookmark.savedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {stage && (
                      <Link to={`/stage/${stage.id}`} className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
                        style={{ color: 'var(--text-3)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    )}
                    <button
                      onClick={() => toggleBookmark({ id: bookmark.id, type: bookmark.type, title: bookmark.title, description: bookmark.description ?? '', stageId: bookmark.stageId, stageName: bookmark.stageName ?? '' })}
                      className="p-1.5 rounded-lg transition-all hover:bg-red-50"
                      style={{ color: '#F59E0B' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stage distribution */}
      {bookmarks.length > 0 && (
        <div className="card p-5 animate-slide-up">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-4)' }}>按节点分布</h3>
          <div className="space-y-2.5">
            {stages.map(stage => {
              const count = bookmarks.filter(b => b.stageId === stage.id).length
              if (!count) return null
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <Link to={`/stage/${stage.id}`} className="flex items-center gap-1.5 w-28 hover:text-cyan-700 transition-colors" style={{ color: 'var(--text-2)' }}>
                    <span>{stage.icon}</span>
                    <span className="text-xs truncate">{stage.name}</span>
                  </Link>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / bookmarks.length) * 100}%`, background: stage.color }} />
                  </div>
                  <span className="text-xs w-4 text-right" style={{ color: 'var(--text-3)' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'

interface Props { onClose: () => void }

const NAV_ITEMS = [
  { to: '/industry-map', label: '平台与模式地图',   icon: '🌍', badge: 'NEW', badgeColor: '#CCFBF1', badgeText: '#0F766E' },
  { to: '/ceo', label: '老板决策视角',             icon: '👔', badge: 'NEW', badgeColor: '#FFEDD5', badgeText: '#F97316' },
  { to: '/consultant', label: '顾问调研视角',       icon: '🧭', badge: null },
  { to: '/custom-content', label: '自定义内容',      icon: '✍️', badge: 'NEW', badgeColor: '#ECFEFF', badgeText: '#0E7490' },
  { to: '/customer-practices', label: '客户实践库', icon: '📁', badge: 'NEW', badgeColor: '#FFEDD5', badgeText: '#F97316' },
  { to: '/ai-assistant', label: 'AI小助手',        icon: '🤖', badge: 'NEW', badgeColor: '#CCFBF1', badgeText: '#0F766E' },
  { to: '/bookmarks', label: '我的收藏',           icon: '🔖', badge: null },
  { to: '/progress', label: '学习进度',            icon: '📈', badge: null },
]

export default function Sidebar({ onClose }: Props) {
  const { progress } = useAppContext()
  const navigate = useNavigate()
  const total = stages.length
  const completed = progress.completedStages.length
  const visited = progress.visitedStages.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <button onClick={() => { navigate('/'); onClose() }}
          className="flex items-center gap-3 w-full text-left group mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0E7490, #14B8A6)' }}>
            🌐
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">跨境电商 AI 机会图谱</p>
            <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--sidebar-text)' }}>E-commerce AI Map</p>
          </div>
        </button>

        {/* Progress */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: 'var(--sidebar-text)' }}>掌握进度</span>
            <span className="text-[11px] font-bold" style={{ color: '#5EEAD4' }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #14B8A6, #5EEAD4)' }} />
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px]" style={{ color: 'rgba(148,170,200,0.7)' }}>已访问 {visited}/{total}</span>
            <span className="text-[10px]" style={{ color: 'rgba(148,170,200,0.7)' }}>已完成 {completed}</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="px-3 pt-3 pb-2">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} onClick={onClose}
            className={({ isActive }) => `nav-item mb-0.5 ${isActive ? 'active' : ''}`}>
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 truncate text-[13px]">{item.label}</span>
            {item.badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                style={{ background: item.badgeColor!, color: item.badgeText!, opacity: 0.9 }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Divider */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,170,200,0.5)' }}>
          跨境业务流程
        </p>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 sidebar-scroll space-y-0.5">
        {stages.map(stage => {
          const isVisited = progress.visitedStages.includes(stage.id)
          const isCompleted = progress.completedStages.includes(stage.id)
          return (
            <NavLink key={stage.id} to={`/stage/${stage.id}`} onClick={onClose}
              className={({ isActive }) => `nav-item relative ${isActive ? 'active' : ''}`}>
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                style={{
                  background: isCompleted ? `${stage.color}30` : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isCompleted ? stage.color + '60' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {stage.icon}
              </span>
              <span className="flex-1 truncate text-[13px]">
                <span className="font-mono text-[10px] mr-1.5" style={{ color: 'rgba(148,170,200,0.4)' }}>
                  {String(stage.order).padStart(2, '0')}
                </span>
                {stage.name}
              </span>
              {isCompleted && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22C55E' }} />}
              {isVisited && !isCompleted && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-70" style={{ background: '#14B8A6' }} />}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

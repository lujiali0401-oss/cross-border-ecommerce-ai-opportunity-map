import { useNavigate } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'

type StageItem = typeof stages[number]

const PHASES = [
  {
    id: 'market-product',
    title: '市场与商品',
    desc: '市场调研、选品、供应商和商品资料',
    color: '#0E7490',
    items: stages.slice(0, 5),
  },
  {
    id: 'traffic-order',
    title: '流量与订单',
    desc: '上架、广告、内容、询盘和订单处理',
    color: '#F97316',
    items: stages.slice(5, 10),
  },
  {
    id: 'fulfillment-service',
    title: '履约与售后',
    desc: '仓储、国际物流、清关尾程和客服售后',
    color: '#14B8A6',
    items: stages.slice(10, 14),
  },
  {
    id: 'finance-growth',
    title: '财务与增长',
    desc: '结算、经营分析和复购运营',
    color: '#10B981',
    items: stages.slice(14, 17),
  },
]

function StageNode({
  stage,
  isVisited,
  isCompleted,
  onClick,
}: {
  stage: StageItem
  isVisited: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  const statusText = isCompleted ? '已完成' : isVisited ? '已访问' : '未访问'
  const statusColor = isCompleted ? '#0F766E' : isVisited ? '#0E7490' : 'var(--text-4)'
  const statusBg = isCompleted ? '#CCFBF1' : isVisited ? '#ECFEFF' : 'var(--surface-2)'

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl p-3.5 transition-all duration-200"
      style={{
        background: isCompleted ? `${stage.color}08` : 'var(--surface)',
        border: `1.5px solid ${isCompleted ? stage.color + '45' : isVisited ? stage.color + '30' : 'var(--border)'}`,
        boxShadow: '0 1px 3px rgba(14,90,180,0.05)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-105"
          style={{ background: `${stage.color}12`, border: `1.5px solid ${stage.color}30` }}
        >
          {stage.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: `${stage.color}12`, color: stage.color }}
            >
              {String(stage.order).padStart(2, '0')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: statusBg, color: statusColor, border: '1px solid var(--border)' }}>
              {statusText}
            </span>
          </div>
          <h3 className="text-sm font-bold leading-tight transition-colors group-hover:text-cyan-700" style={{ color: 'var(--text-1)' }}>
            {stage.name}
          </h3>
          <p className="text-[11px] mt-1 line-clamp-1" style={{ color: 'var(--text-3)' }}>
            {stage.departments.slice(0, 2).join(' · ')}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
              {stage.roles.length} 岗位
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#FFEDD5', color: '#F97316', border: '1px solid #FDBA74' }}>
              {stage.aiOpportunities.length} AI
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default function FlowDiagram() {
  const navigate = useNavigate()
  const { progress } = useAppContext()

  const isVisited = (id: string) => progress.visitedStages.includes(id)
  const isCompleted = (id: string) => progress.completedStages.includes(id)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>跨境电商四阶段路线图</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              把 17 个节点拆成 4 个阶段，先看主链路，再进入单个节点查看 SOP、岗位和 AI 机会。
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-4)' }}>
            <span>选品</span>
            <span>→</span>
            <span>订单</span>
            <span>→</span>
            <span>履约</span>
            <span>→</span>
            <span>复购</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {PHASES.map((phase, phaseIndex) => (
          <div key={phase.id}>
            <div className="rounded-2xl p-4" style={{ background: `${phase.color}08`, border: `1.5px solid ${phase.color}25` }}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-44 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                      style={{ background: `${phase.color}14`, color: phase.color, border: `1px solid ${phase.color}30` }}
                    >
                      {phaseIndex + 1}
                    </span>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{phase.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{phase.desc}</p>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  {phase.items.map(stage => (
                    <StageNode
                      key={stage.id}
                      stage={stage}
                      isVisited={isVisited(stage.id)}
                      isCompleted={isCompleted(stage.id)}
                      onClick={() => navigate(`/stage/${stage.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {phaseIndex < PHASES.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                  ↓
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { color: 'var(--border-2)', fill: 'var(--surface-2)', label: '未访问' },
          { color: '#0E749080', fill: '#ECFEFF', label: '已访问' },
          { color: '#14B8A680', fill: '#CCFBF1', label: '已完成' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: item.fill, border: `1.5px solid ${item.color}` }} />
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{item.label}</span>
          </div>
        ))}
        <span className="text-[11px] sm:ml-auto" style={{ color: 'var(--text-4)' }}>点击节点查看详情 →</span>
      </div>
    </div>
  )
}

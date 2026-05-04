import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stages } from '../data/stages'
import { useAppContext } from '../App'
import FlowMap from '../components/FlowMap'
import FlowDiagram from '../components/FlowDiagram'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { manufacturingIndustries } from '../data/industryMap'
import { sampleCustomerPractices } from '../data/customerPractices'
import type { CustomerPractice } from '../data/customerPractices'

type FlowView = 'card' | 'diagram'

export default function Home() {
  const navigate = useNavigate()
  const { progress } = useAppContext()
  const [flowView, setFlowView] = useState<FlowView>('diagram')
  const [customerPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)

  const totalAI   = stages.reduce((sum, s) => sum + s.aiOpportunities.length, 0)
  const totalSOP  = stages.reduce((sum, s) => sum + s.sops.length, 0)
  const totalRoles = stages.reduce((sum, s) => sum + s.roles.length, 0)

  const MODULE_ENTRIES = [
    { title: '平台与模式地图', desc: '理解平台、业务模式和跨境卖家类型差异', icon: '🌍', color: '#0284C7', bg: '#E0F2FE', to: '/industry-map' },
    { title: '业务全流程', desc: '从市场调研到复购运营，建立端到端链路认知', icon: '🗺', color: '#0E7490', bg: '#CFFAFE', to: '/' },
    { title: '岗位知识库', desc: '进入节点查看岗位职责、KPI、系统和痛点', icon: '👥', color: '#059669', bg: '#D1FAE5', to: '/stage/product-research' },
    { title: 'AI 机会点', desc: '按流程识别 AI、RPA、数据分析和自动化机会', icon: '🤖', color: '#F97316', bg: '#FFEDD5', to: '/stage/order-processing' },
    { title: '老板决策视角', desc: '看成熟度、店铺健康度、ROI、优先级矩阵', icon: '👔', color: '#D97706', bg: '#FEF3C7', to: '/ceo' },
    { title: '顾问调研视角', desc: '使用访谈问题、调研模板和场景评估卡', icon: '🧭', color: '#06B6D4', bg: '#E0F2FE', to: '/consultant' },
    { title: 'AI小助手', desc: '用自然语言提问，获得模拟回答和知识推荐', icon: '💬', color: '#0F766E', bg: '#CCFBF1', to: '/ai-assistant' },
    { title: '客户实践库', desc: '沉淀真实客户项目、ROI、复盘和可复制打法', icon: '📁', color: '#F97316', bg: '#FEF3C7', to: '/customer-practices' },
  ]

  const LEARNING_PATHS = [
    { title: '业务理解路径', icon: '🌱', color: '#059669', steps: ['平台与模式地图', '业务全流程', '岗位知识库', 'SOP 功能包', 'AI 机会点'] },
    { title: '顾问作战路径', icon: '🧭', color: '#0E7490', steps: ['平台与模式地图', 'AI 机会点', '顾问调研视角', '客户实践库', 'AI 小助手'] },
    { title: '老板决策路径', icon: '👔', color: '#0F3D5E', steps: ['平台与模式地图', '老板决策视角', 'AI 机会点', '业务全流程', '客户实践库'] },
    { title: '个人资产沉淀路径', icon: '📁', color: '#D97706', steps: ['客户实践库', '自定义内容', '我的收藏', '学习进度', 'AI 小助手'] },
  ]

  const USERS = [
    { role: '跨境电商老板', desc: '关注增长、利润、库存、广告 ROI 和现金流', icon: '💼', color: '#0F3D5E', bg: '#ECFEFF' },
    { role: '运营负责人', desc: '统筹选品、Listing、广告、订单、客服和复购', icon: '🎯', color: '#0E7490', bg: '#CFFAFE' },
    { role: 'ITBP / 自动化负责人', desc: '推动 ERP、OMS、WMS、平台后台和 RPA 打通', icon: '📊', color: '#10B981', bg: '#D1FAE5' },
    { role: 'AI / RPA 方案顾问', desc: '建立行业语言，精准定位自动化机会点', icon: '🤖', color: '#F97316', bg: '#FEF3C7' },
    { role: '售前 / 实施顾问', desc: '快速理解跨境客户流程，提升调研质量', icon: '🚀', color: '#06B6D4', bg: '#E0F2FE' },
    { role: '客户成功经理', desc: '沉淀客户实践，挖掘复购和增值场景', icon: '⭐', color: '#EC4899', bg: '#FCE7F3' },
  ]

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Hero ── */}
      <section className="relative rounded-3xl overflow-hidden" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 grid-pattern" />
        {/* Floating orbs */}
        <div className="absolute top-8 right-16 w-40 h-40 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #14B8A6, transparent)', animationDelay: '0s' }} />
        <div className="absolute bottom-4 right-40 w-24 h-24 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #0E7490, transparent)', animationDelay: '2s' }} />
        <div className="absolute top-16 right-64 w-16 h-16 rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)', animationDelay: '4s' }} />

        <div className="relative px-6 sm:px-10 py-12">
          {/* Labels */}
          <div className="inline-flex items-center gap-2 mb-5 animate-slide-up flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#ECFEFF', color: '#0E7490', border: '1px solid #A5F3FC' }}>
              Cross-border E-commerce AI Map
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' }}>
              平台 · 流程 · 岗位 · SOP · AI机会 · 实践
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 animate-slide-up delay-75"
            style={{ color: 'var(--text-1)' }}>
            跨境电商 AI 机会图谱<br />
            <span className="text-gradient-blue">业务认知与自动化场景识别系统</span>
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mb-8 animate-slide-up delay-150"
            style={{ color: 'var(--text-2)' }}>
            覆盖跨境电商平台模式、业务全流程、岗位 SOP、AI 自动化机会、老板决策视角、顾问调研方法与客户实践记录，
            帮助跨境老板、运营负责人、ITBP 和 AI 顾问快速识别业务增长与自动化机会。
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 animate-slide-up delay-200">
            {[
              { value: manufacturingIndustries.length.toString(), label: '业务模式',   color: '#06B6D4', bg: '#E0F2FE' },
              { value: stages.length.toString(),                  label: '流程节点',   color: '#0E7490', bg: '#CFFAFE' },
              { value: totalRoles.toString(),                      label: '岗位角色',   color: '#0F766E', bg: '#CCFBF1' },
              { value: totalAI.toString(),                         label: 'AI机会点',  color: '#F97316', bg: '#FEF3C7' },
              { value: customerPractices.length.toString(),         label: '客户实践',   color: '#10B981', bg: '#D1FAE5' },
            ].map(s => (
              <div key={s.label} className="stat-pill">
                <span className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 系统能力入口 ── */}
      <section className="animate-slide-up delay-200">
        <SectionHeader icon="🚪" title="系统能力入口" subtitle="从行业认知、流程岗位、AI 机会到客户实践沉淀" color="#0E7490" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULE_ENTRIES.map((item, i) => (
            <button
              key={item.title}
              onClick={() => navigate(item.to)}
              className="card card-hover p-4 text-left group animate-scale-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: item.bg, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1 transition-colors group-hover:text-cyan-700" style={{ color: 'var(--text-1)' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 全链路流程图（含视图切换）── */}
      <section className="animate-slide-up delay-200">
        {/* Section header + toggle */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="section-header mb-0">
            <div className="section-header-icon" style={{ background: '#ECFEFF', border: '1px solid #A5F3FC', color: '#0E7490' }}>
              🗺
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>跨境电商业务全流程图</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                市场调研 → 选品 → … → 复购运营 · 17 个核心节点
              </p>
            </div>
          </div>

          {/* View toggle */}
          <div className="tab-bar flex-shrink-0" style={{ padding: 3, gap: 2 }}>
            <button
              onClick={() => setFlowView('diagram')}
              className={`tab-btn ${flowView === 'diagram' ? 'active' : ''}`}
              style={{ fontSize: 12, padding: '6px 12px', gap: 5 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="8" height="8" rx="2" />
                <rect x="14" y="3" width="8" height="8" rx="2" />
                <rect x="2" y="13" width="8" height="8" rx="2" />
                <path d="M10 7h4M22 7v6a4 4 0 01-4 4h-4" strokeLinecap="round" />
              </svg>
              流程图视图
            </button>
            <button
              onClick={() => setFlowView('card')}
              className={`tab-btn ${flowView === 'card' ? 'active' : ''}`}
              style={{ fontSize: 12, padding: '6px 12px', gap: 5 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              卡片视图
            </button>
          </div>
        </div>

        {/* Flow content */}
        <div className="card p-5 sm:p-6">
          {flowView === 'diagram' ? (
            <FlowDiagram />
          ) : (
            <FlowMap />
          )}
        </div>
      </section>

      {/* ── 目标用户 ── */}
      <section className="animate-slide-up delay-300">
        <SectionHeader icon="👥" title="适合哪些人使用" color="#0F3D5E" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USERS.map((item, i) => (
            <div key={item.role} className="card p-4 card-hover group animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: item.bg, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{item.role}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 快速入口 ── */}
      <section className="animate-slide-up delay-300">
        <SectionHeader icon="⚡" title="快速进入业务节点" subtitle="17 个跨境电商核心节点全覆盖" color="#F97316" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {stages.map((stage, i) => {
            const isVisited = progress.visitedStages.includes(stage.id)
            const isCompleted = progress.completedStages.includes(stage.id)
            return (
              <button
                key={stage.id}
                onClick={() => navigate(`/stage/${stage.id}`)}
                className="card card-hover group p-4 text-left flex flex-col gap-3 animate-scale-in"
                style={{
                  animationDelay: `${i * 40}ms`,
                  borderColor: isCompleted ? `${stage.color}50` : undefined,
                  boxShadow: isCompleted ? `0 4px 16px ${stage.color}15` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                    style={{ background: `${stage.color}15`, border: `1.5px solid ${stage.color}30` }}>
                    {stage.icon}
                  </div>
                  {isCompleted
                    ? <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: '#D1FAE5', color: '#059669' }}>✓</span>
                    : isVisited
                    ? <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                    : null}
                </div>
                <div>
                  <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-4)' }}>
                    {String(stage.order).padStart(2, '0')}
                  </p>
                  <p className="text-sm font-semibold leading-tight transition-colors group-hover:text-cyan-700"
                    style={{ color: 'var(--text-1)' }}>
                    {stage.name}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                    {stage.roles.length} 岗位
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${stage.color}12`, color: stage.color, border: `1px solid ${stage.color}25` }}>
                    {stage.aiOpportunities.length} AI
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── 学习路径 ── */}
      <section className="animate-slide-up delay-400 pb-4">
        <SectionHeader icon="📖" title="推荐学习路径" subtitle="按不同角色目标，从认知建立到实践沉淀逐步推进" color="#10B981" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_PATHS.map((path, i) => (
            <div key={path.title} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${path.color}12`, border: `1px solid ${path.color}25` }}>
                  {path.icon}
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{path.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {path.steps.map((step, index) => (
                  <div key={`${path.title}-${step}`} className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: `${path.color}10`, color: path.color, border: `1px solid ${path.color}25` }}>
                      {step}
                    </span>
                    {index < path.steps.length - 1 && <span className="text-xs" style={{ color: 'var(--text-4)' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
      </section>
    </div>
  )
}

function SectionHeader({ icon, title, subtitle, color }: { icon: string; title: string; subtitle?: string; color: string }) {
  return (
    <div className="section-header">
      <div className="section-header-icon" style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

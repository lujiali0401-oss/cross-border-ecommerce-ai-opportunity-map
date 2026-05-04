import { useMemo, useState } from 'react'
import { useAppContext } from '../App'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  chinaCompanyGroups,
  globalCompanyGroups,
  industryComparisons,
  industryOpportunityGroups,
  manufacturingIndustries,
} from '../data/industryMap'
import type { CompanyGroup, ManufacturingIndustry } from '../data/industryMap'

function includesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase())
}

function industrySearchText(industry: ManufacturingIndustry) {
  return [
    industry.name,
    industry.category,
    industry.description,
    ...industry.typicalProducts,
    ...industry.processFeatures,
    ...industry.commonSystems,
    ...industry.typicalRoles,
    ...industry.painPoints,
    ...industry.automationOpportunities,
    ...industry.representativeGlobalCompanies,
    ...industry.representativeChineseCompanies,
  ].join(' ')
}

function formatDate(timestamp: number) {
  if (!timestamp) return '未记录'
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

export default function IndustryMapPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState(manufacturingIndustries[0]?.id ?? '')
  const [visitedIndustries, setVisitedIndustries] = useLocalStorage<Record<string, number>>('industry_map_progress', {})
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const { toggleBookmark, isBookmarked, saveNote, getNote } = useAppContext()

  const selectedIndustry = manufacturingIndustries.find(industry => industry.id === selectedId) ?? manufacturingIndustries[0]
  const normalizedQuery = searchQuery.trim()

  const filteredIndustries = useMemo(() => {
    if (!normalizedQuery) return manufacturingIndustries
    return manufacturingIndustries.filter(industry => includesQuery(industrySearchText(industry), normalizedQuery))
  }, [normalizedQuery])

  const filteredGlobalGroups = useMemo(() => filterCompanyGroups(globalCompanyGroups, normalizedQuery), [normalizedQuery])
  const filteredChinaGroups = useMemo(() => filterCompanyGroups(chinaCompanyGroups, normalizedQuery), [normalizedQuery])
  const totalOpportunities = industryOpportunityGroups.reduce((sum, group) => sum + group.opportunities.length, 0)
  const visitedCount = Object.keys(visitedIndustries).length

  const selectIndustry = (industry: ManufacturingIndustry) => {
    setSelectedId(industry.id)
    setVisitedIndustries(prev => ({ ...prev, [industry.id]: Date.now() }))
  }

  const bookmarkIndustry = (industry: ManufacturingIndustry) => {
    toggleBookmark({
      id: `industry-map-${industry.id}`,
      stageId: `industry-map:${industry.id}`,
      stageName: '平台与模式地图',
      type: 'sop',
      title: industry.name,
      description: industry.description,
    })
  }

  const noteId = (industry: ManufacturingIndustry) => `industry-map-note-${industry.id}`

  const saveIndustryNote = (industry: ManufacturingIndustry) => {
    saveNote(noteId(industry), noteDrafts[industry.id] ?? getNote(noteId(industry)))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="card overflow-hidden animate-slide-up">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0E7490, #10B981, #14B8A6)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ECFEFF, #D1FAE5)', border: '1.5px solid #A5F3FC' }}>
              🌍
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-blue badge">平台模式地图</span>
                <span className="badge-mint badge">平台样本</span>
                <span className="badge-violet badge">自动化机会差异</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-1)' }}>
                平台与模式地图
              </h1>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-2)' }}>
                先理解跨境电商有哪些平台、业务模式和运营差异，再进入流程、岗位、SOP 和 AI 自动化机会点。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: '业务模式', value: manufacturingIndustries.length, icon: '🏭', color: '#0E7490', bg: '#ECFEFF' },
              { label: '常见平台', value: globalCompanyGroups.reduce((sum, group) => sum + group.companies.length, 0), icon: '🌐', color: '#0F3D5E', bg: '#ECFEFF' },
              { label: '典型业务模式', value: chinaCompanyGroups.reduce((sum, group) => sum + group.companies.length, 0), icon: '📍', color: '#059669', bg: '#D1FAE5' },
              { label: 'AI机会点', value: totalOpportunities, icon: '🤖', color: '#D97706', bg: '#FEF3C7' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: stat.bg, border: `1px solid ${stat.color}25` }}>
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[11px]" style={{ color: stat.color }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search / progress */}
      <section className="card p-5 animate-slide-up">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            className="input flex-1"
            placeholder="搜索平台、业务模式、产品、系统或机会点..."
          />
          <div className="rounded-xl px-4 py-3 flex-shrink-0" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>模式学习进度</span>
              <span className="text-sm font-bold font-mono" style={{ color: '#0E7490' }}>{visitedCount}/{manufacturingIndustries.length}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.round((visitedCount / manufacturingIndustries.length) * 100)}%`, background: 'linear-gradient(90deg, #0E7490, #10B981)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Module 1 */}
      <section className="space-y-4 animate-slide-up">
        <SectionHeader icon="🏭" title="业务模式总览" subtitle="点击模式卡片查看完整详情，也会记录学习进度" color="#0E7490" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {manufacturingIndustries.map(industry => (
            <button
              key={industry.id}
              onClick={() => selectIndustry(industry)}
              className="px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-all"
              style={selectedId === industry.id
                ? { background: '#ECFEFF', color: '#0E7490', border: '1.5px solid #A5F3FC' }
                : { background: 'var(--surface)', color: 'var(--text-3)', border: '1.5px solid var(--border)' }
              }
            >
              {industry.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredIndustries.map((industry, index) => {
              const visitedAt = visitedIndustries[industry.id]
              const bookmarked = isBookmarked(`industry-map-${industry.id}`)
              return (
                <button
                  key={industry.id}
                  onClick={() => selectIndustry(industry)}
                  className="card card-hover p-4 text-left animate-scale-in"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    borderColor: selectedId === industry.id ? '#0E749050' : undefined,
                    boxShadow: selectedId === industry.id ? '0 6px 22px rgba(59,130,246,0.14)' : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="badge badge-blue mb-2">{industry.category}</span>
                      <h3 className="text-base font-bold" style={{ color: 'var(--text-1)' }}>{industry.name}</h3>
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: bookmarked ? '#FEF3C7' : 'var(--surface-2)', color: bookmarked ? '#D97706' : 'var(--text-4)' }}>
                      {bookmarked ? '已收藏' : visitedAt ? '已读' : '未读'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-3)' }}>{industry.description}</p>
                  <MiniTagBlock label="典型产品" items={industry.typicalProducts.slice(0, 4)} color="#0E7490" bg="#ECFEFF" />
                  <MiniTagBlock label="常见系统" items={industry.commonSystems.slice(0, 4)} color="#059669" bg="#D1FAE5" />
                  <MiniTagBlock label="AI机会" items={industry.automationOpportunities.slice(0, 3)} color="#0F3D5E" bg="#ECFEFF" />
                </button>
              )
            })}
          </div>

          {selectedIndustry && (
            <aside className="card p-5 h-fit sticky top-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="badge badge-blue">{selectedIndustry.category}</span>
                  <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--text-1)' }}>{selectedIndustry.name}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-4)' }}>
                    最近学习：{formatDate(visitedIndustries[selectedIndustry.id] ?? 0)}
                  </p>
                </div>
                <button
                  onClick={() => bookmarkIndustry(selectedIndustry)}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{
                    background: isBookmarked(`industry-map-${selectedIndustry.id}`) ? '#FEF3C7' : 'var(--surface-2)',
                    color: isBookmarked(`industry-map-${selectedIndustry.id}`) ? '#D97706' : 'var(--text-3)',
                    border: `1px solid ${isBookmarked(`industry-map-${selectedIndustry.id}`) ? '#FDE68A' : 'var(--border)'}`,
                  }}
                >
                  {isBookmarked(`industry-map-${selectedIndustry.id}`) ? '已收藏' : '收藏'}
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>{selectedIndustry.description}</p>
              <DetailBlock title="流程特点" items={selectedIndustry.processFeatures} color="#0E7490" bg="#ECFEFF" />
              <DetailBlock title="典型岗位" items={selectedIndustry.typicalRoles} color="#059669" bg="#D1FAE5" />
              <DetailBlock title="常见痛点" items={selectedIndustry.painPoints} color="#DC2626" bg="#FFE4E6" />
              <DetailBlock title="代表平台 / 打法" items={[...selectedIndustry.representativeGlobalCompanies, ...selectedIndustry.representativeChineseCompanies]} color="#0F3D5E" bg="#ECFEFF" />
              <div className="mt-4 rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#D97706' }}>我的模式笔记</p>
                <textarea
                  value={noteDrafts[selectedIndustry.id] ?? getNote(noteId(selectedIndustry))}
                  onChange={event => setNoteDrafts(prev => ({ ...prev, [selectedIndustry.id]: event.target.value }))}
                  className="input text-xs"
                  rows={3}
                  placeholder="记录这个业务模式的客户样本、典型场景或售前判断..."
                />
                <div className="flex justify-end mt-2">
                  <button onClick={() => saveIndustryNote(selectedIndustry)} className="btn-primary text-xs">保存笔记</button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Module 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanySection title="常见跨境平台与工具" icon="🌐" groups={filteredGlobalGroups} color="#0F3D5E" />
        <CompanySection title="典型跨境业务打法" icon="📍" groups={filteredChinaGroups} color="#059669" />
      </div>

      {/* Module 4 */}
      <section className="animate-slide-up">
        <SectionHeader icon="📊" title="不同模式业务差异对比" subtitle="用业务特征、痛点、系统和 AI 机会快速建立模式差异感" color="#D97706" />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead style={{ background: 'var(--surface-2)' }}>
                <tr>
                  {['业务模式', '核心业务特征', '典型痛点', '重点系统', 'AI/自动化机会'].map(head => (
                    <th key={head} className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {industryComparisons.map(item => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-1)', borderBottom: '1px solid var(--border)' }}>{item.industry}</td>
                    <TableTags items={item.businessFeatures} color="#0E7490" bg="#ECFEFF" />
                    <TableTags items={item.painPoints} color="#DC2626" bg="#FFE4E6" />
                    <TableTags items={item.keySystems} color="#059669" bg="#D1FAE5" />
                    <TableTags items={item.aiOpportunities} color="#0F3D5E" bg="#ECFEFF" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 5 */}
      <section className="animate-slide-up pb-6">
        <SectionHeader icon="🤖" title="不同模式 AI / 自动化机会点" subtitle="面向 ITBP、老板和解决方案顾问的第一批切入场景" color="#0F3D5E" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {industryOpportunityGroups.map(group => (
            <div key={group.id} className="card p-4 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#ECFEFF', border: '1px solid #BAE6FD' }}>✨</div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{group.industry}</h3>
              </div>
              <ul className="space-y-2">
                {group.opportunities.map((item, index) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: '#ECFEFF', color: '#0F3D5E' }}>{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function filterCompanyGroups(groups: CompanyGroup[], query: string) {
  if (!query) return groups
  return groups
    .map(group => {
      const categoryMatched = includesQuery(group.category, query)
      const companies = categoryMatched ? group.companies : group.companies.filter(company => includesQuery(company, query))
      return { ...group, companies }
    })
    .filter(group => group.companies.length > 0 || includesQuery(group.category, query))
}

function SectionHeader({ icon, title, subtitle, color }: { icon: string; title: string; subtitle: string; color: string }) {
  return (
    <div className="section-header">
      <div className="section-header-icon" style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>{icon}</div>
      <div>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{title}</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{subtitle}</p>
      </div>
    </div>
  )
}

function MiniTagBlock({ label, items, color, bg }: { label: string; items: string[]; color: string; bg: string }) {
  return (
    <div className="mb-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-4)' }}>{label}</p>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <span key={item} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: bg, color, border: `1px solid ${color}25` }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function DetailBlock({ title, items, color, bg }: { title: string; items: string[]; color: string; bg: string }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color }}>{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="text-[11px] px-2 py-1 rounded-full" style={{ background: bg, color, border: `1px solid ${color}25` }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function CompanySection({ title, icon, groups, color }: { title: string; icon: string; groups: CompanyGroup[]; color: string }) {
  return (
    <section className="animate-slide-up">
      <SectionHeader icon={icon} title={title} subtitle="按平台或业务打法分类展示代表样本，不做完整排行" color={color} />
      <div className="card p-5 space-y-3">
        {groups.length === 0 ? (
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>没有匹配的平台或业务模式</p>
          </div>
        ) : groups.map(group => (
          <div key={group.id} className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-1)' }}>{group.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.companies.map(company => (
                <span key={company} className="text-[11px] px-2 py-1 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{company}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TableTags({ items, color, bg }: { items: string[]; color: string; bg: string }) {
  return (
    <td className="px-4 py-3 align-top" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="text-[11px] px-2 py-1 rounded-full" style={{ background: bg, color, border: `1px solid ${color}25` }}>{item}</span>
        ))}
      </div>
    </td>
  )
}

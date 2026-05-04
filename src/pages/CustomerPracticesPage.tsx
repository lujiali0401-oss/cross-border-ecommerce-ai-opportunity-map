import { FormEvent, useMemo, useState } from 'react'
import { useAppContext } from '../App'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  PRACTICE_OPPORTUNITY_TYPES,
  PRACTICE_STATUSES,
  sampleCustomerPractices,
} from '../data/customerPractices'
import type { CustomerPractice, PracticeOpportunityType, PracticeStatus } from '../data/customerPractices'

type FormState = Record<keyof CustomerPractice, string | boolean>

interface FieldConfig {
  key: keyof CustomerPractice
  label: string
  required?: boolean
  multiline?: boolean
  multi?: boolean
  type?: 'checkbox' | 'select' | 'date'
  options?: string[]
}

interface FieldGroup {
  title: string
  icon: string
  color: string
  fields: FieldConfig[]
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: '基础信息',
    icon: '🏢',
    color: '#0E7490',
    fields: [
      { key: 'projectName', label: '项目名称', required: true },
      { key: 'customerName', label: '客户名称' },
      { key: 'anonymous', label: '是否匿名', type: 'checkbox' },
      { key: 'industry', label: '客户行业', required: true },
      { key: 'companySize', label: '企业规模' },
      { key: 'customerType', label: '客户类型' },
      { key: 'status', label: '项目状态', required: true, type: 'select', options: PRACTICE_STATUSES },
      { key: 'date', label: '记录日期', type: 'date' },
    ],
  },
  {
    title: '业务背景',
    icon: '🧭',
    color: '#059669',
    fields: [
      { key: 'businessBackground', label: '业务背景', multiline: true },
      { key: 'relatedProcesses', label: '涉及流程', multi: true, multiline: true },
      { key: 'relatedRoles', label: '涉及岗位', multi: true, multiline: true },
      { key: 'relatedSystems', label: '使用系统', multi: true, multiline: true },
    ],
  },
  {
    title: '问题与痛点',
    icon: '⚠️',
    color: '#DC2626',
    fields: [
      { key: 'originalManualProcess', label: '原人工流程', multiline: true },
      { key: 'painPoints', label: '核心痛点', required: true, multi: true, multiline: true },
      { key: 'impactScope', label: '影响范围', multiline: true },
      { key: 'baselineMetrics', label: '业务指标基线', multiline: true },
    ],
  },
  {
    title: '解决方案',
    icon: '🛠',
    color: '#0F3D5E',
    fields: [
      { key: 'solution', label: '解决方案', required: true, multiline: true },
      { key: 'opportunityType', label: '自动化 / AI 场景', type: 'select', options: PRACTICE_OPPORTUNITY_TYPES },
      { key: 'implementationActions', label: '方案动作', multi: true, multiline: true },
      { key: 'tools', label: '涉及工具 / 技术', multi: true, multiline: true },
      { key: 'dataSources', label: '数据来源', multi: true, multiline: true },
    ],
  },
  {
    title: '项目结果',
    icon: '📈',
    color: '#D97706',
    fields: [
      { key: 'results', label: '上线效果', multiline: true },
      { key: 'roiData', label: 'ROI 数据', multiline: true },
      { key: 'timeSaved', label: '节省时间' },
      { key: 'manpowerSaved', label: '节省人力' },
      { key: 'revenueImpact', label: '收入提升' },
      { key: 'errorRateChange', label: '错误率变化' },
    ],
  },
  {
    title: '复盘沉淀',
    icon: '🧠',
    color: '#0284C7',
    fields: [
      { key: 'successLessons', label: '成功经验', multi: true, multiline: true },
      { key: 'challenges', label: '踩坑问题', multi: true, multiline: true },
      { key: 'reusablePlaybook', label: '可复制打法', multi: true, multiline: true },
      { key: 'nextOpportunities', label: '下一步机会', multi: true, multiline: true },
      { key: 'tags', label: '标签', multi: true, multiline: true },
      { key: 'notes', label: '备注', multiline: true },
    ],
  },
]

const ARRAY_FIELDS = new Set<keyof CustomerPractice>([
  'relatedProcesses',
  'relatedRoles',
  'relatedSystems',
  'painPoints',
  'implementationActions',
  'tools',
  'dataSources',
  'successLessons',
  'challenges',
  'reusablePlaybook',
  'nextOpportunities',
  'tags',
])

function emptyForm(): FormState {
  return {
    id: '',
    projectName: '',
    customerName: '',
    anonymous: true,
    industry: '',
    companySize: '',
    customerType: '',
    status: '调研中',
    date: new Date().toISOString().slice(0, 10),
    businessBackground: '',
    relatedProcesses: '',
    relatedRoles: '',
    relatedSystems: '',
    originalManualProcess: '',
    painPoints: '',
    impactScope: '',
    baselineMetrics: '',
    solution: '',
    opportunityType: '流程自动化',
    implementationActions: '',
    tools: '',
    dataSources: '',
    results: '',
    roiData: '',
    timeSaved: '',
    manpowerSaved: '',
    revenueImpact: '',
    errorRateChange: '',
    successLessons: '',
    challenges: '',
    reusablePlaybook: '',
    nextOpportunities: '',
    tags: '',
    notes: '',
    createdAt: '',
    updatedAt: '',
  }
}

function makeId() {
  return `practice-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function linesToArray(value: string | boolean) {
  return String(value || '').split('\n').map(line => line.trim()).filter(Boolean)
}

function itemToForm(item: CustomerPractice): FormState {
  const form = emptyForm()
  Object.keys(form).forEach(key => {
    const typedKey = key as keyof CustomerPractice
    const value = item[typedKey]
    form[typedKey] = Array.isArray(value) ? value.join('\n') : (value ?? '') as string | boolean
  })
  return form
}

function buildPractice(form: FormState, existing?: CustomerPractice): CustomerPractice {
  const now = new Date().toISOString()
  return {
    id: existing?.id ?? makeId(),
    projectName: String(form.projectName).trim(),
    customerName: String(form.customerName || '').trim(),
    anonymous: Boolean(form.anonymous),
    industry: String(form.industry).trim(),
    companySize: String(form.companySize || '').trim(),
    customerType: String(form.customerType || '').trim(),
    status: form.status as PracticeStatus,
    date: String(form.date || new Date().toISOString().slice(0, 10)),
    businessBackground: String(form.businessBackground || '').trim(),
    relatedProcesses: linesToArray(form.relatedProcesses),
    relatedRoles: linesToArray(form.relatedRoles),
    relatedSystems: linesToArray(form.relatedSystems),
    originalManualProcess: String(form.originalManualProcess || '').trim(),
    painPoints: linesToArray(form.painPoints),
    impactScope: String(form.impactScope || '').trim(),
    baselineMetrics: String(form.baselineMetrics || '').trim(),
    solution: String(form.solution).trim(),
    opportunityType: form.opportunityType as PracticeOpportunityType,
    implementationActions: linesToArray(form.implementationActions),
    tools: linesToArray(form.tools),
    dataSources: linesToArray(form.dataSources),
    results: String(form.results || '').trim(),
    roiData: String(form.roiData || '').trim(),
    timeSaved: String(form.timeSaved || '').trim(),
    manpowerSaved: String(form.manpowerSaved || '').trim(),
    revenueImpact: String(form.revenueImpact || '').trim(),
    errorRateChange: String(form.errorRateChange || '').trim(),
    successLessons: linesToArray(form.successLessons),
    challenges: linesToArray(form.challenges),
    reusablePlaybook: linesToArray(form.reusablePlaybook),
    nextOpportunities: linesToArray(form.nextOpportunities),
    tags: linesToArray(form.tags),
    notes: String(form.notes || '').trim(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}

function displayCustomer(item: CustomerPractice) {
  if (item.anonymous) return item.industry ? `${item.industry}客户` : '匿名客户'
  return item.customerName || '未填写客户'
}

function formatDate(value: string) {
  if (!value) return '未记录'
  return new Date(value).toLocaleDateString('zh-CN')
}

function searchableText(item: CustomerPractice) {
  return JSON.stringify(item).toLowerCase()
}

function hasRoi(item: CustomerPractice) {
  return Boolean(item.roiData || item.timeSaved || item.manpowerSaved || item.revenueImpact || item.errorRateChange)
}

export default function CustomerPracticesPage() {
  const [practices, setPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)
  const [form, setForm] = useState<FormState>(() => emptyForm())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(sampleCustomerPractices[0]?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [roiFilter, setRoiFilter] = useState('全部')
  const [error, setError] = useState('')
  const [tip, setTip] = useState('')
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const { toggleBookmark, isBookmarked, saveNote, getNote } = useAppContext()

  const industries = useMemo(() => ['全部', ...Array.from(new Set(practices.map(item => item.industry).filter(Boolean)))], [practices])
  const selectedPractice = practices.find(item => item.id === selectedId) ?? practices[0]

  const stats = [
    { label: '客户实践总数', value: practices.length, icon: '📁', color: '#0E7490', bg: '#ECFEFF' },
    { label: '涉及行业', value: new Set(practices.map(item => item.industry).filter(Boolean)).size, icon: '🏭', color: '#059669', bg: '#D1FAE5' },
    { label: '涉及流程', value: new Set(practices.flatMap(item => item.relatedProcesses)).size, icon: '🗺', color: '#0F3D5E', bg: '#ECFEFF' },
    { label: '已验证场景', value: practices.filter(item => ['已上线', '已复盘'].includes(item.status)).length, icon: '✅', color: '#D97706', bg: '#FEF3C7' },
    { label: '有 ROI 数据', value: practices.filter(hasRoi).length, icon: '📈', color: '#0284C7', bg: '#E0F2FE' },
  ]

  const filteredPractices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return practices.filter(item => {
      const matchSearch = !query || searchableText(item).includes(query)
      const matchIndustry = industryFilter === '全部' || item.industry === industryFilter
      const matchStatus = statusFilter === '全部' || item.status === statusFilter
      const matchType = typeFilter === '全部' || item.opportunityType === typeFilter
      const matchRoi = roiFilter === '全部' || (roiFilter === '有 ROI' ? hasRoi(item) : !hasRoi(item))
      return matchSearch && matchIndustry && matchStatus && matchType && matchRoi
    })
  }, [industryFilter, practices, roiFilter, searchQuery, statusFilter, typeFilter])

  const updateField = (key: keyof CustomerPractice, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const required: Array<keyof CustomerPractice> = ['projectName', 'industry', 'status', 'painPoints', 'solution']
    const missing = required.find(key => !String(form[key] || '').trim())
    if (missing) {
      const labels: Record<string, string> = {
        projectName: '项目名称',
        industry: '客户行业',
        status: '项目状态',
        painPoints: '核心痛点',
        solution: '解决方案',
      }
      setError(`请先填写必填字段：${labels[missing]}`)
      setTip('')
      return
    }

    const existing = practices.find(item => item.id === editingId)
    const practice = buildPractice(form, existing)
    if (existing) {
      setPractices(prev => prev.map(item => item.id === existing.id ? practice : item))
      setTip('客户实践已更新')
    } else {
      setPractices(prev => [practice, ...prev])
      setTip('客户实践已保存')
    }
    setSelectedId(practice.id)
    resetForm()
    setTimeout(() => setTip(''), 2000)
  }

  const editPractice = (item: CustomerPractice) => {
    setEditingId(item.id)
    setForm(itemToForm(item))
    setSelectedId(item.id)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deletePractice = (item: CustomerPractice) => {
    if (!confirm(`确定删除「${item.projectName}」吗？此操作不可撤销。`)) return
    setPractices(prev => prev.filter(current => current.id !== item.id))
    if (selectedId === item.id) setSelectedId(null)
    if (editingId === item.id) resetForm()
  }

  const bookmarkPractice = (item: CustomerPractice) => {
    toggleBookmark({
      id: `customer-practice-${item.id}`,
      stageId: `customer-practice:${item.id}`,
      stageName: '客户实践库',
      type: 'ai',
      title: item.projectName,
      description: `${item.industry} · ${item.solution}`,
    })
  }

  const noteId = (item: CustomerPractice) => `customer-practice-note-${item.id}`
  const savePracticeNote = (item: CustomerPractice) => {
    saveNote(noteId(item), noteDrafts[item.id] ?? getNote(noteId(item)))
    setTip('笔记已保存')
    setTimeout(() => setTip(''), 1600)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <section className="card overflow-hidden animate-slide-up">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0E7490, #10B981, #14B8A6)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ECFEFF, #D1FAE5)', border: '1.5px solid #A5F3FC' }}>
              📁
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="badge-blue badge">真实项目经验</span>
                <span className="badge-mint badge">解决方案资产</span>
                <span className="badge-violet badge">本地保存</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>客户实践库</h1>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-2)' }}>
                沉淀真实客户项目中的行业、流程、岗位、痛点、解决方案、ROI 和复盘经验，把每一次客户实践转化为可复用的跨境电商解决方案资产。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {stats.map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: stat.bg, border: `1px solid ${stat.color}25` }}>
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[11px]" style={{ color: stat.color }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-5 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="input md:col-span-2" placeholder="搜索项目、行业、痛点、方案、标签..." />
          <FilterSelect value={industryFilter} onChange={setIndustryFilter} options={industries} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['全部', ...PRACTICE_STATUSES]} />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={['全部', ...PRACTICE_OPPORTUNITY_TYPES]} />
          <FilterSelect value={roiFilter} onChange={setRoiFilter} options={['全部', '有 ROI', '无 ROI']} />
        </div>
      </section>

      <section className="card overflow-hidden animate-slide-up">
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{editingId ? '编辑客户实践' : '新增客户实践'}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>多项字段一行一个，保存后会转为数组。</p>
          </div>
          <button onClick={resetForm} className="btn-secondary text-xs">清空表单</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {FIELD_GROUPS.map(group => (
            <div key={group.title}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${group.color}12`, border: `1px solid ${group.color}25` }}>{group.icon}</span>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{group.title}</h3>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map(field => (
                  <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                    <span className="text-xs font-semibold mb-1.5 inline-flex gap-1" style={{ color: 'var(--text-2)' }}>
                      {field.label}{field.required && <span style={{ color: '#DC2626' }}>*</span>}
                    </span>
                    {field.type === 'checkbox' ? (
                      <div className="h-[42px] flex items-center gap-2 px-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)' }}>
                        <input type="checkbox" checked={Boolean(form[field.key])} onChange={event => updateField(field.key, event.target.checked)} />
                        <span className="text-sm" style={{ color: 'var(--text-2)' }}>匿名展示客户名称</span>
                      </div>
                    ) : field.type === 'select' ? (
                      <select value={String(form[field.key] ?? '')} onChange={event => updateField(field.key, event.target.value)} className="input">
                        {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : field.multiline ? (
                      <textarea value={String(form[field.key] ?? '')} onChange={event => updateField(field.key, event.target.value)} className="input" rows={field.multi ? 3 : 4} placeholder={field.multi ? '一行一个' : ''} />
                    ) : (
                      <input type={field.type === 'date' ? 'date' : 'text'} value={String(form[field.key] ?? '')} onChange={event => updateField(field.key, event.target.value)} className="input" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {(error || tip) && (
            <div className="rounded-xl p-3 text-xs" style={error ? { background: '#FFF5F5', color: '#991B1B', border: '1px solid #FECDD3' } : { background: '#D1FAE5', color: '#047857', border: '1px solid #A7F3D0' }}>
              {error || tip}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {editingId && <button type="button" onClick={resetForm} className="btn-secondary">取消编辑</button>}
            <button type="submit" className="btn-primary">{editingId ? '保存修改' : '保存客户实践'}</button>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6">
        <section className="space-y-3 animate-slide-up">
          <SectionHeader icon="📁" title="客户实践列表" subtitle={`共 ${practices.length} 条，当前显示 ${filteredPractices.length} 条`} color="#0E7490" />
          {filteredPractices.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>没有匹配的客户实践，调整筛选条件试试。</p>
            </div>
          ) : filteredPractices.map(item => (
            <article key={item.id} className="card p-4 card-hover">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#ECFEFF', border: '1px solid #A5F3FC' }}>📁</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="badge badge-blue">{item.status}</span>
                    <span className="badge badge-violet">{item.opportunityType}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{displayCustomer(item)}</span>
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{item.projectName}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{item.industry} · {formatDate(item.date)}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    <SummaryBlock label="核心痛点" text={item.painPoints[0] ?? '暂无'} color="#DC2626" bg="#FFF5F5" />
                    <SummaryBlock label="解决方案" text={item.solution} color="#0F3D5E" bg="#F5F3FF" />
                  </div>
                  <MiniTagRow label="流程" items={item.relatedProcesses} color="#0E7490" bg="#ECFEFF" />
                  <MiniTagRow label="岗位" items={item.relatedRoles} color="#059669" bg="#D1FAE5" />
                  <MiniTagRow label="标签" items={item.tags} color="#D97706" bg="#FEF3C7" />
                  <p className="text-[11px] mt-2" style={{ color: 'var(--text-4)' }}>
                    ROI：{item.roiData || item.timeSaved || item.manpowerSaved || '暂无 ROI 数据'} · 更新 {formatDate(item.updatedAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => setSelectedId(item.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#EFF6FF', color: '#0E7490', border: '1px solid #A5F3FC' }}>查看详情</button>
                    <button onClick={() => editPractice(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD' }}>编辑</button>
                    <button onClick={() => deletePractice(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#FFF5F5', color: '#DC2626', border: '1px solid #FECDD3' }}>删除</button>
                    <button onClick={() => bookmarkPractice(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{
                      background: isBookmarked(`customer-practice-${item.id}`) ? '#FEF3C7' : 'var(--surface-2)',
                      color: isBookmarked(`customer-practice-${item.id}`) ? '#D97706' : 'var(--text-3)',
                      border: `1px solid ${isBookmarked(`customer-practice-${item.id}`) ? '#FDE68A' : 'var(--border)'}`,
                    }}>{isBookmarked(`customer-practice-${item.id}`) ? '已收藏' : '收藏'}</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {selectedPractice && (
          <aside className="card p-5 h-fit sticky top-4 animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="badge badge-blue">{selectedPractice.status}</span>
                <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--text-1)' }}>{selectedPractice.projectName}</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{displayCustomer(selectedPractice)} · {selectedPractice.opportunityType}</p>
              </div>
              <button onClick={() => bookmarkPractice(selectedPractice)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>收藏</button>
            </div>
            <DetailSection title="项目概览" items={[`行业：${selectedPractice.industry}`, `企业规模：${selectedPractice.companySize || '未记录'}`, `客户类型：${selectedPractice.customerType || '未记录'}`, `记录日期：${selectedPractice.date}`]} />
            <DetailText title="业务背景" text={selectedPractice.businessBackground} />
            <DetailText title="原流程与痛点" text={selectedPractice.originalManualProcess} list={selectedPractice.painPoints} />
            <DetailText title="解决方案" text={selectedPractice.solution} list={selectedPractice.implementationActions} />
            <DetailSection title="项目结果与 ROI" items={[selectedPractice.results, selectedPractice.roiData, selectedPractice.timeSaved, selectedPractice.manpowerSaved, selectedPractice.revenueImpact, selectedPractice.errorRateChange].filter(Boolean) as string[]} />
            <DetailText title="复盘沉淀" list={[...selectedPractice.successLessons, ...selectedPractice.challenges]} />
            <DetailText title="可复制打法" list={selectedPractice.reusablePlaybook} />
            <DetailText title="下一步机会" list={selectedPractice.nextOpportunities} />
            <div className="rounded-xl p-3 mt-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#D97706' }}>实践笔记</p>
              <textarea
                value={noteDrafts[selectedPractice.id] ?? getNote(noteId(selectedPractice))}
                onChange={event => setNoteDrafts(prev => ({ ...prev, [selectedPractice.id]: event.target.value }))}
                className="input text-xs"
                rows={3}
                placeholder="记录补充判断、复盘结论或下次客户沟通重点..."
              />
              <div className="flex justify-end mt-2">
                <button onClick={() => savePracticeNote(selectedPractice)} className="btn-primary text-xs">保存笔记</button>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-4)' }}>
                TODO：后续如果扩展学习进度模型，可将客户实践详情浏览纳入统一学习进度。
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={event => onChange(event.target.value)} className="input">
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  )
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

function SummaryBlock({ label, text, color, bg }: { label: string; text: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: bg, border: `1px solid ${color}25` }}>
      <p className="text-[10px] font-semibold mb-1" style={{ color }}>{label}</p>
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-2)' }}>{text || '暂无'}</p>
    </div>
  )
}

function MiniTagRow({ label, items, color, bg }: { label: string; items: string[]; color: string; bg: string }) {
  if (!items.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-4)' }}>{label}</span>
      {items.slice(0, 5).map(item => (
        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: bg, color, border: `1px solid ${color}25` }}>{item}</span>
      ))}
    </div>
  )
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-4)' }}>{title}</p>
      <div className="space-y-1.5">
        {items.map(item => (
          <p key={item} className="text-xs leading-relaxed rounded-lg px-3 py-2" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{item}</p>
        ))}
      </div>
    </div>
  )
}

function DetailText({ title, text, list }: { title: string; text?: string; list?: string[] }) {
  if (!text && !list?.length) return null
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-4)' }}>{title}</p>
      {text && <p className="text-xs leading-relaxed rounded-lg px-3 py-2 mb-2" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{text}</p>}
      {list && list.length > 0 && (
        <ul className="space-y-1.5">
          {list.map(item => <li key={item} className="text-xs leading-relaxed flex gap-2" style={{ color: 'var(--text-2)' }}><span style={{ color: '#0E7490' }}>•</span>{item}</li>)}
        </ul>
      )}
    </div>
  )
}

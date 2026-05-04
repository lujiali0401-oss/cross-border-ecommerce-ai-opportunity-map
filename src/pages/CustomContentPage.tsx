import { FormEvent, useMemo, useState } from 'react'
import { useAppContext } from '../App'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { BookmarkItem } from '../types'

type ContentType = 'process' | 'role' | 'opportunity' | 'rolePackage' | 'sop'
type CustomSource = 'custom' | 'copied'
type CustomValue = string | string[] | number

interface CustomItem {
  id: string
  type: ContentType
  createdAt: number
  updatedAt: number
  source: CustomSource
  [key: string]: CustomValue
}

interface FieldConfig {
  key: string
  label: string
  required?: boolean
  multiline?: boolean
  multi?: boolean
  placeholder?: string
  options?: string[]
}

interface TypeConfig {
  id: ContentType
  label: string
  icon: string
  color: string
  bg: string
  border: string
  storageKey: string
  fields: FieldConfig[]
}

type SetItems = (value: CustomItem[] | ((prev: CustomItem[]) => CustomItem[])) => void

const TYPE_CONFIGS: TypeConfig[] = [
  {
    id: 'process',
    label: '流程节点',
    icon: '🗺',
    color: '#0E7490',
    bg: '#ECFEFF',
    border: '#A5F3FC',
    storageKey: 'custom_processes',
    fields: [
      { key: 'name', label: '阶段名称', required: true, placeholder: '例如：多平台订单同步流程' },
      { key: 'description', label: '阶段说明', required: true, multiline: true, placeholder: '说明这个流程解决什么问题、在链路中承担什么作用' },
      { key: 'stage', label: '所属阶段', placeholder: '例如：订单处理 / 客服售后' },
      { key: 'departments', label: '主要参与部门', multi: true, multiline: true, placeholder: '一行一个部门' },
      { key: 'roles', label: '涉及岗位', multi: true, multiline: true, placeholder: '一行一个岗位' },
      { key: 'inputs', label: '关键输入', multi: true, multiline: true },
      { key: 'outputs', label: '关键输出', multi: true, multiline: true },
      { key: 'systems', label: '常见系统', multi: true, multiline: true },
      { key: 'painPoints', label: '常见痛点', multi: true, multiline: true },
      { key: 'automationOpportunities', label: '自动化机会点', multi: true, multiline: true },
      { key: 'aiOpportunities', label: 'AI 化机会点', multi: true, multiline: true },
      { key: 'relatedSops', label: '相关 SOP', multi: true, multiline: true },
      { key: 'notes', label: '备注', multiline: true },
    ],
  },
  {
    id: 'role',
    label: '岗位',
    icon: '👤',
    color: '#059669',
    bg: '#D1FAE5',
    border: '#A7F3D0',
    storageKey: 'custom_roles',
    fields: [
      { key: 'name', label: '岗位名称', required: true, placeholder: '例如：库存计划 计划员' },
      { key: 'department', label: '所属部门', required: true, placeholder: '例如：补货计划部' },
      { key: 'positionInFlow', label: '岗位定位', required: true, multiline: true, placeholder: '说明这个岗位在业务链路中连接哪些环节' },
      { key: 'responsibilities', label: '核心职责', multi: true, multiline: true },
      { key: 'dailyWorkflow', label: '日常工作流程', multi: true, multiline: true },
      { key: 'weeklyWorkflow', label: '每周工作内容', multi: true, multiline: true },
      { key: 'monthlyWorkflow', label: '每月工作内容', multi: true, multiline: true },
      { key: 'collaborators', label: '关键协作对象', multi: true, multiline: true },
      { key: 'systems', label: '常用系统', multi: true, multiline: true },
      { key: 'kpis', label: '关键指标', multi: true, multiline: true },
      { key: 'painPoints', label: '常见痛点', multi: true, multiline: true },
      { key: 'automationOpportunities', label: '自动化机会点', multi: true, multiline: true },
      { key: 'aiOpportunities', label: 'AI 化机会点', multi: true, multiline: true },
      { key: 'notes', label: '备注', multiline: true },
    ],
  },
  {
    id: 'opportunity',
    label: '机会点',
    icon: '🤖',
    color: '#0F3D5E',
    bg: '#ECFEFF',
    border: '#BAE6FD',
    storageKey: 'custom_opportunities',
    fields: [
      { key: 'name', label: '场景名称', required: true, placeholder: '例如：缺货预警自动化' },
      { key: 'category', label: '场景类型', required: true, placeholder: '例如：RPA / AI / 数据分析 / IoT' },
      { key: 'relatedProcess', label: '所属流程' },
      { key: 'relatedRoles', label: '涉及岗位', multi: true, multiline: true },
      { key: 'currentManualProcess', label: '当前人工做法', multiline: true },
      { key: 'painPoint', label: '核心痛点', required: true, multiline: true },
      { key: 'automationMethod', label: '自动化方式', multiline: true },
      { key: 'aiMethod', label: 'AI 化方式', multiline: true },
      { key: 'requiredData', label: '所需数据', multi: true, multiline: true },
      { key: 'relatedSystems', label: '涉及系统', multi: true, multiline: true },
      { key: 'expectedValue', label: '预期价值', required: true, multiline: true },
      { key: 'roiLogic', label: 'ROI 判断', multiline: true },
      { key: 'difficulty', label: '落地难度', options: ['低', '中', '高'] },
      { key: 'priority', label: '推荐优先级', options: ['低', '中', '高'] },
      { key: 'implementationNotes', label: '实施注意事项', multi: true, multiline: true },
      { key: 'notes', label: '备注', multiline: true },
    ],
  },
  {
    id: 'rolePackage',
    label: '岗位功能包',
    icon: '🧩',
    color: '#0284C7',
    bg: '#E0F2FE',
    border: '#BAE6FD',
    storageKey: 'custom_role_packages',
    fields: [
      { key: 'title', label: '功能包标题', required: true, placeholder: '例如：库存计划 计划员上手包' },
      { key: 'roleName', label: '对应岗位', required: true },
      { key: 'roleSummary', label: '岗位简介', required: true, multiline: true },
      { key: 'positionInFlow', label: '岗位在链路中的位置', multiline: true },
      { key: 'dailyTasks', label: '每日任务', multi: true, multiline: true },
      { key: 'weeklyTasks', label: '每周任务', multi: true, multiline: true },
      { key: 'monthlyTasks', label: '每月任务', multi: true, multiline: true },
      { key: 'sops', label: '核心 SOP', multi: true, multiline: true },
      { key: 'commonForms', label: '常用表单', multi: true, multiline: true },
      { key: 'commonSystems', label: '常用系统', multi: true, multiline: true },
      { key: 'collaborators', label: '协作部门', multi: true, multiline: true },
      { key: 'commonProblems', label: '常见问题', multi: true, multiline: true },
      { key: 'onboardingChecklist', label: '新人上手清单', multi: true, multiline: true },
      { key: 'aiToolSuggestions', label: 'AI 工具建议', multi: true, multiline: true },
      { key: 'sevenDayLearningPath', label: '7 天学习路径', multi: true, multiline: true },
      { key: 'thirtyDayGoals', label: '30 天掌握目标', multi: true, multiline: true },
    ],
  },
  {
    id: 'sop',
    label: 'SOP',
    icon: '📋',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FDE68A',
    storageKey: 'custom_sops',
    fields: [
      { key: 'name', label: 'SOP 名称', required: true },
      { key: 'role', label: '适用岗位', required: true },
      { key: 'process', label: '适用流程' },
      { key: 'scenario', label: '适用场景' },
      { key: 'steps', label: '操作步骤', required: true, multi: true, multiline: true, placeholder: '一行一个步骤' },
      { key: 'inputs', label: '输入信息', multi: true, multiline: true },
      { key: 'outputs', label: '输出结果', multi: true, multiline: true },
      { key: 'notes', label: '注意事项', multi: true, multiline: true },
      { key: 'exceptions', label: '常见异常', multi: true, multiline: true },
      { key: 'exceptionHandling', label: '异常处理方式', multi: true, multiline: true },
      { key: 'automationOpportunities', label: '可自动化机会', multi: true, multiline: true },
      { key: 'remark', label: '备注', multiline: true },
    ],
  },
]

const TYPE_LABELS = TYPE_CONFIGS.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as Record<ContentType, TypeConfig>)

function makeId(type: ContentType) {
  return `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function emptyForm(config: TypeConfig) {
  return config.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.options?.[0] ?? ''
    return acc
  }, {})
}

function linesToArray(value: string) {
  return value.split('\n').map(line => line.trim()).filter(Boolean)
}

function valueToText(value: CustomValue | undefined) {
  return Array.isArray(value) ? value.join('\n') : String(value ?? '')
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function titleOf(item: CustomItem) {
  return String(item.title || item.name || item.roleName || '未命名内容')
}

function summaryOf(item: CustomItem) {
  return String(
    item.description ||
    item.positionInFlow ||
    item.roleSummary ||
    item.painPoint ||
    item.currentManualProcess ||
    item.steps ||
    item.notes ||
    item.remark ||
    '暂无摘要'
  )
}

function tagsOf(item: CustomItem) {
  const candidates = [
    item.stage,
    item.department,
    item.category,
    item.relatedProcess,
    item.role,
    item.process,
    item.difficulty,
    item.priority,
  ]
  return candidates.map(value => String(value || '').trim()).filter(Boolean).slice(0, 4)
}

function bookmarkType(type: ContentType): BookmarkItem['type'] {
  if (type === 'opportunity') return 'ai_opportunity'
  if (type === 'role' || type === 'rolePackage') return 'role'
  if (type === 'process' || type === 'sop') return 'sop'
  return 'ai'
}

export default function CustomContentPage() {
  const [activeType, setActiveType] = useState<ContentType>('process')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Record<string, string>>(() => emptyForm(TYPE_CONFIGS[0]))
  const [error, setError] = useState('')
  const [savedTip, setSavedTip] = useState('')
  const [openNoteId, setOpenNoteId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState('')

  const [customProcesses, setCustomProcesses] = useLocalStorage<CustomItem[]>('custom_processes', [])
  const [customRoles, setCustomRoles] = useLocalStorage<CustomItem[]>('custom_roles', [])
  const [customOpportunities, setCustomOpportunities] = useLocalStorage<CustomItem[]>('custom_opportunities', [])
  const [customRolePackages, setCustomRolePackages] = useLocalStorage<CustomItem[]>('custom_role_packages', [])
  const [customSops, setCustomSops] = useLocalStorage<CustomItem[]>('custom_sops', [])
  const { toggleBookmark, isBookmarked, saveNote, getNote } = useAppContext()

  const stores: Record<ContentType, { items: CustomItem[]; setItems: SetItems }> = {
    process: { items: customProcesses, setItems: setCustomProcesses },
    role: { items: customRoles, setItems: setCustomRoles },
    opportunity: { items: customOpportunities, setItems: setCustomOpportunities },
    rolePackage: { items: customRolePackages, setItems: setCustomRolePackages },
    sop: { items: customSops, setItems: setCustomSops },
  }

  const activeConfig = TYPE_LABELS[activeType]
  const activeStore = stores[activeType]

  const stats = [
    { label: '自定义流程', value: customProcesses.length, config: TYPE_LABELS.process },
    { label: '自定义岗位', value: customRoles.length, config: TYPE_LABELS.role },
    { label: '自定义机会点', value: customOpportunities.length, config: TYPE_LABELS.opportunity },
    { label: '自定义功能包', value: customRolePackages.length, config: TYPE_LABELS.rolePackage },
    { label: '自定义 SOP', value: customSops.length, config: TYPE_LABELS.sop },
  ]

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return activeStore.items
    return activeStore.items.filter(item => JSON.stringify(item).toLowerCase().includes(query))
  }, [activeStore.items, searchQuery])

  const switchType = (type: ContentType) => {
    setActiveType(type)
    setFormState(emptyForm(TYPE_LABELS[type]))
    setEditingId(null)
    setError('')
    setSavedTip('')
  }

  const resetForm = () => {
    setFormState(emptyForm(activeConfig))
    setEditingId(null)
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const missing = activeConfig.fields.find(field => field.required && !formState[field.key]?.trim())
    if (missing) {
      setError(`请先填写必填字段：${missing.label}`)
      setSavedTip('')
      return
    }

    const now = Date.now()
    const payload = activeConfig.fields.reduce<Record<string, CustomValue>>((acc, field) => {
      const value = formState[field.key] ?? ''
      acc[field.key] = field.multi ? linesToArray(value) : value.trim()
      return acc
    }, {})

    if (editingId) {
      activeStore.setItems(prev => prev.map(item => item.id === editingId ? { ...item, ...payload, updatedAt: now } : item))
      setSavedTip('已更新内容')
    } else {
      activeStore.setItems(prev => [
        {
          ...payload,
          id: makeId(activeType),
          type: activeType,
          source: 'custom',
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ])
      setSavedTip('已保存新内容')
    }

    resetForm()
    setError('')
    setTimeout(() => setSavedTip(''), 2200)
  }

  const editItem = (item: CustomItem) => {
    setEditingId(item.id)
    setFormState(activeConfig.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = valueToText(item[field.key])
      return acc
    }, {}))
    setError('')
    setSavedTip('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteItem = (item: CustomItem) => {
    if (!confirm(`确定删除「${titleOf(item)}」吗？此操作不可撤销。`)) return
    activeStore.setItems(prev => prev.filter(current => current.id !== item.id))
    if (editingId === item.id) resetForm()
  }

  const toggleItemBookmark = (item: CustomItem) => {
    toggleBookmark({
      id: `custom-content-${item.type}-${item.id}`,
      stageId: `custom:${item.type}:${item.id}`,
      stageName: '自定义内容',
      type: bookmarkType(item.type),
      title: titleOf(item),
      description: summaryOf(item),
    })
  }

  const openNote = (item: CustomItem) => {
    const noteId = `custom-note-${item.type}-${item.id}`
    setOpenNoteId(openNoteId === noteId ? null : noteId)
    setNoteDraft(getNote(noteId))
  }

  const saveItemNote = (item: CustomItem) => {
    const noteId = `custom-note-${item.type}-${item.id}`
    saveNote(noteId, noteDraft)
    setSavedTip('笔记已保存')
    setTimeout(() => setSavedTip(''), 1800)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <section className="card overflow-hidden animate-slide-up">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #10B981, #0E7490, #14B8A6)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D1FAE5, #ECFEFF)', border: '1.5px solid #A7F3D0' }}
            >
              ✍️
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-mint badge">本地知识沉淀</span>
                <span className="badge-blue badge">localStorage 保存</span>
                <span className="badge-violet badge">可编辑扩展</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-1)' }}>
                自定义内容管理
              </h1>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-2)' }}>
                你可以把客户现场调研到的流程、岗位、SOP 和 AI 自动化机会点沉淀到这里，逐步建立属于自己的跨境电商知识库。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {stats.map(stat => (
              <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: stat.config.bg, border: `1px solid ${stat.config.border}` }}>
                <div className="text-xl mb-1">{stat.config.icon}</div>
                <div className="text-xl font-bold font-mono" style={{ color: stat.config.color }}>{stat.value}</div>
                <div className="text-[11px]" style={{ color: stat.config.color }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="card p-4 animate-slide-up">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {TYPE_CONFIGS.map(config => (
            <button
              key={config.id}
              onClick={() => switchType(config.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
              style={activeType === config.id
                ? { background: config.bg, color: config.color, border: `1.5px solid ${config.border}` }
                : { background: 'var(--surface-2)', color: 'var(--text-2)', border: '1.5px solid var(--border)' }
              }
            >
              <span>{config.icon}</span>
              <span className="text-sm font-medium truncate">{config.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="card overflow-hidden animate-slide-up">
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>
              {editingId ? `编辑${activeConfig.label}` : `新增${activeConfig.label}`}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
              多项内容支持一行一个，保存后会转成数组结构。
            </p>
          </div>
          <button onClick={resetForm} className="btn-secondary text-xs">清空表单</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConfig.fields.map(field => (
              <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                <span className="text-xs font-semibold mb-1.5 inline-flex items-center gap-1" style={{ color: 'var(--text-2)' }}>
                  {field.label}
                  {field.required && <span style={{ color: '#DC2626' }}>*</span>}
                </span>
                {field.options ? (
                  <select
                    value={formState[field.key] ?? ''}
                    onChange={event => setFormState(prev => ({ ...prev, [field.key]: event.target.value }))}
                    className="input"
                  >
                    {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.multiline ? (
                  <textarea
                    value={formState[field.key] ?? ''}
                    onChange={event => setFormState(prev => ({ ...prev, [field.key]: event.target.value }))}
                    placeholder={field.placeholder ?? (field.multi ? '一行一个' : '')}
                    className="input"
                    rows={field.multi ? 4 : 3}
                  />
                ) : (
                  <input
                    value={formState[field.key] ?? ''}
                    onChange={event => setFormState(prev => ({ ...prev, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    className="input"
                  />
                )}
              </label>
            ))}
          </div>

          {(error || savedTip) && (
            <div
              className="rounded-xl p-3 text-xs"
              style={error
                ? { background: '#FFF5F5', color: '#991B1B', border: '1px solid #FECDD3' }
                : { background: '#D1FAE5', color: '#047857', border: '1px solid #A7F3D0' }
              }
            >
              {error || savedTip}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {editingId && <button type="button" onClick={resetForm} className="btn-secondary">取消编辑</button>}
            <button type="submit" className="btn-primary">
              {editingId ? '保存修改' : '保存内容'}
            </button>
          </div>

          <div className="rounded-xl p-3" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
              TODO：后续可在默认流程、岗位、机会点详情页增加“复制为自定义内容”按钮，复制后 source 标记为 copied，并跳转到这里继续编辑。
            </p>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="card p-5 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="section-header mb-0">
            <div className="section-header-icon" style={{ background: activeConfig.bg, border: `1px solid ${activeConfig.border}`, color: activeConfig.color }}>
              {activeConfig.icon}
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>{activeConfig.label}列表</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                共 {activeStore.items.length} 条，当前显示 {filteredItems.length} 条
              </p>
            </div>
          </div>
          <input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="搜索自定义内容..."
            className="input sm:max-w-xs"
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="text-4xl mb-3">{activeConfig.icon}</div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-1)' }}>
              {activeStore.items.length === 0 ? `还没有自定义${activeConfig.label}` : '没有匹配内容'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              {activeStore.items.length === 0 ? '先在上方表单保存一条客户现场调研内容。' : '换一个关键词试试。'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const config = TYPE_LABELS[item.type]
              const noteId = `custom-note-${item.type}-${item.id}`
              const bookmarkId = `custom-content-${item.type}-${item.id}`
              return (
                <article key={item.id} className="card p-4 card-hover">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: config.bg, border: `1px solid ${config.border}` }}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="badge" style={{ background: config.bg, color: config.color, borderColor: config.border }}>
                          {config.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-4)', border: '1px solid var(--border)' }}>
                          {item.source === 'copied' ? '复制内容' : '自定义'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>{titleOf(item)}</h3>
                      <p className="text-xs leading-relaxed mt-1 line-clamp-3" style={{ color: 'var(--text-3)' }}>{summaryOf(item)}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {tagsOf(item).map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]" style={{ color: 'var(--text-4)' }}>
                        <span>创建：{formatDate(Number(item.createdAt))}</span>
                        <span>更新：{formatDate(Number(item.updatedAt))}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => editItem(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#EFF6FF', color: '#0E7490', border: '1px solid #A5F3FC' }}>
                          编辑
                        </button>
                        <button onClick={() => deleteItem(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#FFF5F5', color: '#DC2626', border: '1px solid #FECDD3' }}>
                          删除
                        </button>
                        <button onClick={() => toggleItemBookmark(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{
                          background: isBookmarked(bookmarkId) ? '#FEF3C7' : 'var(--surface-2)',
                          color: isBookmarked(bookmarkId) ? '#D97706' : 'var(--text-3)',
                          border: `1px solid ${isBookmarked(bookmarkId) ? '#FDE68A' : 'var(--border)'}`,
                        }}>
                          {isBookmarked(bookmarkId) ? '已收藏' : '收藏'}
                        </button>
                        <button onClick={() => openNote(item)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                          笔记
                        </button>
                      </div>

                      {openNoteId === noteId && (
                        <div className="mt-3 rounded-xl p-3 animate-fade-in" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <textarea
                            value={noteDraft}
                            onChange={event => setNoteDraft(event.target.value)}
                            className="input text-xs"
                            rows={3}
                            placeholder="记录这条内容的客户背景、判断依据或后续动作..."
                          />
                          <div className="flex justify-end mt-2">
                            <button onClick={() => saveItemNote(item)} className="btn-primary text-xs">保存笔记</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="text-[11px] mt-4" style={{ color: 'var(--text-4)' }}>
          TODO：当前已提供自定义内容页面内搜索；后续如果新增全局搜索页，可把 custom_* 数据源统一接入全局检索索引。
        </p>
      </section>
    </div>
  )
}

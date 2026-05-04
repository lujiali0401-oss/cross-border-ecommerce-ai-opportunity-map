import { useState, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  interviewGroups,
  researchFields,
  opportunityCriteria,
  scenarioCards,
} from '../data/consultant'
import type { Difficulty, Priority } from '../data/consultant'
import { sampleCustomerPractices } from '../data/customerPractices'
import type { CustomerPractice } from '../data/customerPractices'

// ─── Helpers ──────────────────────────────────────────────────
const difficultyConfig: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  low:    { label: '低',  color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
  medium: { label: '中',  color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  high:   { label: '高',  color: '#DC2626', bg: '#FFE4E6', border: '#FECDD3' },
}

const priorityConfig: Record<Priority, { color: string; bg: string; border: string }> = {
  P0: { color: '#DC2626', bg: '#FFE4E6', border: '#FECDD3' },
  P1: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  P2: { color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-bold font-mono w-5 text-right" style={{ color }}>{score}</span>
    </div>
  )
}

type PracticeDraft = Record<string, string>

function createPracticeFromConsultant({
  draft,
  sourceLabel,
  summary,
  painPoints,
  solution,
  relatedProcesses = [],
  relatedRoles = [],
  relatedSystems = [],
  tags = [],
}: {
  draft: PracticeDraft
  sourceLabel: string
  summary: string
  painPoints: string[]
  solution: string
  relatedProcesses?: string[]
  relatedRoles?: string[]
  relatedSystems?: string[]
  tags?: string[]
}): CustomerPractice {
  const now = new Date().toISOString()
  return {
    id: `consultant-practice-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    projectName: draft.projectName.trim(),
    customerName: draft.customerName?.trim() ?? '',
    anonymous: true,
    industry: draft.industry.trim(),
    companySize: '',
    customerType: '',
    status: '调研中',
    date: new Date().toISOString().slice(0, 10),
    businessBackground: `${sourceLabel}提交生成，建议后续在客户实践库中补充业务背景、ROI 和复盘信息。`,
    relatedProcesses,
    relatedRoles,
    relatedSystems,
    originalManualProcess: summary,
    painPoints: painPoints.length ? painPoints : ['待进一步提炼核心痛点'],
    impactScope: '',
    baselineMetrics: '',
    solution: solution || '调研阶段，解决方案待进一步设计。',
    opportunityType: '流程自动化',
    implementationActions: [],
    tools: [],
    dataSources: [sourceLabel],
    results: '',
    roiData: '',
    timeSaved: '',
    manpowerSaved: '',
    revenueImpact: '',
    errorRateChange: '',
    successLessons: [],
    challenges: [],
    reusablePlaybook: [],
    nextOpportunities: [],
    tags: [sourceLabel, draft.industry.trim(), ...tags].filter(Boolean),
    notes: `从顾问视角「${sourceLabel}」提交。`,
    createdAt: now,
    updatedAt: now,
  }
}

function PracticeSubmitPanel({
  title,
  desc,
  draft,
  onDraftChange,
  onCopy,
  onSubmit,
  onClear,
  tip,
  error,
}: {
  title: string
  desc: string
  draft: PracticeDraft
  onDraftChange: (key: string, value: string) => void
  onCopy: () => void
  onSubmit: () => void
  onClear: () => void
  tip?: string
  error?: string
}) {
  return (
    <div className="p-4 space-y-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
      <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
            📁
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={draft.projectName ?? ''} onChange={e => onDraftChange('projectName', e.target.value)} className="input text-xs" placeholder="项目名称" />
          <input value={draft.industry ?? ''} onChange={e => onDraftChange('industry', e.target.value)} className="input text-xs" placeholder="客户行业" />
          <input value={draft.customerName ?? ''} onChange={e => onDraftChange('customerName', e.target.value)} className="input text-xs" placeholder="客户名称（可不填，默认匿名）" />
          <input value={draft.corePain ?? ''} onChange={e => onDraftChange('corePain', e.target.value)} className="input text-xs" placeholder="核心痛点摘要" />
          <textarea value={draft.solution ?? ''} onChange={e => onDraftChange('solution', e.target.value)} className="input text-xs md:col-span-2" rows={2} placeholder="初步解决方案想法，可先粗略填写" />
        </div>
      </div>

      {(tip || error) && (
        <div className="rounded-xl p-3 text-xs"
          style={error
            ? { background: '#FFF5F5', color: '#991B1B', border: '1px solid #FECDD3' }
            : { background: '#D1FAE5', color: '#047857', border: '1px solid #A7F3D0' }}>
          {error || tip}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button onClick={onClear} className="btn-secondary text-xs">清空</button>
        <button onClick={onCopy} className="btn-secondary text-xs">📋 复制全部内容</button>
        <button onClick={onSubmit} className="btn-primary text-xs">提交到客户实践库</button>
      </div>
    </div>
  )
}

// ─── Page sections ─────────────────────────────────────────────
type Section = 'interview' | 'research' | 'criteria' | 'scenarios'

const SECTIONS: { id: Section; label: string; icon: string; color: string }[] = [
  { id: 'interview',  label: '访谈问题清单', icon: '🎙',  color: '#0F3D5E' },
  { id: 'research',   label: '需求调研模板', icon: '📝',  color: '#0E7490' },
  { id: 'criteria',   label: '机会点判断',   icon: '🎯',  color: '#059669' },
  { id: 'scenarios',  label: '场景评估卡',   icon: '🃏',  color: '#D97706' },
]

// ─── Interview section ─────────────────────────────────────────
function InterviewSection() {
  const [activeRole, setActiveRole] = useState(0)
  const [answers, setAnswers] = useLocalStorage<Record<string, string>>('consultant_interview_answers', {})
  const [practiceDraft, setPracticeDraft] = useLocalStorage<Record<string, string>>('consultant_interview_practice_draft', {
    projectName: '',
    customerName: '',
    industry: '',
    corePain: '',
    solution: '',
  })
  const [customerPractices, setCustomerPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)
  const [savedTip, setSavedTip] = useState('')
  const [error, setError] = useState('')
  const group = interviewGroups[activeRole]

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const updateDraft = (key: string, value: string) => {
    setPracticeDraft(prev => ({ ...prev, [key]: value }))
  }

  const buildInterviewSummary = () => {
    return interviewGroups.map(g => {
      const lines = g.questions.map((q, idx) => {
        const answer = answers[q.id]?.trim() || '（未填写）'
        return `${String(idx + 1).padStart(2, '0')} ${q.question}\n${answer}`
      }).join('\n\n')
      return `【${g.role}】\n${lines}`
    }).join('\n\n')
  }

  const copyInterviewSummary = () => {
    navigator.clipboard?.writeText(buildInterviewSummary())
    setSavedTip('访谈纪要已复制')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const clearInterviewAnswers = () => {
    if (!confirm('确定清空所有访谈填写内容吗？')) return
    setAnswers({})
    setSavedTip('访谈填写内容已清空')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const submitToCustomerPractice = () => {
    if (!practiceDraft.projectName?.trim() || !practiceDraft.industry?.trim()) {
      setError('请至少填写项目名称和客户行业，方便保存到客户实践库。')
      setSavedTip('')
      return
    }

    const now = new Date().toISOString()
    const filledAnswers = Object.values(answers).map(value => value.trim()).filter(Boolean)
    const practice: CustomerPractice = {
      id: `interview-practice-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      projectName: practiceDraft.projectName.trim(),
      customerName: practiceDraft.customerName?.trim() ?? '',
      anonymous: true,
      industry: practiceDraft.industry.trim(),
      companySize: '',
      customerType: '',
      status: '调研中',
      date: new Date().toISOString().slice(0, 10),
      businessBackground: '由顾问视角访谈问题清单提交生成，建议后续在客户实践库中补充业务背景、ROI 和复盘信息。',
      relatedProcesses: [],
      relatedRoles: [group.role],
      relatedSystems: [],
      originalManualProcess: buildInterviewSummary(),
      painPoints: practiceDraft.corePain?.trim()
        ? [practiceDraft.corePain.trim()]
        : filledAnswers.slice(0, 4).length
        ? filledAnswers.slice(0, 4)
        : ['访谈记录已保存，核心痛点待进一步提炼'],
      impactScope: '',
      baselineMetrics: '',
      solution: practiceDraft.solution?.trim() || '访谈阶段，解决方案待进一步设计。',
      opportunityType: '流程自动化',
      implementationActions: [],
      tools: [],
      dataSources: ['客户访谈记录'],
      results: '',
      roiData: '',
      timeSaved: '',
      manpowerSaved: '',
      revenueImpact: '',
      errorRateChange: '',
      successLessons: [],
      challenges: [],
      reusablePlaybook: [],
      nextOpportunities: [],
      tags: ['访谈记录', group.role, practiceDraft.industry.trim()],
      notes: '从顾问视角访谈问题清单提交。',
      createdAt: now,
      updatedAt: now,
    }

    setCustomerPractices(prev => [practice, ...prev])
    setError('')
    setSavedTip('已提交到客户实践库，可前往继续补充详情')
    setPracticeDraft({ projectName: '', customerName: '', industry: '', corePain: '', solution: '' })
    setTimeout(() => setSavedTip(''), 2400)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta
        icon="🎙"
        title="跨境电商客户访谈问题清单"
        desc="按访谈对象分类，帮助顾问在现场调研时针对不同角色快速提问、高效挖掘真实需求"
        color="#0F3D5E"
      />

      {/* Role tabs */}
      <div className="flex flex-wrap gap-2">
        {interviewGroups.map((g, i) => (
          <button
            key={g.role}
            onClick={() => setActiveRole(i)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeRole === i
                ? { background: g.bg, color: g.color, border: `1.5px solid ${g.color}50` }
                : { background: 'var(--surface)', color: 'var(--text-2)', border: '1.5px solid var(--border)' }
            }
          >
            <span>{g.icon}</span>
            {g.role}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b" style={{ borderColor: 'var(--border)', background: group.bg }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'white', border: `1.5px solid ${group.color}30` }}
          >
            {group.icon}
          </div>
          <div>
            <h3 className="text-base font-bold mb-1" style={{ color: group.color }}>{group.role}</h3>
            <p className="text-xs" style={{ color: 'var(--text-2)' }}>{group.desc}</p>
          </div>
        </div>

        {/* Questions list */}
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as CSSProperties}>
          {group.questions.map((q, idx) => (
            <div key={q.id} className="p-4 hover:bg-blue-50/40 transition-colors group">
              <div className="flex items-start gap-3">
                {/* Number badge */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                  style={{ background: `${group.color}15`, color: group.color, border: `1px solid ${group.color}30` }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-snug mb-1.5" style={{ color: 'var(--text-1)' }}>
                    {q.question}
                  </p>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-4)' }}>
                      为什么问
                    </span>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{q.why}</p>
                  </div>
                  <textarea
                    value={answers[q.id] ?? ''}
                    onChange={e => updateAnswer(q.id, e.target.value)}
                    placeholder="记录客户原话、数据、异常、痛点或后续追问..."
                    className="input w-full text-xs mt-3"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                📁
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>提交为客户实践草稿</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  可以先把访谈记录沉淀到客户实践库，后续再补充方案、ROI 和复盘。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={practiceDraft.projectName ?? ''}
                onChange={e => updateDraft('projectName', e.target.value)}
                className="input text-xs"
                placeholder="项目名称，例如：某家居客户订单发货自动化调研"
              />
              <input
                value={practiceDraft.industry ?? ''}
                onChange={e => updateDraft('industry', e.target.value)}
                className="input text-xs"
                placeholder="客户行业，例如：跨境电商 / 鞋服箱包"
              />
              <input
                value={practiceDraft.customerName ?? ''}
                onChange={e => updateDraft('customerName', e.target.value)}
                className="input text-xs"
                placeholder="客户名称（可不填，默认匿名）"
              />
              <input
                value={practiceDraft.corePain ?? ''}
                onChange={e => updateDraft('corePain', e.target.value)}
                className="input text-xs"
                placeholder="核心痛点摘要"
              />
              <textarea
                value={practiceDraft.solution ?? ''}
                onChange={e => updateDraft('solution', e.target.value)}
                className="input text-xs md:col-span-2"
                rows={2}
                placeholder="初步解决方案想法，可先粗略填写"
              />
            </div>
          </div>

          {(savedTip || error) && (
            <div className="rounded-xl p-3 text-xs"
              style={error
                ? { background: '#FFF5F5', color: '#991B1B', border: '1px solid #FECDD3' }
                : { background: '#D1FAE5', color: '#047857', border: '1px solid #A7F3D0' }}>
              {error || savedTip}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button onClick={clearInterviewAnswers} className="btn-secondary text-xs">清空</button>
            <button onClick={copyInterviewSummary} className="btn-secondary text-xs">📋 复制全部内容</button>
            <button onClick={submitToCustomerPractice} className="btn-primary text-xs">提交到客户实践库</button>
          </div>
        </div>
      </div>

      {/* Usage tip */}
      <div className="rounded-xl p-4 flex gap-3" style={{ background: '#ECFEFF', border: '1px solid #BAE6FD' }}>
        <span className="text-lg flex-shrink-0">💡</span>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#5B21B6' }}>顾问实战建议</p>
          <p className="text-xs leading-relaxed" style={{ color: '#6D28D9' }}>
            访谈时不要逐条念问题，应自然地嵌入对话中。每轮访谈控制在 45-60 分钟以内，前 10 分钟建立信任，中间 30 分钟核心挖掘，最后 10 分钟确认关键信息和下一步。
            访谈后 24 小时内整理纪要，否则关键细节容易遗失。
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Research template section ─────────────────────────────────
function ResearchSection() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('consultant_research_notes', {})
  const [practiceDraft, setPracticeDraft] = useLocalStorage<Record<string, string>>('consultant_research_practice_draft', {
    projectName: '',
    customerName: '',
    industry: '',
    corePain: '',
    solution: '',
  })
  const [customerPractices, setCustomerPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)
  const [savedTip, setSavedTip] = useState('')
  const [error, setError] = useState('')

  const updateDraft = (key: string, value: string) => {
    setPracticeDraft(prev => ({ ...prev, [key]: value }))
  }

  const buildResearchSummary = () => {
    return researchFields
      .map(f => `【${f.label}】\n${notes[f.id]?.trim() || '（未填写）'}`)
      .join('\n\n')
  }

  const copyResearchSummary = () => {
    navigator.clipboard?.writeText(buildResearchSummary())
    setSavedTip('调研内容已复制')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const clearResearchNotes = () => {
    if (!confirm('确定清空需求调研模板里的填写内容吗？')) return
    setNotes({})
    setSavedTip('调研填写内容已清空')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const submitToCustomerPractice = () => {
    if (!practiceDraft.projectName?.trim() || !practiceDraft.industry?.trim()) {
      setError('请至少填写项目名称和客户行业，方便保存到客户实践库。')
      setSavedTip('')
      return
    }

    const practice = createPracticeFromConsultant({
      draft: practiceDraft,
      sourceLabel: '需求调研模板',
      summary: buildResearchSummary(),
      painPoints: [
        practiceDraft.corePain?.trim() || notes.painPoint?.trim() || '调研内容已保存，核心痛点待进一步提炼',
      ],
      solution: practiceDraft.solution?.trim() || notes.expectedGain?.trim() || '调研阶段，解决方案待进一步设计。',
      relatedProcesses: notes.process?.trim() ? [notes.process.trim()] : [],
      relatedRoles: notes.who?.trim() ? [notes.who.trim()] : [],
      relatedSystems: notes.systems
        ?.split(/[\n、,，]/)
        .map(item => item.trim())
        .filter(Boolean) ?? [],
      tags: ['需求调研'],
    })

    setCustomerPractices(prev => [practice, ...prev])
    setPracticeDraft({ projectName: '', customerName: '', industry: '', corePain: '', solution: '' })
    setError('')
    setSavedTip('已提交到客户实践库，可前往继续补充详情')
    setTimeout(() => setSavedTip(''), 2400)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta
        icon="📝"
        title="需求调研模板"
        desc="针对单个业务场景的标准化调研框架，帮助顾问完整收集自动化方案设计所需的关键信息"
        color="#0E7490"
      />

      {/* Template card */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)', background: '#ECFEFF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl" style={{ border: '1px solid #A5F3FC' }}>
              🗂
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#1E40AF' }}>场景调研表</p>
              <p className="text-xs mt-0.5" style={{ color: '#0E7490' }}>
                此处可直接填写，内容仅保存在本地，不会上传
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as CSSProperties}>
          {researchFields.map((field, idx) => (
            <div key={field.id} className="p-4 sm:p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: '#EFF6FF', border: '1px solid #A5F3FC' }}
                >
                  {field.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold" style={{ color: '#93C5FD' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                      {field.label}
                    </label>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                      style={{ background: '#EFF6FF', color: '#0E7490' }}>
                      参考
                    </span>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                      {field.example}
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                value={notes[field.id] ?? ''}
                onChange={e => setNotes(prev => ({ ...prev, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                className="input w-full text-xs"
                rows={2}
                style={{ marginLeft: 44 }}
              />

              {/* Tip */}
              <div className="mt-2 flex items-start gap-1.5" style={{ marginLeft: 44 }}>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: '#FEF3C7', color: '#D97706' }}>
                  注意
                </span>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-4)' }}>
                  {field.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

        <PracticeSubmitPanel
          title="提交为客户实践草稿"
          desc="可以把调研表直接沉淀到客户实践库，后续再补充结果、ROI 和复盘经验。"
          draft={practiceDraft}
          onDraftChange={updateDraft}
          onCopy={copyResearchSummary}
          onClear={clearResearchNotes}
          onSubmit={submitToCustomerPractice}
          tip={savedTip}
          error={error}
        />
      </div>
    </div>
  )
}

// ─── Opportunity criteria section ──────────────────────────────
function CriteriaSection() {
  const [scores, setScores] = useLocalStorage<Record<string, number>>('consultant_opportunity_scores', {})
  const [practiceDraft, setPracticeDraft] = useLocalStorage<Record<string, string>>('consultant_criteria_practice_draft', {
    projectName: '',
    customerName: '',
    industry: '',
    corePain: '',
    solution: '',
  })
  const [customerPractices, setCustomerPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)
  const [savedTip, setSavedTip] = useState('')
  const [error, setError] = useState('')

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0)
  const maxScore = opportunityCriteria.length * 5
  const pct = Math.round((totalScore / maxScore) * 100)

  const verdict =
    pct >= 70 ? { text: '强烈推荐立项', color: '#059669', bg: '#D1FAE5' }
    : pct >= 50 ? { text: '值得进一步评估', color: '#D97706', bg: '#FEF3C7' }
    : { text: '暂不优先推进', color: '#DC2626', bg: '#FFE4E6' }

  const updateDraft = (key: string, value: string) => {
    setPracticeDraft(prev => ({ ...prev, [key]: value }))
  }

  const buildCriteriaSummary = () => {
    const lines = opportunityCriteria.map(c => {
      const score = scores[c.id] ?? 0
      return `【${c.label}】${score || '未评分'} / 5\n高分参考：${c.highScore}\n低分参考：${c.lowScore}`
    })
    return [
      `【综合评分】${totalScore} / ${maxScore}`,
      `【判断结论】${verdict.text}`,
      '',
      ...lines,
    ].join('\n')
  }

  const copyCriteriaSummary = () => {
    navigator.clipboard?.writeText(buildCriteriaSummary())
    setSavedTip('机会点判断结果已复制')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const clearCriteriaScores = () => {
    if (!confirm('确定清空机会点判断评分吗？')) return
    setScores({})
    setSavedTip('机会点评分已清空')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const submitToCustomerPractice = () => {
    if (!practiceDraft.projectName?.trim() || !practiceDraft.industry?.trim()) {
      setError('请至少填写项目名称和客户行业，方便保存到客户实践库。')
      setSavedTip('')
      return
    }

    const lowScoreLabels = opportunityCriteria
      .filter(c => (scores[c.id] ?? 0) > 0 && (scores[c.id] ?? 0) <= 2)
      .map(c => c.label)

    const practice = createPracticeFromConsultant({
      draft: practiceDraft,
      sourceLabel: '机会点判断',
      summary: buildCriteriaSummary(),
      painPoints: [
        practiceDraft.corePain?.trim()
          || (lowScoreLabels.length ? `低分约束：${lowScoreLabels.join('、')}` : '机会点评分已保存，核心痛点待进一步提炼'),
      ],
      solution: practiceDraft.solution?.trim() || `${verdict.text}。建议结合评分维度补充 ROI、数据质量和系统集成条件。`,
      tags: ['机会点判断', verdict.text],
    })

    setCustomerPractices(prev => [practice, ...prev])
    setPracticeDraft({ projectName: '', customerName: '', industry: '', corePain: '', solution: '' })
    setError('')
    setSavedTip('已提交到客户实践库，可前往继续补充详情')
    setTimeout(() => setSavedTip(''), 2400)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta
        icon="🎯"
        title="机会点判断框架"
        desc="8 个维度评分，帮助顾问快速判断一个场景是否值得推进自动化/AI 项目"
        color="#059669"
      />

      {/* Score dashboard */}
      {Object.keys(scores).length > 0 && (
        <div className="card p-5 animate-scale-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>综合评分</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono" style={{ color: '#059669' }}>{totalScore}</span>
                <span className="text-sm" style={{ color: 'var(--text-4)' }}>/ {maxScore}</span>
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #34D399)' }}
                />
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: verdict.bg, color: verdict.color }}>
                {verdict.text}
              </span>
            </div>
            <button
              onClick={() => setScores({})}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
            >
              重置
            </button>
          </div>
        </div>
      )}

      {/* Criteria grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opportunityCriteria.map(c => {
          const score = scores[c.id] ?? 0
          return (
            <div key={c.id} className="card p-4 animate-slide-up">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: c.bg, border: `1px solid ${c.color}25` }}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{c.label}</p>
                  <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--text-3)' }}>{c.desc}</p>
                </div>
              </div>

              {/* High / Low examples */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                  <p className="text-[9px] font-semibold mb-0.5" style={{ color: '#065F42' }}>高分情况</p>
                  <p className="text-[10px] leading-snug" style={{ color: '#047857' }}>{c.highScore}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: '#FFE4E6', border: '1px solid #FECDD3' }}>
                  <p className="text-[9px] font-semibold mb-0.5" style={{ color: '#9F1239' }}>低分情况</p>
                  <p className="text-[10px] leading-snug" style={{ color: '#BE123C' }}>{c.lowScore}</p>
                </div>
              </div>

              {/* Score buttons */}
              <div>
                <p className="text-[10px] mb-2" style={{ color: 'var(--text-4)' }}>当前场景打分</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => setScores(prev => ({ ...prev, [c.id]: v }))}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={
                        score === v
                          ? { background: c.color, color: 'white', boxShadow: `0 2px 8px ${c.color}40` }
                          : { background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }
                      }
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#065F42' }}>📊 打分参考标准</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { score: 1, label: '基本不符合' },
            { score: 2, label: '少量符合' },
            { score: 3, label: '中等程度' },
            { score: 4, label: '大部分符合' },
            { score: 5, label: '完全符合' },
          ].map(item => (
            <div key={item.score} className="text-center">
              <div className="text-lg font-bold font-mono" style={{ color: '#059669' }}>{item.score}</div>
              <div className="text-[10px]" style={{ color: '#047857' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <PracticeSubmitPanel
          title="提交为客户实践草稿"
          desc="可以把机会点评分沉淀到客户实践库，用于后续立项判断、ROI 测算和方案复盘。"
          draft={practiceDraft}
          onDraftChange={updateDraft}
          onCopy={copyCriteriaSummary}
          onClear={clearCriteriaScores}
          onSubmit={submitToCustomerPractice}
          tip={savedTip}
          error={error}
        />
      </div>
    </div>
  )
}

// ─── Scenario cards section ────────────────────────────────────
function ScenarioSection() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'P0' | 'P1'>('all')
  const [scenarioNotes, setScenarioNotes] = useLocalStorage<Record<string, string>>('consultant_scenario_notes', {})
  const [practiceDraft, setPracticeDraft] = useLocalStorage<Record<string, string>>('consultant_scenario_practice_draft', {
    projectName: '',
    customerName: '',
    industry: '',
    corePain: '',
    solution: '',
  })
  const [customerPractices, setCustomerPractices] = useLocalStorage<CustomerPractice[]>('customer_practices', sampleCustomerPractices)
  const [savedTip, setSavedTip] = useState('')
  const [error, setError] = useState('')

  const filtered = scenarioCards.filter(s => filter === 'all' || s.priority === filter)
  const selectedScenario = scenarioCards.find(s => s.id === expanded) ?? filtered[0] ?? scenarioCards[0]

  const updateDraft = (key: string, value: string) => {
    setPracticeDraft(prev => ({ ...prev, [key]: value }))
  }

  const buildScenarioSummary = (targetCards = expanded ? scenarioCards.filter(sc => sc.id === expanded) : filtered) => {
    return targetCards.map(sc => [
      `【${sc.name}】`,
      `所属阶段：${sc.stage}`,
      `涉及岗位：${sc.roles.join('、')}`,
      `优先级：${sc.priority}`,
      `落地难度：${difficultyConfig[sc.difficulty].label}`,
      `当前流程：${sc.currentFlow}`,
      `核心痛点：${sc.painPoint}`,
      `RPA 自动化方案：${sc.rpaApproach}`,
      `AI 智能化方案：${sc.aiApproach}`,
      `预期收益：${sc.expectedGain}`,
      `现场评估备注：${scenarioNotes[sc.id]?.trim() || '（未填写）'}`,
    ].join('\n')).join('\n\n')
  }

  const copyScenarioSummary = () => {
    navigator.clipboard?.writeText(buildScenarioSummary())
    setSavedTip(expanded ? '当前场景评估内容已复制' : '全部场景评估内容已复制')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const clearScenarioNotes = () => {
    if (!confirm('确定清空场景评估卡里的填写内容吗？')) return
    setScenarioNotes({})
    setSavedTip('场景评估填写内容已清空')
    setError('')
    setTimeout(() => setSavedTip(''), 1800)
  }

  const submitToCustomerPractice = () => {
    if (!practiceDraft.projectName?.trim() || !practiceDraft.industry?.trim()) {
      setError('请至少填写项目名称和客户行业，方便保存到客户实践库。')
      setSavedTip('')
      return
    }

    const practice = createPracticeFromConsultant({
      draft: practiceDraft,
      sourceLabel: '场景评估卡',
      summary: [
        buildScenarioSummary([selectedScenario]),
        scenarioNotes[selectedScenario.id]?.trim()
          ? `\n【顾问现场备注】\n${scenarioNotes[selectedScenario.id].trim()}`
          : '',
      ].filter(Boolean).join('\n'),
      painPoints: [practiceDraft.corePain?.trim() || selectedScenario.painPoint],
      solution: practiceDraft.solution?.trim() || `${selectedScenario.rpaApproach}\n${selectedScenario.aiApproach}`,
      relatedProcesses: [selectedScenario.stage],
      relatedRoles: selectedScenario.roles,
      tags: ['场景评估', selectedScenario.name, selectedScenario.priority],
    })

    setCustomerPractices(prev => [practice, ...prev])
    setPracticeDraft({ projectName: '', customerName: '', industry: '', corePain: '', solution: '' })
    setError('')
    setSavedTip(`已将「${selectedScenario.name}」提交到客户实践库`)
    setTimeout(() => setSavedTip(''), 2400)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionMeta
        icon="🃏"
        title="跨境电商常见切入场景评估卡"
        desc="8 个最常见的跨境电商 AI/自动化切入点，含场景全貌、方案思路和落地评估"
        color="#D97706"
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>按优先级筛选：</span>
        {(['all', 'P0', 'P1'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              filter === f
                ? f === 'P0'
                  ? { background: '#FFE4E6', color: '#DC2626', border: '1.5px solid #FECDD3' }
                  : f === 'P1'
                  ? { background: '#FEF3C7', color: '#D97706', border: '1.5px solid #FDE68A' }
                  : { background: '#ECFEFF', color: '#0E7490', border: '1.5px solid #A5F3FC' }
                : { background: 'var(--surface)', color: 'var(--text-3)', border: '1.5px solid var(--border)' }
            }
          >
            {f === 'all' ? `全部 (${scenarioCards.length})` : f === 'P0' ? `🔴 P0 优先级 (${scenarioCards.filter(s => s.priority === 'P0').length})` : `🟡 P1 优先级 (${scenarioCards.filter(s => s.priority === 'P1').length})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((sc, i) => {
          const isOpen = expanded === sc.id
          const diff = difficultyConfig[sc.difficulty]
          const prio = priorityConfig[sc.priority]

          return (
            <div
              key={sc.id}
              className="card overflow-hidden animate-slide-up transition-all"
              style={{ animationDelay: `${i * 50}ms`, borderColor: isOpen ? `${sc.color}50` : undefined }}
            >
              {/* Card top accent */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${sc.color}, ${sc.color}30)` }} />

              {/* Header (always visible, clickable) */}
              <button
                onClick={() => setExpanded(isOpen ? null : sc.id)}
                className="w-full text-left p-4 sm:p-5 transition-colors hover:bg-blue-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${sc.color}12`, border: `1.5px solid ${sc.color}30` }}
                    >
                      {sc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Name + badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{sc.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: prio.bg, color: prio.color, border: `1px solid ${prio.border}` }}>
                          {sc.priority} 优先
                        </span>
                      </div>
                      {/* Stage + roles */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                          {sc.stage}
                        </span>
                        {sc.roles.map(r => (
                          <span key={r} className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side: scores + toggle */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[9px] mb-1" style={{ color: 'var(--text-4)' }}>RPA 适合度</p>
                        <ScoreBar score={sc.rpaScore} color="#0E7490" />
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] mb-1" style={{ color: 'var(--text-4)' }}>AI 适合度</p>
                        <ScoreBar score={sc.aiScore} color="#14B8A6" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                        落地难度 {diff.label}
                      </span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="transition-transform duration-200"
                        style={{ color: 'var(--text-4)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t animate-fade-in" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  {/* Mobile scores */}
                  <div className="sm:hidden p-4 pb-0 grid grid-cols-2 gap-3">
                    <div className="card p-3">
                      <p className="text-[9px] mb-2" style={{ color: 'var(--text-4)' }}>RPA 适合度</p>
                      <ScoreBar score={sc.rpaScore} color="#0E7490" />
                    </div>
                    <div className="card p-3">
                      <p className="text-[9px] mb-2" style={{ color: 'var(--text-4)' }}>AI 适合度</p>
                      <ScoreBar score={sc.aiScore} color="#14B8A6" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x"
                    style={{ '--tw-divide-opacity': 1 } as CSSProperties}>
                    {/* Left col */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <DetailBlock icon="🔄" label="当前流程" color={sc.color} text={sc.currentFlow} />
                      <DetailBlock icon="⚠️" label="核心痛点" color="#DC2626" text={sc.painPoint} textColor="#991B1B" bg="#FFF5F5" border="#FECDD3" />
                      <DetailBlock icon="💡" label="预期收益" color="#059669" text={sc.expectedGain} textColor="#065F42" bg="#F0FDF4" border="#A7F3D0" />
                    </div>
                    {/* Right col */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <DetailBlock icon="⚙️" label="RPA 自动化方案" color="#0E7490" text={sc.rpaApproach} textColor="#1E3A8A" bg="#EFF6FF" border="#A5F3FC" />
                      <DetailBlock icon="🤖" label="AI 智能化方案" color="#0F3D5E" text={sc.aiApproach} textColor="#3B0764" bg="#F5F3FF" border="#BAE6FD" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 border-t" style={{ borderColor: 'var(--border)' }}>
                    <label className="text-[11px] font-semibold block mb-2" style={{ color: 'var(--text-2)' }}>
                      现场评估备注
                    </label>
                    <textarea
                      value={scenarioNotes[sc.id] ?? ''}
                      onChange={e => setScenarioNotes(prev => ({ ...prev, [sc.id]: e.target.value }))}
                      placeholder="记录客户匹配度、现场证据、系统边界、改造风险或下一步验证事项..."
                      className="input w-full text-xs"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card overflow-hidden">
        <PracticeSubmitPanel
          title="提交为客户实践草稿"
          desc={`可以把${expanded ? `「${selectedScenario.name}」` : '当前筛选范围内的场景'}评估沉淀到客户实践库；展开某张卡片后会优先提交该场景。`}
          draft={practiceDraft}
          onDraftChange={updateDraft}
          onCopy={copyScenarioSummary}
          onClear={clearScenarioNotes}
          onSubmit={submitToCustomerPractice}
          tip={savedTip}
          error={error}
        />
      </div>
    </div>
  )
}

function DetailBlock({
  icon, label, color, text,
  textColor, bg, border,
}: {
  icon: string; label: string; color: string; text: string;
  textColor?: string; bg?: string; border?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm">{icon}</span>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
          {label}
        </p>
      </div>
      <div
        className="rounded-xl p-3"
        style={{
          background: bg ?? 'var(--surface)',
          border: `1px solid ${border ?? 'var(--border)'}`,
        }}
      >
        <p className="text-xs leading-relaxed" style={{ color: textColor ?? 'var(--text-2)' }}>
          {text}
        </p>
      </div>
    </div>
  )
}

// ─── Section meta header ───────────────────────────────────────
function SectionMeta({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}12`, border: `1.5px solid ${color}25` }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{title}</h2>
        <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function ConsultantPage() {
  const [activeSection, setActiveSection] = useState<Section>('interview')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleSectionChange = (id: Section) => {
    setActiveSection(id)
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ── Hero ── */}
      <div className="card overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0F3D5E, #0E7490, #059669, #D97706)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ECFEFF, #ECFEFF)', border: '1.5px solid #C4B5FD' }}
            >
              🧭
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="badge-violet badge">AI 厂商 · 售前顾问</span>
                <span className="badge-blue badge">RPA 厂商 · 解决方案</span>
                <span className="badge-mint badge">自动化厂商 · 客户成功</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
                顾问调研视角
              </h1>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-2)' }}>
                进入跨境电商客户现场时的完整工具包：访谈问题清单、需求调研模板、机会点判断框架、
                场景评估卡。帮助顾问从「听不懂」到「说得准」，从「聊得好」到「立得住」。
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {[
              { value: `${interviewGroups.reduce((s, g) => s + g.questions.length, 0)} 题`, label: '访谈问题', color: '#0F3D5E', bg: '#ECFEFF' },
              { value: `${researchFields.length} 项`, label: '调研字段', color: '#0E7490', bg: '#ECFEFF' },
              { value: `${opportunityCriteria.length} 维度`, label: '机会判断', color: '#059669', bg: '#D1FAE5' },
              { value: `${scenarioCards.length} 个`, label: '场景评估卡', color: '#D97706', bg: '#FEF3C7' },
            ].map(s => (
              <div key={s.label} className="stat-pill">
                <span className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => handleSectionChange(s.id)}
            className="flex flex-col items-start gap-1.5 p-3.5 rounded-2xl text-left transition-all card-hover"
            style={
              activeSection === s.id
                ? {
                    background: `${s.color}10`,
                    border: `2px solid ${s.color}50`,
                    boxShadow: `0 4px 16px ${s.color}18`,
                  }
                : {
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(14,90,180,0.06)',
                  }
            }
          >
            <span className="text-xl">{s.icon}</span>
            <span
              className="text-xs font-semibold leading-tight"
              style={{ color: activeSection === s.id ? s.color : 'var(--text-2)' }}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Section content ── */}
      <div ref={contentRef}>
        {activeSection === 'interview'  && <InterviewSection />}
        {activeSection === 'research'   && <ResearchSection />}
        {activeSection === 'criteria'   && <CriteriaSection />}
        {activeSection === 'scenarios'  && <ScenarioSection />}
      </div>
    </div>
  )
}

import { FormEvent, KeyboardEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../App'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { BookmarkItem } from '../types'
import type { AssistantRecommendation, AssistantRecommendationType } from '../utils/aiAssistant'
import { generateAIResponse } from '../utils/aiAssistant'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  recommendations?: AssistantRecommendation[]
}

const QUICK_QUESTIONS = [
  '亚马逊运营每天做什么？',
  '跨境电商一张订单是怎么流转的？',
  '多平台订单处理有什么痛点？',
  '跨境电商哪里最适合做 AI 自动化？',
  '红人营销怎么自动化？',
  '广告投放专员每天要关注什么？',
  '客服售后有哪些常见痛点？',
  '老板应该关注哪些经营指标？',
  '老板如何判断自动化项目值不值得做？',
  '新人怎么快速理解跨境电商岗位？',
  '解决方案顾问去跨境电商客户现场应该问什么？',
  '如何判断一个跨境电商自动化场景是否值得做？',
]

const TAGS = ['平台模式', '流程理解', '岗位 SOP', 'AI 自动化机会', '老板决策', '顾问调研']

const TYPE_META: Record<AssistantRecommendationType, { label: string; icon: string; color: string; bg: string; border: string }> = {
  process: { label: '流程节点', icon: '🗺', color: '#0E7490', bg: '#ECFEFF', border: '#A5F3FC' },
  role: { label: '岗位卡片', icon: '👤', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
  opportunity: { label: '机会点', icon: '🤖', color: '#0F3D5E', bg: '#ECFEFF', border: '#BAE6FD' },
  rolePackage: { label: '岗位功能包', icon: '🧩', color: '#0284C7', bg: '#E0F2FE', border: '#BAE6FD' },
  decision: { label: '决策模型', icon: '🎯', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  consultant: { label: '顾问模板', icon: '🧭', color: '#DB2777', bg: '#FCE7F3', border: '#FBCFE8' },
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function bookmarkType(type: AssistantRecommendationType): BookmarkItem['type'] {
  if (type === 'opportunity') return 'ai_opportunity'
  if (type === 'role' || type === 'rolePackage') return 'role'
  if (type === 'decision') return 'ai'
  return 'sop'
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('ai_chat_history', [])
  const [input, setInput] = useState('')
  const { toggleBookmark, isBookmarked } = useAppContext()

  const latestRecommendations = useMemo(() => {
    return [...messages].reverse().find(message => message.role === 'assistant' && message.recommendations?.length)?.recommendations ?? []
  }, [messages])

  const sendQuestion = (rawQuestion: string) => {
    const question = rawQuestion.trim()
    if (!question) return

    const now = Date.now()
    const response = generateAIResponse(question)
    const userMessage: ChatMessage = {
      id: makeId('user'),
      role: 'user',
      content: question,
      createdAt: now,
    }
    const assistantMessage: ChatMessage = {
      id: makeId('assistant'),
      role: 'assistant',
      content: response.answer,
      createdAt: now + 1,
      recommendations: response.recommendations,
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    sendQuestion(input)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendQuestion(input)
    }
  }

  const handleBookmark = (recommendation: AssistantRecommendation) => {
    toggleBookmark({
      id: `ai-assistant-${recommendation.id}`,
      stageId: recommendation.stageId ?? recommendation.targetPath ?? 'ai-assistant',
      stageName: TYPE_META[recommendation.type].label,
      type: bookmarkType(recommendation.type),
      title: recommendation.title,
      description: recommendation.description,
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top intro */}
      <section className="card overflow-hidden animate-slide-up">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0E7490, #14B8A6, #10B981)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ECFEFF, #ECFEFF)', border: '1.5px solid #A5F3FC' }}
            >
              🤖
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-blue badge">模拟 AI 问答</span>
                <span className="badge-mint badge">本地知识推荐</span>
                <span className="badge-violet badge">不接真实 API</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-1)' }}>
                AI小助手
              </h1>
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-2)' }}>
                你可以像问一位跨境电商数字化顾问一样提问，例如：亚马逊运营每天做什么？跨境电商哪里最适合做 AI 自动化？
                多平台订单处理有什么痛点？老板应该关注哪些经营指标？
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {TAGS.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick questions */}
      <section className="card p-5 animate-slide-up">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="section-header mb-0">
            <div className="section-header-icon" style={{ background: '#ECFEFF', border: '1px solid #BAE6FD', color: '#0F3D5E' }}>
              ✨
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>常见问题快捷提问</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>点击后自动发送问题，适合快速试用模拟顾问</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map(question => (
            <button
              key={question}
              onClick={() => sendQuestion(question)}
              className="text-xs px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              {question}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        {/* Chat */}
        <section className="card overflow-hidden animate-slide-up">
          <div className="p-4 sm:p-5 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#ECFEFF', border: '1px solid #A5F3FC' }}>
                💬
              </div>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>顾问对话</h2>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>当前版本使用本地 mock data 生成回复</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('确定清空 AI 顾问对话记录吗？')) setMessages([])
                }}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: 'var(--text-4)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                清空对话
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5 space-y-4 min-h-[420px] max-h-[620px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4"
                  style={{ background: 'linear-gradient(135deg, #ECFEFF, #D1FAE5)', border: '1.5px solid #A5F3FC' }}>
                  🤖
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-1)' }}>欢迎使用 AI小助手</h3>
                <p className="text-sm max-w-md leading-relaxed mb-5" style={{ color: 'var(--text-3)' }}>
                  你可以从岗位、流程、SOP、AI 自动化机会、老板 决策或顾问调研任一方向开始提问。
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {QUICK_QUESTIONS.slice(0, 4).map(question => (
                    <button
                      key={question}
                      onClick={() => sendQuestion(question)}
                      className="badge badge-blue transition-transform hover:-translate-y-0.5"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] sm:max-w-[78%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1" style={{ justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>{formatTime(message.createdAt)}</span>
                      <span className="text-[11px] font-medium" style={{ color: message.role === 'user' ? '#0E7490' : '#0F3D5E' }}>
                        {message.role === 'user' ? '你' : 'AI 顾问'}
                      </span>
                    </div>
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={message.role === 'user'
                        ? { background: 'linear-gradient(135deg, #0E7490, #0E7490)', color: 'white', boxShadow: '0 2px 10px rgba(59,130,246,0.25)' }
                        : { background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                      }
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: message.role === 'user' ? 'white' : 'var(--text-2)' }}>
                        {message.content}
                      </p>
                    </div>
                    {message.role === 'assistant' && message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {message.recommendations.slice(0, 3).map(recommendation => (
                          <RecommendationCard
                            key={recommendation.id}
                            recommendation={recommendation}
                            bookmarked={isBookmarked(`ai-assistant-${recommendation.id}`)}
                            onBookmark={() => handleBookmark(recommendation)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入问题，例如：缺货预警自动化应该怎么设计？"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary flex-shrink-0" disabled={!input.trim()}>
                发送
              </button>
            </div>
          </form>
        </section>

        {/* Latest recommendations + future API */}
        <aside className="space-y-6 animate-slide-up">
          <section className="card p-5">
            <div className="section-header mb-4">
              <div className="section-header-icon" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#059669' }}>
                🧠
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>推荐知识卡片</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>随最近一次回复自动更新</p>
              </div>
            </div>
            {latestRecommendations.length > 0 ? (
              <div className="space-y-2">
                {latestRecommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    bookmarked={isBookmarked(`ai-assistant-${recommendation.id}`)}
                    onBookmark={() => handleBookmark(recommendation)}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  提问后会在这里出现流程节点、岗位、机会点、决策模型或顾问模板推荐。
                </p>
              </div>
            )}
          </section>

          <section className="card p-5">
            <div className="section-header mb-4">
              <div className="section-header-icon" style={{ background: '#ECFEFF', border: '1px solid #BAE6FD', color: '#0F3D5E' }}>
                🔌
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>未来 API 接入</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>当前版本不调用真实模型</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                后续可以通过后端 API 接入 OpenAI、Claude、DeepSeek、腾讯混元或通义千问等模型。
              </p>
              <div className="rounded-xl p-3" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                  注意：真实 API Key 必须放在服务端或 Vercel 环境变量中，不能写进前端代码。
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function RecommendationCard({
  recommendation,
  bookmarked,
  onBookmark,
  compact = false,
}: {
  recommendation: AssistantRecommendation
  bookmarked: boolean
  onBookmark: () => void
  compact?: boolean
}) {
  const meta = TYPE_META[recommendation.type]

  return (
    <div className={`rounded-xl ${compact ? 'p-3' : 'p-3.5'}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
        >
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
              {meta.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>{recommendation.title}</h3>
          <p className={`text-xs mt-1 leading-relaxed ${compact ? 'line-clamp-2' : 'line-clamp-3'}`} style={{ color: 'var(--text-3)' }}>
            {recommendation.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            {recommendation.targetPath ? (
              <Link to={recommendation.targetPath} className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-blue-50"
                style={{ color: '#0E7490', border: '1px solid #A5F3FC', background: '#EFF6FF' }}>
                查看详情
              </Link>
            ) : (
              // TODO: 如果后续有统一的详情弹窗，可在这里接入精确详情跳转。
              <button className="text-xs px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-4)', border: '1px solid var(--border)' }}>
                查看详情
              </button>
            )}
            <button
              onClick={onBookmark}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                color: bookmarked ? '#D97706' : 'var(--text-3)',
                background: bookmarked ? '#FEF3C7' : 'var(--surface-2)',
                border: `1px solid ${bookmarked ? '#FDE68A' : 'var(--border)'}`,
              }}
            >
              {bookmarked ? '已收藏' : '收藏'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

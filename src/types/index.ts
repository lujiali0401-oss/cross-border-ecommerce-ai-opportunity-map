export type DifficultyLevel = 'low' | 'medium' | 'high'
export type ImpactLevel = 'low' | 'medium' | 'high'
export type AIType = 'AI' | 'RPA' | 'Automation' | 'Analytics' | 'IoT'
export type TabId = 'overview' | 'roles' | 'sops' | 'ai'

export interface KPI {
  name: string
  description: string
  unit?: string
}

export interface Role {
  id: string
  title: string
  description?: string
  department: string
  responsibilities: string[]
  kpis: string[]
  painPoints: string[]
  tools: string[]
}

export interface SOPStep {
  step: number
  action: string
  responsible?: string
  note?: string
}

export interface SOP {
  id: string
  name: string
  owner: string
  frequency: string
  duration: string
  description: string
  steps: SOPStep[]
  inputs: string[]
  outputs: string[]
}

export interface AIOpportunity {
  id: string
  title: string
  type: AIType
  description: string
  benefits: string[]
  difficulty: DifficultyLevel
  impact: ImpactLevel
  tools: string[]
  estimatedROI?: string
  maturity: '成熟' | '发展中' | '前沿'
}

export interface Stage {
  id: string
  order: number
  name: string
  englishName: string
  icon: string
  color: string
  bgGradient: string
  description: string
  objective: string
  departments: string[]
  systemsInvolved: string[]
  roles: Role[]
  sops: SOP[]
  aiOpportunities: AIOpportunity[]
  kpis: KPI[]
  commonChallenges: string[]
  digitalMaturityCurrent: string
  digitalMaturityTarget: string
}

export interface BookmarkItem {
  id: string
  stageId: string
  stageName: string
  type: 'sop' | 'ai' | 'ai_opportunity' | 'role'
  title: string
  description?: string
  savedAt: number
}

export interface NoteItem {
  stageId: string
  content: string
  updatedAt: number
}

export interface ProgressData {
  visitedStages: string[]
  completedStages: string[]
  lastVisited?: string
  startedAt: number
}

export interface AppState {
  bookmarks: BookmarkItem[]
  notes: Record<string, NoteItem>
  progress: ProgressData
}

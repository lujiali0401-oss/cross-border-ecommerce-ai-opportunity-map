import type { AIOpportunity, Role, SOP, Stage } from '../types'
import { stages } from '../data/stages'
import { interviewGroups, opportunityCriteria, scenarioCards } from '../data/consultant'
import { maturityLevels, matrixQuadrants, roadmapPhases, roiDimensions } from '../data/ceo'
import { sampleCustomerPractices } from '../data/customerPractices'
import type { CustomerPractice } from '../data/customerPractices'

export type AssistantRecommendationType =
  | 'process'
  | 'role'
  | 'opportunity'
  | 'rolePackage'
  | 'decision'
  | 'consultant'

export interface AssistantRecommendation {
  id: string
  type: AssistantRecommendationType
  title: string
  description: string
  stageId?: string
  targetPath?: string
}

export interface AssistantResponse {
  answer: string
  recommendations: AssistantRecommendation[]
}

interface RoleMatch {
  keyword: string
  stage: Stage
  role: Role
}

const ROLE_ALIASES: Array<{ keyword: string; aliases: string[]; stageId?: string }> = [
  { keyword: '亚马逊运营', aliases: ['亚马逊运营', 'Amazon运营', 'Amazon 运营'], stageId: 'product-listing' },
  { keyword: 'TikTok Shop 运营', aliases: ['TikTok Shop 运营', 'TikTok运营', 'TikTok 运营'], stageId: 'content-marketing' },
  { keyword: '选品专员', aliases: ['选品专员', '选品', '产品开发'], stageId: 'product-research' },
  { keyword: '广告投放专员', aliases: ['广告投放专员', '广告', '投放'], stageId: 'advertising' },
  { keyword: '红人营销专员', aliases: ['红人营销专员', '红人营销', '达人营销', 'KOL'], stageId: 'content-marketing' },
  { keyword: '订单处理专员', aliases: ['订单处理专员', '订单专员', '订单处理'], stageId: 'order-processing' },
  { keyword: '物流专员', aliases: ['物流专员', '国际物流', '尾程'], stageId: 'international-logistics' },
  { keyword: '客服专员', aliases: ['客服专员', '客服', '售后'], stageId: 'customer-service' },
  { keyword: '财务结算专员', aliases: ['财务结算专员', '财务', '结算', '利润'], stageId: 'financial-settlement' },
  { keyword: '数据分析师', aliases: ['数据分析师', '数据分析', 'BI'], stageId: 'business-analysis' },
  { keyword: 'ITBP', aliases: ['ITBP', '信息化业务伙伴', '数字化伙伴'] },
  { keyword: '自动化负责人', aliases: ['自动化负责人', 'IT负责人', 'IT / 自动化负责人', 'RPA负责人'] },
  { keyword: '老板', aliases: ['老板', 'CEO', '店铺负责人', '负责人', '决策层'] },
]

const PROCESS_ALIASES: Array<{ stageId: string; aliases: string[] }> = [
  { stageId: 'market-research', aliases: ['市场调研', '市场', '类目趋势'] },
  { stageId: 'product-research', aliases: ['选品', '产品开发', '爆品'] },
  { stageId: 'supplier-development', aliases: ['供应商开发', '供应商', '打样'] },
  { stageId: 'procurement-stocking', aliases: ['采购备货', '采购', '补货', '库存'] },
  { stageId: 'product-materials', aliases: ['商品资料', '素材', '多语言'] },
  { stageId: 'product-listing', aliases: ['产品上架', 'Listing', 'listing', '标题', '五点描述'] },
  { stageId: 'advertising', aliases: ['广告投放', '广告', 'ACOS', 'ROAS'] },
  { stageId: 'content-marketing', aliases: ['内容营销', '红人营销', '达人', '直播'] },
  { stageId: 'inquiry-order', aliases: ['客户询盘', '询盘', '下单'] },
  { stageId: 'order-processing', aliases: ['订单处理', '订单', '发货单'] },
  { stageId: 'warehouse-management', aliases: ['仓储管理', '仓储', '海外仓', 'FBA'] },
  { stageId: 'international-logistics', aliases: ['国际物流', '物流', '头程', '运费'] },
  { stageId: 'customs-last-mile', aliases: ['清关', '尾程', '配送'] },
  { stageId: 'customer-service', aliases: ['客服售后', '客服', '售后', '差评'] },
  { stageId: 'financial-settlement', aliases: ['财务结算', '财务', '结算', '利润'] },
  { stageId: 'business-analysis', aliases: ['数据分析', '经营分析', '看板'] },
  { stageId: 'repurchase-operation', aliases: ['复购运营', '复购', '老客户'] },
]

const AI_KEYWORDS = ['AI', 'ai', '自动化', 'RPA', '机器人', '智能化', '提效', '降本', '替代人工', '数据分析', '预警', '广告 ROI', 'ACOS']
const SOP_KEYWORDS = ['SOP', 'sop', '新人', '上手', '入职', '学习', '功能包', '怎么学']
const DECISION_KEYWORDS = ['老板', 'cio', '老板', '负责人', '决策', 'ROI', 'roi', '投入产出', '数字化', '规划', '路线图', '成熟度']
const CONSULTANT_KEYWORDS = ['解决方案', '售前', '顾问', '调研', '访谈', '客户现场', '需求', '场景评估']
const INDUSTRY_MAP_KEYWORDS = [
  '平台与模式',
  '业务模式',
  '平台型卖家',
  '独立站',
  '品牌出海',
  '铺货',
  '精品',
  'B2B',
  'DTC',
  'TikTok Shop',
  'Amazon',
  'Shopee',
  '平台地图',
]
const CUSTOMER_PRACTICE_KEYWORDS = ['客户案例', '客户实践', '项目复盘', '真实案例', '自动化实践', '解决方案案例']

function includesAny(text: string, keywords: string[]) {
  return keywords.some(keyword => text.includes(keyword))
}

function compact<T>(items: Array<T | undefined | null>): T[] {
  return items.filter(Boolean) as T[]
}

function findStageById(stageId?: string) {
  return stages.find(stage => stage.id === stageId)
}

function findStageByName(stageName: string) {
  return stages.find(stage => stage.name === stageName)
}

function findRole(question: string): RoleMatch | undefined {
  for (const item of ROLE_ALIASES) {
    if (!item.aliases.some(alias => question.includes(alias))) continue

    const preferredStages = compact([findStageById(item.stageId), ...stages])
    for (const stage of preferredStages) {
      const role = stage.roles.find(r =>
        item.aliases.some(alias => r.title.includes(alias)) ||
        r.title.includes(item.keyword) ||
        r.department.includes(item.keyword)
      )
      if (role) return { keyword: item.keyword, stage, role }
    }
  }
  return undefined
}

function findProcess(question: string) {
  const process = PROCESS_ALIASES.find(item => item.aliases.some(alias => question.includes(alias)))
  return findStageById(process?.stageId)
}

function topOpportunitiesForStage(stage: Stage, limit = 3) {
  return stage.aiOpportunities.slice(0, limit)
}

function formatList(items: string[], limit = 4) {
  return items.slice(0, limit).map(item => `- ${item}`).join('\n')
}

function createStageRecommendation(stage: Stage): AssistantRecommendation {
  return {
    id: `process-${stage.id}`,
    type: 'process',
    title: `${stage.icon} ${stage.name}`,
    description: `${stage.description} 主要部门：${stage.departments.join('、')}。`,
    stageId: stage.id,
    targetPath: `/stage/${stage.id}`,
  }
}

function createRoleRecommendation(stage: Stage, role: Role): AssistantRecommendation {
  return {
    id: `role-${role.id}`,
    type: 'role',
    title: role.title,
    description: `${role.department} · ${role.responsibilities[0] ?? '查看该岗位职责、KPI 和常用工具。'}`,
    stageId: stage.id,
    targetPath: `/stage/${stage.id}`,
  }
}

function createOpportunityRecommendation(stage: Stage, opportunity: AIOpportunity): AssistantRecommendation {
  return {
    id: `opportunity-${opportunity.id}`,
    type: 'opportunity',
    title: opportunity.title,
    description: opportunity.description,
    stageId: stage.id,
    targetPath: `/stage/${stage.id}`,
  }
}

function rolePackageRecommendation(stage: Stage, role: Role): AssistantRecommendation {
  return {
    id: `role-package-${role.id}`,
    type: 'rolePackage',
    title: `${role.title}功能包`,
    description: `建议从 ${stage.name} 节点开始，按“岗位职责 → SOP → 痛点 → AI机会”顺序学习。`,
    stageId: stage.id,
    targetPath: `/stage/${stage.id}`,
  }
}

function scenarioRecommendation(id: string): AssistantRecommendation | undefined {
  const scenario = scenarioCards.find(item => item.id === id)
  if (!scenario) return undefined
  const stage = findStageByName(scenario.stage)
  return {
    id: `scenario-${scenario.id}`,
    type: 'opportunity',
    title: `${scenario.icon} ${scenario.name}`,
    description: `${scenario.expectedGain} 难度：${scenario.difficulty}，优先级：${scenario.priority}。`,
    stageId: stage?.id,
    targetPath: stage ? `/stage/${stage.id}` : '/consultant',
  }
}

function generateRoleAnswer(match: RoleMatch): AssistantResponse {
  const { stage, role, keyword } = match
  const sops = stage.sops.slice(0, 2)
  const opportunities = topOpportunitiesForStage(stage)

  const answer = [
    `${keyword} 可以理解为 ${stage.name} 环节里的关键协同岗位。以「${role.title}」为例，它连接 ${stage.departments.join('、')}，目标是把业务输入转成稳定、可执行、可追踪的工作结果。`,
    '',
    `核心职责：\n${formatList(role.responsibilities)}`,
    '',
    `日常工作通常围绕这些 SOP 展开：\n${formatList(sops.map(sop => `${sop.name}：${sop.description}`), 3)}`,
    '',
    `常见痛点：\n${formatList(role.painPoints.length ? role.painPoints : stage.commonChallenges, 4)}`,
    '',
    `AI / 自动化机会点：\n${formatList(opportunities.map(item => `${item.title}：${item.description}`), 3)}`,
    '',
    '建议学习方式：先看岗位卡片理解职责，再展开 SOP 看输入输出，最后看 AI 机会点判断哪些工作高频、重复、规则明确。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      createRoleRecommendation(stage, role),
      rolePackageRecommendation(stage, role),
      ...opportunities.slice(0, 2).map(item => createOpportunityRecommendation(stage, item)),
    ],
  }
}

function generateProcessAnswer(stage: Stage): AssistantResponse {
  const firstSop = stage.sops[0]
  const inputs = firstSop?.inputs ?? []
  const outputs = firstSop?.outputs ?? []
  const opportunities = topOpportunitiesForStage(stage)

  const answer = [
    `「${stage.name}」是跨境电商全链路中的第 ${stage.order} 个节点，主要目标是：${stage.objective}`,
    '',
    `主要参与部门：${stage.departments.join('、')}`,
    `关键输入：${inputs.length ? inputs.join('、') : '通常来自上一业务节点的客户、订单、物料或运营数据'}`,
    `关键输出：${outputs.length ? outputs.join('、') : '形成可履约给下一节点的业务结果和系统记录'}`,
    '',
    `常见痛点：\n${formatList(stage.commonChallenges)}`,
    '',
    `可自动化 / AI 化机会：\n${formatList(opportunities.map(item => `${item.title}：${item.description}`), 3)}`,
    '',
    '建议查看该流程节点卡片，顺着“部门 → KPI → SOP → AI机会”读一遍，会更容易建立业务全貌。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      createStageRecommendation(stage),
      ...stage.roles.slice(0, 2).map(role => createRoleRecommendation(stage, role)),
      ...opportunities.slice(0, 2).map(item => createOpportunityRecommendation(stage, item)),
    ],
  }
}

function generateOrderFlowAnswer(): AssistantResponse {
  const flowStages = stages.slice(0, 14)
  const answer = [
    '一张跨境电商订单通常不是“平台出单就结束”，它会沿着平台下单、订单审核、库存校验、仓库拣货、国际物流、尾程配送、客服售后和财务结算这条链路流转。',
    '',
    `典型路径：${flowStages.map(stage => stage.name).join(' → ')}`,
    '',
    '关键理解点：',
    '- 平台订单决定 SKU、数量、地址、付款和发货时效。',
    '- ERP / OMS 把订单转成可执行的发货单和库存占用。',
    '- WMS、海外仓和物流商共同决定履约时效。',
    '- 客服售后处理异常、差评、退款和客户通知。',
    '- 财务结算把平台收入、广告费、物流费和佣金转成真实利润。',
    '',
    '最容易出问题的地方通常是跨平台、跨系统交接：订单导入、库存同步、异常订单识别、发货单生成、物流单号回填和费用核算。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      ...flowStages.slice(8, 12).map(createStageRecommendation),
      compact([scenarioRecommendation('order-sync'), scenarioRecommendation('finance-profit')])[0],
    ].filter(Boolean) as AssistantRecommendation[],
  }
}

function generateOrderToPlanningAnswer(): AssistantResponse {
  const orderStage = findStageById('order-processing') ?? stages[9]
  const planningStage = findStageById('warehouse-management') ?? stages[10]
  const procurementStage = findStageById('international-logistics') ?? stages[11]

  const answer = [
    '多平台订单处理最核心的问题，是把“平台订单”稳定转成“系统可执行的发货动作”。这里通常跨平台后台、ERP / OMS、WMS、物流商和客服，任何字段不同步都会放大发货延迟、库存错误或客户投诉。',
    '',
    '常见痛点：',
    '- 多平台订单分散：运营需要反复下载、整理、导入。',
    '- 地址、SKU、库存字段不一致：容易产生异常订单。',
    '- 库存和在途数据不同步：卖超、缺货或滞销都难以及时发现。',
    '- 物流规则复杂：不同国家、仓库和物流商的发货规则不同。',
    '- 单号回填滞后：影响平台时效、客户体验和客服压力。',
    '',
    '适合优先自动化的切入点：订单自动下载、多平台订单同步、异常订单识别、发货单自动生成、物流单号自动回填。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      createStageRecommendation(orderStage),
      createStageRecommendation(planningStage),
      createStageRecommendation(procurementStage),
      ...compact([scenarioRecommendation('order-sync')]),
    ],
  }
}

function generateAutomationAnswer(): AssistantResponse {
  const recommended = compact([
    scenarioRecommendation('order-sync'),
    scenarioRecommendation('influencer-automation'),
    scenarioRecommendation('ad-report'),
    {
      id: 'decision-ar-overdue',
      type: 'opportunity' as const,
      title: 'SKU 利润自动计算',
      description: '汇总平台账单、广告费、物流费、佣金和采购成本，自动核算单品真实利润。',
      stageId: 'financial-settlement',
      targetPath: '/stage/financial-settlement',
    },
    scenarioRecommendation('customer-service-ai'),
  ])

  const answer = [
    '跨境电商中最适合优先做 AI / 自动化的场景，通常具备这些特征：高频、重复、规则明确、跨系统、人工耗时长、错误率高，并且会明显影响交期、成本、质量或客户体验。',
    '',
    '第一批建议优先看这 5 类：',
    '- 多平台订单同步：减少人工导出导入和异常漏处理。',
    '- 红人营销自动化：自动采集红人资料、建联和跟进。',
    '- 广告日报自动生成：汇总 ACOS / ROAS，标记低效广告。',
    '- SKU 利润自动计算：看清平台、广告、物流和佣金后的真实利润。',
    '- 多语言客服助手：自动分类消息、生成回复并识别差评风险。',
    '',
    `判断方法可以参考顾问视角里的 ${opportunityCriteria.length} 个维度：频率、重复性、规则明确度、数据结构化、异常比例、错误成本、跨系统程度和收益可量化程度。`,
  ].join('\n')

  return { answer, recommendations: recommended }
}

function generateLearningAnswer(): AssistantResponse {
  const stage = findStageById('product-research') ?? stages[0]
  const role = stage.roles[0]

  const answer = [
    '新人理解跨境电商，不建议一上来背概念，建议按“流程 → 岗位 → SOP → 机会点”的顺序学习。',
    '',
    '推荐学习路径：',
    '- 第 1 天：看首页流程图，先记住订单从哪里来、如何运营、如何履约、如何结算。',
    '- 第 1 周：每天选 2-3 个节点，重点看参与部门、关键输入输出和常见痛点。',
    '- 第 2 周：按岗位功能包学习，理解每个岗位每天看什么、处理什么异常、对谁负责。',
    '- 第 3 周：看 AI 机会点，判断哪些工作高频、重复、规则明确，适合自动化。',
    '',
    '新人上手清单：能讲清一张订单的流转路径；能说出选品、上架、广告、订单、仓储、物流、客服、财务的职责；能识别 3 个低难度高价值自动化场景。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      createStageRecommendation(stage),
      createRoleRecommendation(stage, role),
      rolePackageRecommendation(stage, role),
      { id: 'consultant-scenarios', type: 'consultant', title: '场景评估卡', description: '用真实场景卡学习如何判断自动化机会。', targetPath: '/consultant' },
    ],
  }
}

function generateDecisionAnswer(): AssistantResponse {
  const bestMatrix = matrixQuadrants[0]

  const answer = [
    '跨境老板判断自动化项目，重点不是“技术酷不酷”，而是先判断店铺所处成熟度，再用 ROI 和优先级矩阵筛选项目。',
    '',
    `成熟度建议：从 ${maturityLevels.length} 个阶段判断现状，先补数据和流程基础，再谈 AI 深度智能化。`,
    `ROI 维度：可从 ${roiDimensions.slice(0, 5).map(item => item.name).join('、')} 等方向量化收益。`,
    `优先级矩阵：优先做「${bestMatrix.title}」场景，也就是 ${bestMatrix.subtitle}，例如 ${bestMatrix.items.slice(0, 4).map(item => item.name).join('、')}。`,
    `路线图：建议按 ${roadmapPhases.map(item => item.name).join(' → ')} 分阶段推进。`,
    '',
    '常见风险提醒：不要一开始就做大而全平台；不要低估平台风控、账号权限和数据质量；不要只算节省人力，要同步评估广告 ROI、库存、物流、利润和客户体验。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      { id: 'decision-maturity', type: 'decision', title: '数字化成熟度模型', description: '判断企业现在处于纸质、Excel、单系统、多系统协同还是 AI 自动化阶段。', targetPath: '/ceo' },
      { id: 'decision-roi', type: 'decision', title: 'ROI 评估框架', description: '用节省时间、降低错误、缩短周期、减少库存和提升收入等维度测算价值。', targetPath: '/ceo' },
      { id: 'decision-matrix', type: 'decision', title: '优先级矩阵', description: '按业务价值和落地难度筛选先做、后做、暂不做的场景。', targetPath: '/ceo' },
    ],
  }
}

function generateConsultantAnswer(): AssistantResponse {
  const questions = interviewGroups.flatMap(group => group.questions.slice(0, 2).map(q => `${group.role}：${q.question}`))

  const answer = [
    '解决方案顾问去跨境电商客户现场，核心不是一上来讲产品，而是先把“谁痛、痛在哪、量有多大、规则清不清楚、系统能不能接”问明白。',
    '',
    '建议访谈对象：老板 / 店铺负责人、运营负责人、财务负责人、IT / 自动化负责人、一线执行岗位。',
    '',
    `现场可以优先问：\n${formatList(questions, 6)}`,
    '',
    '判断机会点时，重点看：频率高不高、重复性强不强、规则是否明确、数据是否结构化、异常比例是否可控、收益能否量化。',
    '',
    '做场景评估时，至少写清当前流程、核心痛点、RPA 方案、AI 方案、预期收益、难度和优先级。',
  ].join('\n')

  return {
    answer,
    recommendations: [
      { id: 'consultant-interview', type: 'consultant', title: '访谈问题清单', description: '按不同角色准备现场提问，快速摸清业务真实痛点。', targetPath: '/consultant' },
      { id: 'consultant-research', type: 'consultant', title: '需求调研模板', description: '记录流程、系统、处理量、错误率、异常和期望收益。', targetPath: '/consultant' },
      { id: 'consultant-scenario', type: 'consultant', title: '场景评估卡', description: '用标准结构评估 RPA / AI 场景是否值得推进。', targetPath: '/consultant' },
    ],
  }
}

function generateFallbackAnswer(): AssistantResponse {
  return {
    answer: [
      '你可以从三个方向开始理解跨境电商：',
      '',
      '1. 先看全流程：理解订单从哪里来、如何运营、如何履约、如何结算。',
      '2. 再看岗位：理解每个岗位每天具体做什么、和谁协作。',
      '3. 最后看机会点：判断哪些流程高频、重复、规则明确，适合 AI 或自动化。',
      '',
      '如果不知道怎么问，可以试试：“亚马逊运营每天做什么？”、“跨境电商哪里最适合做 AI 自动化？”、“解决方案顾问去客户现场应该问什么？”',
    ].join('\n'),
    recommendations: [
      createStageRecommendation(stages[0]),
      createStageRecommendation(findStageById('product-research') ?? stages[1]),
      { id: 'fallback-consultant', type: 'consultant', title: '顾问调研工具包', description: '从访谈、调研、机会判断和场景评估理解跨境电商客户。', targetPath: '/consultant' },
    ],
  }
}

function generateIndustryMapAnswer(question: string): AssistantResponse {
  const industryHints = INDUSTRY_MAP_KEYWORDS.filter(keyword => question.includes(keyword)).slice(0, 4)
  return {
    answer: [
      '这个问题适合先看「跨境电商平台与模式地图」。它不是平台排行榜，而是帮你快速建立业务认知：有哪些卖家类型、平台、业务打法，以及不同模式在流程、系统、岗位和 AI 自动化机会上有什么差异。',
      '',
      '你可以重点看三层：',
      '- 业务类型：平台型卖家、独立站、品牌出海、铺货、精品、B2B、DTC 等。',
      '- 代表平台：Amazon、TikTok Shop、Shopee、Shopify、阿里国际站等。',
      '- 差异和机会：不同模式的核心痛点、重点系统和优先自动化场景。',
      '',
      industryHints.length ? `这次问题命中的关键词：${industryHints.join('、')}。` : '如果你想继续追问，可以问“亚马逊精品和独立站有什么不同？”或“TikTok Shop 适合做哪些 AI 自动化？”',
    ].join('\n'),
    recommendations: [
      {
        id: 'industry-map-page',
        type: 'decision',
        title: '🌍 跨境电商平台与模式地图',
        description: '先理解跨境电商类型、代表平台、模式差异，再进入流程、岗位、SOP 和 AI 自动化机会点。',
        targetPath: '/industry-map',
      },
      {
        id: 'industry-map-ai-opportunities',
        type: 'opportunity',
        title: '不同模式 AI / 自动化机会点',
        description: '按 Amazon、TikTok Shop、独立站、B2B、海外仓等模式查看优先场景。',
        targetPath: '/industry-map',
      },
    ],
  }
}

function readCustomerPractices(): CustomerPractice[] {
  try {
    const raw = window.localStorage.getItem('customer_practices')
    return raw ? JSON.parse(raw) : sampleCustomerPractices
  } catch {
    return sampleCustomerPractices
  }
}

function generateCustomerPracticeAnswer(question: string): AssistantResponse {
  const practices = readCustomerPractices()
  const query = question.toLowerCase()
  const matched = practices.filter(item => JSON.stringify(item).toLowerCase().includes(query)).slice(0, 3)
  const recommended = matched.length ? matched : practices.slice(0, 3)

  return {
    answer: [
      '这类问题可以沉淀到「客户实践库」里看。它更适合记录真实项目中的客户行业、流程痛点、原人工做法、解决方案、ROI、复盘经验和可复制打法。',
      '',
      practices.length
        ? `当前本地已有 ${practices.length} 条客户实践记录，可以按行业、项目状态、场景类型和 ROI 数据筛选。`
        : '当前还没有客户实践记录，可以先新增一个真实客户项目或调研案例。',
      '',
      '建议记录时抓住 5 个点：客户行业、核心痛点、原人工流程、解决方案动作、上线结果 / ROI。这样后续做售前、复盘或相似客户方案时就能复用。',
    ].join('\n'),
    recommendations: [
      {
        id: 'customer-practices-page',
        type: 'consultant',
        title: '📁 客户实践库',
        description: '沉淀真实客户项目、解决方案、ROI、项目复盘和可复制打法。',
        targetPath: '/customer-practices',
      },
      ...recommended.map(item => ({
        id: `customer-practice-${item.id}`,
        type: 'consultant' as const,
        title: item.projectName,
        description: `${item.industry} · ${item.solution}`,
        targetPath: '/customer-practices',
      })),
    ],
  }
}

export function generateAIResponse(question: string): AssistantResponse {
  const trimmed = question.trim()
  if (!trimmed) return generateFallbackAnswer()

  if (includesAny(trimmed, CUSTOMER_PRACTICE_KEYWORDS) || (trimmed.includes('ROI') && trimmed.includes('案例'))) {
    return generateCustomerPracticeAnswer(trimmed)
  }

  if (includesAny(trimmed, INDUSTRY_MAP_KEYWORDS)) {
    return generateIndustryMapAnswer(trimmed)
  }

  if (trimmed.includes('一张订单') || trimmed.includes('订单是怎么流转') || trimmed.includes('订单怎么流转')) {
    return generateOrderFlowAnswer()
  }

  if (trimmed.includes('销售订单到补货计划') || (trimmed.includes('订单') && trimmed.includes('补货计划') && trimmed.includes('痛点'))) {
    return generateOrderToPlanningAnswer()
  }

  const role = findRole(trimmed)
  if (role && !includesAny(trimmed, DECISION_KEYWORDS)) {
    return generateRoleAnswer(role)
  }

  if (includesAny(trimmed, CONSULTANT_KEYWORDS)) return generateConsultantAnswer()
  if (includesAny(trimmed, DECISION_KEYWORDS)) return generateDecisionAnswer()
  if (includesAny(trimmed, SOP_KEYWORDS)) return generateLearningAnswer()
  if (includesAny(trimmed, AI_KEYWORDS)) return generateAutomationAnswer()

  const process = findProcess(trimmed)
  if (process) return generateProcessAnswer(process)

  return generateFallbackAnswer()
}

export async function callRealAIModel(userQuestion: string) {
  void userQuestion
  // TODO: 后续可以在这里通过后端 API 接入真实大模型。
  // 可选模型：OpenAI、Claude、DeepSeek、腾讯混元、通义千问等。
  // 注意：不要在前端暴露 API Key。
  return null
}

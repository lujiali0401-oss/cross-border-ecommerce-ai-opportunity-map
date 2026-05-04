export interface InterviewQuestion {
  id: string
  question: string
  why: string
}

export interface InterviewGroup {
  role: string
  icon: string
  color: string
  bg: string
  desc: string
  questions: InterviewQuestion[]
}

export const interviewGroups: InterviewGroup[] = [
  {
    role: '老板 / 店铺负责人',
    icon: '👔',
    color: '#0F3D5E',
    bg: '#FFEDD5',
    desc: '判断增长、利润、库存、广告 ROI、现金流和自动化预算',
    questions: [
      { id: 'boss-1', question: '目前主要销售平台有哪些？哪个平台贡献最多利润？', why: '先判断业务重心和平台优先级' },
      { id: 'boss-2', question: '销售增长主要来自新品、广告、活动，还是复购？', why: '明确增长杠杆，避免只谈降本' },
      { id: 'boss-3', question: '当前利润压力最大来自哪里：广告、物流、库存、佣金还是退货？', why: '跨境老板最关心利润结构' },
      { id: 'boss-4', question: '库存压力大不大？缺货和滞销哪个更严重？', why: '库存是跨境电商现金流和履约的关键' },
      { id: 'boss-5', question: '广告 ROI 是否稳定？有没有固定复盘机制？', why: '广告分析自动化往往 ROI 清晰' },
      { id: 'boss-6', question: '物流成本是否可控？异常订单和延误是否影响评价？', why: '物流体验直接影响平台表现和客户满意度' },
      { id: 'boss-7', question: '是否有多平台扩张计划？现有团队能否支撑？', why: '多平台扩张通常带来系统和自动化需求' },
      { id: 'boss-8', question: '哪些工作最依赖人工？是否有自动化预算？', why: '判断项目立项空间和第一批场景' },
      { id: 'boss-9', question: '最希望先解决增长问题还是降本问题？', why: '对齐老板语言，决定方案叙事' },
      { id: 'boss-10', question: '过去一年最想复盘但一直没沉淀下来的经验是什么？', why: '引出客户实践库和知识资产沉淀价值' },
    ],
  },
  {
    role: '运营负责人',
    icon: '🛒',
    color: '#0E7490',
    bg: '#ECFEFF',
    desc: '摸清选品、Listing、广告、活动、订单、客服和经营数据',
    questions: [
      { id: 'ops-1', question: '每天要处理多少 Listing？新品上架流程是怎样的？', why: '识别商品资料和上架自动化机会' },
      { id: 'ops-2', question: '广告数据多久复盘一次？目前怎么判断低效广告？', why: '广告数据汇总和异常预警常见高频场景' },
      { id: 'ops-3', question: '选品主要看哪些数据？竞品和评论怎么分析？', why: '判断 AI 选品和评论分析可行性' },
      { id: 'ops-4', question: '订单是否需要人工导出导入？哪些平台最麻烦？', why: '多平台订单同步是典型 RPA / 集成入口' },
      { id: 'ops-5', question: '客服消息量大不大？差评和售后如何处理？', why: '识别多语言客服、差评预警和知识库场景' },
      { id: 'ops-6', question: '红人营销是否有资源库？建联和跟进怎么记录？', why: '红人自动化非常适合沉淀客户实践' },
      { id: 'ops-7', question: '库存预警怎么做？补货建议靠系统还是经验？', why: '库存预警和智能补货直接影响现金流' },
      { id: 'ops-8', question: '每周需要输出哪些报表？耗时多久？', why: '经营报表自动化收益容易量化' },
      { id: 'ops-9', question: '平台规则变化、违规词、敏感词现在怎么检查？', why: '适合做规则检查和内容风控' },
      { id: 'ops-10', question: '最希望 AI 帮运营做哪三件事？', why: '让业务方自己定义优先级' },
    ],
  },
  {
    role: '财务负责人',
    icon: '💰',
    color: '#059669',
    bg: '#D1FAE5',
    desc: '关注平台账单、广告费、物流费、SKU 利润、回款和现金流',
    questions: [
      { id: 'fin-1', question: '平台账单如何下载？是否需要人工整理？', why: '平台账单自动下载是低难度场景' },
      { id: 'fin-2', question: '广告费、物流费、平台佣金如何核算？', why: '费用核对是利润真实性的关键' },
      { id: 'fin-3', question: 'SKU 利润多久核算一次？能看到单品真实利润吗？', why: 'SKU 利润是老板决策核心' },
      { id: 'fin-4', question: '多平台财务报表如何汇总？', why: '多平台汇总通常依赖 Excel' },
      { id: 'fin-5', question: '是否存在回款异常？多久能发现？', why: '回款异常预警可直接降低资金风险' },
      { id: 'fin-6', question: '利润表多久出一次？老板什么时候能看到？', why: '缩短核算周期是高层强需求' },
      { id: 'fin-7', question: '人工对账最耗时的是哪部分？', why: '定位第一批财务自动化场景' },
    ],
  },
  {
    role: 'IT / 自动化负责人',
    icon: '💻',
    color: '#D97706',
    bg: '#FEF3C7',
    desc: '摸清 ERP、OMS、WMS、平台后台、广告和客服系统的集成现状',
    questions: [
      { id: 'it-1', question: '目前使用哪些系统？ERP、OMS、WMS、店铺后台是否打通？', why: '判断集成基础和系统边界' },
      { id: 'it-2', question: '哪些数据还在 Excel？谁负责维护？', why: 'Excel 是自动化和数据治理的重要入口' },
      { id: 'it-3', question: '哪些流程每天要人工复制粘贴？', why: '跨平台、跨系统复制粘贴最适合 RPA' },
      { id: 'it-4', question: '是否已有 RPA 或自动化工具？谁维护？', why: '判断实施和运维能力' },
      { id: 'it-5', question: '是否有 API 接口能力？平台数据如何获取？', why: '决定用 RPA、接口还是半自动方案' },
      { id: 'it-6', question: '哪些场景业务方最想自动化？', why: '让 IT 和业务优先级对齐' },
      { id: 'it-7', question: '数据安全、账号权限和平台风控有哪些限制？', why: '跨境平台账号安全非常关键' },
    ],
  },
]

export interface ResearchField {
  id: string
  label: string
  placeholder: string
  example: string
  tip: string
  icon: string
}

export const researchFields: ResearchField[] = [
  { id: 'scene', label: '场景名称', placeholder: '例如：多平台订单同步、红人信息采集、广告日报生成...', example: '多平台订单到发货自动化', tip: '场景名称要能让老板一眼看懂价值', icon: '🏷️' },
  { id: 'platform', label: '所属平台', placeholder: 'Amazon / TikTok Shop / Shopee / Shopify / 阿里国际站...', example: 'Amazon、Shopee、TikTok Shop', tip: '平台不同，接口、规则和风控差异很大', icon: '🌐' },
  { id: 'roles', label: '涉及岗位', placeholder: '订单处理专员、运营、仓储、客服...', example: '订单处理专员、仓储专员、物流专员', tip: '记录岗位和人数，方便算 ROI', icon: '👥' },
  { id: 'currentFlow', label: '当前流程', placeholder: '人工现在怎么做？一步一步写清楚...', example: '人工下载平台订单 → 整理 Excel → 导入 ERP → 通知仓库发货', tip: '最好让客户现场演示一遍真实操作', icon: '🔄' },
  { id: 'frequency', label: '处理频率 / 量级', placeholder: '每天多少单、多少条消息、多少个红人、多少张账单...', example: '日均 300 单，促销日 1000+ 单', tip: '频率决定自动化的经济价值', icon: '📊' },
  { id: 'systems', label: '涉及系统', placeholder: '平台后台、ERP、OMS、WMS、广告后台、客服系统...', example: 'Amazon Seller Central、ERP、WMS、物流商系统', tip: '系统边界决定技术路线', icon: '💻' },
  { id: 'painPoint', label: '核心痛点', placeholder: '最痛的是耗时、错误、漏跟进、库存、利润，还是体验...', example: '人工导入导出频繁，异常订单容易遗漏，物流状态不同步', tip: '用客户原话记录，这句话往往是方案 PPT 开篇', icon: '🎯' },
  { id: 'automation', label: '自动化方案', placeholder: 'RPA、接口、表格自动化、定时任务、规则引擎...', example: '定时下载订单，同步 ERP，异常订单推送人工复核', tip: '先从可控的半自动开始，不必一上来全自动', icon: '⚙️' },
  { id: 'aiPlan', label: 'AI 方案', placeholder: '分类、生成、分析、预测、知识库、智能助手...', example: 'AI 识别异常订单、自动生成运营日报和客服回复建议', tip: 'AI 适合处理文本、判断、总结、预测和推荐', icon: '🤖' },
  { id: 'expectedGain', label: '预期收益', placeholder: '节省时间？降低错误？提升广告 ROI？减少库存？...', example: '订单处理时间减少 70%，异常订单漏处理率下降', tip: '收益越具体，越容易立项', icon: '💡' },
  { id: 'nextStep', label: '下一步验证动作', placeholder: '要看哪些数据？找谁确认？做什么 PoC？', example: '拉取一周订单样本，统计异常类型和人工处理时间', tip: '调研结束要带走明确下一步', icon: '✅' },
]

export interface OpportunityCriteria {
  id: string
  label: string
  desc: string
  highScore: string
  lowScore: string
  icon: string
  color: string
  bg: string
}

export const opportunityCriteria: OpportunityCriteria[] = [
  { id: 'frequency', label: '高频', desc: '每天或每周重复发生，自动化有规模收益', highScore: '每天几十到几千次', lowScore: '偶发、低频', icon: '🔁', color: '#0E7490', bg: '#ECFEFF' },
  { id: 'repetitive', label: '重复', desc: '操作步骤固定，可复用规则', highScore: '90% 按固定路径执行', lowScore: '每次都需要大量主观判断', icon: '♻️', color: '#059669', bg: '#D1FAE5' },
  { id: 'rules', label: '规则明确', desc: '能写出判断条件和异常分支', highScore: '规则可穷举', lowScore: '依赖个人经验', icon: '📐', color: '#0F3D5E', bg: '#FFEDD5' },
  { id: 'crossPlatform', label: '跨平台', desc: '涉及多个平台后台或店铺', highScore: 'Amazon、TikTok、Shopee 多平台同步', lowScore: '单平台且后台已有能力', icon: '🌐', color: '#0284C7', bg: '#E0F2FE' },
  { id: 'crossSystem', label: '跨系统', desc: '涉及平台、ERP、OMS、WMS、广告、客服系统之间传递数据', highScore: '2 个以上系统手工复制粘贴', lowScore: '单系统内闭环', icon: '🔗', color: '#D97706', bg: '#FEF3C7' },
  { id: 'structured', label: '数据结构化', desc: '输入输出字段清晰，适合自动处理', highScore: '订单、账单、广告表、库存表字段稳定', lowScore: '大量图片、自由文本且无规则', icon: '🗄️', color: '#0891B2', bg: '#CFFAFE' },
  { id: 'time', label: '人工耗时长', desc: '每次或累计耗时明显', highScore: '每月超过 40 人时', lowScore: '每月几分钟', icon: '⏰', color: '#DC2626', bg: '#FFE4E6' },
  { id: 'error', label: '错误率高', desc: '人工错误会导致发错货、利润错算、差评或漏跟进', highScore: '错误影响客户体验或资金', lowScore: '错误影响很小', icon: '🛡️', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'revenue', label: '影响收入', desc: '能提升转化、广告 ROI、复购或销售机会', highScore: '直接影响销售额或转化率', lowScore: '只改善体验但难量化', icon: '📈', color: '#F97316', bg: '#FFEDD5' },
  { id: 'cost', label: '影响成本', desc: '能降低人工、广告、物流、库存或售后成本', highScore: '可测算节省金额', lowScore: '成本影响不明显', icon: '💰', color: '#F97316', bg: '#FEF3C7' },
  { id: 'inventory', label: '影响库存', desc: '能减少缺货、滞销、资金占用或补货失误', highScore: '库存和现金流影响大', lowScore: '不涉及库存', icon: '📦', color: '#06B6D4', bg: '#E0F2FE' },
  { id: 'cx', label: '影响客户体验', desc: '能改善客服、物流、差评、退款和响应时效', highScore: '直接影响评价和复购', lowScore: '客户无感知', icon: '⭐', color: '#EC4899', bg: '#FCE7F3' },
]

export type Difficulty = 'low' | 'medium' | 'high'
export type Priority = 'P0' | 'P1' | 'P2'

export interface ScenarioCard {
  id: string
  name: string
  icon: string
  color: string
  stage: string
  roles: string[]
  currentFlow: string
  painPoint: string
  rpaApproach: string
  aiApproach: string
  expectedGain: string
  difficulty: Difficulty
  priority: Priority
  aiScore: number
  rpaScore: number
}

export const scenarioCards: ScenarioCard[] = [
  {
    id: 'influencer-automation',
    name: '红人营销自动化',
    icon: '🎬',
    color: '#EC4899',
    stage: '内容营销',
    roles: ['红人营销专员', '内容运营'],
    currentFlow: '人工搜索红人、复制资料到表格、发送邀约、跟进样品和内容发布状态。',
    painPoint: '红人信息分散、筛选耗时、沟通记录难沉淀、效果数据回收困难。',
    rpaApproach: '自动采集公开资料，更新红人资源库，定时提醒跟进状态。',
    aiApproach: 'AI 生成建联邮件、分析红人画像、对内容效果做评分。',
    expectedGain: '资料整理时间减少 60%+，跟进遗漏下降，红人资源可复用。',
    difficulty: 'medium',
    priority: 'P0',
    aiScore: 9,
    rpaScore: 8,
  },
  {
    id: 'order-sync',
    name: '多平台订单同步',
    icon: '📥',
    color: '#0E7490',
    stage: '订单处理',
    roles: ['订单处理专员', 'IT / 自动化负责人'],
    currentFlow: '运营从多个平台导出订单，整理 Excel 后导入 ERP / OMS，再通知仓库发货。',
    painPoint: '人工导出导入频繁，异常订单容易漏，物流单号回填慢。',
    rpaApproach: 'RPA 或接口定时下载订单，同步 ERP，异常订单推送人工复核。',
    aiApproach: 'AI 识别地址异常、重复订单、风险订单并生成处理建议。',
    expectedGain: '订单处理时间减少 70%，发货及时率提升，异常漏处理下降。',
    difficulty: 'medium',
    priority: 'P0',
    aiScore: 7,
    rpaScore: 9,
  },
  {
    id: 'ad-report',
    name: '广告日报自动生成',
    icon: '📣',
    color: '#F97316',
    stage: '广告投放',
    roles: ['广告投放专员', '数据分析师'],
    currentFlow: '人工下载广告后台数据，整理关键词、广告组、ACOS、ROAS，再写日报。',
    painPoint: '日报耗时、低效广告发现滞后、预算调整依赖个人经验。',
    rpaApproach: '定时拉取广告数据，自动生成标准日报和异常清单。',
    aiApproach: 'AI 总结广告表现、标记低效词、给出预算调整建议。',
    expectedGain: '日报从 1 小时降到 5 分钟，广告异常当天发现。',
    difficulty: 'low',
    priority: 'P0',
    aiScore: 8,
    rpaScore: 8,
  },
  {
    id: 'listing-ai',
    name: 'Listing 优化助手',
    icon: '🛒',
    color: '#10B981',
    stage: '产品上架',
    roles: ['亚马逊运营', 'Listing 优化专员'],
    currentFlow: '运营人工研究竞品标题、五点描述和关键词，再手写 Listing。',
    painPoint: '优化依赖经验、多语言耗时、平台敏感词容易遗漏。',
    rpaApproach: '自动整理竞品关键词和商品资料，检查字段完整性。',
    aiApproach: 'AI 生成标题、五点描述、A+ 文案、多语言翻译和敏感词检查。',
    expectedGain: '上架资料准备时间减少，Listing 质量更稳定。',
    difficulty: 'low',
    priority: 'P1',
    aiScore: 9,
    rpaScore: 6,
  },
  {
    id: 'finance-profit',
    name: 'SKU 利润自动计算',
    icon: '💰',
    color: '#D97706',
    stage: '财务结算',
    roles: ['财务结算专员', '跨境电商老板'],
    currentFlow: '财务人工下载平台账单、广告费、物流费，再用 Excel 汇总 SKU 利润。',
    painPoint: '账单格式不同、核算周期长、老板看不到实时真实利润。',
    rpaApproach: '自动下载账单和费用数据，按 SKU 汇总成本与收入。',
    aiApproach: 'AI 解释利润波动，提示异常费用和亏损 SKU。',
    expectedGain: '利润核算从数天缩短到小时级，经营决策更及时。',
    difficulty: 'medium',
    priority: 'P0',
    aiScore: 8,
    rpaScore: 9,
  },
  {
    id: 'customer-service-ai',
    name: '多语言客服助手',
    icon: '🎧',
    color: '#06B6D4',
    stage: '客服售后',
    roles: ['客服专员', '售后专员'],
    currentFlow: '客服人工阅读多语言消息，查询订单和物流状态后手动回复。',
    painPoint: '消息量大、回复慢、常见问题重复、差评处理滞后。',
    rpaApproach: '自动创建工单、查询订单物流、推送超时提醒。',
    aiApproach: 'AI 分类消息、生成多语言回复、识别负面情绪和差评风险。',
    expectedGain: '响应效率提升，新客服上手更快，差评风险提前发现。',
    difficulty: 'medium',
    priority: 'P1',
    aiScore: 9,
    rpaScore: 7,
  },
]

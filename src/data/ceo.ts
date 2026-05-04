// ─── 成熟度模型 ────────────────────────────────────────────────
export interface MaturityLevel {
  level: number
  name: string
  tagline: string
  icon: string
  color: string
  bg: string
  border: string
  description: string
  symptoms: string[]
  problems: string[]
  nextSteps: string[]
  systems: string[]
  automationScenes: string[]
}

export const maturityLevels: MaturityLevel[] = [
  {
    level: 0,
    name: '纸质 / 人工阶段',
    tagline: '信息靠传话，数据无可查',
    icon: '📄',
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#D1D5DB',
    description: '企业运营高度依赖纸质单据和人工传递，数据无法追溯，管理层无法实时掌握经营状态。',
    symptoms: [
      '订单、运营、仓库、财务大量依赖纸质单据',
      '信息传递靠口头、微信、电话',
      '出了问题无法快速定位责任',
      '老板想看数据，要等人工汇报才知道',
    ],
    problems: [
      '信息丢失或传递错误概率高',
      '无法追溯历史数据做决策',
      '员工离职带走大量隐性知识',
      '流程优化无从下手，没有数据支撑',
    ],
    nextSteps: [
      '梳理核心业务流程，画出端到端流程图',
      '制定标准化表单，统一单据格式',
      '建立基础数据台账（客户、产品、供应商）',
      '明确各环节负责人和交接标准',
    ],
    systems: ['基础 ERP（轻量版）', '企业微信 / 钉钉', '在线表单工具'],
    automationScenes: ['标准化表单填写', '简单消息提醒通知', '基础报表汇总'],
  },
  {
    level: 1,
    name: 'Excel 管理阶段',
    tagline: '数据有了，但分散在每个人的电脑里',
    icon: '📊',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FDE68A',
    description: '业务数据已经电子化，但主要依靠 Excel 管理，数据分散且版本混乱，报表需要人工汇总。',
    symptoms: [
      '大量业务通过 Excel 管理，人均 20+ 个 Excel 文件',
      '同一份数据多人维护，版本混乱',
      '月末汇总报表要花 2-3 天',
      '数据口径不统一，同一指标各部门数字不同',
    ],
    problems: [
      '数据孤岛严重，无法跨部门共享',
      '人工汇总效率低、错误率高',
      '关键人员休假/离职导致业务停摆',
      '数据时效差，决策依据往往是上周/上月数据',
    ],
    nextSteps: [
      '统一基础数据标准（主数据管理）',
      '引入轻量 SaaS 系统替代核心 Excel',
      '建立数据录入规范，减少重复录入',
      '试点一个部门的系统化，积累经验',
    ],
    systems: ['轻量 ERP / 进销存', 'CRM 系统', '在线协作文档（飞书/钉钉）'],
    automationScenes: ['Excel 数据自动汇总', '邮件/消息自动通知', '定时报表自动发送'],
  },
  {
    level: 2,
    name: '单系统应用阶段',
    tagline: '系统有了，但各自为政',
    icon: '🖥',
    color: '#0E7490',
    bg: '#ECFEFF',
    border: '#A5F3FC',
    description: '已上线部分核心系统，单部门效率提升明显，但系统之间尚未打通，仍需大量人工导入导出。',
    symptoms: [
      '已有 ERP、OMS、WMS、广告后台 中的 1-2 个系统',
      '系统之间数据不互通，靠人工导出再导入',
      '同一数据在多个系统中重复维护',
      '上了系统但流程未重塑，"系统比 Excel 还麻烦"',
    ],
    problems: [
      '系统孤岛导致数据二次录入，效率未提升',
      '接口未打通，跨部门协作仍靠微信',
      '系统使用率不高，员工绕系统走',
      '系统投资回报不符合预期',
    ],
    nextSteps: [
      '打通核心系统数据流（ERP ↔ CRM ↔ WMS）',
      '建立数据流转规则，消灭手工导入',
      '识别跨系统自动化场景（RPA 切入点）',
      '推行流程再造，让业务配合系统而非绕系统',
    ],
    systems: ['系统集成平台（iPaaS）', 'RPA 工具', '统一数据仓库'],
    automationScenes: ['跨系统数据同步', '订单录入自动化', '系统间状态同步通知'],
  },
  {
    level: 3,
    name: '多系统协同阶段',
    tagline: '系统开始协同，流程逐步线上化',
    icon: '🔗',
    color: '#0F3D5E',
    bg: '#FFEDD5',
    border: '#FDBA74',
    description: '主要系统已协同运转，业务流程线上化程度较高，开始具备数据分析基础，跨部门协作效率提升。',
    symptoms: [
      'ERP、OMS、WMS、广告后台、客服系统 等系统协同工作',
      '跨部门审批和流程基本在线上完成',
      '有初步的数据报表，但深度分析能力不足',
      '数据评价和流程标准化仍需持续优化',
    ],
    problems: [
      '数据评价参差不齐，垃圾数据影响分析',
      '缺乏统一指标体系，各系统数据口径不一',
      '管理层看不到实时经营全貌',
      '已有数据但利用率低，停留在"能查"不"能用"',
    ],
    nextSteps: [
      '建立主数据管理（MDM）和数据治理体系',
      '搭建经营驾驶舱，实现核心指标可视化',
      '建立流程监控和预警机制',
      '开始引入 AI/机器学习模型做预测分析',
    ],
    systems: ['BI 数据分析平台', '数据仓库（数据湖）', '流程挖掘工具'],
    automationScenes: ['库存预警自动通知', 'Listing自动生成', '对账自动核对', '运营日报自动发送'],
  },
  {
    level: 4,
    name: '数据驱动阶段',
    tagline: '数字说话，管理从经验转向数据',
    icon: '📈',
    color: '#059669',
    bg: '#D1FAE5',
    border: '#A7F3D0',
    description: '核心经营数据全面可视化，管理层可实时查看经营状况，部分风险可提前预警，管理决策基于数据而非经验。',
    symptoms: [
      '有实时经营驾驶舱，订单/库存/库存/回款一屏可见',
      '异常情况有系统预警，而非事后发现',
      '周/月度经营分析有数据支撑，不靠记忆和感觉',
      '业务部门开始主动要数据、看数据',
    ],
    problems: [
      '预测能力不足，只能看历史不能看未来',
      '高频重复性工作仍消耗大量人力',
      '知识和经验沉淀在人头而非系统',
      '面对个性化需求响应速度慢',
    ],
    nextSteps: [
      '引入机器学习做需求预测、风险预测',
      '推动高频场景智能化（AI 辅助）',
      '开始建立企业知识库，沉淀业务经验',
      '建立人机协同工作流，让 AI 成为业务助手',
    ],
    systems: ['AI 平台 / 机器学习平台', '知识图谱', '智能分析工具'],
    automationScenes: ['需求预测与库存优化', '动态补货建议', '风险提前预警', 'AI 辅助分析报告'],
  },
  {
    level: 5,
    name: 'AI 自动化阶段',
    tagline: 'AI 成为业务伙伴，人专注高价值判断',
    icon: '🤖',
    color: '#0284C7',
    bg: '#E0F2FE',
    border: '#BAE6FD',
    description: '高频重复流程全面自动化，AI 辅助决策，企业知识库成熟，人机协同成为日常工作模式。',
    symptoms: [
      'AI 辅助Listing、补货、预警、分析、客服，员工从执行者变成监督者',
      '高频重复流程自动化率超过 70%',
      '新员工可以通过知识库快速上手，上手周期缩短 60%+',
      '管理层每日经营简报自动生成，无需人工汇报',
    ],
    problems: [
      '持续需要 AI 场景的运营和优化',
      '组织需要建立人机协同的新工作方式',
      '企业知识库需要持续维护和迭代',
    ],
    nextSteps: [
      '建立 AI 场景运营机制，持续评估和优化',
      '持续沉淀业务知识，完善企业知识库',
      '探索 AI 与业务深度融合的新模式',
      '培养内部 AI 应用和运营能力',
    ],
    systems: ['企业 AI 平台', 'RAG 知识库', 'AI Agent 工作流'],
    automationScenes: ['全链路智能客服', 'AI 经营分析助手', '智能补货与供应链优化', '自动合规审查'],
  },
]

// ─── ROI 评估框架 ─────────────────────────────────────────────
export interface ROIDimension {
  id: string
  name: string
  icon: string
  color: string
  bg: string
  desc: string
  scenes: string
  measure: string
  example: string
}

export const roiDimensions: ROIDimension[] = [
  {
    id: 'labor',
    name: '节省人工时间',
    icon: '⏱',
    color: '#0E7490',
    bg: '#ECFEFF',
    desc: '减少人工录入、复制、统计、核对、汇报等重复性工作时间',
    scenes: '订单录入、对账、运营日报、库存盘点、报表汇总',
    measure: '节省人数 × 月均薪资 × 月度节省比例',
    example: '3人×8000元×60% = 节省 14,400 元/月',
  },
  {
    id: 'error',
    name: '降低错误率',
    icon: '🛡',
    color: '#DC2626',
    bg: '#FFE4E6',
    desc: '减少因人工操作失误导致的返工、投诉、赔偿等损失',
    scenes: '订单录入、发货核对、财务对账、Listing计算',
    measure: '月均错误次数 × 单次处理成本 × 减少比例',
    example: '15次×500元×90% = 节省 6,750 元/月',
  },
  {
    id: 'delivery',
    name: '提高订单准交率',
    icon: '🚚',
    color: '#D97706',
    bg: '#FEF3C7',
    desc: '通过库存预警、补货优化减少因内部原因导致的交期延误',
    scenes: '运营计划、采购备料、库存评估、库存预警',
    measure: '延误订单金额 × 延误罚款率 × 改善比例',
    example: '月延误订单 50万 × 2% × 50% = 5,000 元/月',
  },
  {
    id: 'inventory',
    name: '降低库存积压',
    icon: '🏭',
    color: '#059669',
    bg: '#D1FAE5',
    desc: '通过预测补货、动态安全库存减少呆滞库存和资金占用',
    scenes: '库存预警、采购建议、销售预测、仓储管理',
    measure: '呆滞库存金额 × 资金成本率 × 改善比例',
    example: '呆滞库存100万 × 6% × 30% = 18,000 元/年',
  },
  {
    id: 'satisfaction',
    name: '提升客户满意度',
    icon: '⭐',
    color: '#F59E0B',
    bg: '#FEF9C3',
    desc: '更快响应、更少出错、更好服务，减少客户流失，增加复购',
    scenes: '售后响应、Listing速度、发货准确、异常处理',
    measure: '流失客户减少数 × 客户年均贡献额',
    example: '每年少流失2个客户 × 20万 = 40 万/年',
  },
  {
    id: 'settlement',
    name: '缩短结算周期',
    icon: '💰',
    color: '#16A34A',
    bg: '#DCFCE7',
    desc: '加速对账、开票、回款流程，改善现金流',
    scenes: '财务对账、发票核对、回款跟进、结算提醒',
    measure: '应收账款余额 × 资金成本率 × 周期缩短天数/30',
    example: '应收1000万 × 6% × 5天/30 = 1 万/月',
  },
  {
    id: 'visibility',
    name: '降低管理黑盒',
    icon: '🔍',
    color: '#0F3D5E',
    bg: '#FFEDD5',
    desc: '经营数据实时可见，减少因信息不透明导致的管理失控和坏账',
    scenes: '经营看板、风险预警、订单追踪、绩效监控',
    measure: '通过案例估算：每年减少1次重大管理事故的损失',
    example: '减少1次10万级别的管理损失 = 10 万/年',
  },
  {
    id: 'collaboration',
    name: '降低跨部门沟通成本',
    icon: '🤝',
    color: '#0284C7',
    bg: '#E0F2FE',
    desc: '减少因信息不对称导致的会议、电话确认、邮件沟通',
    scenes: '订单状态同步、运营进度可见、库存实时查询',
    measure: '日均沟通次数 × 单次时间成本 × 人数 × 工作日',
    example: '10次×10分钟×10人×250天 = 417 人天/年',
  },
  {
    id: 'accuracy',
    name: '提高数据准确性',
    icon: '✅',
    color: '#0891B2',
    bg: '#CFFAFE',
    desc: '数据准确是后续分析、预测和决策的基础，间接价值巨大',
    scenes: '基础数据管理、主数据治理、数据校验',
    measure: '数据错误导致的决策失误成本 × 改善概率',
    example: '每年因数据错误导致的损失估算 × 减少 50%',
  },
  {
    id: 'decision',
    name: '提高管理层决策效率',
    icon: '📊',
    color: '#6D28D9',
    bg: '#F5F3FF',
    desc: '管理层从搜集信息变成分析决策，决策评价和速度双提升',
    scenes: '经营驾驶舱、数据分析、市场预测、战略规划',
    measure: '管理层决策准备时间缩短 × 高管时间成本',
    example: 'CEO节省4小时/周 × 500元/时 × 50周 = 10 万/年',
  },
]

// ─── 优先级矩阵 ────────────────────────────────────────────────
export interface MatrixItem {
  name: string
  scene: string
}

export interface MatrixQuadrant {
  id: string
  title: string
  subtitle: string
  action: string
  color: string
  bg: string
  border: string
  icon: string
  items: MatrixItem[]
}

export const matrixQuadrants: MatrixQuadrant[] = [
  {
    id: 'quick-win',
    title: '优先落地',
    subtitle: '高价值 · 低难度',
    action: '立即启动，3 个月内可见成效',
    color: '#059669',
    bg: '#D1FAE5',
    border: '#A7F3D0',
    icon: '🚀',
    items: [
      { name: '订单录入自动化', scene: '销售支持' },
      { name: '运营日报自动汇总', scene: '运营统计' },
      { name: '售后知识库问答', scene: '售后客服' },
      { name: '发货通知自动同步', scene: '物流仓库' },
      { name: '对账自动核对', scene: '财务部门' },
      { name: '库存预警自动推送', scene: '采购计划' },
    ],
  },
  {
    id: 'strategic',
    title: '重点规划',
    subtitle: '高价值 · 高难度',
    action: '列入年度规划，分阶段推进',
    color: '#0E7490',
    bg: '#ECFEFF',
    border: '#A5F3FC',
    icon: '🎯',
    items: [
      { name: '智能补货系统', scene: '运营计划' },
      { name: '需求与库存预测', scene: '供应链' },
      { name: '经营驾驶舱', scene: '管理层' },
      { name: 'AI 经营分析助手', scene: '老板 / CEO' },
      { name: '客户流失预测', scene: '销售管理' },
      { name: '评价根因智能分析', scene: '品质部门' },
    ],
  },
  {
    id: 'quick-pilot',
    title: '快速试点',
    subtitle: '低价值 · 低难度',
    action: '作为练兵场，积累技术和经验',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FDE68A',
    icon: '🧪',
    items: [
      { name: '表单自动生成', scene: '行政后勤' },
      { name: '固定报表定时推送', scene: '各部门' },
      { name: '简单消息提醒', scene: '跨部门通知' },
      { name: '会议纪要自动整理', scene: '管理会议' },
    ],
  },
  {
    id: 'avoid',
    title: '暂不建议',
    subtitle: '低价值 · 高难度',
    action: '不在当前阶段投入，等基础成熟',
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#D1D5DB',
    icon: '⏸',
    items: [
      { name: '无明确 ROI 的复杂定制', scene: '— ' },
      { name: '数据基础不足的 AI 预测', scene: '数据治理未完成' },
      { name: '业务部门不参与的系统改造', scene: '— ' },
      { name: '替代人工 100% 自动化', scene: '例外场景过多' },
    ],
  },
]

// ─── 数字化路线图 ─────────────────────────────────────────────
export interface RoadmapPhase {
  phase: number
  name: string
  duration: string
  icon: string
  color: string
  bg: string
  goal: string
  actions: string[]
  outputs: string[]
  successSign: string
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: 1,
    name: '流程梳理',
    duration: '1-2 个月',
    icon: '🗺',
    color: '#0F3D5E',
    bg: '#FFEDD5',
    goal: '搞清楚现在怎么做，找出最大的浪费和痛点',
    actions: [
      '画出订单到发货全链路流程图',
      '访谈各业务部门负责人和一线岗位',
      '记录所有系统和表单，统计处理量',
      '输出"流程痛点清单"和优先级排序',
    ],
    outputs: ['端到端流程图', '痛点清单', '初步 ROI 估算'],
    successSign: '老板和业务部门对痛点清单拍桌说"就是这个！"',
  },
  {
    phase: 2,
    name: '数据打通',
    duration: '2-4 个月',
    icon: '🔗',
    color: '#0E7490',
    bg: '#ECFEFF',
    goal: '消灭数据孤岛，让数据能自动流转而非靠人工传递',
    actions: [
      '梳理主数据（客户/产品/供应商/物料）标准',
      '确认各系统边界和数据所有权',
      '打通关键系统接口（ERP ↔ CRM ↔ WMS）',
      '建立数据同步规则，测试数据一致性',
    ],
    outputs: ['主数据标准文档', '系统集成架构图', '数据流转规则'],
    successSign: '同一笔订单，销售、运营、仓库看到的数据一致',
  },
  {
    phase: 3,
    name: '高频场景自动化',
    duration: '3-6 个月',
    icon: '⚙️',
    color: '#059669',
    bg: '#D1FAE5',
    goal: '用 RPA 和自动化工具解放高频重复劳动，快速见效',
    actions: [
      '选择 2-3 个高频、规则明确的场景试点',
      '评估 ROI，制定验收标准',
      '开发和测试，小范围试跑 2 周',
      '验收后复制到更多场景',
    ],
    outputs: ['自动化机器人上线', 'ROI 验证报告', '可复制的方法论'],
    successSign: '试点场景人工时间减少 60% 以上，业务部门主动要求推广',
  },
  {
    phase: 4,
    name: '经营分析驾驶舱',
    duration: '2-3 个月',
    icon: '📊',
    color: '#D97706',
    bg: '#FEF3C7',
    goal: '让管理层一眼看清经营全貌，从"猜"变成"看"',
    actions: [
      '定义核心指标体系（销售/广告/库存/物流/利润）',
      '统一各系统数据口径',
      '搭建可视化看板，设置异常预警',
      '建立周/月度数据复盘机制',
    ],
    outputs: ['经营驾驶舱上线', '指标体系文档', '管理复盘 SOP'],
    successSign: '老板每天早上打开看板，不再需要等汇报才知道情况',
  },
  {
    phase: 5,
    name: 'AI 助手与智能决策',
    duration: '持续迭代',
    icon: '🤖',
    color: '#0284C7',
    bg: '#E0F2FE',
    goal: '让 AI 成为每个核心岗位的业务助手，提升决策评价',
    actions: [
      '建立企业知识库（产品手册/历史案例/SOP）',
      '接入业务系统数据，让 AI 有上下文',
      '设计 AI 工作流（Listing/补货/客服/分析）',
      '建立人机协同机制，明确哪些 AI 决策人来审核',
    ],
    outputs: ['企业知识库上线', 'AI 助手工作流', '人机协同 SOP'],
    successSign: '新员工靠知识库 2 周上手，老员工用 AI 助手提效 40%',
  },
]

// ─── 失败风险提醒 ─────────────────────────────────────────────
export interface FailureRisk {
  id: string
  name: string
  icon: string
  color: string
  bg: string
  desc: string
  consequence: string
  prevention: string
}

export const failureRisks: FailureRisk[] = [
  {
    id: 'process',
    name: '只买系统，不改流程',
    icon: '🚫',
    color: '#DC2626',
    bg: '#FFE4E6',
    desc: '购买系统后，仍按原有方式操作，系统沦为摆设或"电子版 Excel"',
    consequence: '系统投资浪费，员工怨声载道，项目被迫推倒重来',
    prevention: '上系统前先梳理流程，以流程优化为目标选系统，而非以有系统为目标',
  },
  {
    id: 'piecemeal',
    name: '只做单点自动化，没有全链路设计',
    icon: '🧩',
    color: '#D97706',
    bg: '#FEF3C7',
    desc: '把一个个孤立的自动化场景堆砌起来，但整体链路仍然断裂',
    consequence: '局部效率提升，整体效率未改善，甚至出现新的信息孤岛',
    prevention: '先设计全链路，再分阶段落地；每个自动化场景都要考虑上下游连接',
  },
  {
    id: 'no-business',
    name: '业务部门不参与',
    icon: '👻',
    color: '#0F3D5E',
    bg: '#FFEDD5',
    desc: 'IT 部门主导推进，业务部门消极配合，系统无法满足实际需求',
    consequence: '上线后没人用，系统成为"幽灵系统"，项目名存实亡',
    prevention: '业务负责人必须是项目 Owner，IT 是技术支持，不能颠倒主次',
  },
  {
    id: 'data-standard',
    name: '数据标准不统一',
    icon: '🗃',
    color: '#0E7490',
    bg: '#ECFEFF',
    desc: '同一产品在不同系统有不同编码，同一客户有不同名称，数据无法合并分析',
    consequence: '数据无法跑通，报表对不上，AI 模型无从训练',
    prevention: '项目初期就做主数据管理，建立全公司统一的数据标准',
  },
  {
    id: 'no-ops',
    name: '没有持续运营机制',
    icon: '📉',
    color: '#059669',
    bg: '#D1FAE5',
    desc: '项目上线即宣告成功，无人负责持续优化、维护和推广',
    consequence: '系统逐渐老化，使用率下降，价值持续缩水',
    prevention: '指定专职数字化运营人员，建立季度复盘机制，持续迭代优化',
  },
  {
    id: 'no-owner',
    name: '没有明确负责人',
    icon: '👤',
    color: '#0891B2',
    bg: '#CFFAFE',
    desc: '项目是"大家的事"，遇到问题互相推诿，决策迟缓',
    consequence: '问题积压无人解决，项目进度拖延，各部门开始甩锅',
    prevention: '必须由 老板 或数字化负责人作为唯一 Owner，有决策权和资源权',
  },
  {
    id: 'no-roi',
    name: '没有衡量 ROI',
    icon: '💸',
    color: '#D97706',
    bg: '#FEF9C3',
    desc: '没有设定量化目标，无法证明项目价值，导致续费和扩展预算难以获批',
    consequence: '下一期预算被砍，项目难以为继，数字化推进失去动力',
    prevention: '项目立项时就定 ROI 目标，上线后定期对比，用数字说话',
  },
  {
    id: 'tech-only',
    name: '只重技术，不重组织协同',
    icon: '⚙️',
    color: '#6D28D9',
    bg: '#F5F3FF',
    desc: '把数字化当技术项目而非管理变革，忽视组织架构和利益格局的调整',
    consequence: '系统上线后部门间推诿依旧，流程变革阻力大，技术能力闲置',
    prevention: '数字化是"一把手工程"，配套推进组织流程优化和利益机制调整',
  },
  {
    id: 'no-training',
    name: '项目上线后缺少培训',
    icon: '🎓',
    color: '#16A34A',
    bg: '#DCFCE7',
    desc: '系统上线后员工不会用或用错，数据评价差，流程执行偏差大',
    consequence: '系统数据评价低，后续分析和 AI 失去数据基础',
    prevention: '上线前 2 周全员培训，上线后 1 个月专人驻守辅导，建立操作手册',
  },
  {
    id: 'no-knowledge',
    name: '没有沉淀 SOP 和知识库',
    icon: '📚',
    color: '#B45309',
    bg: '#FEF3C7',
    desc: '业务经验全在人脑中，关键人员离职就带走，新人上手慢，错误重复出现',
    consequence: '组织能力无法积累，人才依赖严重，扩张复制困难',
    prevention: '将流程、经验、决策逻辑文档化，建立结构化知识库，作为 AI 训练基础',
  },
]

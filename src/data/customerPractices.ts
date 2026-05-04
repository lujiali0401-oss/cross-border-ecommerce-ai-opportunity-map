export type PracticeStatus = '调研中' | '方案设计' | '实施中' | '已上线' | '已复盘' | '暂停 / 未推进'
export type PracticeOpportunityType = '选品分析' | 'Listing 优化' | '广告分析' | '红人营销' | '订单自动化' | '物流履约' | '客服售后' | '财务结算' | '经营分析' | '系统集成' | '老客户营销' | '流程自动化' | 'AI 助手' | '数据分析' | '风险预警' | '知识库 / 培训'

export interface CustomerPractice {
  id: string
  projectName: string
  customerName?: string
  anonymous: boolean
  industry: string
  companySize?: string
  customerType?: string
  status: PracticeStatus
  date: string

  businessBackground: string
  relatedProcesses: string[]
  relatedRoles: string[]
  relatedSystems: string[]

  originalManualProcess: string
  painPoints: string[]
  impactScope?: string
  baselineMetrics?: string

  solution: string
  opportunityType: PracticeOpportunityType
  implementationActions: string[]
  tools: string[]
  dataSources: string[]

  results?: string
  roiData?: string
  timeSaved?: string
  manpowerSaved?: string
  revenueImpact?: string
  errorRateChange?: string

  successLessons: string[]
  challenges: string[]
  reusablePlaybook: string[]
  nextOpportunities: string[]
  tags: string[]
  notes?: string

  createdAt: string
  updatedAt: string
}

export const PRACTICE_STATUSES: PracticeStatus[] = ['调研中', '方案设计', '实施中', '已上线', '已复盘', '暂停 / 未推进']
export const PRACTICE_OPPORTUNITY_TYPES: PracticeOpportunityType[] = ['选品分析', 'Listing 优化', '广告分析', '红人营销', '订单自动化', '物流履约', '客服售后', '财务结算', '经营分析', '系统集成', '老客户营销']

const now = '2026-05-04T00:00:00.000Z'

export const sampleCustomerPractices: CustomerPractice[] = [
  {
    id: 'sample-influencer-automation',
    projectName: '跨境电商红人营销自动化实践',
    customerName: '',
    anonymous: true,
    industry: '跨境电商 / 鞋服箱包',
    companySize: '成长型团队',
    customerType: '品牌方',
    status: '已复盘',
    date: '2026-04-18',
    businessBackground: '客户通过海外红人内容种草带动 Amazon 和 TikTok 销售，但红人筛选、建联、报价、样品寄送和内容跟进高度依赖人工。',
    relatedProcesses: ['内容营销', '红人筛选', '样品寄送', '效果复盘'],
    relatedRoles: ['红人营销专员', '内容运营', '社媒运营'],
    relatedSystems: ['TikTok', 'Instagram', 'YouTube', '邮箱', 'Google Sheet', 'CRM'],
    originalManualProcess: '人工搜索红人 → 手动记录账号信息 → 判断粉丝和内容质量 → 手动发送邀约 → 表格跟进报价和样品状态 → 人工回收发布数据。',
    painPoints: ['红人信息分散', '筛选效率低', '沟通记录难沉淀', '跟进容易遗漏', '效果数据难回收'],
    impactScope: '影响红人营销触达效率、合作转化率和内容投放 ROI。',
    baselineMetrics: '运营每天花费大量时间搜索、复制、整理和跟进红人资料。',
    solution: '通过自动化采集红人信息，建立红人资源库，自动生成建联记录和跟进状态，辅助沉淀合作效果数据。',
    opportunityType: '红人营销',
    implementationActions: ['统一红人字段', '自动采集公开资料', '建立红人资源库', '生成跟进状态', '回收内容效果数据'],
    tools: ['RPA', '浏览器自动化', '表格自动化', 'AI 文案助手'],
    dataSources: ['社媒公开资料', '历史合作表格', '沟通记录', '内容发布数据'],
    results: '机器人可持续运行，替代大量人工资料整理和跟进动作，提高红人营销触达效率。',
    roiData: '机器人 24 小时运行，替代多名人工进行资料整理与跟进，提升营销触达效率。',
    timeSaved: '资料整理和初筛时间显著减少。',
    manpowerSaved: '减少多名运营人员的重复整理工作。',
    revenueImpact: '提升达人触达量，为后续转化创造更多机会。',
    errorRateChange: '减少漏跟进和重复沟通。',
    successLessons: ['先统一达人字段，再做自动化', '自动化结果需要人工抽检', '复盘指标要提前设计'],
    challenges: ['公开资料结构不稳定', '达人质量仍需人工判断'],
    reusablePlaybook: ['适合达人营销、渠道拓展、客户线索跟进等高频重复场景'],
    nextOpportunities: ['达人质量评分', '沟通内容生成', '合作效果预测'],
    tags: ['跨境电商', 'Amazon', 'TikTok', '红人营销', 'RPA'],
    notes: '匿名示例，可作为流程自动化项目模板。',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-coupon-marketing',
    projectName: '阿里国际站老客户优惠券自动化营销实践',
    customerName: '',
    anonymous: true,
    industry: '跨境电商 / 小家电',
    companySize: '中小型品牌',
    customerType: '品牌方',
    status: '已上线',
    date: '2026-04-22',
    businessBackground: '客户希望针对阿里国际站历史合作客户做优惠券和折扣触达，促进老客户复购。',
    relatedProcesses: ['复购运营', '客户分层', '优惠券触达'],
    relatedRoles: ['平台运营', '客服专员', '销售支持'],
    relatedSystems: ['阿里国际站', 'CRM', '邮件工具', 'Excel'],
    originalManualProcess: '人工筛选历史客户 → 手动整理客户名单 → 手动创建优惠券 → 手动触达客户 → 人工统计反馈。',
    painPoints: ['老客户数据分散', '人工筛选和触达效率低', '促活动作不连续'],
    impactScope: '影响老客户复购、二次营销和运营团队效率。',
    baselineMetrics: '历史客户筛选和优惠券整理需要人工反复导表。',
    solution: '自动抓取历史合作客户信息，按规则生成优惠券触达计划，推动二次购买。',
    opportunityType: '老客户营销',
    implementationActions: ['汇总历史客户数据', '设置复购触发规则', '自动生成优惠券名单', '记录触达状态'],
    tools: ['RPA', '营销自动化', '表格规则引擎'],
    dataSources: ['历史订单', '客户标签', '优惠券规则'],
    results: '老客户运营动作从临时人工处理变成周期性自动化流程。',
    roiData: '提升老客户复购和二次营销效率。',
    timeSaved: '减少人工筛选和名单整理时间。',
    manpowerSaved: '运营人员从重复导表中释放。',
    revenueImpact: '提高复购触达覆盖率。',
    errorRateChange: '减少客户遗漏和重复触达。',
    successLessons: ['客户分层规则要简单清晰', '先做小范围触达验证效果', '需要保留人工审核名单'],
    challenges: ['客户数据质量不统一', '优惠券策略需要业务持续调整'],
    reusablePlaybook: ['适合复购型业务、渠道客户运营、老客户促活'],
    nextOpportunities: ['客户复购预测', '优惠券策略推荐', '触达内容自动生成'],
    tags: ['阿里国际站', '小家电', '复购运营', '老客户营销'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-order-shipping-research',
    projectName: '多平台订单到发货自动化调研',
    customerName: '',
    anonymous: true,
    industry: '跨境电商 / 消费品',
    companySize: '多平台成长型卖家',
    customerType: '跨境卖家',
    status: '调研中',
    date: '2026-04-28',
    businessBackground: '客户同时运营 Amazon、Shopee 和 TikTok Shop，订单、库存、物流数据分散在不同平台和系统中。',
    relatedProcesses: ['订单处理', '仓储管理', '国际物流', '客服售后'],
    relatedRoles: ['订单处理专员', '仓储专员', '物流专员', '客服专员'],
    relatedSystems: ['Amazon Seller Central', 'Shopee', 'TikTok Shop', 'ERP', 'WMS', '物流商系统'],
    originalManualProcess: '人工下载平台订单 → 整理 Excel → 导入 ERP → 通知仓库发货 → 回填物流单号 → 查询物流状态。',
    painPoints: ['多平台订单分散', '人工导入导出频繁', '异常订单容易遗漏', '物流状态不同步'],
    impactScope: '影响订单处理时效、发货及时率、客户催单和售后体验。',
    baselineMetrics: '订单导表、异常核对、单号回填依赖人工重复处理。',
    solution: '打通平台订单、ERP、WMS 和物流系统，实现订单自动同步、异常识别、发货单生成和物流单号回填。',
    opportunityType: '订单自动化',
    implementationActions: ['绘制端到端流程', '识别系统断点', '定义订单状态字段', '设计异常订单规则', '自动回填物流单号'],
    tools: ['流程梳理', '系统集成', 'RPA', '数据看板'],
    dataSources: ['订单数据', '库存数据', '物流单号', '平台发货状态'],
    results: '已形成第一版自动化机会清单。',
    roiData: '预计减少人工处理时间，提高发货及时率，降低异常订单遗漏。',
    timeSaved: '待上线后验证。',
    manpowerSaved: '待上线后验证。',
    revenueImpact: '改善交付体验，减少客户催单和售后压力。',
    errorRateChange: '预计减少错发、漏发和状态同步错误。',
    successLessons: ['先定义订单状态，再谈自动化', '不要一开始追求全链路集成', '先找导表最多的断点'],
    challenges: ['平台字段不统一', '物流商接口和平台风控需要确认'],
    reusablePlaybook: ['适合多平台、多店铺、多仓库的跨境卖家'],
    nextOpportunities: ['订单自动下载', '异常订单识别', '物流状态推送', '库存预警'],
    tags: ['Amazon', 'Shopee', 'TikTok Shop', '订单自动化', '系统集成'],
    createdAt: now,
    updatedAt: now,
  },
]

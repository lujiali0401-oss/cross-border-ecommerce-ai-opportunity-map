export interface ManufacturingIndustry {
  id: string
  name: string
  category: string
  description: string
  typicalProducts: string[]
  processFeatures: string[]
  commonSystems: string[]
  typicalRoles: string[]
  painPoints: string[]
  automationOpportunities: string[]
  representativeGlobalCompanies: string[]
  representativeChineseCompanies: string[]
}

export interface CompanyGroup {
  id: string
  category: string
  companies: string[]
}

export interface IndustryComparison {
  id: string
  industry: string
  businessFeatures: string[]
  painPoints: string[]
  keySystems: string[]
  aiOpportunities: string[]
}

export interface IndustryOpportunityGroup {
  id: string
  industry: string
  opportunities: string[]
}

export const manufacturingIndustries: ManufacturingIndustry[] = [
  {
    id: 'platform-seller',
    name: '平台型卖家',
    category: '销售模式',
    description: '主要依托 Amazon、TikTok Shop、Shopee、Lazada、eBay 等第三方平台获取流量和订单。',
    typicalProducts: ['消费电子', '家居用品', '服装鞋包', '小家电', '户外用品'],
    processFeatures: ['平台规则强', '订单和广告数据分散', '评价影响转化', '多店铺运营常见'],
    commonSystems: ['Amazon Seller Central', 'TikTok Shop', 'Shopee', 'ERP', 'OMS', 'WMS'],
    typicalRoles: ['平台运营', '广告投放专员', '订单处理专员', '客服专员'],
    painPoints: ['规则变化快', '多平台数据割裂', '广告 ROI 波动', '订单同步依赖人工'],
    automationOpportunities: ['多平台订单同步', '广告日报自动生成', 'Listing 优化建议', '差评预警'],
    representativeGlobalCompanies: ['Amazon', 'eBay', 'Walmart Marketplace'],
    representativeChineseCompanies: ['Anker', 'SHEIN Marketplace 卖家', 'Temu 卖家'],
  },
  {
    id: 'independent-site',
    name: '独立站卖家',
    category: '销售模式',
    description: '通过 Shopify、WooCommerce 或自建站承接流量，强调品牌资产、用户数据和复购运营。',
    typicalProducts: ['DTC 品牌', '美妆个护', '服装鞋包', '家居生活', '兴趣品类'],
    processFeatures: ['流量自运营', '用户数据沉淀好', '广告与站内转化强相关', '复购和邮件营销重要'],
    commonSystems: ['Shopify', 'GA4', 'Meta Ads', 'Google Ads', 'CRM', '邮件营销'],
    typicalRoles: ['独立站运营', '广告投放专员', '内容运营', '数据分析师'],
    painPoints: ['获客成本高', '站内转化低', '用户分层粗糙', '复购动作不连续'],
    automationOpportunities: ['站内转化分析', '弃购召回', '邮件内容生成', '客户分层自动化'],
    representativeGlobalCompanies: ['Shopify', 'WooCommerce', 'Klaviyo'],
    representativeChineseCompanies: ['Cider', 'PatPat', '完美日记海外站'],
  },
  {
    id: 'brand-global',
    name: '品牌出海',
    category: '品牌模式',
    description: '从单纯卖货升级为品牌建设，关注内容、口碑、渠道、用户资产和长期利润。',
    typicalProducts: ['智能硬件', '家居品牌', '运动户外', '美妆个护', '宠物用品'],
    processFeatures: ['品牌内容重', '渠道组合复杂', '复购和口碑重要', '利润和现金流要精细管理'],
    commonSystems: ['Shopify', 'Amazon', '社媒平台', 'CRM', 'BI', 'ERP'],
    typicalRoles: ['跨境电商老板', '品牌负责人', '内容运营', '数据分析师'],
    painPoints: ['品牌内容产能不足', '渠道表现难比较', '用户资产沉淀不足', '经营看板不完整'],
    automationOpportunities: ['品牌内容生成', '渠道 ROI 分析', '用户分层', '经营健康度看板'],
    representativeGlobalCompanies: ['Allbirds', 'Glossier', 'Gymshark'],
    representativeChineseCompanies: ['Anker', 'Baseus', 'DJI 大疆'],
  },
  {
    id: 'distribution',
    name: '铺货型卖家',
    category: '运营模式',
    description: '通过大量 SKU、多店铺、多平台快速铺货测试市场，强调上新效率和订单处理效率。',
    typicalProducts: ['泛家居', '小百货', '配件', '季节性商品'],
    processFeatures: ['SKU 多', '上架频繁', '利润薄', '数据同步和库存管理压力大'],
    commonSystems: ['ERP', '批量刊登工具', 'OMS', 'WMS', 'Excel'],
    typicalRoles: ['平台运营', 'Listing 优化专员', '订单处理专员', '库存计划专员'],
    painPoints: ['商品资料整理量大', '多平台重复上架', '滞销 SKU 多', '库存同步不及时'],
    automationOpportunities: ['多平台商品同步', '商品资料自动整理', '滞销库存预警', '订单自动下载'],
    representativeGlobalCompanies: ['Amazon', 'Shopee', 'Lazada'],
    representativeChineseCompanies: ['华南铺货卖家', '义乌供应链卖家', '东南亚多平台卖家'],
  },
  {
    id: 'boutique-seller',
    name: '精品型卖家',
    category: '运营模式',
    description: '聚焦少量核心 SKU，强调选品、差异化、Listing、广告、评价和供应链深度运营。',
    typicalProducts: ['精品小家电', '户外装备', '宠物用品', '电子配件'],
    processFeatures: ['SKU 少但运营深', '广告和评价关键', '补货节奏影响利润', '产品生命周期管理重要'],
    commonSystems: ['Amazon', '广告后台', 'ERP', 'BI', '评论分析工具'],
    typicalRoles: ['亚马逊运营', '广告投放专员', '产品开发', '数据分析师'],
    painPoints: ['广告 ACOS 波动', '竞品跟价快', '评论影响转化', '补货失误成本高'],
    automationOpportunities: ['竞品价格监控', '评论情绪分析', '广告预算建议', '智能补货'],
    representativeGlobalCompanies: ['Anker', 'Belkin', 'SharkNinja'],
    representativeChineseCompanies: ['绿联', '倍思', '追觅'],
  },
  {
    id: 'b2b-cross-border',
    name: 'B2B 跨境卖家',
    category: '客户类型',
    description: '通过阿里国际站、Made-in-China、Global Sources 或独立站获取询盘，关注线索、报价和老客户复购。',
    typicalProducts: ['工业品', '小家电', '机械设备', '包装材料', '定制产品'],
    processFeatures: ['询盘链路长', '报价和样品重要', '老客户复购价值高', '销售跟进依赖记录'],
    commonSystems: ['阿里国际站', 'CRM', 'ERP', '邮件', 'WhatsApp', 'Excel'],
    typicalRoles: ['外贸业务员', '平台运营', '销售负责人', '客服专员'],
    painPoints: ['询盘分散', '客户跟进遗漏', '报价资料难复用', '老客户激活低效'],
    automationOpportunities: ['询盘自动分类', '报价邮件生成', '客户跟进提醒', '老客户优惠券触达'],
    representativeGlobalCompanies: ['Alibaba.com', 'Made-in-China', 'Global Sources'],
    representativeChineseCompanies: ['阿里国际站卖家', '外贸工厂', 'B2B 品牌商'],
  },
  {
    id: 'dtc-brand',
    name: 'DTC 品牌',
    category: '品牌模式',
    description: '直接面向海外消费者销售，强调用户数据、内容种草、复购、会员和品牌体验。',
    typicalProducts: ['服装', '美妆', '宠物', '家居', '消费电子'],
    processFeatures: ['用户旅程长', '内容和广告协同', '复购运营关键', '客服体验影响品牌'],
    commonSystems: ['Shopify', 'CRM', 'Klaviyo', 'Meta Ads', '客服系统'],
    typicalRoles: ['独立站运营', '内容运营', '客服专员', '数据分析师'],
    painPoints: ['广告成本高', '转化漏斗难定位', '客户分层粗糙', '复购触达不连续'],
    automationOpportunities: ['客户分层', '弃购召回', '复购邮件生成', '站内转化分析'],
    representativeGlobalCompanies: ['Gymshark', 'Allbirds', 'Warby Parker'],
    representativeChineseCompanies: ['Cider', 'PatPat', 'SHEIN'],
  },
  {
    id: 'live-commerce',
    name: '跨境直播电商',
    category: '内容模式',
    description: '通过 TikTok Live、达人直播和短视频内容带动实时成交和粉丝沉淀。',
    typicalProducts: ['服饰', '美妆', '小家电', '家居百货'],
    processFeatures: ['内容节奏快', '主播/达人协同', '爆发式订单', '售后和履约压力大'],
    commonSystems: ['TikTok Shop', '直播中控台', 'ERP', 'OMS', '客服系统'],
    typicalRoles: ['TikTok Shop 运营', '内容运营', '红人营销专员', '订单处理专员'],
    painPoints: ['直播数据复盘慢', '爆单后履约压力大', '达人效果难评估', '脚本和素材产能不足'],
    automationOpportunities: ['直播数据复盘', '达人效果评分', '爆单库存预警', '直播脚本生成'],
    representativeGlobalCompanies: ['TikTok Shop', 'Whatnot', 'Amazon Live'],
    representativeChineseCompanies: ['TikTok 出海团队', '内容电商品牌', '直播服务商'],
  },
  {
    id: 'overseas-warehouse',
    name: '海外仓备货模式',
    category: '履约模式',
    description: '提前将货物备到海外仓，提高配送时效，但要求更强的补货、库存和资金管理。',
    typicalProducts: ['大件家居', '小家电', '汽配', '户外用品'],
    processFeatures: ['库存前置', '资金占用高', '补货周期长', '履约体验好'],
    commonSystems: ['海外仓系统', 'WMS', 'ERP', '物流商系统', '平台库存'],
    typicalRoles: ['库存计划专员', '物流专员', '仓储专员', '平台运营'],
    painPoints: ['库存积压风险', '缺货补货滞后', '多仓库存不同步', '海外仓费用难核算'],
    automationOpportunities: ['海外仓库存预警', '智能补货建议', '仓储费用核对', '多仓库存看板'],
    representativeGlobalCompanies: ['Amazon FBA', 'ShipBob', 'Flexport'],
    representativeChineseCompanies: ['万邑通', '谷仓海外仓', '纵腾集团'],
  },
  {
    id: 'dropshipping',
    name: '一件代发模式',
    category: '履约模式',
    description: '卖家不持有库存，由供应商或代发平台完成履约，适合轻资产测试但体验和稳定性不确定。',
    typicalProducts: ['小商品', '配件', '季节性商品', '测试款'],
    processFeatures: ['轻库存', '上新快', '供应商稳定性关键', '物流体验波动'],
    commonSystems: ['Shopify', 'AliExpress', 'ERP', '代发平台', '物流查询'],
    typicalRoles: ['独立站运营', '选品专员', '订单处理专员', '客服专员'],
    painPoints: ['物流慢', '供应商质量不稳定', '订单同步和售后复杂', '客户体验难控制'],
    automationOpportunities: ['订单自动同步', '供应商表现分析', '物流异常提醒', '客服自动回复'],
    representativeGlobalCompanies: ['AliExpress', 'Oberlo', 'DSers'],
    representativeChineseCompanies: ['华南代发供应链', '义乌供应商', '跨境代发平台'],
  },
  {
    id: 'temu-model',
    name: 'Temu 半托管 / 全托管',
    category: '平台模式',
    description: '围绕平台托管规则进行供货、定价、库存和履约协同，强调供应链响应和成本控制。',
    typicalProducts: ['低价消费品', '服饰配件', '家居百货', '小工具'],
    processFeatures: ['平台规则强', '价格压力大', '供货节奏快', '库存和履约要求高'],
    commonSystems: ['Temu 后台', 'ERP', '供应商系统', 'WMS'],
    typicalRoles: ['平台运营', '采购专员', '库存计划专员', '财务结算专员'],
    painPoints: ['价格核算压力大', '库存节奏难控', '平台规则变化快', '利润核算不透明'],
    automationOpportunities: ['价格利润测算', '供货计划提醒', '平台规则检查', '利润日报'],
    representativeGlobalCompanies: ['Temu', 'SHEIN Marketplace', 'Amazon Haul'],
    representativeChineseCompanies: ['Temu 供货商', '服装供应链', '家居百货供应链'],
  },
  {
    id: 'distribution-agent',
    name: '跨境分销 / 代理',
    category: '渠道模式',
    description: '通过海外代理、分销商、渠道伙伴拓展市场，关注渠道资料、价格体系、订单和复购。',
    typicalProducts: ['品牌产品', '工业品', '消费电子', '家居建材'],
    processFeatures: ['渠道层级多', '价格体系复杂', '客户资料需要沉淀', '复购和关系维护重要'],
    commonSystems: ['CRM', 'ERP', '邮件', 'WhatsApp', '渠道管理表'],
    typicalRoles: ['渠道运营', '销售负责人', '客服专员', '财务结算专员'],
    painPoints: ['渠道资料分散', '跟进容易遗漏', '价格政策难统一', '复购触达低效'],
    automationOpportunities: ['渠道客户分层', '跟进提醒', '报价邮件生成', '复购优惠触达'],
    representativeGlobalCompanies: ['Global Sources', 'Alibaba.com', '独立站渠道商'],
    representativeChineseCompanies: ['B2B 外贸卖家', '品牌代理商', '分销型卖家'],
  },
]

export const globalCompanyGroups: CompanyGroup[] = [
  { id: 'platforms-mainstream', category: '主流平台', companies: ['Amazon', 'TikTok Shop', 'Shopee', 'Lazada', 'AliExpress'] },
  { id: 'platforms-western', category: '欧美平台', companies: ['eBay', 'Walmart', 'Etsy', 'Target Plus', 'Wayfair'] },
  { id: 'platforms-dtc', category: '独立站 / DTC', companies: ['Shopify', 'WooCommerce', 'BigCommerce', 'Klaviyo', 'Meta Ads'] },
  { id: 'platforms-b2b', category: 'B2B 平台', companies: ['Alibaba.com', 'Made-in-China', 'Global Sources', 'Thomasnet'] },
  { id: 'platforms-logistics', category: '物流履约', companies: ['Amazon FBA', 'Flexport', 'DHL', 'FedEx', 'ShipBob'] },
]

export const chinaCompanyGroups: CompanyGroup[] = [
  { id: 'business-amazon', category: '亚马逊精品模式', companies: ['精品选品', 'Listing 优化', '广告投放', 'FBA 补货', '评论运营'] },
  { id: 'business-tiktok', category: 'TikTok 内容种草 + 小店转化', companies: ['短视频内容', '直播转化', '达人合作', '样品寄送', '内容效果回收'] },
  { id: 'business-shopify', category: 'Shopify 独立站 DTC', companies: ['广告引流', '站内转化', '邮件营销', '会员复购', '品牌内容'] },
  { id: 'business-sea', category: 'Shopee / Lazada 东南亚铺货', companies: ['多平台上架', '价格监控', '订单同步', '客服响应', '活动运营'] },
  { id: 'business-b2b', category: '阿里国际站 B2B 询盘转化', companies: ['询盘分配', '报价跟进', '老客户营销', '样品管理', 'CRM 沉淀'] },
  { id: 'business-temu', category: 'Temu 半托管 / 全托管', companies: ['供货计划', '价格核算', '库存同步', '平台规则检查'] },
]

export const industryComparisons: IndustryComparison[] = [
  {
    id: 'amazon',
    industry: '亚马逊精品卖家',
    businessFeatures: ['SKU 少而精', '广告和评价影响大', 'FBA 库存节奏关键'],
    painPoints: ['ACOS 波动', '补货不准', '差评影响转化'],
    keySystems: ['Amazon Seller Central', 'Amazon Ads', 'ERP', 'BI'],
    aiOpportunities: ['广告 ACOS 预警', 'Listing 优化建议', '评论情绪分析', '智能补货'],
  },
  {
    id: 'tiktok',
    industry: 'TikTok Shop 卖家',
    businessFeatures: ['内容驱动', '直播和达人协同', '爆单波动大'],
    painPoints: ['达人效果难评估', '内容产能不足', '爆单履约压力'],
    keySystems: ['TikTok Shop', 'TikTok Ads', 'ERP', '客服系统'],
    aiOpportunities: ['红人画像分析', '直播复盘', '脚本生成', '爆单库存预警'],
  },
  {
    id: 'dtc',
    industry: '独立站 DTC',
    businessFeatures: ['自有用户数据', '广告获客成本高', '复购和邮件营销重要'],
    painPoints: ['站内转化低', '客户分层粗糙', '复购动作不连续'],
    keySystems: ['Shopify', 'GA4', 'Meta Ads', 'CRM', 'Klaviyo'],
    aiOpportunities: ['弃购召回', '客户分层', '广告 ROI 分析', '邮件内容生成'],
  },
  {
    id: 'b2b',
    industry: 'B2B 跨境卖家',
    businessFeatures: ['询盘链路长', '报价和样品重要', '老客户价值高'],
    painPoints: ['询盘跟进遗漏', '报价资料难复用', '客户资料分散'],
    keySystems: ['阿里国际站', 'CRM', 'ERP', '邮件', 'WhatsApp'],
    aiOpportunities: ['询盘分类', '报价邮件生成', '客户跟进提醒', '老客户优惠触达'],
  },
]

export const industryOpportunityGroups: IndustryOpportunityGroup[] = [
  { id: 'selection', industry: '选品与商品', opportunities: ['爆品趋势分析', '竞品价格监控', '评论情绪分析', '利润自动测算', 'Listing 自动生成'] },
  { id: 'ads', industry: '广告与增长', opportunities: ['广告日报自动生成', 'ACOS 异常预警', '关键词表现分析', '预算调整建议', '投放 ROI 分析'] },
  { id: 'influencer', industry: '内容与红人', opportunities: ['红人信息采集', '红人画像分析', '建联邮件自动生成', '样品寄送状态追踪', '红人 ROI 评分'] },
  { id: 'order', industry: '订单履约', opportunities: ['多平台订单同步', '异常订单识别', '发货单自动生成', '物流单号自动回填', '物流异常预警'] },
  { id: 'service-finance', industry: '客服与财务', opportunities: ['多语言客服助手', '差评预警', '平台账单自动下载', 'SKU 利润自动计算', '利润日报自动生成'] },
]

// 政策文档
export interface PolicyDocument {
  id: string;
  title: string;
  category: PolicyCategory;
  sourceText: string;
  uploadedAt: string;
  source: string;
}

export type PolicyCategory =
  | '医保报销'
  | '生育津贴'
  | '灵活就业补贴'
  | '高龄补贴'
  | '人才补贴';

// 申请条件
export interface Condition {
  id: string;
  name: string;
  plainDescription: string;
  type: 'age' | 'income' | 'text' | 'date' | 'select' | 'number' | 'boolean';
  options?: string[];
  required: boolean;
  unit?: string;
}

// 分析结果
export interface AnalysisResult {
  id: string;
  policyId: string;
  plainTranslation: string;
  summary: string;
  conditions: Condition[];
  keyPoints?: { label: string; value: string }[];
  createdAt: string;
}

// 资格判断单项
export interface EligibilityItem {
  conditionId: string;
  conditionName: string;
  userInput: string;
  met: boolean;
  reason: string;
}

// 资格判断结果
export interface EligibilityResult {
  id: string;
  policyId: string;
  verdict: 'eligible' | 'partial' | 'ineligible';
  items: EligibilityItem[];
  summary: string;
  suggestions: string[];
}

// 补贴分项
export interface SubsidyBreakdown {
  label: string;
  amount: number;
  formula: string;
}

// 补贴估算结果
export interface SubsidyEstimate {
  id: string;
  policyId: string;
  totalAmount: number;
  currency: string;
  formula: string;
  breakdown: SubsidyBreakdown[];
  note: string;
}

// 办理步骤
export interface ProcessStep {
  order: number;
  title: string;
  description: string;
  duration: string;
  tip?: string;
}

// 所需材料
export interface Material {
  name: string;
  description: string;
  howToGet: string;
  required: boolean;
}

// 办理指南
export interface ProcessGuide {
  id: string;
  policyId: string;
  steps: ProcessStep[];
  materials: Material[];
  mermaidChart: string;
  channels: { name: string; description: string }[];
}

// API 响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 适老化设置
export type FontSize = 'standard' | 'large' | 'xlarge';
export type ContrastMode = 'normal' | 'high';

export interface AccessibilitySettings {
  fontSize: FontSize;
  contrast: ContrastMode;
  speechEnabled: boolean;
  simplifiedMode: boolean;
}

// 对话消息（资格评估页）
export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  options?: string[];
  inputType?: 'text' | 'number' | 'select' | 'date';
  timestamp: number;
}

// 政策分类配置
export interface PolicyCategoryConfig {
  category: PolicyCategory;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  exampleId: string;
}

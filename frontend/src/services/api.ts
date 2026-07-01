import type {
  ApiResponse,
  AnalysisResult,
  EligibilityResult,
  SubsidyEstimate,
  ProcessGuide,
  PolicyDocument,
  Condition,
} from '@/types';

const BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || '请求失败');
  }

  return result.data;
}

export const api = {
  // 获取示例政策列表
  getPolicies: () => request<PolicyDocument[]>('/policies'),

  // 政策分析
  analyzePolicy: (data: { policyText?: string; exampleId?: string }) =>
    request<AnalysisResult>('/analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 资格评估
  judgeEligibility: (data: { conditions: Condition[]; userInput: Record<string, string> }) =>
    request<EligibilityResult>('/eligibility', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 补贴测算
  estimateSubsidy: (data: {
    policyText?: string;
    exampleId?: string;
    params: Record<string, string | number>;
  }) =>
    request<SubsidyEstimate>('/subsidy', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 办理指南
  generateGuide: (data: { policyText?: string; exampleId?: string }) =>
    request<ProcessGuide>('/guide', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 上传文件
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const result: ApiResponse<{ text: string }> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || '文件上传失败');
    }

    return result.data.text;
  },
};

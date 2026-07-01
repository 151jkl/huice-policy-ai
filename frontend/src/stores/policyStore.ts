import { create } from 'zustand';
import type {
  PolicyDocument,
  AnalysisResult,
  EligibilityResult,
  SubsidyEstimate,
  ProcessGuide,
} from '@/types';

interface PolicyStore {
  // 当前政策
  currentPolicy: PolicyDocument | null;
  setCurrentPolicy: (policy: PolicyDocument | null) => void;

  // 分析结果
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;

  // 资格评估结果
  eligibilityResult: EligibilityResult | null;
  setEligibilityResult: (result: EligibilityResult | null) => void;

  // 补贴测算结果
  subsidyEstimate: SubsidyEstimate | null;
  setSubsidyEstimate: (estimate: SubsidyEstimate | null) => void;

  // 办理指南
  processGuide: ProcessGuide | null;
  setProcessGuide: (guide: ProcessGuide | null) => void;

  // 重置
  reset: () => void;
}

export const usePolicyStore = create<PolicyStore>((set) => ({
  currentPolicy: null,
  setCurrentPolicy: (policy) => set({ currentPolicy: policy }),

  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),

  eligibilityResult: null,
  setEligibilityResult: (result) => set({ eligibilityResult: result }),

  subsidyEstimate: null,
  setSubsidyEstimate: (estimate) => set({ subsidyEstimate: estimate }),

  processGuide: null,
  setProcessGuide: (guide) => set({ processGuide: guide }),

  reset: () =>
    set({
      currentPolicy: null,
      analysisResult: null,
      eligibilityResult: null,
      subsidyEstimate: null,
      processGuide: null,
    }),
}));

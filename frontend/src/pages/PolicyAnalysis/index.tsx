import { useState, useRef, useEffect, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolicyStore } from '@/stores/policyStore';
import { api } from '@/services/api';
import type { PolicyDocument, AnalysisResult, Condition } from '@/types';
import { SpeechButton } from '@/components/accessibility/SpeechButton';

/* ============================================================
 * SVG 图标（全部使用 SVG，不使用 emoji）
 * ========================================================== */

/** 上传图标 */
function IconUpload({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

/** 星星图标（重点内容） */
function IconStar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

/** 勾选图标 */
function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

/** 文档图标 */
function IconDoc({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

/** AI 闪光图标 */
function IconSparkles({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  );
}

/** 右箭头图标 */
function IconArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

/** 刷新/重试图标 */
function IconRefresh({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}

/** 警告图标 */
function IconAlert({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

/* ============================================================
 * 辅助常量与函数
 * ========================================================== */

/** 条件类型 → 中文标签映射 */
const typeLabelMap: Record<Condition['type'], string> = {
  age: '年龄',
  income: '收入',
  text: '文本',
  date: '日期',
  select: '选择',
  number: '数字',
  boolean: '是/否',
};

/**
 * 将翻译文本按句拆分，关键句（含数字/百分比/金额/关键词）
 * 用高亮背景 + 左边框标记，其余正常渲染。
 */
function renderTranslation(
  text: string,
  keyPoints?: { label: string; value: string }[]
) {
  const keywords = (keyPoints ?? []).map((k) => k.value).filter(Boolean);
  const sentences = text
    .split(/(?<=[。！？\n])/)
    .filter((s) => s.trim().length > 0);

  return sentences.map((sentence, idx) => {
    const isKey =
      /\d/.test(sentence) ||
      /[%％]|元|万|千|百|岁|个月|日|倍/.test(sentence) ||
      keywords.some((kw) => kw && sentence.includes(kw));

    if (isKey) {
      return (
        <span
          key={idx}
          className="inline-block bg-highlight-bg border-l-[3px] border-highlight-border px-2 py-0.5 rounded-r my-1 leading-relaxed"
        >
          {sentence}
        </span>
      );
    }
    return <span key={idx}>{sentence}</span>;
  });
}

/* ============================================================
 * 主组件
 * ========================================================== */

export function PolicyAnalysis() {
  const navigate = useNavigate();
  const {
    analysisResult,
    setAnalysisResult,
    currentPolicy,
    setCurrentPolicy,
  } = usePolicyStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastActionRef = useRef<(() => Promise<void>) | null>(null);

  /* ---------- 获取示例政策列表 ---------- */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await api.getPolicies();
        if (active) setPolicies(list.slice(0, 5));
      } catch {
        // 示例区加载失败不阻塞主流程
      } finally {
        if (active) setLoadingPolicies(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  /* ---------- 通用分析流程 ---------- */
  const runAnalysis = useCallback(
    async (
      action: () => Promise<AnalysisResult>,
      policy: PolicyDocument | null
    ) => {
      const exec = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await action();
          setAnalysisResult(result);
          if (policy) setCurrentPolicy(policy);
        } catch (e) {
          setError(e instanceof Error ? e.message : '分析失败，请重试');
        } finally {
          setLoading(false);
        }
      };
      lastActionRef.current = exec;
      await exec();
    },
    [setAnalysisResult, setCurrentPolicy]
  );

  /* ---------- 文件上传分析 ---------- */
  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过 10MB');
        return;
      }
      const action = async () => {
        const text = await api.uploadFile(file);
        const result = await api.analyzePolicy({ policyText: text });
        // 分析成功后再设置 currentPolicy，避免分析失败时 currentPolicy 残留
        const policy: PolicyDocument = {
          id: `upload-${Date.now()}`,
          title: file.name.replace(/\.[^.]+$/, ''),
          category: '医保报销',
          sourceText: text,
          uploadedAt: new Date().toISOString(),
          source: '用户上传',
        };
        setCurrentPolicy(policy);
        return result;
      };
      await runAnalysis(action, null);
    },
    [runAnalysis, setCurrentPolicy]
  );

  /* ---------- 示例政策分析 ---------- */
  const handleExample = useCallback(
    async (policy: PolicyDocument) => {
      setSelectedExampleId(policy.id);
      await runAnalysis(() => api.analyzePolicy({ exampleId: policy.id }), policy);
    },
    [runAnalysis]
  );

  /* ---------- 重试 ---------- */
  const handleRetry = useCallback(() => {
    lastActionRef.current?.();
  }, []);

  /* ---------- 重新分析（回到上传阶段） ---------- */
  const handleReset = useCallback(() => {
    setAnalysisResult(null);
    setCurrentPolicy(null);
    setSelectedExampleId(null);
    setError(null);
  }, [setAnalysisResult, setCurrentPolicy]);

  /* ---------- 文件选择 ---------- */
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  /* ============================================================
   * 渲染：加载骨架屏
   * ========================================================== */
  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
            <IconSparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-h3 font-semibold text-ink">AI 正在分析...</p>
          <p className="text-caption text-ink-weak mt-1">正在翻译政策并提取申请条件</p>
        </div>
        <div className="card max-w-[720px] mx-auto space-y-4">
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="card lg:col-span-2 space-y-3">
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
          <div className="card lg:col-span-3 space-y-3">
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
   * 渲染：错误状态
   * ========================================================== */
  if (error && !analysisResult) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-16">
        <div className="bg-danger-light border border-danger/30 rounded-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-danger/10 mb-4">
            <IconAlert className="w-7 h-7 text-danger" />
          </div>
          <h3 className="text-h3 font-semibold text-ink mb-2">分析失败</h3>
          <p className="text-body text-ink-secondary mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="btn-primary inline-flex items-center gap-2"
            >
              <IconRefresh className="w-5 h-5" />
              重试
            </button>
            <button
              onClick={() => {
                setError(null);
                setSelectedExampleId(null);
              }}
              className="btn-secondary"
            >
              返回上传
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
   * 渲染：分析结果
   * ========================================================== */
  if (analysisResult) {
    const title = currentPolicy?.title || analysisResult.summary || '政策分析结果';
    const source = currentPolicy?.source || '用户上传';
    const category = currentPolicy?.category ?? '政策';
    const sourceText = currentPolicy?.sourceText || '';
    const translation = analysisResult.plainTranslation;
    const keyPoints = analysisResult.keyPoints ?? [];
    const conditions = analysisResult.conditions ?? [];

    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
        {/* ---------- 政策摘要卡 ---------- */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tag tag-primary">{category}</span>
            <h1 className="text-h2 font-semibold text-ink flex-1 min-w-[200px]">{title}</h1>
            <span className="text-caption text-ink-weak inline-flex items-center gap-1">
              <IconDoc className="w-4 h-4" />
              来源：{source}
            </span>
            <button
              onClick={handleReset}
              className="text-caption text-primary font-medium inline-flex items-center gap-1 hover:text-primary-hover transition-colors"
            >
              <IconRefresh className="w-4 h-4" />
              重新分析
            </button>
          </div>
          {analysisResult.summary && currentPolicy?.title && (
            <p className="text-body text-ink-secondary mt-3 leading-relaxed">
              {analysisResult.summary}
            </p>
          )}
        </div>

        {/* ---------- 左右分栏：原文 / 翻译 ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* 左栏：政策原文 */}
          <div className="lg:col-span-2 card overflow-hidden p-0">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <IconDoc className="w-5 h-5 text-ink-secondary" />
              <h2 className="text-body font-semibold text-ink">政策原文</h2>
            </div>
            <div className="p-5">
              <div className="scrollbar-thin overflow-y-auto max-h-[480px] text-[15px] text-ink-secondary leading-[1.8] whitespace-pre-wrap">
                {sourceText || '暂无原文内容'}
              </div>
            </div>
          </div>

          {/* 右栏：AI 大白话翻译 */}
          <div className="lg:col-span-3 card overflow-hidden p-0">
            <div className="bg-primary-light px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-primary" />
                <h2 className="text-body font-semibold text-primary">AI 大白话翻译</h2>
              </div>
              <SpeechButton text={translation} />
            </div>
            <div className="p-5">
              <div className="flex gap-3">
                {/* AI 头像 */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <IconSparkles className="w-5 h-5" />
                </div>
                {/* 翻译气泡 */}
                <div className="flex-1 bg-secondary rounded-xl p-4 text-body text-ink leading-[1.8]">
                  {renderTranslation(translation, keyPoints)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 重点内容提取 ---------- */}
        {keyPoints.length > 0 && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <IconStar className="w-5 h-5 text-warning" />
              <h2 className="text-h3 font-semibold text-ink">重点内容提取</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyPoints.map((kp, idx) => (
                <div key={idx} className="bg-secondary rounded-lg p-4">
                  <p className="text-caption text-ink-weak mb-1">{kp.label}</p>
                  <p className="text-body font-semibold text-primary">{kp.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- 申请条件 ---------- */}
        {conditions.length > 0 && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <IconCheck className="w-5 h-5 text-success" />
              <h2 className="text-h3 font-semibold text-ink">申请条件（AI 自动提取）</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conditions.map((cond) => (
                <div
                  key={cond.id}
                  className="border border-border-light rounded-lg p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success-light flex items-center justify-center mt-0.5">
                      <IconCheck className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-body font-semibold text-ink">{cond.name}</h3>
                        <span className="tag bg-secondary text-ink-secondary">
                          {typeLabelMap[cond.type]}
                        </span>
                      </div>
                      <p className="text-caption text-ink-weak leading-relaxed">
                        {cond.plainDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- 下一步 CTA ---------- */}
        <div className="text-center py-6">
          {conditions.length > 0 ? (
            <button
              onClick={() => navigate('/eligibility')}
              className="btn-primary-lg inline-flex items-center gap-2"
            >
              去资格评估
              <IconArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="inline-block bg-warning-light border border-warning/30 rounded-lg px-6 py-4 text-left">
              <p className="text-body text-warning font-medium mb-1">
                AI 未能从该政策中提取到申请条件
              </p>
              <p className="text-caption text-ink-secondary">
                请尝试上传内容更完整的政策文件，或选择示例政策体验完整流程。
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================
   * 渲染：上传阶段（默认）
   * ========================================================== */
  return (
    <div className="max-w-[720px] mx-auto px-6 py-10">
      {/* 标题 */}
      <div className="text-center mb-10">
        <h1 className="text-h1 font-semibold text-ink">政策分析</h1>
        <p className="text-body text-ink-weak mt-3">
          上传政策文件，AI 自动翻译并提取申请条件
        </p>
      </div>

      {/* 上传阶段的小错误提示 */}
      {error && (
        <div className="bg-danger-light border border-danger/30 rounded-lg p-4 mb-6 flex items-center gap-3">
          <IconAlert className="w-5 h-5 text-danger flex-shrink-0" />
          <p className="text-caption text-danger flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-caption text-danger font-medium hover:underline"
          >
            关闭
          </button>
        </div>
      )}

      {/* 拖拽上传区 */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`h-[200px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary-lighter'
            : 'border-primary bg-primary-light hover:bg-primary-lighter'
        }`}
      >
        <IconUpload className="w-16 h-16 text-primary mb-2" />
        <p className="text-body-l font-medium text-ink">点击或拖拽文件到此处上传</p>
        <p className="text-caption text-ink-weak mt-1">
          支持 PDF / TXT 文本，单个文件 10MB 以内
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt"
          onChange={onFileChange}
        />
      </div>

      {/* 示例政策区 */}
      <div className="mt-10">
        <p className="text-body font-medium text-ink mb-4">或选择示例政策快速体验：</p>
        {loadingPolicies ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-[80px] rounded-lg" />
            ))}
          </div>
        ) : policies.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {policies.map((p) => (
              <button
                key={p.id}
                onClick={() => handleExample(p)}
                className={`h-[80px] rounded-lg border bg-white p-3 text-left transition-all duration-200 hover:shadow-card ${
                  selectedExampleId === p.id
                    ? 'border-primary bg-primary-light'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <span className="tag tag-primary mb-1.5 inline-block">{p.category}</span>
                <p className="text-caption font-medium text-ink line-clamp-2 leading-tight">
                  {p.title}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-caption text-ink-weak">暂无示例政策</p>
        )}
      </div>
    </div>
  );
}

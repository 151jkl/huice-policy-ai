import { useState, useEffect, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolicyStore } from '@/stores/policyStore';
import { api } from '@/services/api';
import type { SubsidyEstimate, SubsidyBreakdown } from '@/types';

/* ============================================================
 * SVG 图标（全部使用 SVG，不使用 emoji）
 * ========================================================== */

/** 铅笔图标（测算参数） */
function IconPencil({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
      />
    </svg>
  );
}

/** 饼图图标（金额组成） */
function IconPieChart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
      />
    </svg>
  );
}

/** 文档图标（政策依据） */
function IconDoc({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

/** 小文档图标（依据列表项） */
function IconDocSmall({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

/** 警告图标（免责提示） */
function IconWarning({ className = 'w-5 h-5' }: { className?: string }) {
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

/** 右箭头图标 */
function IconArrowRight({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

/** 旋转加载图标 */
function IconSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      />
    </svg>
  );
}

/** 计算器图标（空状态） */
function IconCalculator({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm3.75 0h.008v.008H12v-.008zm0 2.25h.008v.008H12V13.5zm0-4.5h.008v.008H12v-.008zm0 2.25h.008v.008H12v-.008zm3.75 4.5h.008v.008h-.008v-.008zm0-2.25h.008v.008h-.008V13.5zm0-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM6 3.75A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6zM6 6.75h12v3.75H6V6.75z"
      />
    </svg>
  );
}

/** 下拉箭头图标 */
function IconChevronDown({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

/* ============================================================
 * countup 动画 Hook（requestAnimationFrame 实现）
 * ========================================================== */

function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic 缓动函数，让数字滚动先快后慢
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ============================================================
 * 常量
 * ========================================================== */

/** 金额组成分项的色块圆点颜色 */
const BREAKDOWN_COLORS = [
  '#1677FF',
  '#52C41A',
  '#FAAD14',
  '#FF4D4F',
  '#722ED1',
  '#13C2C2',
];

/** 就医类型选项 */
const MEDICAL_TYPES = ['门诊', '住院', '急诊'];

/** 表单数字字段配置 */
const NUMBER_FIELDS: {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
}[] = [
  { key: 'monthlyIncome', label: '月收入', unit: '元', placeholder: '请输入月收入' },
  { key: 'paymentYears', label: '缴费年限', unit: '年', placeholder: '请输入缴费年限' },
  { key: 'familySize', label: '家庭人数', unit: '人', placeholder: '请输入家庭人数' },
];

/* ============================================================
 * 主组件
 * ========================================================== */

export function SubsidyCalc() {
  const navigate = useNavigate();
  const { currentPolicy, eligibilityResult, subsidyEstimate, setSubsidyEstimate } =
    usePolicyStore();

  const [params, setParams] = useState<Record<string, string | number>>({
    monthlyIncome: '',
    paymentYears: '',
    familySize: '',
    medicalType: '门诊',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- 表单校验 ---------- */
  const isFormValid =
    String(params.monthlyIncome).trim() !== '' &&
    String(params.paymentYears).trim() !== '' &&
    String(params.familySize).trim() !== '';

  /* ---------- 更新参数 ---------- */
  function updateParam(key: string, value: string | number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  function handleNumberChange(key: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      updateParam(key, e.target.value);
    };
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    updateParam('medicalType', e.target.value);
  }

  /* ---------- 提交测算 ---------- */
  async function handleCalculate() {
    if (!currentPolicy || !isFormValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      const submitParams: Record<string, string | number> = {
        monthlyIncome: Number(params.monthlyIncome) || 0,
        paymentYears: Number(params.paymentYears) || 0,
        familySize: Number(params.familySize) || 0,
        medicalType: params.medicalType,
      };

      // 优先使用 exampleId（示例政策），否则用上传的 policyText
      const isExample = currentPolicy.id && !currentPolicy.id.startsWith('upload-');
      const result = await api.estimateSubsidy({
        exampleId: isExample ? currentPolicy.id : undefined,
        policyText: isExample ? undefined : currentPolicy.sourceText,
        params: submitParams,
      });
      setSubsidyEstimate(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '测算失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================
   * 渲染：空状态 - 未选择政策
   * ========================================================== */
  if (!currentPolicy) {
    return (
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <EmptyState
          icon={<IconCalculator className="w-8 h-8 text-ink-weak" />}
          title="请先选择政策"
          description="补贴测算需要基于已分析的政策内容进行。请先前往「政策分析」页面选择或上传政策文件。"
          buttonText="前往政策分析"
          onClick={() => navigate('/analysis')}
        />
      </div>
    );
  }

  /* ============================================================
   * 渲染：空状态 - 未完成资格评估
   * ========================================================== */
  if (!eligibilityResult) {
    return (
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <EmptyState
          icon={<IconCalculator className="w-8 h-8 text-ink-weak" />}
          title="请先完成资格评估"
          description="建议先完成资格评估，了解您是否符合申请条件后，再进行补贴金额测算。"
          buttonText="前往资格评估"
          onClick={() => navigate('/eligibility')}
        />
      </div>
    );
  }

  /* ============================================================
   * 渲染：主界面
   * ========================================================== */
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10 animate-fade-in">
      {/* ---------- 页面标题 ---------- */}
      <div className="text-center mb-10">
        <h1 className="text-h1 font-semibold text-ink">补贴测算</h1>
        <p className="text-body text-ink-weak mt-3">
          根据您的条件，AI 估算可获得的补贴金额
        </p>
      </div>

      {/* ---------- 左右布局 ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ============ 左栏：测算参数（40%） ============ */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-card p-8 shadow-card">
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-6">
              <IconPencil className="w-5 h-5 text-primary" />
              <h2 className="text-h3 font-semibold text-ink">测算参数</h2>
            </div>

            {/* 表单项 */}
            <div className="space-y-5">
              {/* 数字输入字段 */}
              {NUMBER_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="block text-body font-medium text-ink mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={String(params[field.key])}
                      onChange={handleNumberChange(field.key)}
                      placeholder={field.placeholder}
                      disabled={loading}
                      className="input-field pr-12 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-weak text-body pointer-events-none">
                      {field.unit}
                    </span>
                  </div>
                </div>
              ))}

              {/* 就医类型下拉选择 */}
              <div>
                <label className="block text-body font-medium text-ink mb-2">
                  就医类型
                </label>
                <div className="relative">
                  <select
                    value={String(params.medicalType)}
                    onChange={handleSelectChange}
                    disabled={loading}
                    className="input-field appearance-none pr-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {MEDICAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-weak pointer-events-none">
                    <IconChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* 测算按钮 */}
            <button
              onClick={handleCalculate}
              disabled={!isFormValid || loading}
              className="w-full mt-6 bg-primary text-white rounded-lg font-medium transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ height: 48 }}
            >
              {loading ? (
                <>
                  <IconSpinner className="w-5 h-5" />
                  AI 测算中...
                </>
              ) : (
                '开始测算'
              )}
            </button>
          </div>
        </div>

        {/* ============ 右栏：测算结果（60%） ============ */}
        <div className="lg:col-span-3">
          {/* 加载状态：骨架屏 */}
          {loading && <ResultSkeleton />}

          {/* 错误状态 */}
          {!loading && error && (
            <div className="bg-danger-light border border-danger/30 rounded-card p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-danger/10 mb-4">
                <IconWarning className="w-7 h-7 text-danger" />
              </div>
              <h3 className="text-h3 font-semibold text-ink mb-2">测算失败</h3>
              <p className="text-body text-ink-secondary mb-6">{error}</p>
              <button
                onClick={handleCalculate}
                className="btn-primary inline-flex items-center gap-2"
              >
                重新测算
              </button>
            </div>
          )}

          {/* 结果展示 */}
          {!loading && !error && subsidyEstimate && (
            <ResultPanel estimate={subsidyEstimate} onGoGuide={() => navigate('/guide')} />
          )}

          {/* 空状态：尚未测算 */}
          {!loading && !error && !subsidyEstimate && (
            <div className="bg-white rounded-card p-12 shadow-card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-5">
                <IconCalculator className="w-8 h-8 text-ink-weak" />
              </div>
              <h3 className="text-h3 font-semibold text-ink mb-2">暂无测算结果</h3>
              <p className="text-body text-ink-secondary leading-relaxed">
                请在左侧填写您的相关信息，点击「开始测算」即可获取 AI 估算的补贴金额。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 结果面板组件
 * ========================================================== */

function ResultPanel({
  estimate,
  onGoGuide,
}: {
  estimate: SubsidyEstimate;
  onGoGuide: () => void;
}) {
  const animatedAmount = useCountUp(estimate.totalAmount, 1000);
  const formattedAmount = animatedAmount.toLocaleString('zh-CN');
  const breakdown = estimate.breakdown ?? [];

  return (
    <div className="space-y-5 animate-fade-in animate-slide-up">
      {/* ---------- 1. 结果主卡片 ---------- */}
      <div
        className="bg-white rounded-modal p-8"
        style={{ boxShadow: '0 4px 16px rgba(22,119,255,0.12)' }}
      >
        {/* 顶部标签 */}
        <p className="text-body text-ink-secondary mb-3">预计补贴金额</p>

        {/* 金额展示 */}
        <div className="flex items-baseline gap-1">
          <span className="text-[24px] font-semibold text-primary leading-none">¥</span>
          <span className="text-amount text-primary tabular-nums">{formattedAmount}</span>
          <span className="text-[20px] text-ink-weak ml-1">/月</span>
        </div>

        {/* 分割线 */}
        <div className="border-t border-border-light my-6" />

        {/* ---------- 2. 金额组成卡片 ---------- */}
        <div className="bg-secondary rounded-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <IconPieChart className="w-5 h-5 text-primary" />
            <h3 className="text-body font-semibold text-ink">金额组成</h3>
          </div>

          {/* 分项列表 */}
          {breakdown.length > 0 ? (
            <div className="space-y-3">
              {breakdown.map((item: SubsidyBreakdown, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          BREAKDOWN_COLORS[idx % BREAKDOWN_COLORS.length],
                      }}
                    />
                    <span className="text-body text-ink truncate">{item.label}</span>
                  </div>
                  <span className="text-body font-semibold text-primary flex-shrink-0 ml-3">
                    ¥{item.amount.toLocaleString('zh-CN')}
                  </span>
                </div>
              ))}

              {/* 总计行 */}
              <div className="border-t border-border-light pt-3 mt-1 flex items-center justify-between">
                <span className="text-body font-semibold text-ink">合计</span>
                <span className="text-body-l font-bold text-primary">
                  ¥{estimate.totalAmount.toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-caption text-ink-weak">暂无分项明细</p>
          )}
        </div>
      </div>

      {/* ---------- 3. 政策依据卡片 ---------- */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <IconDoc className="w-5 h-5 text-primary" />
          <h3 className="text-body font-semibold text-ink">政策依据</h3>
        </div>

        <div className="space-y-2.5">
          {/* 分项计算公式作为依据 */}
          {breakdown
            .filter((item: SubsidyBreakdown) => item.formula)
            .map((item: SubsidyBreakdown, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <IconDocSmall className="w-4 h-4 text-ink-weak flex-shrink-0 mt-0.5" />
                <p className="text-caption text-ink-secondary leading-relaxed">
                  <span className="text-ink font-medium">{item.label}：</span>
                  {item.formula}
                </p>
              </div>
            ))}

          {/* 整体计算公式 */}
          {estimate.formula && (
            <div className="flex items-start gap-2">
              <IconDocSmall className="w-4 h-4 text-ink-weak flex-shrink-0 mt-0.5" />
              <p className="text-caption text-ink-secondary leading-relaxed">
                {estimate.formula}
              </p>
            </div>
          )}

          {/* 备注 */}
          {estimate.note && (
            <div className="flex items-start gap-2">
              <IconDocSmall className="w-4 h-4 text-ink-weak flex-shrink-0 mt-0.5" />
              <p className="text-caption text-ink-secondary leading-relaxed">
                {estimate.note}
              </p>
            </div>
          )}

          {/* 无依据时的兜底 */}
          {breakdown.length === 0 && !estimate.formula && !estimate.note && (
            <p className="text-caption text-ink-weak">暂无政策依据信息</p>
          )}
        </div>
      </div>

      {/* ---------- 底部：免责提示 + CTA ---------- */}
      <div className="pt-2">
        {/* 免责提示 */}
        <div className="flex items-center gap-2 mb-5">
          <IconWarning className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-caption text-ink-secondary">
            估算结果仅供参考，具体金额以实际办理为准
          </p>
        </div>

        {/* 下一步 CTA */}
        <button
          onClick={onGoGuide}
          className="btn-primary w-full flex items-center justify-center gap-2"
          style={{ height: 48 }}
        >
          查看办理指南
          <IconArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * 骨架屏组件（加载状态）
 * ========================================================== */

function ResultSkeleton() {
  return (
    <div className="space-y-5">
      {/* 主卡片骨架 */}
      <div className="bg-white rounded-modal p-8" style={{ boxShadow: '0 4px 16px rgba(22,119,255,0.12)' }}>
        <div className="skeleton h-5 w-28 mb-3" />
        <div className="skeleton h-14 w-48 mb-6" />
        <div className="border-t border-border-light my-6" />
        <div className="bg-secondary rounded-card p-5">
          <div className="skeleton h-5 w-24 mb-4" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-4 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-36" />
              <div className="skeleton h-4 w-16" />
            </div>
            <div className="border-t border-border-light pt-3 flex items-center justify-between">
              <div className="skeleton h-5 w-12" />
              <div className="skeleton h-5 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* 政策依据骨架 */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="skeleton h-5 w-24 mb-3" />
        <div className="space-y-2.5">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 空状态组件
 * ========================================================== */

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-card p-12 shadow-card text-center max-w-md mx-auto">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-5">
        {icon}
      </div>
      <h2 className="text-h2 font-semibold text-ink mb-3">{title}</h2>
      <p className="text-body text-ink-secondary mb-6 leading-relaxed">{description}</p>
      <button onClick={onClick} className="btn-primary inline-flex items-center gap-2">
        {buttonText}
        <IconArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

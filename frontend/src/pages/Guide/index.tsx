import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolicyStore } from '@/stores/policyStore';
import { api } from '@/services/api';
import { MermaidView } from '@/components/charts/MermaidView';
import type { ProcessGuide } from '@/types';

/* ========== SVG 图标 ========== */

function IconRoute({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.553 2.776A1 1 0 0022 18.882V8.118a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
    </svg>
  );
}

function IconClock({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconBulb({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function IconClipboard({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function IconLocation({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconPhone({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function IconGlobe({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function IconPrint({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}

function IconDownload({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconCheck({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconChevronDown({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function IconAlert({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

/* ========== 时间轴步骤组件 ========== */

function TimelineStep({
  step,
  isLast,
}: {
  step: ProcessGuide['steps'][number];
  isLast: boolean;
}) {
  return (
    <div className="flex gap-6">
      {/* 轨道 + 节点 */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-lg shadow-card-hover shrink-0">
          {isLast ? <IconCheck className="w-5 h-5" /> : step.order}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-primary mt-2 min-h-[40px]" />}
      </div>

      {/* 内容卡片 */}
      <div className="flex-1 bg-secondary rounded-card p-5 mb-6">
        <h4 className="text-h3 font-semibold text-ink">{step.title}</h4>
        <p className="text-body text-ink-secondary mt-2 leading-relaxed">{step.description}</p>

        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 bg-primary-light text-ink-secondary rounded px-3 py-1 text-caption">
            <IconClock />
            {step.duration}
          </span>
        </div>

        {step.tip && (
          <div className="flex items-start gap-2 mt-3 p-3 bg-highlight-bg rounded-lg">
            <IconBulb className="w-4 h-4 text-highlight-border mt-0.5 shrink-0" />
            <span className="text-caption text-highlight-border">{step.tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== 材料清单项组件 ========== */

function MaterialItem({
  material,
  checked,
  onToggle,
}: {
  material: ProcessGuide['materials'][number];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="py-3 border-b border-border-light last:border-0">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`touch-target w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            checked
              ? 'bg-primary border-primary text-white'
              : 'border-border bg-white hover:border-primary'
          }`}
          aria-label={checked ? '取消勾选' : '勾选材料'}
        >
          {checked && <IconCheck className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-body ${checked ? 'line-through text-ink-weak' : 'text-ink'}`}>
              {material.name}
            </span>
            {material.required ? (
              <span className="tag tag-danger">必需</span>
            ) : (
              <span className="tag bg-secondary text-ink-weak">可选</span>
            )}
          </div>
          {material.howToGet && (
            <p className="text-xs text-ink-weak mt-1">{material.howToGet}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== 主组件 ========== */

export function Guide() {
  const navigate = useNavigate();
  const { currentPolicy, processGuide, setProcessGuide } = usePolicyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMermaid, setShowMermaid] = useState(false);
  const [checkedMaterials, setCheckedMaterials] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!currentPolicy) return;
    if (processGuide) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    // 优先使用 exampleId（示例政策），否则用上传的 policyText
    const isExample = currentPolicy.id && !currentPolicy.id.startsWith('upload-');
    api
      .generateGuide({
        exampleId: isExample ? currentPolicy.id : undefined,
        policyText: isExample ? undefined : currentPolicy.sourceText,
      })
      .then((result) => {
        if (!cancelled) {
          setProcessGuide(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '生成办理指南失败');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentPolicy, processGuide, setProcessGuide]);

  const toggleMaterial = (index: number) => {
    setCheckedMaterials((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleExport = () => {
    if (!processGuide) return;
    const blob = new Blob([JSON.stringify(processGuide, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPolicy?.title || '政策'}-办理指南.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* 空状态：无政策 */
  if (!currentPolicy) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-4">
            <IconAlert className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-h2 font-semibold text-ink mb-2">请先选择政策</h3>
          <p className="text-body text-ink-weak mb-6">
            您需要先在政策分析页选择或上传政策文件，才能生成办理指南。
          </p>
          <button onClick={() => navigate('/analysis')} className="btn-primary">
            去政策分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* 页面标题 */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-h1 font-semibold text-ink">办理指南</h1>
        <p className="text-body text-ink-weak mt-2">按步骤完成办理，AI 为您生成专属指南</p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-body text-ink-secondary">AI 正在生成办理指南...</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-1/3 rounded" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !loading && (
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="card border border-danger">
            <div className="flex items-center gap-3 text-danger mb-2">
              <IconAlert className="w-6 h-6" />
              <h3 className="text-h3 font-semibold">生成失败</h3>
            </div>
            <p className="text-body text-ink-secondary mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setProcessGuide(null);
              }}
              className="btn-primary"
            >
              重新生成
            </button>
          </div>
        </div>
      )}

      {/* 办理指南内容 */}
      {processGuide && !loading && !error && (
        <>
          {/* 政策标题栏 */}
          <div className="max-w-[1100px] mx-auto px-6 mb-6">
            <div className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="tag tag-primary">{currentPolicy.category}</span>
                <h2 className="text-h3 font-semibold text-ink">{currentPolicy.title}</h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="btn-text flex items-center gap-1.5"
                >
                  <IconPrint />
                  <span className="hidden sm:inline">打印</span>
                </button>
                <button onClick={handleExport} className="btn-text flex items-center gap-1.5">
                  <IconDownload />
                  <span className="hidden sm:inline">导出</span>
                </button>
              </div>
            </div>
          </div>

          {/* 左右布局 */}
          <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-[65%_35%] gap-8">
            {/* 左栏：办理流程时间轴 */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <IconRoute className="w-5 h-5 text-primary" />
                <h3 className="text-h3 font-semibold text-ink">办理流程</h3>
              </div>

              {/* 时间轴步骤 */}
              <div>
                {processGuide.steps.map((step, index) => (
                  <TimelineStep
                    key={index}
                    step={step}
                    isLast={index === processGuide.steps.length - 1}
                  />
                ))}
              </div>

              {/* Mermaid 流程图折叠区 */}
              {processGuide.mermaidChart && (
                <div className="mt-6 pt-6 border-t border-border-light">
                  <button
                    onClick={() => setShowMermaid(!showMermaid)}
                    className="w-full flex items-center justify-center gap-2 text-primary font-medium text-body hover:text-primary-hover transition-colors"
                  >
                    <span>查看完整流程图</span>
                    <IconChevronDown
                      className={`w-4 h-4 transition-transform ${showMermaid ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showMermaid && (
                    <div className="mt-6 p-4 bg-white rounded-card">
                      <MermaidView chart={processGuide.mermaidChart} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 右栏：材料清单 + 办理地点 */}
            <div className="space-y-5">
              {/* 材料清单 */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconClipboard className="w-5 h-5 text-primary" />
                    <h3 className="text-h3 font-semibold text-ink">所需材料</h3>
                  </div>
                  <span className="tag tag-primary">共 {processGuide.materials.length} 项</span>
                </div>
                <div>
                  {processGuide.materials.map((material, index) => (
                    <MaterialItem
                      key={index}
                      material={material}
                      checked={checkedMaterials.has(index)}
                      onToggle={() => toggleMaterial(index)}
                    />
                  ))}
                </div>
              </div>

              {/* 办理地点 */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <IconLocation className="w-5 h-5 text-primary" />
                  <h3 className="text-h3 font-semibold text-ink">办理地点与渠道</h3>
                </div>
                <div className="space-y-3">
                  {processGuide.channels.map((channel, index) => (
                    <ChannelItem key={index} channel={channel} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作区 */}
          <div className="max-w-[1100px] mx-auto px-6 mt-8 flex items-center justify-center gap-4">
            <button onClick={() => navigate('/')} className="btn-secondary">
              返回首页
            </button>
            <button onClick={() => navigate('/eligibility')} className="btn-secondary">
              重新评估
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ========== 渠道信息项 ========== */

function ChannelItem({ channel }: { channel: { name: string; description: string } }) {
  const text = `${channel.name} ${channel.description}`;
  // 智能识别渠道类型
  const isPhone = /[\d-]{7,}/.test(text) && text.includes('电话');
  const isUrl = text.includes('http') || text.includes('www');
  const isTime = text.includes('时间') || text.includes('办公');

  let icon = <IconLocation className="w-4 h-4" />;
  if (isPhone) icon = <IconPhone className="w-4 h-4" />;
  else if (isUrl) icon = <IconGlobe className="w-4 h-4" />;
  else if (isTime) icon = <IconClock className="w-4 h-4" />;

  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-primary mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1">
        <p className="text-body text-ink font-medium leading-relaxed">{channel.name}</p>
        <p className="text-caption text-ink-secondary leading-relaxed mt-0.5">{channel.description}</p>
        {isUrl && (
          <a
            href={text.match(/https?:\/\/[^\s]+/)?.[0] || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-caption text-primary hover:text-primary-hover mt-1"
          >
            点击访问 →
          </a>
        )}
        {isPhone && (
          <a
            href={`tel:${text.match(/[\d-]+/)?.[0] || ''}`}
            className="block text-caption text-primary hover:text-primary-hover mt-1"
          >
            点击拨打 →
          </a>
        )}
      </div>
    </div>
  );
}

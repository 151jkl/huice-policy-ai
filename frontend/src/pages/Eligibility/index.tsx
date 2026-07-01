import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolicyStore } from '@/stores/policyStore';
import { api } from '@/services/api';
import type { Condition, EligibilityResult, ChatMessage } from '@/types';

/* -------------------------------------------------------------------------- */
/*                              工具函数                                       */
/* -------------------------------------------------------------------------- */

let msgSeq = 0;
function genId(): string {
  msgSeq += 1;
  return `msg-${Date.now()}-${msgSeq}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 将 Condition.type 映射为对话输入类型 */
function mapInputType(type: Condition['type']): ChatMessage['inputType'] {
  switch (type) {
    case 'select':
    case 'boolean':
      return 'select';
    case 'number':
    case 'age':
    case 'income':
      return 'number';
    case 'date':
      return 'date';
    case 'text':
    default:
      return 'text';
  }
}

/** 根据条件生成 AI 提问消息 */
function buildQuestionMessage(condition: Condition, index: number): ChatMessage {
  const inputType = mapInputType(condition.type);
  let prompt = '';
  if (inputType === 'select') {
    prompt = '请选择最符合您情况的选项：';
  } else if (inputType === 'number') {
    prompt = `请输入您的${condition.name}${
      condition.unit ? `（单位：${condition.unit}）` : ''
    }：`;
  } else if (inputType === 'date') {
    prompt = `请输入您的${condition.name}（格式：YYYY-MM-DD）：`;
  } else {
    prompt = `请输入您的${condition.name}：`;
  }

  // boolean 类型自动补充"是/否"选项
  const options =
    inputType === 'select'
      ? condition.type === 'boolean'
        ? condition.options && condition.options.length > 0
          ? condition.options
          : ['是', '否']
        : condition.options
      : undefined;

  return {
    id: genId(),
    role: 'ai',
    content: `条件 ${index + 1}：${condition.name}\n${condition.plainDescription}\n\n${prompt}`,
    options,
    inputType,
    timestamp: Date.now(),
  };
}

/* -------------------------------------------------------------------------- */
/*                              SVG 图标组件                                   */
/* -------------------------------------------------------------------------- */

function RobotIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 7V4" strokeLinecap="round" />
      <circle cx="12" cy="3.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.2 16h5.6" strokeLinecap="round" />
      <path d="M4 11v4M20 11v4" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7v1H4v-1z" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3.5l9 16.5H3z" strokeLinejoin="round" />
      <path d="M12 10v4.5" strokeLinecap="round" />
      <circle cx="12" cy="17.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SendIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              头像组件                                       */
/* -------------------------------------------------------------------------- */

function RobotAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
      <RobotIcon className="w-5 h-5 text-white" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0 shadow-sm">
      <UserIcon className="w-5 h-5 text-white" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            评估结果卡片                                     */
/* -------------------------------------------------------------------------- */

const verdictConfig: Record<
  EligibilityResult['verdict'],
  {
    bg: string;
    border: string;
    iconColor: string;
    titleColor: string;
    title: string;
    Icon: (props: { className?: string }) => ReactNode;
  }
> = {
  eligible: {
    bg: 'bg-success-light',
    border: 'border-l-success',
    iconColor: 'text-success',
    titleColor: 'text-success',
    title: '恭喜！您符合申请条件',
    Icon: CheckIcon,
  },
  partial: {
    bg: 'bg-warning-light',
    border: 'border-l-warning',
    iconColor: 'text-warning',
    titleColor: 'text-warning',
    title: '您部分符合条件',
    Icon: WarningIcon,
  },
  ineligible: {
    bg: 'bg-danger-light',
    border: 'border-l-danger',
    iconColor: 'text-danger',
    titleColor: 'text-danger',
    title: '暂不符合条件',
    Icon: CrossIcon,
  },
};

function ResultCard({
  result,
  onCta,
}: {
  result: EligibilityResult;
  onCta: () => void;
}) {
  const cfg = verdictConfig[result.verdict];
  const { Icon } = cfg;

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-border-light">
      {/* 顶部结果横幅 */}
      <div
        className={`flex items-center gap-4 h-20 px-6 border-l-4 ${cfg.bg} ${cfg.border}`}
      >
        <Icon className={`w-8 h-8 ${cfg.iconColor}`} />
        <div>
          <h3 className={`text-2xl font-semibold ${cfg.titleColor}`}>{cfg.title}</h3>
        </div>
      </div>

      {/* 概要 */}
      {result.summary && (
        <div className="px-6 pt-5">
          <p className="text-body text-ink-secondary leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* 逐条明细 */}
      <div className="px-6 py-4">
        <h4 className="text-caption font-semibold text-ink mb-2">条件明细</h4>
        <div className="divide-y divide-border-light">
          {result.items.map((item) => (
            <div key={item.conditionId} className="py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-body text-ink font-medium">{item.conditionName}</p>
                  <p className="text-caption text-ink-secondary mt-0.5 break-words">
                    您的回答：{item.userInput || '—'}
                  </p>
                </div>
                {item.met ? (
                  <span className="tag tag-success flex-shrink-0 gap-1">
                    <CheckIcon className="w-3 h-3" />
                    符合
                  </span>
                ) : (
                  <span className="tag tag-danger flex-shrink-0 gap-1">
                    <CrossIcon className="w-3 h-3" />
                    不符合
                  </span>
                )}
              </div>
              {!item.met && item.reason && (
                <div className="mt-2 text-caption text-warning bg-highlight-bg rounded px-3 py-2 leading-relaxed">
                  改进建议：{item.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 总体建议 */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="px-6 pb-4">
          <h4 className="text-caption font-semibold text-ink mb-2">总体建议</h4>
          <ul className="space-y-1.5">
            {result.suggestions.map((s, i) => (
              <li
                key={i}
                className="text-caption text-ink-secondary bg-highlight-bg rounded px-3 py-2 leading-relaxed"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 底部 CTA */}
      <div className="px-6 pb-6 pt-2">
        <button onClick={onCta} className="btn-primary inline-flex items-center gap-2">
          去补贴测算
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              主组件                                         */
/* -------------------------------------------------------------------------- */

export function Eligibility() {
  const navigate = useNavigate();
  const { currentPolicy, analysisResult, setEligibilityResult } = usePolicyStore();

  const conditions = analysisResult?.conditions ?? [];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [inlineValue, setInlineValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const answersRef = useRef<Record<string, string>>({});
  const initializedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- 初始化对话 ---------------- */
  useEffect(() => {
    if (initializedRef.current) return;
    if (!analysisResult || conditions.length === 0) return;
    initializedRef.current = true;

    const welcome: ChatMessage = {
      id: genId(),
      role: 'ai',
      content: `您好！我是慧策。接下来我将通过 ${conditions.length} 个问题，帮您评估是否符合《${
        currentPolicy?.title ?? '该政策'
      }》的申请条件。请根据您的实际情况回答，让我们开始吧！`,
      timestamp: Date.now(),
    };
    const firstQuestion = buildQuestionMessage(conditions[0], 0);
    setMessages([welcome, firstQuestion]);
    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResult]);

  /* ---------------- 自动滚动到底部 ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, result]);

  /* ---------------- 状态计算 ---------------- */
  const isAwaitingInput =
    !loading && !result && currentStep >= 0 && currentStep < conditions.length;
  const activeCondition = isAwaitingInput ? conditions[currentStep] : null;
  const activeInputType = activeCondition ? mapInputType(activeCondition.type) : null;

  const bottomInputEnabled =
    isAwaitingInput && (activeInputType === 'text' || activeInputType === 'date');

  function getStepStatus(index: number): 'done' | 'current' | 'pending' {
    if (index < currentStep) return 'done';
    if (index === currentStep) return 'current';
    return 'pending';
  }

  const totalSteps = conditions.length;
  const completedSteps = result ? totalSteps : Math.min(currentStep, totalSteps);
  const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  /* ---------------- 提交回答 ---------------- */
  async function handleAnswer(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading || !isAwaitingInput) return;
    const condition = conditions[currentStep];
    if (!condition) return;

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    answersRef.current[condition.id] = trimmed;
    setUserInput('');
    setInlineValue('');
    setLoading(true);

    const nextStep = currentStep + 1;

    // 模拟 AI 思考
    await delay(600);

    if (nextStep < conditions.length) {
      const nextQuestion = buildQuestionMessage(conditions[nextStep], nextStep);
      setMessages((prev) => [...prev, nextQuestion]);
      setCurrentStep(nextStep);
      setLoading(false);
    } else {
      // 全部回答完毕，调用接口评估
      try {
        const res = await api.judgeEligibility({
          conditions,
          userInput: answersRef.current,
        });
        setResult(res);
        setEligibilityResult(res);
        setCurrentStep(conditions.length);
        const finalMsg: ChatMessage = {
          id: genId(),
          role: 'ai',
          content: '感谢您的回答！以下是为您生成的资格评估结果：',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, finalMsg]);
      } catch (err) {
        const errMsg: ChatMessage = {
          id: genId(),
          role: 'ai',
          content: `评估过程中出现问题：${
            err instanceof Error ? err.message : '未知错误'
          }。请稍后重试，或返回政策分析页重新开始。`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleSend() {
    if (!bottomInputEnabled) return;
    handleAnswer(userInput);
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInlineConfirm() {
    if (!inlineValue.trim()) return;
    handleAnswer(inlineValue);
  }

  /* ---------------- 底部输入框 placeholder ---------------- */
  function getBottomPlaceholder(): string {
    if (result) return '评估已完成';
    if (loading) return '正在思考...';
    if (!isAwaitingInput) return '请稍候...';
    if (activeInputType === 'select') return '请点击上方选项进行选择';
    if (activeInputType === 'number') return '请在上方输入框中填写数字';
    return '输入您的回答...';
  }

  /* -------------------------------------------------------------------------- */
  /*                              渲染：空状态                                   */
  /* -------------------------------------------------------------------------- */

  if (!analysisResult || conditions.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 侧边栏 */}
        <Sidebar
          currentPolicy={currentPolicy}
          conditions={[]}
          getStepStatus={() => 'pending'}
          onGoAnalysis={() => navigate('/analysis')}
        />
        {/* 主区域空状态 */}
        <section className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-5">
              <RobotIcon className="w-8 h-8 text-ink-weak" />
            </div>
            <h2 className="text-h2 text-ink mb-3">请先完成政策分析</h2>
            <p className="text-body text-ink-secondary mb-6 leading-relaxed">
              资格评估需要基于政策分析提取的申请条件进行。请先前往「政策分析」页面对政策进行解读。
            </p>
            <button onClick={() => navigate('/analysis')} className="btn-primary">
              前往政策分析
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              渲染：主界面                                   */
  /* -------------------------------------------------------------------------- */

  const lastMessage = messages[messages.length - 1];
  const isActiveQuestion =
    isAwaitingInput &&
    !!lastMessage &&
    lastMessage.role === 'ai' &&
    lastMessage.inputType !== undefined;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ---------------- 左侧边栏 ---------------- */}
      <Sidebar
        currentPolicy={currentPolicy}
        conditions={conditions}
        getStepStatus={getStepStatus}
        onGoAnalysis={() => navigate('/analysis')}
      />

      {/* ---------------- 右侧主对话区 ---------------- */}
      <section className="flex-1 flex flex-col bg-white min-w-0">
        {/* 顶部进度条 */}
        <header className="h-14 flex-shrink-0 bg-white border-b border-border-light flex items-center justify-between px-8">
          {/* 左：进度圆点 */}
          <div className="flex items-center gap-2">
            {conditions.map((c, idx) => {
              const status = getStepStatus(idx);
              return (
                <span
                  key={c.id}
                  className={
                    status === 'done'
                      ? 'w-2.5 h-2.5 rounded-full bg-primary'
                      : status === 'current'
                      ? 'w-2.5 h-2.5 rounded-full bg-primary animate-pulse-slow'
                      : 'w-2.5 h-2.5 rounded-full border-2 border-border'
                  }
                />
              );
            })}
          </div>

          {/* 中：步骤标题 */}
          <div className="flex-1 text-center px-4">
            {result ? (
              <span className="text-body font-medium text-ink">评估完成</span>
            ) : (
              <span className="text-body font-medium text-ink">
                第 {Math.min(currentStep + 1, totalSteps)}/{totalSteps} 步
                {activeCondition ? ` - ${activeCondition.name}` : ''}
              </span>
            )}
          </div>

          {/* 右：百分比 */}
          <div className="text-body font-semibold text-primary w-16 text-right">
            {percent}%
          </div>
        </header>

        {/* 对话区域 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-8 py-8">
          <div className="max-w-[800px] mx-auto space-y-6">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const isActive = isLast && isActiveQuestion;
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in animate-slide-up ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {isUser ? <UserAvatar /> : <RobotAvatar />}

                  <div
                    className={`max-w-[70%] px-5 py-4 ${
                      isUser
                        ? 'bg-primary text-white rounded-2xl rounded-br-[4px]'
                        : 'bg-secondary text-ink rounded-2xl rounded-bl-[4px]'
                    }`}
                  >
                    <p className="text-base leading-[1.8] whitespace-pre-line break-words">
                      {msg.content}
                    </p>

                    {/* select 类型：快捷选项按钮 */}
                    {isActive && msg.inputType === 'select' && msg.options && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="bg-white text-primary border border-primary rounded-lg px-4 py-2 text-caption font-medium transition-colors duration-200 hover:bg-primary-light active:scale-95"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* number 类型：数字输入 + 确认 */}
                    {isActive && msg.inputType === 'number' && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          value={inlineValue}
                          onChange={(e) => setInlineValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInlineConfirm();
                            }
                          }}
                          placeholder="请输入数字"
                          className="w-40 bg-white text-ink rounded-lg px-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          style={{ height: 40 }}
                        />
                        <button
                          onClick={handleInlineConfirm}
                          disabled={!inlineValue.trim()}
                          className="bg-primary text-white rounded-lg px-4 font-medium transition-colors duration-200 hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ height: 40 }}
                        >
                          确认
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI 思考态 */}
            {loading && !result && (
              <div className="flex gap-3 animate-fade-in">
                <RobotAvatar />
                <div className="bg-secondary rounded-2xl rounded-bl-[4px] px-5 py-4 flex items-center gap-2">
                  <span className="text-body text-ink-secondary">正在思考</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-ink-weak animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-ink-weak animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-ink-weak animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                </div>
              </div>
            )}

            {/* 评估结果卡片 */}
            {result && (
              <div className="flex gap-3 animate-fade-in animate-slide-up">
                <RobotAvatar />
                <div className="flex-1 max-w-[92%] min-w-0">
                  <ResultCard result={result} onCta={() => navigate('/subsidy')} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* 底部输入区 */}
        <footer className="flex-shrink-0 bg-white border-t border-border-light">
          <div className="max-w-[800px] mx-auto px-8 py-4 flex items-center gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!bottomInputEnabled}
              placeholder={getBottomPlaceholder()}
              className="flex-1 bg-secondary rounded-full px-5 text-base text-ink placeholder:text-ink-weak border border-transparent focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ height: 48 }}
            />
            <button
              onClick={handleSend}
              disabled={!bottomInputEnabled || !userInput.trim()}
              aria-label="发送"
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              左侧边栏                                       */
/* -------------------------------------------------------------------------- */

function Sidebar({
  currentPolicy,
  conditions,
  getStepStatus,
  onGoAnalysis,
}: {
  currentPolicy: { title: string; category: string } | null;
  conditions: Condition[];
  getStepStatus: (index: number) => 'done' | 'current' | 'pending';
  onGoAnalysis: () => void;
}) {
  return (
    <aside className="w-60 flex-shrink-0 bg-secondary border-r border-border-light overflow-y-auto scrollbar-thin flex flex-col">
      {/* 当前政策卡 */}
      <div className="p-4">
        {currentPolicy ? (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <span className="tag tag-primary mb-2">{currentPolicy.category}</span>
            <h3 className="text-base font-semibold text-ink leading-snug mt-1">
              {currentPolicy.title}
            </h3>
            <span className="tag tag-warning mt-3">示例政策</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-caption text-ink-secondary mb-3">请先选择政策</p>
            <button onClick={onGoAnalysis} className="btn-primary w-full text-caption">
              前往政策分析
            </button>
          </div>
        )}
      </div>

      {/* 评估进度 */}
      {conditions.length > 0 && (
        <div className="px-4 pb-4 flex-1">
          <h4 className="text-caption font-semibold text-ink mb-3 px-1">评估进度</h4>
          <div className="space-y-1">
            {conditions.map((c, idx) => {
              const status = getStepStatus(idx);
              return (
                <div key={c.id} className="flex items-center gap-2.5 py-1.5 px-1">
                  {status === 'done' && (
                    <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </span>
                  )}
                  {status === 'current' && (
                    <span className="w-5 h-5 rounded-full bg-primary animate-pulse-slow flex-shrink-0" />
                  )}
                  {status === 'pending' && (
                    <span className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                  )}
                  <span
                    className={`text-caption ${
                      status === 'current'
                        ? 'text-primary font-semibold'
                        : status === 'done'
                        ? 'text-ink'
                        : 'text-ink-weak'
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

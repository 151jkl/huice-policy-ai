import { useAccessibility } from '@/hooks/useAccessibility';
import type { FontSize, ContrastMode } from '@/types';

export function AccessibilityPanel({ onClose }: { onClose: () => void }) {
  const { settings, setFontSize, setContrast, toggleSpeech, toggleSimplifiedMode, reset } = useAccessibility();

  const fontSizes: { value: FontSize; label: string; size: string }[] = [
    { value: 'standard', label: '标准', size: 'text-base' },
    { value: 'large', label: '大', size: 'text-xl' },
    { value: 'xlarge', label: '超大', size: 'text-2xl' },
  ];

  const contrastModes: { value: ContrastMode; label: string }[] = [
    { value: 'normal', label: '标准' },
    { value: 'high', label: '高对比' },
  ];

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* 面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-modal z-50 animate-slide-in-right flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h3 className="text-h3 text-ink">适老化设置</h3>
          <button
            onClick={onClose}
            className="touch-target flex items-center justify-center rounded-lg text-ink-weak hover:bg-secondary hover:text-ink"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 字体大小 */}
          <div>
            <label className="block text-caption font-medium text-ink-secondary mb-3">字体大小</label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFontSize(item.value)}
                  className={`touch-target rounded-lg font-medium transition-all duration-200 ${item.size} ${
                    settings.fontSize === item.value
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-ink hover:bg-primary-light'
                  }`}
                >
                  A
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {fontSizes.map((item) => (
                <span key={item.value} className="text-center text-xs text-ink-weak">
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* 对比度 */}
          <div>
            <label className="block text-caption font-medium text-ink-secondary mb-3">对比度</label>
            <div className="grid grid-cols-2 gap-2">
              {contrastModes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setContrast(item.value)}
                  className={`touch-target rounded-lg text-body font-medium transition-all duration-200 ${
                    settings.contrast === item.value
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-ink hover:bg-primary-light'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 语音播报 */}
          <div>
            <label className="block text-caption font-medium text-ink-secondary mb-3">语音播报</label>
            <button
              onClick={toggleSpeech}
              className={`w-full touch-target rounded-lg text-body font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                settings.speechEnabled
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-ink hover:bg-primary-light'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              {settings.speechEnabled ? '已开启' : '开启播报'}
            </button>
          </div>

          {/* 简化模式 */}
          <div>
            <label className="block text-caption font-medium text-ink-secondary mb-3">简化模式</label>
            <button
              onClick={toggleSimplifiedMode}
              className={`w-full touch-target rounded-lg text-body font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                settings.simplifiedMode
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-ink hover:bg-primary-light'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              {settings.simplifiedMode ? '已开启' : '开启简化'}
            </button>
          </div>
        </div>

        {/* 底部 */}
        <div className="p-5 border-t border-border-light">
          <button
            onClick={reset}
            className="w-full touch-target rounded-lg text-body text-primary font-medium hover:bg-primary-light transition-colors duration-200"
          >
            恢复默认
          </button>
        </div>
      </div>
    </>
  );
}

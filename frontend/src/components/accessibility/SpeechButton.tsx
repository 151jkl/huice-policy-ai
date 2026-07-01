import { useAccessibility } from '@/hooks/useAccessibility';

export function SpeechButton({ text }: { text?: string }) {
  const { settings, toggleSpeech } = useAccessibility();

  const speak = (content?: string) => {
    if (!('speechSynthesis' in window)) {
      alert('您的浏览器不支持语音播报功能');
      return;
    }

    window.speechSynthesis.cancel();

    if (settings.speechEnabled && !content) {
      toggleSpeech();
      return;
    }

    if (content) {
      if (!settings.speechEnabled) {
        toggleSpeech();
      }
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toggleSpeech();
    }
  };

  if (!('speechSynthesis' in window)) return null;

  return (
    <button
      onClick={() => speak(text)}
      className={`touch-target flex items-center justify-center rounded-lg transition-all duration-200 ${
        settings.speechEnabled
          ? 'bg-primary text-white'
          : 'bg-secondary text-ink hover:bg-primary-light'
      }`}
      title="语音播报"
      aria-label="语音播报"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </button>
  );
}

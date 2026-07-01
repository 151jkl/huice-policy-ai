import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AccessibilitySettings, FontSize, ContrastMode } from '@/types';

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  setContrast: (mode: ContrastMode) => void;
  toggleSpeech: () => void;
  toggleSimplifiedMode: () => void;
  reset: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'standard',
  contrast: 'normal',
  speechEnabled: false,
  simplifiedMode: false,
};

export const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

const STORAGE_KEY = 'policy-translator-a11y';

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // 应用字体大小到 html 元素
    const html = document.documentElement;
    html.setAttribute('data-font-size', settings.fontSize);
    html.setAttribute('data-contrast', settings.contrast);
  }, [settings]);

  const setFontSize = (fontSize: FontSize) => setSettings((s) => ({ ...s, fontSize }));
  const setContrast = (contrast: ContrastMode) => setSettings((s) => ({ ...s, contrast }));
  const toggleSpeech = () => setSettings((s) => ({ ...s, speechEnabled: !s.speechEnabled }));
  const toggleSimplifiedMode = () => setSettings((s) => ({ ...s, simplifiedMode: !s.simplifiedMode }));
  const reset = () => setSettings(defaultSettings);

  return (
    <AccessibilityContext.Provider
      value={{ settings, setFontSize, setContrast, toggleSpeech, toggleSimplifiedMode, reset }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

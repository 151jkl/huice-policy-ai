import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    flowchart: {
      curve: 'basis',
      padding: 20,
    },
  });
  initialized = true;
}

initMermaid();

export function MermaidView({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      if (!chart) return;

      // Re-initialize if HMR replaced this module
      if (!initialized) {
        initMermaid();
      }

      setLoading(true);
      setError(null);

      try {
        const id = `mermaid-${Date.now()}`;
        const renderPromise = mermaid.render(id, chart);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('渲染超时，请稍后重试')), 10000),
        );
        const { svg } = (await Promise.race([renderPromise, timeoutPromise])) as {
          svg: string;
        };

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '流程图渲染失败');
          setLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  // 始终渲染 container div，确保 ref 被附加到 DOM
  // loading/error 状态作为覆盖层显示
  return (
    <div className="relative">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-caption text-ink-weak">流程图渲染中...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-danger-light rounded-lg text-danger text-caption">
          <p className="font-medium mb-1">流程图渲染失败</p>
          <p className="text-ink-secondary">{error}</p>
        </div>
      )}

      {/* container 始终存在于 DOM 中，确保 ref 可用 */}
      <div
        ref={containerRef}
        className={`flex justify-center overflow-x-auto scrollbar-thin ${
          loading || error ? 'hidden' : 'block'
        }`}
      />
    </div>
  );
}

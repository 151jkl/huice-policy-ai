import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/analysis', label: '政策分析' },
  { path: '/eligibility', label: '资格评估' },
  { path: '/subsidy', label: '补贴测算' },
  { path: '/guide', label: '办理指南' },
];

export function MainLayout() {
  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 首页深色主题：给 body 加 class + 滚动时切换导航栏样式
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isHome) {
      document.body.classList.add('home-dark');
    } else {
      document.body.classList.remove('home-dark');
    }
    return () => document.body.classList.remove('home-dark');
  }, [isHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 首页始终使用深色导航栏（已滚动状态）
  const navDark = isHome || scrolled;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 h-16 transition-all duration-300 ${
          navDark
            ? 'bg-[#0A0E1A]/80 backdrop-blur-md border-b border-white/10'
            : 'bg-white border-b border-border-light shadow-nav'
        }`}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 touch-target"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1677FF] to-[#69B1FF] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className={`text-h3 font-bold ${navDark ? 'text-white' : 'text-ink'}`}>慧策</span>
          </button>

          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `text-body font-medium transition-colors duration-200 relative py-2 ${
                    isActive
                      ? navDark
                        ? 'text-[#69B1FF]'
                        : 'text-primary'
                      : navDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-ink-secondary hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                          navDark ? 'bg-[#69B1FF]' : 'bg-primary'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* 适老化入口 */}
          <button
            onClick={() => setShowA11yPanel(true)}
            className={`touch-target flex items-center justify-center rounded-lg transition-colors duration-200 ${
              navDark
                ? 'text-white/70 hover:bg-white/10 hover:text-white'
                : 'text-ink-secondary hover:bg-secondary hover:text-primary'
            }`}
            title="适老化设置"
            aria-label="适老化设置"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* 移动端导航 */}
        <nav
          className={`md:hidden flex items-center justify-around h-12 ${
            navDark ? 'border-t border-white/10' : 'border-t border-border-light'
          }`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `text-xs font-medium px-2 py-1 rounded ${
                  isActive
                    ? navDark
                      ? 'text-[#69B1FF] bg-white/10'
                      : 'text-primary bg-primary-light'
                    : navDark
                    ? 'text-white/50'
                    : 'text-ink-weak'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-[#0A0E1A] text-white border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左列 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1677FF] to-[#69B1FF] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-body font-bold">慧策</span>
              </div>
              <p className="text-caption text-white/60">社会公益项目 · 仅供参考</p>
            </div>

            {/* 中列 */}
            <div>
              <h4 className="text-caption font-medium text-white/70 mb-3">快速链接</h4>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="block text-caption text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 右列 */}
            <div>
              <h4 className="text-caption font-medium text-white/70 mb-3">免责声明</h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-[280px]">
                本工具使用 AI 技术与模拟数据，分析结果仅供参考，具体以政府部门发布为准。
              </p>
            </div>
          </div>

          {/* 版权 */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/40">© 2025 慧策 · 公益项目</p>
          </div>
        </div>
      </footer>

      {/* 适老化面板 */}
      {showA11yPanel && <AccessibilityPanel onClose={() => setShowA11yPanel(false)} />}
    </div>
  );
}

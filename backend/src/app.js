/**
 * Express 应用入口
 * 集中注册中间件、挂载路由、统一错误处理，并启动 HTTP 服务。
 */
const express = require('express');
const cors = require('cors');
const { config, validateConfig } = require('./config');
const errorHandler = require('./middleware/errorHandler');
const analysisRoutes = require('./routes/analysis');
const eligibilityRoutes = require('./routes/eligibility');
const subsidyRoutes = require('./routes/subsidy');
const guideRoutes = require('./routes/guide');
const uploadRoutes = require('./routes/upload');
const { mockPolicies } = require('./data/mockPolicies');

const app = express();

// 中间件：CORS（允许前端跨域访问）+ JSON 解析（limit 10mb，支持较大政策文本）
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/api/health', (req, res) => {
  const { ok, missing } = validateConfig();
  res.json({
    success: true,
    data: {
      status: 'ok',
      model: config.llm.model,
      configReady: ok,
      ...(ok ? {} : { missing }),
    },
  });
});

// 示例政策列表（供前端首页"示例政策快速体验"使用，含原文供后续测算/指南调用）
app.get('/api/policies', (req, res) => {
  res.json({
    success: true,
    data: mockPolicies.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      source: p.source,
      sourceText: p.sourceText,
    })),
  });
});

// 业务路由挂载
app.use('/api/analysis', analysisRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/subsidy', subsidyRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/upload', uploadRoutes);

// 404 兜底
app.use((req, res) => {
  res.status(404).json({ success: false, error: `接口不存在：${req.method} ${req.originalUrl}` });
});

// 统一错误处理中间件（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务
const PORT = config.port;
app.listen(PORT, () => {
  const { ok, missing } = validateConfig();
  // eslint-disable-next-line no-console
  console.log(`[政策翻译官后端] 服务已启动：http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[政策翻译官后端] 当前模型：${config.llm.model}（${config.llm.baseURL}）`);
  if (!ok) {
    // eslint-disable-next-line no-console
    console.warn(
      `[政策翻译官后端] 警告：LLM 配置不完整，缺少 ${missing.join(', ')}。请在 backend/.env 中配置后重启，否则 LLM 接口将不可用。`
    );
  }
});

module.exports = app;

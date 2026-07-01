/**
 * 配置管理模块
 * 集中读取环境变量，提供默认值，避免散落各处的 process.env 调用。
 */
require('dotenv').config();

const config = {
  // LLM 相关配置（OpenAI 兼容模式，可切换通义千问 / 智谱GLM）
  llm: {
    apiKey: process.env.LLM_API_KEY || '',
    baseURL:
      process.env.LLM_BASE_URL ||
      'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: process.env.LLM_MODEL || 'qwen-plus',
  },
  // 服务端口
  port: parseInt(process.env.PORT, 10) || 3000,
  // 运行环境
  nodeEnv: process.env.NODE_ENV || 'development',
};

/**
 * 校验关键配置是否就绪，便于在启动时提前暴露配置问题。
 * @returns {{ ok: boolean, missing: string[] }}
 */
function validateConfig() {
  const missing = [];
  if (!config.llm.apiKey) missing.push('LLM_API_KEY');
  if (!config.llm.baseURL) missing.push('LLM_BASE_URL');
  if (!config.llm.model) missing.push('LLM_MODEL');
  return { ok: missing.length === 0, missing };
}

module.exports = { config, validateConfig };

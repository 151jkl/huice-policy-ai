/**
 * LLM 客户端封装
 * 基于 OpenAI 兼容 SDK，通过环境变量切换 baseURL 与 apiKey，
 * 屏蔽通义千问 / 智谱GLM 等供应商差异。API Key 仅存后端，前端永不接触。
 */
const OpenAI = require('openai');
const { config, validateConfig } = require('../../config');

const { llm } = config;

// 创建 OpenAI 兼容客户端实例
const client = new OpenAI({
  apiKey: llm.apiKey || 'missing-api-key', // 占位，避免 SDK 在实例化时抛错
  baseURL: llm.baseURL,
  // 适度放宽超时，LLM 结构化输出可能较慢
  timeout: 60_000,
  maxRetries: 2,
});

/**
 * 调用 LLM 进行对话补全（结构化 JSON 输出）
 *
 * @param {Object} params
 * @param {string} params.systemPrompt - 系统提示词（角色与输出约束）
 * @param {string} params.userMessage   - 用户消息（具体任务输入）
 * @param {boolean} [params.jsonMode=true] - 是否强制 JSON 对象输出
 * @param {number} [params.temperature=0.2] - 采样温度，结构化任务用低温度
 * @returns {Promise<string>} LLM 返回的文本内容（jsonMode 下为 JSON 字符串）
 */
async function chatCompletion({
  systemPrompt,
  userMessage,
  jsonMode = true,
  temperature = 0.2,
}) {
  const { ok, missing } = validateConfig();
  if (!ok) {
    throw new Error(
      `LLM 配置不完整，缺少环境变量：${missing.join(', ')}。请在 backend/.env 中配置后重启服务。`
    );
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: llm.model,
    messages,
    temperature,
    // 强制模型返回 JSON 对象，保证可解析、可校验
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  });

  const content = completion?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('LLM 返回内容为空，请稍后重试或检查模型配置。');
  }
  return content;
}

// 导出单例实例与调用方法
module.exports = {
  client,
  chatCompletion,
  model: llm.model,
};

/**
 * LLM 服务统一出口
 * 对外暴露 4 个业务方法，内部统一处理：Prompt 编排 → LLM 调用 → JSON 解析 → Schema 校验 → 失败重试。
 * 路由层只调用这里的方法，不直接接触 LLMClient 与 Prompt 模板。
 */
const { chatCompletion } = require('./LLMClient');
const {
  ANALYSIS_SYSTEM_PROMPT,
  ELIGIBILITY_SYSTEM_PROMPT,
  SUBSIDY_SYSTEM_PROMPT,
  GUIDE_SYSTEM_PROMPT,
} = require('../prompt/templates');
const analysisSchema = require('../../schemas/analysisSchema');
const eligibilitySchema = require('../../schemas/eligibilitySchema');
const subsidySchema = require('../../schemas/subsidySchema');
const guideSchema = require('../../schemas/guideSchema');

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, coerceTypes: true });

// 预编译各 Schema 校验器
const validators = {
  analysis: ajv.compile(analysisSchema),
  eligibility: ajv.compile(eligibilitySchema),
  subsidy: ajv.compile(subsidySchema),
  guide: ajv.compile(guideSchema),
};

/**
 * 用 JSON Schema 校验数据，返回 { valid, errors }
 * @param {string} key 校验器键
 * @param {object} data 待校验数据
 */
function validate(key, data) {
  const validateFn = validators[key];
  const valid = validateFn(data);
  if (valid) return { valid: true, errors: null };
  const errors = (validateFn.errors || [])
    .map((e) => `${e.instancePath || '(root)'} ${e.message}`)
    .join('; ');
  return { valid: false, errors };
}

/**
 * 解析 LLM 返回的 JSON 字符串。
 * 兼容模型偶尔包裹 ```json 代码块的情况。
 * @param {string} raw
 * @returns {object}
 */
function parseJson(raw) {
  if (typeof raw === 'object') return raw;
  let text = String(raw).trim();
  // 去除可能的 markdown 代码块包裹
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  }
  return JSON.parse(text);
}

/**
 * 通用调用 + 校验 + 重试封装
 * @param {Object} opts
 * @param {string} opts.systemPrompt
 * @param {string} opts.userMessage
 * @param {string} opts.validatorKey  对应 validators 的键
 * @param {number} [opts.retries=1]   校验失败重试次数
 */
async function callWithValidation({
  systemPrompt,
  userMessage,
  validatorKey,
  retries = 1,
}) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await chatCompletion({ systemPrompt, userMessage });
      const data = parseJson(raw);
      const { valid, errors } = validate(validatorKey, data);
      if (valid) return data;
      lastError = new Error(`LLM 返回数据校验失败：${errors}`);
      // 校验失败则重试（最后一次不再抛出，由下方统一处理）
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('LLM 调用失败，请稍后重试。');
}

/**
 * 1. 政策分析：翻译为大白话 + 提取申请条件
 * @param {string} policyText 政策原文
 * @returns {Promise<object>} { plainTranslation, summary, conditions }
 */
async function analyzePolicy(policyText) {
  if (!policyText || !policyText.trim()) {
    throw new Error('政策原文不能为空。');
  }
  return callWithValidation({
    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
    userMessage: `请分析以下政策原文，翻译成大白话并提取申请条件：\n\n${policyText}`,
    validatorKey: 'analysis',
  });
}

/**
 * 2. 资格评估：逐条判断用户是否符合条件
 * @param {Array} conditions 条件列表
 * @param {Object} userInput  用户输入，键为条件 id
 * @returns {Promise<object>} { verdict, items, summary, suggestions }
 */
async function judgeEligibility(conditions, userInput) {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    throw new Error('申请条件列表不能为空。');
  }
  if (!userInput || typeof userInput !== 'object') {
    throw new Error('用户输入信息不能为空。');
  }
  const payload = {
    conditions,
    userInput,
  };
  return callWithValidation({
    systemPrompt: ELIGIBILITY_SYSTEM_PROMPT,
    userMessage: `请根据以下条件列表和用户填写信息，逐条判断资格：\n\n${JSON.stringify(
      payload,
      null,
      2
    )}`,
    validatorKey: 'eligibility',
  });
}

/**
 * 3. 补贴测算：估算补贴金额
 * @param {string} policyText 政策原文
 * @param {Object} params     用户参数（收入、年限、年龄等）
 * @returns {Promise<object>} { totalAmount, currency, formula, breakdown, note }
 */
async function estimateSubsidy(policyText, params) {
  if (!policyText || !policyText.trim()) {
    throw new Error('政策原文不能为空。');
  }
  if (!params || typeof params !== 'object') {
    throw new Error('测算参数不能为空。');
  }
  return callWithValidation({
    systemPrompt: SUBSIDY_SYSTEM_PROMPT,
    userMessage: `请根据以下政策原文和用户参数估算补贴金额：\n\n【政策原文】\n${policyText}\n\n【用户参数】\n${JSON.stringify(
      params,
      null,
      2
    )}`,
    validatorKey: 'subsidy',
  });
}

/**
 * 4. 办理指南：生成步骤 + 材料 + mermaid 流程图 + 渠道
 * @param {string} policyText 政策原文
 * @returns {Promise<object>} { steps, materials, mermaidChart, channels }
 */
async function generateGuide(policyText) {
  if (!policyText || !policyText.trim()) {
    throw new Error('政策原文不能为空。');
  }
  return callWithValidation({
    systemPrompt: GUIDE_SYSTEM_PROMPT,
    userMessage: `请根据以下政策原文生成办理指南（步骤、材料、mermaid 流程图、渠道）：\n\n${policyText}`,
    validatorKey: 'guide',
  });
}

module.exports = {
  analyzePolicy,
  judgeEligibility,
  estimateSubsidy,
  generateGuide,
};

/**
 * 政策分析路由
 * POST /api/analysis
 * 接收 { policyText 或 exampleId }，返回 { plainTranslation, summary, conditions }
 */
const express = require('express');
const router = express.Router();
const { analyzePolicy } = require('../services/llm');
const { getPolicyById } = require('../data/mockPolicies');

router.post('/', async (req, res, next) => {
  try {
    const { policyText, exampleId } = req.body || {};

    let text = policyText;
    // 支持通过示例 id 直接取模拟政策原文
    if ((!text || !text.trim()) && exampleId) {
      const policy = getPolicyById(exampleId);
      if (!policy) {
        return res.status(400).json({
          success: false,
          error: `未找到示例政策：${exampleId}。请检查 exampleId 是否正确。`,
        });
      }
      text = policy.sourceText;
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: '请提供政策原文（policyText）或示例政策 id（exampleId）。',
      });
    }

    // 调用 LLM 服务（内部已含 JSON Schema 校验与失败重试1次）
    const result = await analyzePolicy(text);
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

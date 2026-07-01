/**
 * 补贴测算路由
 * POST /api/subsidy
 * 接收 { policyText, params }，返回 { totalAmount, currency, formula, breakdown, note }
 */
const express = require('express');
const router = express.Router();
const { estimateSubsidy } = require('../services/llm');
const { getPolicyById } = require('../data/mockPolicies');

router.post('/', async (req, res, next) => {
  try {
    const { policyText, exampleId, params } = req.body || {};

    let text = policyText;
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
    if (!params || typeof params !== 'object') {
      return res.status(400).json({
        success: false,
        error: '请提供测算参数（params），如收入、年限、年龄等。',
      });
    }

    // 调用 LLM 服务估算金额（内部已含校验与重试）
    const result = await estimateSubsidy(text, params);
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

/**
 * 办理指南路由
 * POST /api/guide
 * 接收 { policyText }，返回 { steps, materials, mermaidChart, channels }
 */
const express = require('express');
const router = express.Router();
const { generateGuide } = require('../services/llm');
const { getPolicyById } = require('../data/mockPolicies');

router.post('/', async (req, res, next) => {
  try {
    const { policyText, exampleId } = req.body || {};

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

    // 调用 LLM 服务生成办理指南（内部已含校验与重试）
    const result = await generateGuide(text);
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

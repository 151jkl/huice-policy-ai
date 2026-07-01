/**
 * 资格评估路由
 * POST /api/eligibility
 * 接收 { conditions, userInput }，返回 { verdict, items, summary, suggestions }
 */
const express = require('express');
const router = express.Router();
const { judgeEligibility } = require('../services/llm');

router.post('/', async (req, res, next) => {
  try {
    const { conditions, userInput } = req.body || {};

    if (!Array.isArray(conditions) || conditions.length === 0) {
      return res.status(400).json({
        success: false,
        error: '请提供申请条件列表（conditions），且不能为空。',
      });
    }
    if (!userInput || typeof userInput !== 'object') {
      return res.status(400).json({
        success: false,
        error: '请提供用户填写信息（userInput）。',
      });
    }

    // 调用 LLM 服务逐条判断（内部已含校验与重试）
    const result = await judgeEligibility(conditions, userInput);
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

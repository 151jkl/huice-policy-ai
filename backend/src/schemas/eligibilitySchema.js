/**
 * 资格评估结果 JSON Schema
 * 用于校验 LLM 返回的 judgeEligibility 结果。
 */
const eligibilitySchema = {
  type: 'object',
  required: ['verdict', 'items', 'summary', 'suggestions'],
  properties: {
    verdict: {
      type: 'string',
      enum: ['eligible', 'partial', 'ineligible'],
      description: '总体结论：符合 / 部分符合 / 不符合',
    },
    items: {
      type: 'array',
      description: '逐条判断明细',
      items: {
        type: 'object',
        required: ['conditionId', 'name', 'userValue', 'met', 'reason'],
        properties: {
          conditionId: { type: 'string', description: '对应条件 id' },
          name: { type: 'string', description: '条件名称' },
          userValue: { type: 'string', description: '用户填写的值' },
          met: { type: 'boolean', description: '是否满足' },
          reason: { type: 'string', description: '原因说明' },
        },
      },
    },
    summary: {
      type: 'string',
      description: '总体说明',
    },
    suggestions: {
      type: 'array',
      items: { type: 'string' },
      description: '改进建议',
    },
  },
};

module.exports = eligibilitySchema;

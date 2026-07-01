/**
 * 补贴测算结果 JSON Schema
 * 用于校验 LLM 返回的 estimateSubsidy 结果。
 */
const subsidySchema = {
  type: 'object',
  required: ['totalAmount', 'currency', 'formula', 'breakdown', 'note'],
  properties: {
    totalAmount: {
      type: 'number',
      description: '估算总金额（元）',
      minimum: 0,
    },
    currency: {
      type: 'string',
      description: '币种',
    },
    formula: {
      type: 'string',
      description: '总额计算公式说明',
    },
    breakdown: {
      type: 'array',
      description: '分项明细',
      items: {
        type: 'object',
        required: ['label', 'amount', 'formula'],
        properties: {
          label: { type: 'string', description: '分项名称' },
          amount: { type: 'number', description: '分项金额（元）' },
          formula: { type: 'string', description: '分项计算依据' },
        },
      },
    },
    note: {
      type: 'string',
      description: '补充说明',
    },
  },
};

module.exports = subsidySchema;

/**
 * 政策分析结果 JSON Schema
 * 用于校验 LLM 返回的 analyzePolicy 结果，保证前端可解析、可渲染。
 * 字段与前端 TypeScript 接口保持一致。
 */
const analysisSchema = {
  type: 'object',
  required: ['plainTranslation', 'summary', 'conditions'],
  properties: {
    plainTranslation: {
      type: 'string',
      description: '政策的大白话翻译',
      minLength: 1,
    },
    summary: {
      type: 'string',
      description: '一句话总结',
    },
    conditions: {
      type: 'array',
      description: '申请条件列表',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'name', 'plainDescription', 'type', 'required'],
        properties: {
          id: { type: 'string', description: '条件唯一标识' },
          name: { type: 'string', description: '条件名称' },
          plainDescription: { type: 'string', description: '大白话说明' },
          type: {
            type: 'string',
            enum: ['age', 'income', 'text', 'date', 'select', 'number', 'boolean'],
            description: '条件类型',
          },
          options: {
            type: 'array',
            items: { type: 'string' },
            description: 'select 类型的可选项',
          },
          required: { type: 'boolean', description: '是否必填' },
          unit: { type: 'string', description: '单位' },
        },
      },
    },
  },
};

module.exports = analysisSchema;

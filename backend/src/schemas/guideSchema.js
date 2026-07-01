/**
 * 办理指南 JSON Schema
 * 用于校验 LLM 返回的 generateGuide 结果，含步骤、材料、mermaid 流程图、渠道。
 */
const guideSchema = {
  type: 'object',
  required: ['steps', 'materials', 'mermaidChart', 'channels'],
  properties: {
    steps: {
      type: 'array',
      description: '办理步骤',
      items: {
        type: 'object',
        required: ['order', 'title', 'description', 'estimatedDuration'],
        properties: {
          order: { type: 'number', description: '步骤序号' },
          title: { type: 'string', description: '步骤标题' },
          description: { type: 'string', description: '步骤描述' },
          estimatedDuration: { type: 'string', description: '预计时长' },
        },
      },
    },
    materials: {
      type: 'array',
      description: '材料清单',
      items: {
        type: 'object',
        required: ['name', 'description', 'howToGet', 'required'],
        properties: {
          name: { type: 'string', description: '材料名称' },
          description: { type: 'string', description: '材料说明' },
          howToGet: { type: 'string', description: '获取方式' },
          required: { type: 'boolean', description: '是否必需' },
        },
      },
    },
    mermaidChart: {
      type: 'string',
      description: '合法的 mermaid flowchart 语法文本',
      minLength: 1,
    },
    channels: {
      type: 'array',
      description: '办理渠道',
      items: {
        type: 'object',
        required: ['name', 'description'],
        properties: {
          name: { type: 'string', description: '渠道名称' },
          description: { type: 'string', description: '渠道说明' },
        },
      },
    },
  },
};

module.exports = guideSchema;

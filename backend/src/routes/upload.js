/**
 * 文件上传与文本提取路由
 * POST /api/upload
 * 接收 PDF/TXT 文件（multer 处理上传），提取纯文本返回，供前端作为 policyText 调用 /api/analysis。
 * 依赖：multer（文件上传）、pdf-parse（PDF 文本提取）。
 */
const express = require('express');
const multer = require('multer');
const router = express.Router();

// 内存存储，Demo 场景无需落盘；限制 10mb
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'text/plain',
      'application/octet-stream',
    ];
    const ok =
      allowed.includes(file.mimetype) ||
      /\.(pdf|txt)$/i.test(file.originalname);
    if (!ok) {
      return cb(new Error('仅支持 PDF 或 TXT 格式的政策文件。'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '未收到文件，请上传 PDF 或 TXT 格式的政策文件。',
      });
    }

    const { originalname, buffer, mimetype } = req.file;
    let text = '';

    if (/\.pdf$/i.test(originalname) || mimetype === 'application/pdf') {
      // PDF 文本提取（pdf-parse v2 API：导出 PDFParse 类，需 new 后调用 getText）
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        const data = await parser.getText();
        text = data.text || '';
      } finally {
        await parser.destroy();
      }
    } else {
      // TXT 直接读取
      text = buffer.toString('utf8');
    }

    text = text.trim();
    if (!text) {
      return res.status(422).json({
        success: false,
        error: '文件中未提取到有效文本，请确认文件内容或换用其他文件。',
      });
    }

    return res.json({
      success: true,
      data: {
        filename: originalname,
        text,
        length: text.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

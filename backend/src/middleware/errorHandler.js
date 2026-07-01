/**
 * 全局错误处理中间件
 * 统一捕获异常，返回 { success: false, error: message }，避免向前端暴露堆栈。
 * 放在所有路由之后注册（Express 4 参数中间件即错误处理器）。
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    err && err.message
      ? err.message
      : '服务器内部错误，请稍后重试。';

  // 仅在非生产环境打印堆栈，便于排查
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[Error]', message, err && err.stack ? err.stack : '');
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;

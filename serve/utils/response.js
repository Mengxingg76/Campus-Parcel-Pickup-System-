/**
 * 成功响应格式
 * @param {any} data - 响应数据
 * @param {string} message - 响应消息
 * @returns {object} 标准响应对象
 */
const success = (data = null, message = '操作成功') => {
  return {
    code: 200,
    message,
    data
  };
};

/**
 * 错误响应格式
 * @param {string} message - 错误消息
 * @param {number} code - 错误代码
 * @returns {object} 标准错误响应对象
 */
const error = (message = '操作失败', code = 500) => {
  return {
    code,
    message,
    data: null
  };
};

module.exports = {
  success,
  error
};


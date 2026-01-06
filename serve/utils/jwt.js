const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * 生成 JWT Token
 * @param {number} userId - 用户ID
 * @param {string} username - 用户名
 * @param {string} role - 用户角色
 * @returns {string} JWT Token
 */
const generateToken = (userId, username, role) => {
  const payload = {
    userId,
    username,
    role
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * 验证 JWT Token
 * @param {string} token - JWT Token
 * @returns {object|null} 解码后的用户信息，失败返回 null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * 从请求头中提取 Token
 * @param {object} req - Express 请求对象
 * @returns {string|null} Token 字符串，未找到返回 null
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};


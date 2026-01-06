const { verifyToken, extractToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * JWT 认证中间件
 */
const authenticate = (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json(error('未提供认证令牌', 401));
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json(error('无效的认证令牌', 401));
  }
  
  req.user = decoded;
  next();
};

/**
 * 角色权限检查中间件
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(error('未认证', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(error('权限不足', 403));
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};


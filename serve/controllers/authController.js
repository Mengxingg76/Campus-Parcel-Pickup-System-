const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

/**
 * 用户注册
 */
const register = async (req, res) => {
  try {
    const { username, password, nickname, role = 'user' } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json(error('用户名和密码不能为空', 400));
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json(error('用户名已存在', 400));
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      nickname: nickname || username,
      role
    });
    
    // 生成 Token
    const token = generateToken(user.userId, user.username, user.role);
    
    res.json(success({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance
      }
    }, '注册成功'));
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json(error('注册失败', 500));
  }
};

/**
 * 用户登录
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json(error('用户名和密码不能为空', 400));
    }
    
    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`登录失败: 用户 ${username} 不存在`);
      return res.status(401).json(error('用户名或密码错误', 401));
    }
    
    // 验证密码
    console.log('验证密码:', {
      username,
      storedHash: user.password?.substring(0, 20) + '...',
      passwordLength: password?.length
    });
    
    const isPasswordValid = await comparePassword(password, user.password);
    
    console.log('密码验证结果:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.error(`登录失败: 用户 ${username} 密码错误`);
      console.error('存储的密码哈希:', user.password);
      return res.status(401).json(error('用户名或密码错误', 401));
    }
    
    // 生成 Token
    const token = generateToken(user.userId, user.username, user.role);
    
    res.json(success({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance
      }
    }, '登录成功'));
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json(error('登录失败', 500));
  }
};

/**
 * 获取当前用户信息
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    res.json(success(user, '获取成功'));
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json(error('获取用户信息失败', 500));
  }
};

/**
 * 临时：重置管理员密码（仅用于开发环境）
 * 警告：生产环境请删除此端点
 */
const resetAdminPassword = async (req, res) => {
  try {
    const { newPassword = 'admin123' } = req.body;
    
    // 查找管理员用户
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      return res.status(404).json(error('管理员用户不存在', 404));
    }
    
    // 使用 bcryptjs 生成新密码哈希
    const hashedPassword = await hashPassword(newPassword);
    
    // 更新密码
    await admin.update({ password: hashedPassword });
    
    console.log('管理员密码已重置');
    console.log('新密码:', newPassword);
    console.log('新哈希:', hashedPassword);
    
    res.json(success({
      message: '管理员密码已重置',
      newPassword,
      newHash: hashedPassword
    }, '密码重置成功'));
  } catch (err) {
    console.error('重置密码错误:', err);
    res.status(500).json(error('重置密码失败', 500));
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  resetAdminPassword
};


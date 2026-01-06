const { User } = require('../models');
const { hashPassword } = require('../utils/password');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 获取用户列表（管理员）
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, role, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (role) where.role = role;
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { nickname: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['createTime', 'DESC']]
    });
    
    res.json(success({
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }));
  } catch (err) {
    console.error('获取用户列表错误:', err);
    res.status(500).json(error('获取用户列表失败', 500));
  }
};

/**
 * 获取用户详情
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    res.json(success(user));
  } catch (err) {
    console.error('获取用户详情错误:', err);
    res.status(500).json(error('获取用户详情失败', 500));
  }
};

/**
 * 更新用户信息
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, role, balance } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    if (nickname !== undefined) user.nickname = nickname;
    if (role !== undefined) user.role = role;
    if (balance !== undefined) user.balance = balance;
    
    await user.save();
    
    res.json(success(user, '更新成功'));
  } catch (err) {
    console.error('更新用户错误:', err);
    res.status(500).json(error('更新用户失败', 500));
  }
};

/**
 * 删除用户
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    await user.destroy();
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除用户错误:', err);
    res.status(500).json(error('删除用户失败', 500));
  }
};

/**
 * 修改密码
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json(error('旧密码和新密码不能为空', 400));
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    const { comparePassword } = require('../utils/password');
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json(error('旧密码错误', 400));
    }
    
    user.password = await hashPassword(newPassword);
    await user.save();
    
    res.json(success(null, '密码修改成功'));
  } catch (err) {
    console.error('修改密码错误:', err);
    res.status(500).json(error('修改密码失败', 500));
  }
};

/**
 * 账户充值
 */
const recharge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json(error('充值金额必须大于0', 400));
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }
    
    user.balance = parseFloat(user.balance) + parseFloat(amount);
    await user.save();
    
    res.json(success({ balance: user.balance }, '充值成功'));
  } catch (err) {
    console.error('充值错误:', err);
    res.status(500).json(error('充值失败', 500));
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  recharge
};


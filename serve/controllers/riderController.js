const { Rider, User } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 获取配送员列表（管理员）
 */
const getRiders = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, certStatus, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (certStatus) where.certStatus = certStatus;
    if (keyword) {
      where[Op.or] = [
        { realName: { [Op.like]: `%${keyword}%` } },
        { phoneNumber: { [Op.like]: `%${keyword}%` } },
        { studentId: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    const { count, rows } = await Rider.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname', 'role'] }
      ],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['submitTime', 'DESC']]
    });
    
    res.json(success({
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }));
  } catch (err) {
    console.error('获取配送员列表错误:', err);
    res.status(500).json(error('获取配送员列表失败', 500));
  }
};

/**
 * 提交配送员认证
 */
const submitCertification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { realName, idNumber, phoneNumber, studentId, studentCardImage, idCardImage } = req.body;
    
    // 验证输入
    if (!realName || !idNumber || !phoneNumber || !studentId) {
      return res.status(400).json(error('请填写完整的认证信息', 400));
    }
    
    // 检查是否已提交
    const existingRider = await Rider.findOne({ where: { userId } });
    if (existingRider && existingRider.certStatus !== '已拒绝') {
      return res.status(400).json(error('您已提交过认证申请', 400));
    }
    
    // 创建或更新认证信息
    let rider;
    if (existingRider) {
      // 更新
      existingRider.realName = realName;
      existingRider.idNumber = idNumber;
      existingRider.phoneNumber = phoneNumber;
      existingRider.studentId = studentId;
      existingRider.studentCardImage = studentCardImage;
      existingRider.idCardImage = idCardImage;
      existingRider.certStatus = '审核中';
      existingRider.submitTime = new Date();
      await existingRider.save();
      rider = existingRider;
    } else {
      // 创建
      rider = await Rider.create({
        userId,
        realName,
        idNumber,
        phoneNumber,
        studentId,
        studentCardImage,
        idCardImage,
        certStatus: '审核中',
        submitTime: new Date()
      });
    }
    
    res.json(success(rider, '认证申请提交成功'));
  } catch (err) {
    console.error('提交认证错误:', err);
    res.status(500).json(error('提交认证失败', 500));
  }
};

/**
 * 获取当前用户的认证信息
 */
const getMyCertification = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const rider = await Rider.findOne({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname', 'role'] }
      ]
    });
    
    if (!rider) {
      return res.json(success(null, '未提交认证'));
    }
    
    res.json(success(rider));
  } catch (err) {
    console.error('获取认证信息错误:', err);
    res.status(500).json(error('获取认证信息失败', 500));
  }
};

/**
 * 审核配送员认证（管理员）
 */
const reviewCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { certStatus, reason } = req.body;
    
    if (!['已通过', '已拒绝'].includes(certStatus)) {
      return res.status(400).json(error('无效的审核状态', 400));
    }
    
    const rider = await Rider.findByPk(id);
    if (!rider) {
      return res.status(404).json(error('认证信息不存在', 404));
    }
    
    if (rider.certStatus !== '审核中') {
      return res.status(400).json(error('该认证已审核', 400));
    }
    
    rider.certStatus = certStatus;
    await rider.save();
    
    // 如果通过，更新用户角色
    if (certStatus === '已通过') {
      const user = await User.findByPk(rider.userId);
      if (user && user.role === 'user') {
        user.role = 'rider';
        await user.save();
      }
    }
    
    res.json(success(rider, '审核完成'));
  } catch (err) {
    console.error('审核认证错误:', err);
    res.status(500).json(error('审核认证失败', 500));
  }
};

module.exports = {
  getRiders,
  submitCertification,
  getMyCertification,
  reviewCertification
};


const { Order, User, Station, Building, PackageSize } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 生成订单号
 */
const generateOrderNo = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

/**
 * 创建订单
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { stationId, sizeId, buildingId, roomContact, pickupCode, remarks } = req.body;
    
    // 验证输入
    if (!stationId || !sizeId || !buildingId || !roomContact || !pickupCode) {
      return res.status(400).json(error('请填写完整的订单信息', 400));
    }
    
    // 获取包裹规格
    const packageSize = await PackageSize.findByPk(sizeId);
    if (!packageSize) {
      return res.status(404).json(error('包裹规格不存在', 404));
    }
    
    // 计算价格
    const basePrice = 5.00;
    const surcharge = parseFloat(packageSize.surcharge);
    const totalPrice = basePrice + surcharge;
    
    // 检查用户余额
    const user = await User.findByPk(userId);
    if (parseFloat(user.balance) < totalPrice) {
      return res.status(400).json(error('账户余额不足', 400));
    }
    
    // 创建订单
    const order = await Order.create({
      orderNo: generateOrderNo(),
      pickupCode,
      stationId,
      sizeId,
      buildingId,
      roomContact,
      remarks,
      basePrice,
      surcharge,
      totalPrice,
      status: '待接单',
      userId
    });
    
    // 扣除用户余额
    user.balance = parseFloat(user.balance) - totalPrice;
    await user.save();
    
    // 返回订单信息（包含关联数据）
    const orderWithDetails = await Order.findByPk(order.orderId, {
      include: [
        { model: Station, as: 'station' },
        { model: Building, as: 'building' },
        { model: PackageSize, as: 'packageSize' },
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname'] }
      ]
    });
    
    res.json(success(orderWithDetails, '订单创建成功'));
  } catch (err) {
    console.error('创建订单错误:', err);
    res.status(500).json(error('创建订单失败', 500));
  }
};

/**
 * 获取订单列表
 */
const getOrders = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, userId, riderId } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (riderId) where.riderId = riderId;
    
    // 如果是普通用户，只能查看自己的订单
    if (req.user.role === 'user') {
      where.userId = req.user.userId;
    }
    
    // 如果是配送员，可以查看自己接的订单
    if (req.user.role === 'rider') {
      where[Op.or] = [
        { status: '待接单' },
        { riderId: req.user.userId }
      ];
    }
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: Station, as: 'station' },
        { model: Building, as: 'building' },
        { model: PackageSize, as: 'packageSize' },
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname'] },
        { model: User, as: 'rider', attributes: ['userId', 'username', 'nickname'], required: false }
      ],
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
    console.error('获取订单列表错误:', err);
    res.status(500).json(error('获取订单列表失败', 500));
  }
};

/**
 * 获取订单详情
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id, {
      include: [
        { model: Station, as: 'station' },
        { model: Building, as: 'building' },
        { model: PackageSize, as: 'packageSize' },
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname'] },
        { model: User, as: 'rider', attributes: ['userId', 'username', 'nickname'], required: false }
      ]
    });
    
    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }
    
    // 权限检查
    if (req.user.role === 'user' && order.userId !== req.user.userId) {
      return res.status(403).json(error('无权访问', 403));
    }
    
    res.json(success(order));
  } catch (err) {
    console.error('获取订单详情错误:', err);
    res.status(500).json(error('获取订单详情失败', 500));
  }
};

/**
 * 接单（配送员）
 */
const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const riderId = req.user.userId;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }
    
    if (order.status !== '待接单') {
      return res.status(400).json(error('订单状态不允许接单', 400));
    }
    
    order.riderId = riderId;
    order.status = '配送中';
    await order.save();
    
    const orderWithDetails = await Order.findByPk(order.orderId, {
      include: [
        { model: Station, as: 'station' },
        { model: Building, as: 'building' },
        { model: PackageSize, as: 'packageSize' },
        { model: User, as: 'user', attributes: ['userId', 'username', 'nickname'] }
      ]
    });
    
    res.json(success(orderWithDetails, '接单成功'));
  } catch (err) {
    console.error('接单错误:', err);
    res.status(500).json(error('接单失败', 500));
  }
};

/**
 * 完成订单（配送员）
 */
const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const riderId = req.user.userId;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }
    
    if (order.riderId !== riderId) {
      return res.status(403).json(error('无权操作此订单', 403));
    }
    
    if (order.status !== '配送中') {
      return res.status(400).json(error('订单状态不允许完成', 400));
    }
    
    order.status = '已完成';
    await order.save();
    
    // 给配送员结算（70%）
    const rider = await User.findByPk(riderId);
    const riderEarnings = parseFloat(order.totalPrice) * 0.7;
    rider.balance = parseFloat(rider.balance) + riderEarnings;
    await rider.save();
    
    res.json(success(order, '订单完成'));
  } catch (err) {
    console.error('完成订单错误:', err);
    res.status(500).json(error('完成订单失败', 500));
  }
};

/**
 * 取消订单
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }
    
    // 权限检查
    if (req.user.role === 'user' && order.userId !== userId) {
      return res.status(403).json(error('无权操作此订单', 403));
    }
    
    if (order.status === '已完成' || order.status === '已取消') {
      return res.status(400).json(error('订单状态不允许取消', 400));
    }
    
    // 如果订单未接单，退还用户余额
    if (order.status === '待接单') {
      const user = await User.findByPk(order.userId);
      user.balance = parseFloat(user.balance) + parseFloat(order.totalPrice);
      await user.save();
    }
    
    order.status = '已取消';
    await order.save();
    
    res.json(success(order, '订单已取消'));
  } catch (err) {
    console.error('取消订单错误:', err);
    res.status(500).json(error('取消订单失败', 500));
  }
};

/**
 * 更新订单状态（管理员）
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }
    
    order.status = status;
    await order.save();
    
    res.json(success(order, '订单状态更新成功'));
  } catch (err) {
    console.error('更新订单状态错误:', err);
    res.status(500).json(error('更新订单状态失败', 500));
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  acceptOrder,
  completeOrder,
  cancelOrder,
  updateOrderStatus
};


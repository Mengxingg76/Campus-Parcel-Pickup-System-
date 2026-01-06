const { Order, User, Rider, Notice } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 获取仪表板统计数据（管理员）
 */
const getDashboardStats = async (req, res) => {
  try {
    // 总订单数
    const totalOrders = await Order.count();
    
    // 用户总数
    const totalUsers = await User.count();
    
    // 配送员数
    const totalRiders = await User.count({ where: { role: 'rider' } });
    
    // 通知公告数
    const totalNotices = await Notice.count();
    
    // 近7天订单统计
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const ordersByDay = await Order.findAll({
      where: {
        createTime: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [Order.sequelize.fn('DATE', Order.sequelize.col('create_time')), 'date'],
        [Order.sequelize.fn('COUNT', Order.sequelize.col('order_id')), 'count']
      ],
      group: [Order.sequelize.fn('DATE', Order.sequelize.col('create_time'))],
      order: [[Order.sequelize.fn('DATE', Order.sequelize.col('create_time')), 'ASC']],
      raw: true
    });
    
    // 订单状态分布
    const statusDistribution = await Order.findAll({
      attributes: [
        'status',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('order_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    
    res.json(success({
      totalOrders,
      totalUsers,
      totalRiders,
      totalNotices,
      ordersByDay,
      statusDistribution
    }));
  } catch (err) {
    console.error('获取仪表板数据错误:', err);
    res.status(500).json(error('获取仪表板数据失败', 500));
  }
};

module.exports = {
  getDashboardStats
};


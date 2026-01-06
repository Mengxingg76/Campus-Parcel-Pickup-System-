const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('order_info', {
  orderId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'order_id'
  },
  orderNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_no',
    comment: '订单号'
  },
  pickupCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'pickup_code',
    comment: '取件码'
  },
  stationId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'station_id',
    comment: '快递站点ID'
  },
  sizeId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'size_id',
    comment: '包裹规格ID'
  },
  buildingId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'building_id',
    comment: '宿舍楼ID'
  },
  roomContact: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'room_contact',
    comment: '寝室号/联系人'
  },
  remarks: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '备注'
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5.00,
    field: 'base_price',
    comment: '基础配送费'
  },
  surcharge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: '规格附加费'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price',
    comment: '总价'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '待接单',
    comment: '状态：待接单、配送中、已完成、已取消'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'user_id',
    comment: '下单用户ID'
  },
  riderId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'rider_id',
    comment: '配送员ID'
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'create_time',
    comment: '创建时间'
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'update_time',
    comment: '更新时间'
  }
}, {
  tableName: 'order_info',
  timestamps: true,
  createdAt: 'createTime',
  updatedAt: 'updateTime',
  indexes: [
    { fields: ['order_no'] },
    { fields: ['user_id'] },
    { fields: ['rider_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Order;


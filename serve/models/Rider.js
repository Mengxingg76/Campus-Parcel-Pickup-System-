const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rider = sequelize.define('rider_info', {
  riderId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'rider_id'
  },
  realName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'real_name',
    comment: '真实姓名'
  },
  idNumber: {
    type: DataTypes.STRING(18),
    allowNull: false,
    field: 'id_number',
    comment: '身份证号'
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_number',
    comment: '手机号'
  },
  studentId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'student_id',
    comment: '学号'
  },
  studentCardImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'student_card_image',
    comment: '学生证图片'
  },
  idCardImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'id_card_image',
    comment: '身份证图片'
  },
  certStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '无',
    field: 'cert_status',
    comment: '认证状态：无、审核中、已通过、已拒绝'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    field: 'user_id',
    comment: '用户ID'
  },
  submitTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submit_time',
    comment: '提交时间'
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'update_time',
    comment: '更新时间'
  }
}, {
  tableName: 'rider_info',
  timestamps: true,
  createdAt: 'submitTime',
  updatedAt: 'updateTime',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['cert_status'] }
  ]
});

module.exports = Rider;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notice = sequelize.define('notice', {
  noticeId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'notice_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '内容'
  },
  publishTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'publish_time',
    comment: '发布时间'
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'create_time',
    comment: '创建时间'
  }
}, {
  tableName: 'notice',
  timestamps: true,
  createdAt: 'createTime',
  updatedAt: false
});

module.exports = Notice;


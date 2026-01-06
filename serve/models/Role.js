const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('sys_role', {
  roleId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'role_id'
  },
  roleName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'role_name',
    comment: '角色名称'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
    comment: '显示顺序'
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'create_time',
    comment: '创建时间'
  }
}, {
  tableName: 'sys_role',
  timestamps: true,
  createdAt: 'createTime',
  updatedAt: false
});

module.exports = Role;


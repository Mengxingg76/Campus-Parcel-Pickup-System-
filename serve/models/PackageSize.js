const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PackageSize = sequelize.define('package_size', {
  sizeId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'size_id'
  },
  sizeName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'size_name',
    comment: '规格名称'
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '描述'
  },
  surcharge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: '加价'
  }
}, {
  tableName: 'package_size',
  timestamps: false
});

module.exports = PackageSize;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Building = sequelize.define('dormitory_building', {
  buildingId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'building_id'
  },
  buildingName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'building_name',
    comment: '楼栋名称'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
    comment: '排序'
  }
}, {
  tableName: 'dormitory_building',
  timestamps: false
});

module.exports = Building;


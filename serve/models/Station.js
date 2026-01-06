const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Station = sequelize.define('express_station', {
  stationId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'station_id'
  },
  stationName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'station_name',
    comment: '站点名称'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
    comment: '排序'
  }
}, {
  tableName: 'express_station',
  timestamps: false
});

module.exports = Station;


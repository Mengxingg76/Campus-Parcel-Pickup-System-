const { sequelize } = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Station = require('./Station');
const Building = require('./Building');
const PackageSize = require('./PackageSize');
const Order = require('./Order');
const Rider = require('./Rider');
const Notice = require('./Notice');

// 定义关联关系
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(User, { foreignKey: 'riderId', as: 'rider' });
Order.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });
Order.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });
Order.belongsTo(PackageSize, { foreignKey: 'sizeId', as: 'packageSize' });

Rider.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasOne(Rider, { foreignKey: 'userId', as: 'riderInfo' });

module.exports = {
  sequelize,
  User,
  Role,
  Station,
  Building,
  PackageSize,
  Order,
  Rider,
  Notice
};


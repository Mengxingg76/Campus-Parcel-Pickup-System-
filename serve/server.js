const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

// 测试数据库连接
testConnection();

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('正在关闭服务器...');
  await sequelize.close();
  process.exit(0);
});


const express = require('express');
const router = express.Router();

// 导入控制器
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const stationController = require('../controllers/stationController');
const buildingController = require('../controllers/buildingController');
const packageSizeController = require('../controllers/packageSizeController');
const riderController = require('../controllers/riderController');
const noticeController = require('../controllers/noticeController');
const dashboardController = require('../controllers/dashboardController');

// 导入中间件
const { authenticate, authorize } = require('../middleware/auth');

// API 根路径信息
router.get('/', (req, res) => {
  res.json({ 
    code: 200, 
    message: 'API 服务正常', 
    data: {
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register'
        }
      }
    }
  });
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({ code: 200, message: '服务正常', data: null });
});

// 认证路由（不需要认证）
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
// 临时：重置管理员密码（仅用于开发环境，生产环境请删除）
router.post('/auth/reset-admin-password', authController.resetAdminPassword);

// 需要认证的路由
router.use(authenticate);

// 当前用户信息
router.get('/auth/me', authController.getCurrentUser);

// 用户路由
router.get('/users', authorize('admin'), userController.getUsers);
router.get('/users/:id', authorize('admin'), userController.getUserById);
router.put('/users/:id', authorize('admin'), userController.updateUser);
router.delete('/users/:id', authorize('admin'), userController.deleteUser);
router.post('/users/change-password', userController.changePassword);
router.post('/users/recharge', userController.recharge);

// 订单路由
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders/:id/accept', authorize('rider', 'admin'), orderController.acceptOrder);
router.post('/orders/:id/complete', authorize('rider', 'admin'), orderController.completeOrder);
router.post('/orders/:id/cancel', orderController.cancelOrder);
router.put('/orders/:id/status', authorize('admin'), orderController.updateOrderStatus);

// 站点路由
router.get('/stations', stationController.getStations);
router.post('/stations', authorize('admin'), stationController.createStation);
router.put('/stations/:id', authorize('admin'), stationController.updateStation);
router.delete('/stations/:id', authorize('admin'), stationController.deleteStation);

// 楼栋路由
router.get('/buildings', buildingController.getBuildings);
router.post('/buildings', authorize('admin'), buildingController.createBuilding);
router.put('/buildings/:id', authorize('admin'), buildingController.updateBuilding);
router.delete('/buildings/:id', authorize('admin'), buildingController.deleteBuilding);

// 包裹规格路由
router.get('/package-sizes', packageSizeController.getPackageSizes);
router.post('/package-sizes', authorize('admin'), packageSizeController.createPackageSize);
router.put('/package-sizes/:id', authorize('admin'), packageSizeController.updatePackageSize);
router.delete('/package-sizes/:id', authorize('admin'), packageSizeController.deletePackageSize);

// 配送员路由
router.get('/riders', authorize('admin'), riderController.getRiders);
router.post('/riders/certification', riderController.submitCertification);
router.get('/riders/my-certification', riderController.getMyCertification);
router.put('/riders/:id/review', authorize('admin'), riderController.reviewCertification);

// 通知路由
router.get('/notices', noticeController.getNotices);
router.get('/notices/:id', noticeController.getNoticeById);
router.post('/notices', authorize('admin'), noticeController.createNotice);
router.put('/notices/:id', authorize('admin'), noticeController.updateNotice);
router.delete('/notices/:id', authorize('admin'), noticeController.deleteNotice);

// 仪表板路由（管理员）
router.get('/dashboard/stats', authorize('admin'), dashboardController.getDashboardStats);

module.exports = router;


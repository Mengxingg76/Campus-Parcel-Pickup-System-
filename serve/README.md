# 校园快递代取平台 - Node.js 后端

基于 Express.js + Sequelize + MySQL 的后端服务。

## 技术栈

- **Node.js**: 运行环境
- **Express.js**: Web 框架
- **Sequelize**: ORM 框架
- **MySQL**: 数据库
- **JWT**: 身份认证
- **bcryptjs**: 密码加密

## 环境要求

- Node.js: 22 或以上
- MySQL: 5.7 或 8.0 或以上

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，配置数据库连接等信息。

### 3. 初始化数据库

执行 `database/init.sql` 脚本创建数据库和表。

### 4. 启动服务

开发模式（使用 nodemon）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务将运行在 `http://localhost:8080`

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 用户管理
- `GET /api/users` - 获取用户列表（管理员）
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户信息（管理员）
- `DELETE /api/users/:id` - 删除用户（管理员）
- `POST /api/users/change-password` - 修改密码
- `POST /api/users/recharge` - 账户充值

### 订单管理
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders/:id/accept` - 接单（配送员）
- `POST /api/orders/:id/complete` - 完成订单（配送员）
- `POST /api/orders/:id/cancel` - 取消订单
- `PUT /api/orders/:id/status` - 更新订单状态（管理员）

### 站点管理
- `GET /api/stations` - 获取站点列表
- `POST /api/stations` - 创建站点（管理员）
- `PUT /api/stations/:id` - 更新站点（管理员）
- `DELETE /api/stations/:id` - 删除站点（管理员）

### 楼栋管理
- `GET /api/buildings` - 获取楼栋列表
- `POST /api/buildings` - 创建楼栋（管理员）
- `PUT /api/buildings/:id` - 更新楼栋（管理员）
- `DELETE /api/buildings/:id` - 删除楼栋（管理员）

### 包裹规格管理
- `GET /api/package-sizes` - 获取包裹规格列表
- `POST /api/package-sizes` - 创建包裹规格（管理员）
- `PUT /api/package-sizes/:id` - 更新包裹规格（管理员）
- `DELETE /api/package-sizes/:id` - 删除包裹规格（管理员）

### 配送员管理
- `GET /api/riders` - 获取配送员列表（管理员）
- `POST /api/riders/certification` - 提交配送员认证
- `GET /api/riders/my-certification` - 获取当前用户的认证信息
- `PUT /api/riders/:id/review` - 审核配送员认证（管理员）

### 通知公告
- `GET /api/notices` - 获取通知列表
- `GET /api/notices/:id` - 获取通知详情
- `POST /api/notices` - 创建通知（管理员）
- `PUT /api/notices/:id` - 更新通知（管理员）
- `DELETE /api/notices/:id` - 删除通知（管理员）

### 仪表板
- `GET /api/dashboard/stats` - 获取统计数据（管理员）

## 项目结构

```
backend/
├── config/          # 配置文件
│   └── database.js # 数据库配置
├── controllers/     # 控制器
├── middleware/      # 中间件
├── models/         # 数据模型
├── routes/         # 路由
├── utils/          # 工具函数
├── app.js          # Express 应用
├── server.js       # 服务器入口
└── package.json    # 项目配置
```

## 认证说明

大部分接口需要 JWT 认证，在请求头中添加：

```
Authorization: Bearer <token>
```

## 角色说明

- **admin**: 超级管理员
- **rider**: 配送员
- **user**: 普通用户

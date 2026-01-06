# 校园快递代取平台

一个基于 Node.js + Vue3 的前后端分离校园快递代取平台项目。

## 技术栈

### 后端
- Node.js 22+
- Express.js 4.18+
- Sequelize ORM
- JWT 认证
- MySQL 5.7+

### 前端
- Vue 3.4.0
- Element Plus 2.4.4
- Axios 1.6.2
- Vue Router 4.2.5
- Pinia 2.1.7
- ECharts 5.4.3

### 数据库
- MySQL 5.7/8.0+

## 环境要求

- Node.js: 22 或以上
- MySQL: 5.7 或 8.0 或以上（推荐 8.0）

## 项目结构

```
校园快递代取/
├── backend/                 # 后端项目（Node.js）
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由
│   ├── middleware/          # 中间件
│   ├── utils/              # 工具函数
│   ├── app.js              # Express 应用
│   ├── server.js           # 服务器入口
│   └── package.json        # 项目配置
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── router/         # 路由配置
│   │   ├── store/          # 状态管理
│   │   ├── views/          # 页面组件
│   │   │   ├── admin/     # 管理后台页面
│   │   │   ├── rider/     # 配送员页面
│   │   │   ├── user/       # 用户页面
│   │   │   └── common/     # 公共页面
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
└── database/               # 数据库脚本
    └── init.sql
```

## 快速开始

### 1. 数据库初始化

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE express_delivery DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本：
```bash
mysql -u root -p express_delivery < database/init.sql
```

或者直接在 MySQL 客户端中执行 `database/init.sql` 文件。

### 2. 后端配置

1. 修改 `backend/.env` 中的数据库配置：
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=express_delivery
DB_USER=root
DB_PASSWORD=你的数据库密码
```

2. 安装依赖并启动后端服务：
```bash
cd backend
npm install
npm run dev  # 开发模式
# 或
npm start    # 生产模式
```

后端服务将在 `http://localhost:8080` 启动。

### 3. 前端配置

1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

### 4. 访问系统

- 前端地址：http://localhost:3000
- 后端API地址：http://localhost:8080/api
- 健康检查：http://localhost:8080/api/health

## 默认账号

### 管理员账号
- 用户名：`admin`
- 密码：`admin123`
- 角色：超级管理员

## 功能模块

### 1. 管理员模块
- ✅ 登录功能
- ✅ 用户管理
- ✅ 角色管理
- ✅ 首页数据图表统计
- ✅ 快递站点管理
- ✅ 包裹规格管理
- ✅ 宿舍楼管理
- ✅ 订单管理
- ✅ 配送员管理/审核
- ✅ 通知公告管理

### 2. 配送员端模块
- ✅ 登录/注册
- ✅ 接单大厅
- ✅ 接单记录

### 3. 用户端模块
- ✅ 登录/注册
- ✅ 个人中心
- ✅ 用户端首页
- ✅ 快递代取下单
- ✅ 我的订单
- ✅ 账户充值
- ✅ 通知公告
- ✅ 配送员认证

## 开发说明

### 后端开发

1. 数据模型位于 `backend/models/`
2. 控制器位于 `backend/controllers/`
3. 路由位于 `backend/routes/`
4. 中间件位于 `backend/middleware/`
5. 工具函数位于 `backend/utils/`

### 前端开发

1. API接口定义在 `frontend/src/api/`
2. 路由配置在 `frontend/src/router/index.js`
3. 状态管理在 `frontend/src/store/`
4. 页面组件在 `frontend/src/views/`

### JWT认证

- Token存储在localStorage中
- 请求头格式：`Authorization: Bearer {token}`
- Token过期时间：24小时

## 注意事项

1. 确保 MySQL 服务已启动
2. 确保端口 8080 和 3000 未被占用
3. 首次运行需要执行数据库初始化脚本
4. 文件上传路径配置在 `.env` 的 `UPLOAD_PATH` 中，需要确保该目录存在
5. 如果使用 `npm run dev`，需要全局安装 nodemon：`npm install -g nodemon`

## 许可证

MIT License


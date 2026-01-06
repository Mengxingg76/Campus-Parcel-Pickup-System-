-- ============================================
-- 校园快递代取平台数据库初始化脚本
-- ============================================

-- 删除数据库（如果存在，谨慎使用）
-- DROP DATABASE IF EXISTS express_delivery;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS express_delivery 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE express_delivery;

-- ============================================
-- 删除已存在的表（按依赖关系顺序）
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_info;
DROP TABLE IF EXISTS rider_info;
DROP TABLE IF EXISTS notice;
DROP TABLE IF EXISTS package_size;
DROP TABLE IF EXISTS express_station;
DROP TABLE IF EXISTS dormitory_building;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sys_role;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 创建数据表
-- ============================================

-- 1. 角色表
CREATE TABLE sys_role (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    display_order INT DEFAULT 0 COMMENT '显示顺序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_role_name (role_name),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 2. 用户表
CREATE TABLE sys_user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
    nickname VARCHAR(50) COMMENT '昵称',
    role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin-超级管理员, rider-配送员, user-普通用户',
    balance DECIMAL(10, 2) DEFAULT 0.00 COMMENT '账户余额',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 3. 快递站点表
CREATE TABLE express_station (
    station_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '站点ID',
    station_name VARCHAR(100) NOT NULL COMMENT '站点名称',
    sort_order INT DEFAULT 0 COMMENT '排序',
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='快递站点表';

-- 4. 宿舍楼表
CREATE TABLE dormitory_building (
    building_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '楼栋ID',
    building_name VARCHAR(50) NOT NULL COMMENT '楼栋名称',
    sort_order INT DEFAULT 0 COMMENT '排序',
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍楼表';

-- 5. 包裹规格表
CREATE TABLE package_size (
    size_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '规格ID',
    size_name VARCHAR(50) NOT NULL COMMENT '规格名称',
    description VARCHAR(200) COMMENT '描述',
    surcharge DECIMAL(10, 2) DEFAULT 0.00 COMMENT '加价',
    INDEX idx_size_name (size_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='包裹规格表';

-- 6. 订单表
CREATE TABLE order_info (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    pickup_code VARCHAR(50) NOT NULL COMMENT '取件码',
    station_id BIGINT NOT NULL COMMENT '快递站点ID',
    size_id BIGINT NOT NULL COMMENT '包裹规格ID',
    building_id BIGINT NOT NULL COMMENT '宿舍楼ID',
    room_contact VARCHAR(100) NOT NULL COMMENT '寝室号/联系人',
    remarks VARCHAR(500) COMMENT '备注',
    base_price DECIMAL(10, 2) DEFAULT 5.00 COMMENT '基础配送费',
    surcharge DECIMAL(10, 2) DEFAULT 0.00 COMMENT '规格附加费',
    total_price DECIMAL(10, 2) NOT NULL COMMENT '总价',
    status VARCHAR(20) NOT NULL DEFAULT '待接单' COMMENT '状态：待接单、配送中、已完成、已取消',
    user_id BIGINT NOT NULL COMMENT '下单用户ID',
    rider_id BIGINT COMMENT '配送员ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_rider_id (rider_id),
    INDEX idx_status (status),
    INDEX idx_create_time (create_time),
    INDEX idx_station_id (station_id),
    INDEX idx_building_id (building_id),
    FOREIGN KEY (station_id) REFERENCES express_station(station_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (size_id) REFERENCES package_size(size_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (building_id) REFERENCES dormitory_building(building_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES sys_user(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 7. 配送员信息表
CREATE TABLE rider_info (
    rider_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '配送员ID',
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    id_number VARCHAR(18) NOT NULL COMMENT '身份证号',
    phone_number VARCHAR(20) NOT NULL COMMENT '手机号码',
    student_id VARCHAR(50) NOT NULL COMMENT '学号',
    student_card_image VARCHAR(500) COMMENT '学生证照片路径',
    id_card_image VARCHAR(500) COMMENT '身份证照片路径',
    cert_status VARCHAR(20) DEFAULT '无' COMMENT '认证状态：无、审核中、已通过、已拒绝',
    user_id BIGINT NOT NULL UNIQUE COMMENT '认证用户ID',
    submit_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_cert_status (cert_status),
    INDEX idx_submit_time (submit_time),
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送员信息表';

-- 8. 通知公告表
CREATE TABLE notice (
    notice_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '公告ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    publish_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_publish_time (publish_time),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入角色数据
INSERT INTO sys_role (role_name, display_order, create_time) VALUES
('admin', 1, NOW()),
('user', 2, NOW()),
('rider', 3, NOW());

-- 插入管理员用户
-- 密码：admin123 (BCrypt加密后的值)
-- 可以使用在线BCrypt生成器或Spring Security的BCryptPasswordEncoder生成
INSERT INTO sys_user (username, password, nickname, role, balance, create_time, update_time) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', '系统管理员', 'admin', 0.00, NOW(), NOW());

-- 插入测试用户（密码：123456）
-- 普通用户
INSERT INTO sys_user (username, password, nickname, role, balance, create_time, update_time) VALUES
('zhangsan', '$2a$10$7JB720yubVSOfvVaMWzKHe6qYVj8HVD.8UuBPj5rH9nqN9p5vY1zC', '张三', 'user', 5.60, NOW(), NOW()),
('lisi', '$2a$10$7JB720yubVSOfvVaMWzKHe6qYVj8HVD.8UuBPj5rH9nqN9p5vY1zC', '李四', 'user', 0.00, NOW(), NOW());

-- 插入快递站点数据
INSERT INTO express_station (station_name, sort_order) VALUES
('菜鸟驿站', 1),
('顺丰直营点', 2),
('丰巢柜', 3),
('近邻宝', 4),
('城市住行', 5);

-- 插入宿舍楼数据
INSERT INTO dormitory_building (building_name, sort_order) VALUES
('宿舍1号楼', 1),
('宿舍2号楼', 2),
('研究所公寓', 3);

-- 插入包裹规格数据
INSERT INTO package_size (size_name, description, surcharge) VALUES
('小件', '鞋盒大小以内', 0.00),
('中件', '微波炉大小以内', 3.00),
('大件', '重量>5kg或超大', 8.00);

-- 插入配送员认证信息（张三已通过认证）
INSERT INTO rider_info (real_name, id_number, phone_number, student_id, cert_status, user_id, submit_time, update_time) VALUES
('张三', '136631111122223333', '13699998888', '0123456', '已通过', 2, '2025-12-26 13:19:42', '2025-12-26 13:19:42');

-- 更新张三的角色为配送员
UPDATE sys_user SET role = 'rider' WHERE user_id = 2;

-- 插入订单数据（示例数据）
INSERT INTO order_info (order_no, pickup_code, station_id, size_id, building_id, room_contact, remarks, base_price, surcharge, total_price, status, user_id, rider_id, create_time, update_time) VALUES
('OR202512261747093', '3-2013', 1, 2, 1, '李四', '放门口', 5.00, 3.00, 8.00, '已完成', 3, 2, '2025-12-26 17:47:10', '2025-12-26 17:47:10'),
('OR202512272347473', 'A126', 3, 2, 1, '李四', NULL, 5.00, 3.00, 8.00, '待接单', 3, NULL, '2025-12-27 23:47:48', '2025-12-27 23:47:48'),
('OR202512272348123', 'B563', 3, 2, 2, '李四', NULL, 5.00, 3.00, 8.00, '待接单', 3, NULL, '2025-12-27 23:48:13', '2025-12-27 23:48:13'),
('OR202512262249513', 'A126', 5, 3, 2, '503', '兄弟快点,很急', 5.00, 8.00, 13.00, '待接单', 3, NULL, '2025-12-26 22:49:52', '2025-12-26 22:49:52'),
('OR202512251608413', '3-2053', 1, 2, 1, '李四', '放门口', 5.00, 3.00, 8.00, '已取消', 3, NULL, '2025-12-25 16:08:41', '2025-12-25 16:08:41');

-- 插入通知公告数据
INSERT INTO notice (title, content, publish_time, create_time) VALUES
('新增"近邻宝"快递柜代取服务', '好消息!即日起平台正式开通南校区近邻宝快递柜代取服务。', '2025-12-27 22:13:19', '2025-12-27 22:13:19'),
('关于规范快递代取下单地址填写的说明', '为了确保快递准确送达,请同学们在下单时务必填写详细的楼栋和寝室号。对于地址模糊的订单,骑手可能会联系您确认地址。', '2025-12-27 22:13:09', '2025-12-27 22:13:09'),
('近期校园电信诈骗高发,请注意防范', '近期接到多起同学反馈遇到冒充快递客服理赔的诈骗电话。骗子通常声称快递丢失,需要进行双倍赔付,诱导同学扫描二维码或点击链接。\n\n郑重提醒: 凡是要求转账、提供验证码的均为诈骗!', '2025-12-27 22:11:04', '2025-12-27 22:11:04'),
('关于系统服务器升级维护的通知', '尊敬的用户:为了提供更优质的服务,我们将于2025年12月28日 02:00-06:00进行系统升级。届时系统将暂停服务,给您带来的不便敬请谅解。', '2025-12-27 22:09:59', '2025-12-27 22:09:59');

-- ============================================
-- 查询验证
-- ============================================

-- 查看所有表
SHOW TABLES;

-- 查看表结构
-- DESCRIBE sys_user;
-- DESCRIBE order_info;
-- DESCRIBE rider_info;

-- 查看初始化数据统计
SELECT 
    (SELECT COUNT(*) FROM sys_user) AS user_count,
    (SELECT COUNT(*) FROM sys_role) AS role_count,
    (SELECT COUNT(*) FROM express_station) AS station_count,
    (SELECT COUNT(*) FROM dormitory_building) AS building_count,
    (SELECT COUNT(*) FROM package_size) AS size_count,
    (SELECT COUNT(*) FROM order_info) AS order_count,
    (SELECT COUNT(*) FROM rider_info) AS rider_count,
    (SELECT COUNT(*) FROM notice) AS notice_count;

-- ============================================
-- 数据库初始化完成
-- ============================================
-- 默认账号信息：
-- 管理员账号：admin / admin123
-- 测试用户：zhangsan / 123456 (已认证为配送员)
-- 测试用户：lisi / 123456 (普通用户)
-- ============================================

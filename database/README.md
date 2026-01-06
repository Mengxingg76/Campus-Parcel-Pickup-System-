# 数据库初始化说明

## 文件说明

- `init.sql` - 完整的数据库初始化脚本，包含所有表结构、外键关系和初始化数据

## 使用方法

### 方法一：命令行执行

```bash
# 登录MySQL
mysql -u root -p

# 执行SQL文件
source database/init.sql

# 或者直接执行
mysql -u root -p < database/init.sql
```

### 方法二：MySQL客户端工具

1. 使用 Navicat、DBeaver、MySQL Workbench 等工具
2. 连接到MySQL服务器
3. 打开 `init.sql` 文件
4. 执行整个脚本

### 方法三：IDEA数据库工具

1. 在IDEA中打开数据库工具窗口
2. 连接到MySQL数据库
3. 右键点击数据库 -> 运行SQL脚本
4. 选择 `init.sql` 文件执行

## 数据库结构

### 表列表

1. **sys_role** - 角色表
2. **sys_user** - 用户表
3. **express_station** - 快递站点表
4. **dormitory_building** - 宿舍楼表
5. **package_size** - 包裹规格表
6. **order_info** - 订单表
7. **rider_info** - 配送员信息表
8. **notice** - 通知公告表

### 表关系图

```
sys_user (用户)
    ├── order_info (订单) - user_id, rider_id
    └── rider_info (配送员信息) - user_id

express_station (快递站点)
    └── order_info (订单) - station_id

dormitory_building (宿舍楼)
    └── order_info (订单) - building_id

package_size (包裹规格)
    └── order_info (订单) - size_id
```

## 默认账号

### 管理员账号
- **用户名**: `admin`
- **密码**: `admin123`
- **角色**: 超级管理员

### 测试账号

#### 配送员账号
- **用户名**: `zhangsan`
- **密码**: `123456`
- **角色**: 配送员（已通过认证）
- **余额**: ¥5.60

#### 普通用户账号
- **用户名**: `lisi`
- **密码**: `123456`
- **角色**: 普通用户
- **余额**: ¥0.00

## 密码说明

所有密码使用 BCrypt 加密存储。如果需要修改密码，可以使用以下方式：

### Java代码生成BCrypt密码

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String encodedPassword = encoder.encode("your_password");
System.out.println(encodedPassword);
```

### 在线工具

可以使用在线BCrypt生成器：
- https://bcrypt-generator.com/
- https://www.bcrypt.fr/

## 注意事项

1. **执行前备份**: 如果数据库已存在数据，执行前请先备份
2. **外键约束**: 脚本中设置了外键约束，删除数据时需要注意顺序
3. **字符集**: 数据库使用 utf8mb4 字符集，支持emoji和特殊字符
4. **时区**: 默认使用服务器时区，建议设置为 Asia/Shanghai

## 重置数据库

如果需要重置数据库，可以：

1. 删除数据库重新创建：
```sql
DROP DATABASE IF EXISTS express_delivery;
-- 然后重新执行 init.sql
```

2. 或者直接重新执行 `init.sql`（脚本开头已包含删除表的逻辑）

## 常见问题

### Q: 执行时提示外键约束错误？
A: 脚本开头已设置 `SET FOREIGN_KEY_CHECKS = 0`，如果仍有问题，请确保按顺序执行。

### Q: 密码无法登录？
A: 确认密码是否正确，默认密码：
- admin: admin123
- zhangsan: 123456
- lisi: 123456

### Q: 如何添加新用户？
A: 可以使用注册功能，或直接在数据库中插入（密码需要BCrypt加密）。


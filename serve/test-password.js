const bcrypt = require('bcryptjs');

// 数据库中的密码哈希
const storedHash = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C';
const testPassword = 'admin123';

async function testPassword() {
  console.log('测试密码验证...');
  console.log('存储的哈希:', storedHash);
  console.log('测试密码:', testPassword);
  
  try {
    const result = await bcrypt.compare(testPassword, storedHash);
    console.log('验证结果:', result);
    
    if (!result) {
      console.log('\n密码不匹配，生成新的密码哈希:');
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('新的哈希:', newHash);
      console.log('\n请使用以下 SQL 更新数据库:');
      console.log(`UPDATE sys_user SET password = '${newHash}' WHERE username = 'admin';`);
    } else {
      console.log('密码验证成功！');
    }
  } catch (error) {
    console.error('错误:', error);
  }
}

testPassword();


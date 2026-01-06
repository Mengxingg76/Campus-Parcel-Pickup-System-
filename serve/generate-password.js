const bcrypt = require('bcryptjs');

async function generatePassword() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('密码: admin123');
  console.log('生成的哈希:', hash);
  console.log('\n请执行以下 SQL 更新数据库:');
  console.log(`UPDATE sys_user SET password = '${hash}' WHERE username = 'admin';`);
  
  // 验证生成的哈希
  const isValid = await bcrypt.compare(password, hash);
  console.log('\n验证结果:', isValid ? '✓ 密码哈希有效' : '✗ 密码哈希无效');
}

generatePassword().catch(console.error);


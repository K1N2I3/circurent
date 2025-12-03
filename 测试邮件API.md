# 📧 测试邮件 API - 直接使用方法

由于测试页面可能还在部署中，您可以直接使用 API 接口来测试。

## 方法 1: 使用浏览器控制台（最简单）

1. **打开您的应用**：https://circurent.vercel.app
2. **按 F12 打开开发者工具**（或右键 → 检查）
3. **切换到 Console（控制台）标签**
4. **复制并粘贴以下代码**：

```javascript
fetch('https://circurent.vercel.app/api/test-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: 'your-email@example.com'  // 替换为您的测试邮箱
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ 结果:', data);
  if (data.success) {
    console.log('✅ 邮件发送成功！');
    if (data.resendDashboard) {
      console.log('📧 查看详情:', data.resendDashboard);
    }
  } else {
    console.error('❌ 发送失败:', data.error);
  }
})
.catch(error => {
  console.error('❌ 错误:', error);
});
```

5. **按 Enter 执行**
6. **查看控制台输出**，会显示详细的发送结果

## 方法 2: 使用 curl 命令（命令行）

如果您有命令行工具，可以运行：

```bash
curl -X POST https://circurent.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

将 `your-email@example.com` 替换为您的测试邮箱。

## 方法 3: 等待测试页面部署

测试页面 `/test-email` 应该会在几分钟内可用。如果仍然 404，可能是：

1. **部署还在进行中**：等待 1-2 分钟后再试
2. **检查 Vercel 部署状态**：
   - 访问 https://vercel.com/dashboard
   - 查看最新部署是否完成
   - 确认没有部署错误

## 📋 结果解读

### 成功的情况：
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "emailId": "xxx",
  "config": {
    "fromEmail": "CircuRent <noreply@circurent.it>",
    "toEmail": "your-email@example.com"
  }
}
```

### 失败的情况：
```json
{
  "success": false,
  "error": {
    "message": "错误信息",
    "statusCode": 400
  },
  "config": {
    "fromEmail": "CircuRent <noreply@circurent.it>",
    "toEmail": "your-email@example.com"
  }
}
```

## 🔍 常见错误

### 错误 1: "only send testing emails to your own email address"
- **原因**：仍在使用未验证的域名
- **解决**：确认 `RESEND_FROM_EMAIL` 使用的是 `noreply@circurent.it`

### 错误 2: "domain not verified"
- **原因**：域名验证状态有问题
- **解决**：检查 https://resend.com/domains 确认域名状态

### 错误 3: "API key invalid"
- **原因**：API Key 错误或过期
- **解决**：重新生成 API Key 并更新

## 💡 建议

**最快的方法**：使用方法 1（浏览器控制台），立即就能看到结果！


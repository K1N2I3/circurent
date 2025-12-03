# 邮箱验证问题排查指南

## 🔍 常见问题

### 1. 邮箱验证码发送失败

#### 检查清单：

1. **检查 Resend API Key 是否配置**
   ```bash
   # 查看 .env.local 文件
   cat .env.local | grep RESEND_API_KEY
   ```
   
   应该显示：
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

2. **检查服务器日志**
   
   如果发送失败，服务器控制台会显示详细错误信息：
   - ✅ 成功：`✅ Verification email sent to xxx via Resend`
   - ❌ 失败：会显示具体的错误信息

3. **常见错误及解决方案**

   **错误：`domain not verified`**
   - **原因**：使用的发送邮箱地址未验证
   - **解决**：
     - 选项 A：使用 Resend 默认测试域名 `onboarding@resend.dev`（已在代码中配置）
     - 选项 B：在 Resend Dashboard 验证您的域名

   **错误：`API key invalid`**
   - **原因**：API 密钥错误或已过期
   - **解决**：重新生成 API 密钥并更新 `.env.local`

   **错误：`rate limit exceeded`**
   - **原因**：发送频率过高
   - **解决**：等待几分钟后重试

### 2. 开发模式（未配置 Resend）

如果未配置 `RESEND_API_KEY`，系统会：
- ✅ 在控制台显示验证码（用于开发测试）
- ✅ 允许继续注册流程
- ⚠️ 不会实际发送邮件

**查看验证码**：
检查运行 `npm run dev` 的终端窗口，会显示：
```
📧 [DEV MODE] Verification code for xxx@example.com:
   Code: 123456
   Expires in: 10 minutes
```

### 3. 配置自定义发送邮箱

如果您想使用自己的域名邮箱：

1. **在 Resend Dashboard 验证域名**
   - 访问 https://resend.com/domains
   - 添加您的域名
   - 按照提示配置 DNS 记录

2. **更新环境变量**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=CircuRent <noreply@yourdomain.com>
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

## 🔧 调试步骤

### 步骤 1: 检查环境变量

```bash
cd "/Users/ken.lin/Desktop/Alessandro Smit Project CircuRent"
cat .env.local
```

确保包含：
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 步骤 2: 检查服务器日志

1. 打开注册页面
2. 输入邮箱地址
3. 点击"发送验证码"
4. 查看运行 `npm run dev` 的终端窗口

### 步骤 3: 测试 Resend API

如果问题持续，可以手动测试 Resend API：

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "CircuRent <onboarding@resend.dev>",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

## 📧 Resend 免费额度

- **免费额度**：每月 3,000 封邮件
- **默认域名限制**：`onboarding@resend.dev` 每天最多 100 封
- **验证域名后**：无每日限制（仅受月额度限制）

## 🆘 仍然无法解决？

1. **检查 Resend Dashboard**
   - 访问 https://resend.com/emails
   - 查看邮件发送历史
   - 检查是否有错误信息

2. **查看完整错误日志**
   - 服务器控制台会显示详细的错误信息
   - 包括 Resend API 返回的具体错误

3. **临时解决方案**
   - 使用开发模式（不配置 RESEND_API_KEY）
   - 验证码会显示在控制台
   - 适合开发和测试阶段


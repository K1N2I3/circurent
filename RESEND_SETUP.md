# Resend 邮件服务设置指南

## 📧 为什么使用 Resend？

- ✅ **简单易用** - 最友好的邮件 API
- ✅ **免费额度** - 每月 3,000 封邮件免费
- ✅ **快速设置** - 5 分钟即可完成
- ✅ **高送达率** - 专业的邮件基础设施

## 🚀 快速设置步骤

### 步骤 1: 注册 Resend 账户

1. **访问 Resend**：
   - 打开 https://resend.com
   - 点击 "Get Started" 或 "Sign Up"

2. **创建账户**：
   - 使用您的邮箱注册
   - 验证邮箱地址

### 步骤 2: 获取 API 密钥

1. **登录后**，您会看到 Dashboard
2. **点击左侧菜单的 "API Keys"**
3. **点击 "Create API Key"** 按钮
4. **填写信息**：
   - **Name**: CircuRent Production（或您喜欢的名称）
   - **Permission**: 选择 "Sending access"
5. **点击 "Add"**
6. **复制 API 密钥**（格式：`re_xxxxxxxxxxxxx`）
   - ⚠️ **重要**：密钥只显示一次，请立即复制保存

### 步骤 3: 配置到项目

1. **打开项目的 `.env.local` 文件**
2. **添加以下行**：

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

3. **将 `re_xxxxxxxxxxxxx` 替换为您刚才复制的实际 API 密钥**

### 步骤 4: 配置发送域名（可选，推荐）

#### 选项 A: 使用 Resend 默认域名（快速开始）

- 可以直接使用 `onboarding@resend.dev` 作为发送地址
- 适合开发和测试
- **限制**：每天最多 100 封邮件

#### 选项 B: 验证您的域名（生产环境推荐）

1. 在 Resend Dashboard，点击 **"Domains"**
2. 点击 **"Add Domain"**
3. 输入您的域名（例如：`yourdomain.com`）
4. 按照提示添加 DNS 记录到您的域名提供商
5. 等待验证完成（通常几分钟）
6. 验证后，可以使用 `noreply@yourdomain.com` 等地址

### 步骤 5: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## ✅ 验证设置

1. **访问注册页面**
2. **填写邮箱地址**
3. **点击下一步**
4. **检查您的邮箱**，应该会收到验证码邮件

## 📧 邮件模板

系统会自动发送包含以下内容的邮件：
- 精美的 HTML 模板
- 6 位数字验证码
- 过期时间提示（10 分钟）
- CircuRent 品牌样式

## 💰 费用说明

### 免费计划：
- **每月 3,000 封邮件**
- **每天 100 封邮件**（使用默认域名时）
- 适合大多数中小型应用

### 付费计划：
- **Pro**: $20/月 - 50,000 封/月
- **Business**: 自定义价格 - 无限邮件

## 🔒 安全提示

1. **不要将 API 密钥提交到 Git**
2. **使用环境变量存储密钥**
3. **定期轮换 API 密钥**
4. **监控发送量**，避免超出配额

## 🐛 故障排除

### 问题：邮件未收到
- 检查垃圾邮件文件夹
- 确认 API 密钥正确
- 检查 Resend Dashboard 中的发送日志

### 问题：收到 "Invalid API key" 错误
- 确认 API 密钥已复制完整
- 检查 `.env.local` 文件格式
- 重启开发服务器

### 问题：超出配额
- 检查 Resend Dashboard 中的使用量
- 考虑升级到付费计划
- 或使用其他邮件服务（SendGrid、SMTP）

## 📚 更多资源

- [Resend 文档](https://resend.com/docs)
- [API 参考](https://resend.com/docs/api-reference)
- [最佳实践](https://resend.com/docs/best-practices)

## 🎯 下一步

配置完成后，验证码邮件功能就可以正常工作了！

如果需要帮助，请告诉我。


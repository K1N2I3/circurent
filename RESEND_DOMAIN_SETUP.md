# Resend 域名验证指南

## 🔍 问题原因

使用 `onboarding@resend.dev` 测试域名时，Resend 限制只能发送到注册账户的邮箱地址。

**错误信息：**
```
You can only send testing emails to your own email address (hudefei1979@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains, 
and change the `from` address to an email using this domain.
```

## ✅ 解决方案：验证您的域名

### 步骤 1: 访问 Resend Domains 页面

1. 登录 Resend Dashboard
2. 访问：https://resend.com/domains
3. 点击 **"Add Domain"** 按钮

### 步骤 2: 添加您的域名

1. **输入域名**（例如：`yourdomain.com`）
   - 可以是您拥有的任何域名
   - 不需要是主域名，子域名也可以（例如：`mail.yourdomain.com`）

2. **选择域名类型**：
   - **Root Domain**（根域名）：`yourdomain.com`
   - **Subdomain**（子域名）：`mail.yourdomain.com`（推荐，更灵活）

### 步骤 3: 配置 DNS 记录

Resend 会显示需要添加的 DNS 记录，通常包括：

#### 对于根域名：
```
Type: TXT
Name: @
Value: [Resend 提供的验证值]
```

#### 对于子域名（推荐）：
```
Type: TXT
Name: mail (或您选择的子域名)
Value: [Resend 提供的验证值]
```

#### SPF 记录（可选但推荐）：
```
Type: TXT
Name: @ (或子域名)
Value: v=spf1 include:resend.com ~all
```

#### DKIM 记录（推荐）：
```
Type: CNAME
Name: [Resend 提供的名称]
Value: [Resend 提供的值]
```

### 步骤 4: 在您的域名提供商添加 DNS 记录

1. **登录您的域名提供商**（如 GoDaddy, Namecheap, Cloudflare 等）
2. **找到 DNS 管理页面**
3. **添加 Resend 提供的所有 DNS 记录**
4. **保存更改**

### 步骤 5: 等待验证

- DNS 记录传播通常需要 **5-60 分钟**
- Resend 会自动检查验证状态
- 验证成功后，域名状态会变为 **"Verified"**

### 步骤 6: 更新项目配置

验证成功后，更新 `.env.local`：

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=CircuRent <noreply@yourdomain.com>
```

或者如果是子域名：

```env
RESEND_FROM_EMAIL=CircuRent <noreply@mail.yourdomain.com>
```

### 步骤 7: 重启开发服务器

```bash
npm run dev
```

## 🎯 快速测试（临时方案）

在验证域名之前，您可以：

1. **使用注册邮箱测试**：
   - 暂时将测试邮箱改为 `hudefei1979@gmail.com`
   - 这样可以验证邮件发送功能是否正常

2. **使用控制台输出**（开发模式）：
   - 当前代码已经实现了 fallback 模式
   - 验证码会显示在服务器控制台
   - 适合开发和测试阶段

## 📝 常见问题

### Q: 我没有域名怎么办？
**A:** 您可以：
- 购买一个便宜的域名（约 $10-15/年）
- 使用免费域名服务（如 Freenom）
- 在开发阶段使用控制台输出验证码

### Q: 验证需要多长时间？
**A:** 通常 5-60 分钟，取决于 DNS 传播速度。

### Q: 可以使用子域名吗？
**A:** 可以！使用子域名（如 `mail.yourdomain.com`）更灵活，不会影响主域名的其他服务。

### Q: 验证后还需要做什么？
**A:** 
- 更新 `.env.local` 中的 `RESEND_FROM_EMAIL`
- 重启开发服务器
- 测试发送邮件

## 🔗 相关链接

- Resend Domains: https://resend.com/domains
- Resend Documentation: https://resend.com/docs
- DNS 记录说明: https://resend.com/docs/dashboard/domains/introduction


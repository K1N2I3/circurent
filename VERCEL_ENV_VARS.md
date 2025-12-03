# 🔐 Vercel 环境变量配置清单

在 Vercel Dashboard 中配置以下环境变量：

## 📋 必需的环境变量

### 1. Supabase 数据库

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**获取方式**: https://app.supabase.com → 项目 → Settings → API

---

### 2. JWT 认证密钥

```
JWT_SECRET
```

**生成方式**:
```bash
openssl rand -base64 32
```

**要求**: 至少 32 个字符

---

### 3. Resend 邮件服务

```
RESEND_API_KEY
RESEND_FROM_EMAIL
```

**获取方式**: 
- API Key: https://resend.com/api-keys
- From Email: 
  - ✅ **已验证域名**: `CircuRent <noreply@noreply.circurent.it>`（可发送到任何邮箱）
  - 测试: `CircuRent <onboarding@resend.dev>`（只能发送到注册邮箱）

**当前配置**:
- 已验证的域名: `noreply.circurent.it` (子域名) ✅ 已验证
- 发送地址: `noreply@noreply.circurent.it` (必须匹配已验证的子域名)

---

## ⚙️ 可选的环境变量

### Google Maps（如果使用）

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

**注意**: 如果未配置，将自动使用免费的 OpenStreetMap

---

## 📝 在 Vercel 中配置步骤

1. **进入项目设置**:
   - Vercel Dashboard → 选择项目 → Settings → Environment Variables

2. **添加每个变量**:
   - 点击 "Add New"
   - 输入变量名和值
   - 选择环境: ✅ Production, ✅ Preview, ✅ Development
   - 点击 "Save"

3. **重新部署**:
   - 环境变量更改后需要重新部署
   - 进入 Deployments → 点击最新部署的 "..." → Redeploy

---

## ✅ 配置检查清单

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已配置
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已配置
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 已配置
- [ ] `JWT_SECRET` 已配置（至少 32 字符）
- [ ] `RESEND_API_KEY` 已配置
- [ ] `RESEND_FROM_EMAIL` 已配置
- [ ] 所有变量都已添加到 Production、Preview 和 Development 环境
- [ ] 已重新部署项目

---

## 🔍 验证配置

部署后，检查：

1. **应用是否正常加载**
2. **用户注册功能是否正常**
3. **数据库连接是否正常**（检查 Supabase Dashboard）
4. **邮件发送是否正常**（或检查控制台日志）

---

## 🆘 问题排查

### 环境变量未生效？

- ✅ 确认变量名完全匹配（区分大小写）
- ✅ 确认已添加到正确的环境（Production/Preview/Development）
- ✅ 重新部署项目

### 构建失败？

- ✅ 检查所有必需的环境变量是否已配置
- ✅ 查看构建日志中的具体错误信息

### 数据库连接失败？

- ✅ 确认 Supabase 项目正常运行
- ✅ 验证 API 密钥是否正确
- ✅ 检查 Supabase 项目的网络设置

---

**提示**: 可以使用 `.env.example` 文件作为参考模板。


# 🚀 Vercel 部署步骤（当前界面）

## 📋 您当前看到的界面

您已经成功导入了 GitHub 仓库 `K1N2I3/circurent`！

## ⚠️ 重要：部署前先配置环境变量

**不要立即点击 "Deploy"！** 先配置环境变量。

### 步骤 1: 展开环境变量设置

1. 在 "New Project" 表单中，找到 **"> Environment Variables"**
2. **点击展开**这个选项

### 步骤 2: 添加环境变量

点击 "Add" 按钮，逐个添加以下变量：

#### 变量 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://viibdpqwxxroqbbtpocs.supabase.co
Environment: ✅ Production, ✅ Preview, ✅ Development
```

#### 变量 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaWJkcHF3eHhyb3FiYnRwb2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTc0NTksImV4cCI6MjA4MDI3MzQ1OX0.cnTmBJO9OpkZNkL55rEwSydeZ_NgRrU6I4-EOMD0GGE
Environment: ✅ Production, ✅ Preview, ✅ Development
```

#### 变量 3: Supabase Service Role Key
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaWJkcHF3eHhyb3FiYnRwb2NzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY5NzQ1OSwiZXhwIjoyMDgwMjczNDU5fQ.ffx0lCJVTSZCt9JivOGEKnH8IJqRUDANjmTefMRrm2g
Environment: ✅ Production, ✅ Preview, ✅ Development
```

#### 变量 4: JWT Secret
```
Name: JWT_SECRET
Value: circurent-super-secret-jwt-key-change-in-production
Environment: ✅ Production, ✅ Preview, ✅ Development
```

#### 变量 5: Resend API Key
```
Name: RESEND_API_KEY
Value: re_AcovjuaR_5JpoEbpeGfiDpGgQS6vDrLyg
Environment: ✅ Production, ✅ Preview, ✅ Development
```

#### 变量 6: Resend From Email
```
Name: RESEND_FROM_EMAIL
Value: CircuRent <onboarding@resend.dev>
Environment: ✅ Production, ✅ Preview, ✅ Development
```

### 步骤 3: 检查配置

确认以下设置：
- ✅ Framework Preset: **Next.js**（应该已自动检测）
- ✅ Root Directory: **./**（默认即可）
- ✅ 所有 6 个环境变量已添加
- ✅ 每个变量都选择了所有环境（Production、Preview、Development）

### 步骤 4: 部署

1. 确认所有环境变量已添加
2. 点击底部的 **"Deploy"** 按钮
3. 等待构建完成（约 2-3 分钟）

## 📝 快速复制清单

如果您想快速复制所有变量值，可以使用以下格式：

```
NEXT_PUBLIC_SUPABASE_URL=https://viibdpqwxxroqbbtpocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaWJkcHF3eHhyb3FiYnRwb2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTc0NTksImV4cCI6MjA4MDI3MzQ1OX0.cnTmBJO9OpkZNkL55rEwSydeZ_NgRrU6I4-EOMD0GGE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaWJkcHF3eHhyb3FiYnRwb2NzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY5NzQ1OSwiZXhwIjoyMDgwMjczNDU5fQ.ffx0lCJVTSZCt9JivOGEKnH8IJqRUDANjmTefMRrm2g
JWT_SECRET=circurent-super-secret-jwt-key-change-in-production
RESEND_API_KEY=re_AcovjuaR_5JpoEbpeGfiDpGgQS6vDrLyg
RESEND_FROM_EMAIL=CircuRent <onboarding@resend.dev>
```

## ⚠️ 常见错误

### 错误 1: 忘记添加环境变量
- **症状**: 部署成功但应用无法正常工作
- **解决**: 在项目设置中添加环境变量后重新部署

### 错误 2: 变量名拼写错误
- **症状**: 构建成功但功能异常
- **解决**: 检查变量名是否完全匹配（区分大小写）

### 错误 3: 只添加到 Production
- **症状**: Preview 部署失败
- **解决**: 确保每个变量都添加到所有三个环境

## ✅ 部署后检查

部署完成后：
1. 访问提供的 URL（例如：`https://circurent.vercel.app`）
2. 测试首页是否正常加载
3. 测试用户注册功能
4. 测试用户登录功能
5. 检查构建日志确认无错误

## 🎉 完成！

部署成功后，每次推送到 GitHub 的 `main` 分支都会自动触发新的部署！


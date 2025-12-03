# Google Maps API 设置指南

## 📍 获取 Google Maps API 密钥

### 步骤 1: 访问 Google Cloud Console

1. **打开 Google Cloud Console**：
   - 访问 https://console.cloud.google.com
   - 使用您的 Google 账户登录

### 步骤 2: 创建项目（如果还没有）

1. 点击页面顶部的项目选择器
2. 点击 **"New Project"**
3. 填写项目信息：
   - **Project name**: CircuRent（或您喜欢的名称）
   - **Organization**: 选择您的组织（如果有）
4. 点击 **"Create"**
5. 等待项目创建完成（几秒钟）

### 步骤 3: 启用必要的 API

1. 在左侧菜单，点击 **"APIs & Services"** → **"Library"**
2. 搜索并启用以下 API：
   - **"Places API"** - 用于地址自动补全
   - **"Maps JavaScript API"** - 用于地图显示（可选，如果将来需要显示地图）

#### 启用 Places API：
1. 在搜索框输入 "Places API"
2. 点击 **"Places API"**
3. 点击 **"Enable"** 按钮

#### 启用 Maps JavaScript API（可选）：
1. 在搜索框输入 "Maps JavaScript API"
2. 点击 **"Maps JavaScript API"**
3. 点击 **"Enable"** 按钮

### 步骤 4: 创建 API 密钥

1. 在左侧菜单，点击 **"APIs & Services"** → **"Credentials"**
2. 点击页面顶部的 **"+ CREATE CREDENTIALS"**
3. 选择 **"API key"**
4. 系统会生成一个 API 密钥并显示在弹窗中
5. **复制这个密钥**（格式类似：`AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

### 步骤 5: 限制 API 密钥（推荐，提高安全性）

1. 在 "Credentials" 页面，点击您刚创建的 API 密钥
2. 在 "API restrictions" 部分：
   - 选择 **"Restrict key"**
   - 在 "Select APIs" 中，选择：
     - ✅ **Places API**
     - ✅ **Maps JavaScript API**（如果启用了）
3. 在 "Application restrictions" 部分（可选）：
   - 选择 **"HTTP referrers (web sites)"**
   - 添加您的网站域名（例如：`localhost:3000/*`, `yourdomain.com/*`）
4. 点击 **"Save"**

### 步骤 6: 配置到项目中

1. 打开项目的 `.env.local` 文件
2. 添加以下行：

```env
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. 将 `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 替换为您刚才复制的实际 API 密钥

### 步骤 7: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## 💰 费用说明

### 免费额度（每月）：
- **Places API**: 
  - 自动补全：每月前 17,000 次请求免费
  - 地点详情：每月前 2,500 次请求免费
- **Maps JavaScript API**: 每月前 28,000 次地图加载免费

### 超出免费额度后：
- 自动补全：$2.83 / 1,000 次请求
- 地点详情：$17 / 1,000 次请求

**对于大多数应用，免费额度已经足够使用！**

## 🔒 安全提示

1. **限制 API 密钥**：只允许特定 API 使用
2. **设置 HTTP 引用限制**：只允许您的域名使用
3. **不要将 API 密钥提交到 Git**：确保 `.env.local` 在 `.gitignore` 中
4. **监控使用量**：定期检查 Google Cloud Console 中的使用情况

## ✅ 验证设置

配置完成后，在注册页面输入地址时：
1. 输入至少 3 个字符
2. 应该能看到地址建议下拉列表
3. 选择地址后会自动填充

## 🐛 故障排除

### 问题：地址建议不显示
- 检查 API 密钥是否正确
- 确认 Places API 已启用
- 检查浏览器控制台是否有错误

### 问题：收到 "API key not valid" 错误
- 确认 API 密钥已复制完整
- 检查 API 限制设置
- 确认 Places API 已启用

### 问题：超出配额
- 检查 Google Cloud Console 中的使用量
- 考虑升级到付费计划或优化请求频率

## 📚 更多资源

- [Google Maps Platform 文档](https://developers.google.com/maps/documentation)
- [Places API 文档](https://developers.google.com/maps/documentation/places/web-service)
- [定价信息](https://developers.google.com/maps/billing-and-pricing/pricing)


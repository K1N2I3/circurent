# OpenAI API 配置指南

## 📋 需要什么

要使用 AI 图片识别功能，你需要：

1. **OpenAI 账户**（免费注册）
2. **API Key**（需要付费，按使用量计费）
3. **环境变量配置**

## 🔧 详细步骤

### 步骤 1: 注册 OpenAI 账户

1. **访问 OpenAI 官网**
   - 打开 https://platform.openai.com/
   - 点击 "Sign up" 注册账户
   - 或点击 "Log in" 登录已有账户

2. **验证邮箱和手机**
   - 完成邮箱验证
   - 完成手机验证（可能需要）

### 步骤 2: 获取 API Key

1. **登录 OpenAI Platform**
   - 访问 https://platform.openai.com/api-keys
   - 或登录后点击左侧菜单的 "API keys"

2. **创建新的 API Key**
   - 点击 "Create new secret key" 按钮
   - 输入一个名称（例如：CircuRent AI）
   - 点击 "Create secret key"
   - **重要**：立即复制 API Key，因为之后无法再次查看
   - 格式类似：`sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **设置使用限制（可选但推荐）**
   - 在 "Usage limits" 中设置每月预算限制
   - 可以设置硬限制（达到后自动停止）或软限制（仅通知）

### 步骤 3: 充值账户（必需）

1. **添加付款方式**
   - 访问 https://platform.openai.com/account/billing
   - 点击 "Add payment method"
   - 添加信用卡或 PayPal

2. **充值金额**
   - OpenAI 使用按量付费模式
   - 建议先充值 $5-10 用于测试
   - 每次 API 调用都会从余额中扣除

3. **查看定价**
   - GPT-4 Vision API 的定价：
     - 输入：$0.01 / 1K tokens
     - 输出：$0.03 / 1K tokens
   - 每次图片分析大约消耗 100-300 tokens
   - 成本约为 $0.001-0.01 每次分析

### 步骤 4: 配置环境变量

#### 本地开发（.env.local）

1. **打开项目根目录的 `.env.local` 文件**
   - 如果不存在，创建一个新文件

2. **添加 OpenAI API Key**
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```
   - 将 `sk-proj-your-actual-api-key-here` 替换为你的实际 API Key

3. **保存文件**
   - 确保文件已保存

4. **重启开发服务器**
   ```bash
   npm run dev
   ```

#### Vercel 部署

1. **登录 Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择你的项目

2. **打开项目设置**
   - 点击项目名称
   - 点击 "Settings"
   - 点击左侧菜单的 "Environment Variables"

3. **添加环境变量**
   - 点击 "Add New"
   - **Key**: `OPENAI_API_KEY`
   - **Value**: 你的 OpenAI API Key（格式：`sk-proj-...`）
   - **Environment**: 选择所有环境（Production, Preview, Development）
   - 点击 "Save"

4. **重新部署**
   - 环境变量添加后，Vercel 会自动触发重新部署
   - 或手动点击 "Redeploy"

## 💰 费用说明

### 定价详情

- **GPT-4 Vision (gpt-4o)**
  - 输入：$0.01 / 1K tokens
  - 输出：$0.03 / 1K tokens

### 使用成本估算

- **每次图片分析**：
  - 输入 tokens：约 100-200（图片编码 + 提示词）
  - 输出 tokens：约 50-100（生成的描述）
  - **成本**：约 $0.002-0.01 每次

- **每月 100 次分析**：约 $0.20-1.00
- **每月 1000 次分析**：约 $2.00-10.00

### 节省成本的方法

1. **设置使用限制**
   - 在 OpenAI 账户中设置每月预算上限
   - 防止意外超支

2. **优化使用**
   - 只在用户确认需要时调用 AI
   - 可以添加"使用 AI 分析"开关，让用户选择

3. **缓存结果**
   - 相同图片可以缓存分析结果
   - 减少重复 API 调用

## ✅ 验证配置

### 测试 API Key

1. **在添加物品页面**
   - 访问 `/rentals/add`
   - 上传一张图片
   - 如果看到 "Analyzing image with AI..." 提示
   - 几秒后显示 AI 建议，说明配置成功

2. **检查控制台**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签
   - 如果有错误，会显示具体信息

### 常见问题

1. **"API key is invalid"**
   - 检查 API Key 是否正确复制
   - 确保没有多余的空格
   - 确认 API Key 没有被撤销

2. **"Insufficient quota"**
   - 账户余额不足
   - 需要充值

3. **"Rate limit exceeded"**
   - API 调用频率过高
   - 等待一段时间后重试

4. **没有 AI 分析功能**
   - 检查环境变量是否正确配置
   - 确认已重启开发服务器
   - 检查 Vercel 环境变量是否已部署

## 🔒 安全建议

1. **不要提交 API Key 到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 不要在代码中硬编码 API Key

2. **使用环境变量**
   - 始终使用环境变量存储敏感信息
   - 不要在客户端代码中暴露 API Key

3. **定期轮换 API Key**
   - 如果怀疑泄露，立即撤销并创建新的

4. **设置使用限制**
   - 在 OpenAI 账户中设置预算限制
   - 监控使用情况

## 📝 总结

**必需项：**
- ✅ OpenAI 账户
- ✅ API Key
- ✅ 充值账户（至少 $5）
- ✅ 环境变量配置

**可选但推荐：**
- ⚙️ 设置使用限制
- 📊 监控使用情况
- 🔄 定期检查余额

配置完成后，AI 图片识别功能就可以正常工作了！


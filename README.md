# CircuRent - 物品租赁平台

一个现代化的物品租赁平台，支持用户注册、登录、浏览物品、租赁和支付功能。

## 功能特性

- ✅ 用户注册和登录系统
- ✅ 浏览和搜索20+种不同类型的物品
- ✅ 物品分类筛选
- ✅ 物品详情查看
- ✅ 租赁订单创建
- ✅ PayPal支付集成
- ✅ 信用卡支付（演示模式）
- ✅ 用户仪表板查看租赁历史

## 物品类型

平台包含以下类别的物品：
- 电子产品（相机、投影仪、无人机、游戏主机、笔记本电脑等）
- 运动器材（自行车、滑板、跑步机等）
- 户外用品（帐篷、烧烤架、野餐套装等）
- 工具（电钻、电动工具套装、3D打印机等）
- 乐器（钢琴、吉他、电钢琴等）
- 交通工具（电动滑板车等）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **认证**: JWT + bcrypt
- **支付**: PayPal SDK, Stripe (演示)
- **数据存储**: JSON文件（开发环境）

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件 `.env.local`：
```env
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

3. 运行开发服务器：
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/
│   ├── api/              # API路由
│   │   ├── auth/         # 认证相关（登录、注册、登出）
│   │   ├── items/        # 物品相关
│   │   ├── payment/      # 支付处理
│   │   └── rentals/      # 租赁管理
│   ├── components/       # 组件
│   ├── dashboard/        # 用户仪表板
│   ├── items/            # 物品详情页
│   ├── login/            # 登录页
│   ├── payment/          # 支付页
│   ├── register/         # 注册页
│   └── page.tsx          # 首页
├── lib/
│   ├── auth.ts           # 认证工具函数
│   ├── db.ts             # 数据库操作
│   └── initItems.ts      # 初始化物品数据
└── data/                 # 数据存储目录（自动创建）
```

## 使用说明

1. **注册账户**: 点击导航栏的"注册"按钮，填写姓名、邮箱和密码
2. **浏览物品**: 在首页可以浏览所有可用物品，使用搜索和分类筛选
3. **查看详情**: 点击物品卡片查看详细信息
4. **租赁物品**: 选择租赁日期和支付方式，创建租赁订单
5. **完成支付**: 在支付页面完成PayPal或信用卡支付
6. **查看订单**: 在"我的租赁"页面查看所有租赁历史

## 🚀 部署

### 快速部署到 Vercel + GitHub

详细部署指南请查看：[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**快速步骤**:
1. 创建 GitHub 仓库并推送代码
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量（Supabase、Resend、JWT 等）
4. 部署完成！

### 必需的环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=CircuRent <noreply@yourdomain.com>
```

## 注意事项

- ✅ **数据库**: 已配置 Supabase（PostgreSQL），支持生产环境部署
- ✅ **邮件服务**: 已集成 Resend，需要验证域名才能发送到所有邮箱
- ⚠️ **部署**: 在 Vercel 等平台部署时，确保配置所有环境变量
- 📖 **详细说明**: 
  - 部署指南: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
  - 数据库设置: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
  - 邮件设置: [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md)

## 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 许可证

MIT


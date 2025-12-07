# ReelFlix 项目概要

## 项目结构

```
ReelFlix/
├── client/              # React 前端应用 (TypeScript + Tailwind CSS)
│   ├── public/          # 静态资源
│   ├── src/             # 源代码
│   │   ├── assets/      # 静态资源
│   │   ├── components/  # React 组件
│   │   ├── pages/       # 页面组件
│   │   ├── App.tsx      # 主应用组件
│   │   └── main.tsx     # 应用入口
│   ├── index.html       # HTML 模板
│   ├── tsconfig.json    # TypeScript 配置
│   ├── tailwind.config.js # Tailwind CSS 配置
│   └── package.json     # 前端依赖配置
├── server/              # Express 服务端 (TypeScript)
│   ├── src/             # TypeScript 源代码
│   │   ├── controllers/ # 控制器
│   │   ├── middleware/  # 中间件
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── utils/       # 工具函数
│   │   └── server.ts    # 服务端入口
│   ├── dist/            # 编译后的 JavaScript 代码
│   ├── .env             # 环境变量
│   ├── tsconfig.json    # TypeScript 配置
│   └── package.json     # 服务端依赖配置
├── package.json         # 根目录配置和脚本
├── pnpm-lock.yaml       # 依赖锁定文件
└── README.md            # 项目说明
```

## 技术栈

### 前端
- React 19 (TypeScript)
- Vite 构建工具
- HeroUI 组件库
- Tailwind CSS v3
- Framer Motion 动画库

### 后端
- Express 5 (TypeScript)
- Node.js
- dotenv 环境变量管理
- cors 跨域处理

### 开发工具
- pnpm 包管理器
- concurrently 并行执行脚本
- TypeScript 类型检查

## 运行项目

### 开发模式

同时启动前端和服务端：
```bash
pnpm run dev
```

单独启动前端：
```bash
pnpm run dev:client
```

单独启动服务端：
```bash
pnpm run dev:server
```

### 生产构建

构建前后端应用：
```bash
pnpm run build
```

分别构建前端和后端：
```bash
pnpm run build:client
pnpm run build:server
```

启动生产环境应用：
```bash
pnpm run start
```
## 环境配置

### 前端
前端应用运行在 `http://localhost:5173`

### 后端
后端服务运行在 `http://localhost:3000`，端口可通过 `.env` 文件中的 `PORT` 变量修改。

## 项目特点

1. **现代化技术栈** - 使用最新的 React 19 和 Express 5，完全基于 TypeScript
2. **样式系统升级** - 采用 Tailwind CSS v3，提供更灵活的样式定制
3. **类型安全** - 前后端均使用 TypeScript，提供完整的类型检查
4. **组件化设计** - 基于 HeroUI 组件库构建用户界面
5. **清晰的架构** - 前后端分离，结构清晰易于维护
6. **开发友好** - 支持热重载和并发开发
7. **可扩展性** - 模块化的代码结构便于功能扩展
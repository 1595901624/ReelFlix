# ReelFlix - 在线影视平台库

这是一个使用 React + Vite + HeroUI + Tailwind CSS 构建的前端和 Express (TypeScript) 构建的服务端的在线影视平台。该项目旨在为用户提供一个简洁、高效且响应迅速的影视内容浏览和播放体验。并不涉及任何版权内容的存储或分发，仅作为个人视频内容的聚合和展示平台。

![项目预览](./demo/demo.png)

## 项目结构

- `client/` - React 前端应用 (TypeScript + Tailwind CSS)
- `server/` - Express 服务端 (TypeScript)

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

## 快速开始

### 先决条件
- Node.js >= 19
- pnpm >= 10

### 安装依赖

```bash
pnpm install
```

### 环境配置(以下可选)
在 `server/` 目录下创建一个 `.env` 文件，添加以下环境变量：

```
PORT=3000
```

在 `client/` 目录下创建一个 `.env` 文件，添加以下环境变量：

```
# API Sources Configuration
# 标识总共的视频源数量
REEL_FLIEX_SOURCES_COUNT=3

# 具体视频源的名称和 URL
# 格式如下所示：
# 必须按照 REEL_FLIX_SOURCE_{n}_NAME 和 REEL_FLIX_SOURCE_{n}_URL 的格式定义
REEL_FLIX_SOURCE_1_NAME=example1
REEL_FLIX_SOURCE_1_URL=https://api.example1.com/provide/vod/

REEL_FLIX_SOURCE_2_NAME=example2
REEL_FLIX_SOURCE_2_URL=https://api.example2.com/provide/vod/

REEL_FLIX_SOURCE_3_NAME=example3
REEL_FLIX_SOURCE_3_URL=https://api.example3.com/provide/vod/
```

### 本地运行

```bash
# 安装所有子项目依赖
pnpm install-all
# 同时启动前端和服务端
pnpm run dev

## 其它命令
# 只启动前端
pnpm run dev:client

# 只启动服务端
pnpm run dev:server
```

### 生产构建

```bash
# 构建前后端应用
pnpm run build

# 分别构建前端和后端
pnpm run build:client
pnpm run build:server
```

### Docker 部署（未测试）

项目支持使用 Docker 进行部署。

#### 先决条件
- Docker >= 20.10
- Docker Compose >= 2.0

#### 使用 Docker Compose 部署

```bash
# 构建并启动服务
docker-compose up --build

# 后台运行
docker-compose up --build -d

# 停止服务
docker-compose down
```

服务将在以下端口运行：
- 前端: http://localhost:8080
- 后端: http://localhost:3000

#### 单独构建镜像

```bash
# 构建前端镜像
docker build -f Dockerfile.client -t reelflix-client .

# 构建后端镜像
docker build -f Dockerfile.server -t reelflix-server .

# 运行容器
docker run -p 8080:80 reelflix-client
docker run -p 3000:3000 reelflix-server
```

### Vercel 部署（推荐）

项目支持使用 Vercel 部署。

1. git fork 本项目到您的 GitHub 账户。
2. 登录 Vercel 并导入您的仓库。
3. 直接 Deploy


## 项目特点

1. **现代化技术栈** - 使用最新的 React 19 和 Express 5，完全基于 TypeScript
2. **响应式设计** - 基于 HeroUI 组件库和 Tailwind CSS 构建的响应式用户界面
3. **类型安全** - 前后端均使用 TypeScript，提供完整的类型检查
4. **清晰的架构** - 前后端分离，结构清晰易于维护
5. **开发友好** - 支持热重载和并发开发
6. **可扩展性** - 模块化的代码结构便于功能扩展

## 免责声明

ReelFlix 仅作为视频内容聚合平台，不对所展示内容的版权、合法性或准确性承担任何责任。用户应自行评估并承担使用风险。

请谨慎对待应用内外的广告信息。本平台不对广告内容的真实性或可靠性负责。

如果您遇到任何问题或有建议，请通过 GitHub 反馈：[https://github.com/1595901624/ReelFlix](https://github.com/1595901624/ReelFlix)

## TODO

- [ ] PC 版 coming soon
- [ ] 添加更多视频源支持
- [ ] 优化移动端体验
- [ ] 实现用户收藏功能

## 项目文档

详细的项目说明请查看 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

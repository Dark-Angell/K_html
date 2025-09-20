# 翠微路后台管理系统

## 项目概述

这是一个基于 Vue 3 + TypeScript + Element Plus 构建的管理系统前端。采用组合式 API 开发模式，提供完整的用户权限管理、组织架构管理、系统配置管理等核心功能界面。

## ✨ 核心特性

### 🏗️ 技术架构
- **Vue 3.4.29** + **TypeScript 5.0+** 现代化前端技术栈
- **Element Plus 2.7.6** 企业级 UI 组件库
- **Vite 5.3.4** 快速构建工具
- **Vue Router 4.x** 路由管理
- **Pinia** 状态管理
- **Axios** HTTP 请求库

### 🎨 界面设计
- **响应式布局**：支持多种屏幕尺寸适配
- **主题系统**：支持明暗主题切换
- **国际化**：中英文双语支持
- **图标系统**：丰富的图标库支持

### 🔐 安全特性
- **JWT 认证**：无状态身份验证
- **权限路由**：基于角色的路由控制
- **数据权限**：基于部门的数据隔离
- **操作审计**：完整的用户操作记录

## 🏭 项目结构

```
enterprise-management-system-frontend/
├── public/                     # 静态资源
├── src/
│   ├── api/                   # API 接口定义
│   ├── assets/                # 资源文件
│   ├── components/            # 通用组件
│   ├── layout/                # 布局组件
│   ├── locales/               # 国际化配置
│   ├── router/                # 路由配置
│   ├── stores/                # 状态管理
│   ├── styles/                # 样式文件
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数
│   └── views/                 # 页面组件
│       ├── Home/              # 首页
│       ├── Login/             # 登录页面
│       ├── system/            # 系统管理模块
│       └── infra/             # 基础设施模块
├── package.json               # 项目依赖
├── vite.config.ts            # Vite 配置
└── tsconfig.json             # TypeScript 配置
```

## 💼 功能模块

### 系统管理模块 (system)
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **用户管理** | /system/user | 用户信息维护、状态管理、角色分配 |
| **部门管理** | /system/dept | 部门层级结构、部门信息维护 |
| **岗位管理** | /system/post | 岗位配置、岗位分配管理 |
| **角色管理** | /system/role | 角色权限配置、数据范围权限 |
| **菜单管理** | /system/menu | 菜单配置、权限标识、按钮权限 |
| **字典管理** | /system/dict | 字典类型、字典数据维护 |
| **通知公告** | /system/notify | 系统公告发布、公告管理 |
| **个人中心** | /system/profile | 个人信息、密码修改、头像设置 |

### 日志审计模块
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **操作日志** | /system/operate-log | 用户操作记录查询、操作审计 |
| **登录日志** | /system/login-log | 用户登录记录、登录状态跟踪 |

### OAuth2 模块
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **OAuth2 应用** | /system/oauth2/application | 第三方应用接入管理 |
| **OAuth2 令牌** | /system/oauth2/token | 访问令牌管理、令牌查询 |

### 短信服务模块
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **短信渠道** | /system/sms/channel | 短信服务商配置、渠道管理 |
| **短信模板** | /system/sms/template | 短信模板配置、模板管理 |
| **短信日志** | /system/sms/log | 短信发送记录、发送状态查询 |

### 邮件服务模块
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **邮件账号** | /system/mail/account | SMTP 账号配置管理 |
| **邮件模板** | /system/mail/template | 邮件模板配置、模板管理 |
| **邮件日志** | /system/mail/log | 邮件发送记录、发送状态查询 |

### 基础设施模块 (infra)
| 功能模块 | 页面路径 | 功能描述 |
|---------|----------|----------|
| **系统配置** | /infra/config | 系统参数配置、配置项管理 |
| **文件管理** | /infra/file | 文件上传下载、存储配置管理 |
| **定时任务** | /infra/job | 任务配置、任务调度、执行日志 |
| **API 日志** | /infra/api-access-log | 接口访问日志、错误日志查询 |
| **Redis 监控** | /infra/redis | 缓存状态监控、Redis 信息查看 |
| **数据库文档** | /infra/db-doc | 数据库表结构文档生成 |

## 🛠️ 技术栈详情

### 核心框架
| 技术 | 版本 | 说明 |
|------|------|------|
| Vue.js | 3.4.29 | 渐进式前端框架 |
| TypeScript | 5.0+ | 类型安全的 JavaScript |
| Element Plus | 2.7.6 | Vue 3 UI 组件库 |
| Vite | 5.3.4 | 现代化构建工具 |

### 状态管理与路由
| 技术 | 说明 |
|------|------|
| Vue Router | 官方路由管理器 |
| Pinia | 新一代状态管理 |
| VueUse | Vue 组合式工具集 |

### 开发工具
| 技术 | 说明 |
|------|------|
| ESLint | 代码质量检查 |
| Prettier | 代码格式化 |
| Stylelint | 样式检查 |
| Husky | Git 钩子管理 |

### UI 增强组件
| 组件 | 说明 |
|------|------|
| ECharts | 数据可视化图表 |
| Cropper | 图片裁剪组件 |
| Editor | 富文本编辑器 |
| Upload | 文件上传组件 |

## 🚀 快速开始

### 环境要求
- **Node.js 18+**
- **pnpm 8+** (推荐) 或 npm/yarn
- **现代浏览器** (Chrome 88+, Firefox 78+, Safari 14+)

### 1. 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 2. 环境配置
复制并配置环境变量文件：
```bash
# 开发环境
cp .env.base .env.development

# 生产环境
cp .env.base .env.production
```

编辑对应环境文件，配置 API 基础路径：
```bash
# API 基础路径
VITE_API_BASEPATH = http://localhost:48080

# 应用标题
VITE_APP_TITLE = 企业管理系统

# 上传文件大小限制 (MB)
VITE_UPLOAD_SIZE = 20

# 图片压缩质量 (0-1)
VITE_IMAGE_COMPRESSS = 0.8
```

### 3. 启动开发服务器
```bash
# 开发模式
pnpm dev

# 指定端口启动
pnpm dev --port 3000
```

### 4. 构建生产版本
```bash
# 构建生产版本
pnpm build

# 构建并预览
pnpm build && pnpm preview
```

### 5. 访问应用
- **开发环境**：http://localhost:80
- **默认账号**：admin / admin123

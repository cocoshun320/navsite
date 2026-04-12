# 网站导航平台

一个简洁高效的网站分类导航平台，帮助用户快速发现和访问优质网站资源。

## 功能特性

- **网站分类展示** - 按类别展示收录的网站资源，支持分页浏览
- **网站搜索** - 提供关键词搜索功能，快速定位目标网站
- **网站提交** - 允许用户提交新网站供审核收录
- **热门推荐** - 展示热门和精选推荐的网站资源
- **响应式设计** - 完美适配移动端、平板和桌面端

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- 响应式设计，无框架依赖
- 原生JavaScript实现

### 后端
- Node.js + Express.js
- RESTful API设计
- SQLite数据库

## 项目结构

```
demo66/
├── public/              # 前端静态文件
│   ├── css/            # 样式文件
│   │   ├── main.css        # 主样式
│   │   ├── responsive.css  # 响应式样式
│   │   └── animations.css  # 动画效果
│   ├── js/             # JavaScript文件
│   │   ├── api-client.js   # API调用封装
│   │   └── components.js   # 公共组件
│   ├── index.html      # 首页
│   ├── category.html   # 分类页
│   ├── search.html     # 搜索结果页
│   ├── submit.html     # 网站提交页
│   └── about.html      # 关于我们页
├── server/             # 后端服务
│   ├── routes/         # API路由
│   │   ├── categories.js   # 分类路由
│   │   ├── websites.js     # 网站路由
│   │   └── submissions.js  # 提交路由
│   ├── services/       # 业务服务
│   │   ├── categoryService.js
│   │   ├── websiteService.js
│   │   ├── searchService.js
│   │   └── submissionService.js
│   ├── dao/            # 数据访问层
│   │   ├── categoryDAO.js
│   │   ├── websiteDAO.js
│   │   └── submissionDAO.js
│   ├── middleware/     # 中间件
│   │   └── validator.js    # 数据验证
│   ├── database.js     # 数据库管理
│   └── app.js          # 应用入口
├── database/           # 数据库文件
│   ├── init.sql        # 初始化SQL
│   └── navsite.db      # SQLite数据库
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 3. 访问网站

打开浏览器访问 `http://localhost:3000`

## API接口

### 分类接口

- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:id` - 获取分类详情
- `GET /api/categories/:id/websites` - 获取分类下的网站列表

### 网站接口

- `GET /api/websites/search?q=keyword` - 搜索网站
- `GET /api/websites/hot` - 获取热门网站
- `GET /api/websites/recommended` - 获取推荐网站

### 提交接口

- `POST /api/submissions` - 提交新网站

## 数据库设计

### categories表（分类）
- id: 分类ID
- name: 分类名称
- icon: 分类图标
- sort_order: 排序权重
- created_at: 创建时间

### websites表（网站）
- id: 网站ID
- name: 网站名称
- url: 网站URL
- description: 网站描述
- category_id: 所属分类
- logo_url: Logo地址
- view_count: 访问量
- favorite_count: 收藏量
- is_hot: 是否热门
- is_recommended: 是否推荐
- status: 审核状态
- created_at: 创建时间
- updated_at: 更新时间

### submissions表（提交记录）
- id: 提交ID
- name: 网站名称
- url: 网站URL
- description: 网站描述
- category_id: 所属分类
- contact_email: 联系邮箱
- submitter_ip: 提交者IP
- status: 审核状态
- created_at: 提交时间
- reviewed_at: 审核时间
- review_note: 审核备注

## 设计规范

### 颜色方案
- 主色：#0066FF（蓝色）
- 成功色：#00CC66（绿色）
- 错误色：#FF4444（红色）
- 警告色：#FF9900（橙色）

### 响应式断点
- 移动端：< 768px
- 平板：768px - 1023px
- 桌面端：≥ 1024px

## 开发说明

### 添加新分类

在 `database/init.sql` 中添加新的分类数据：

```sql
INSERT OR IGNORE INTO categories (name, icon, sort_order) VALUES
('新分类', 'new-icon', 9);
```

### 添加示例网站

在 `database/init.sql` 中添加网站数据：

```sql
INSERT OR IGNORE INTO websites (name, url, description, category_id, is_hot, is_recommended, view_count, favorite_count) VALUES
('网站名称', 'https://example.com', '网站描述', 1, 1, 1, 1000, 50);
```

## 许可证

MIT License

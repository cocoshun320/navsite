# 网站导航平台 - 启动说明

## 问题诊断

如果遇到"没有"任何反应的情况，请按以下步骤检查：

## 1. 检查Node.js是否安装

打开命令提示符（CMD）或PowerShell，输入：
```bash
node --version
npm --version
```

如果显示版本号，说明已安装。如果提示"不是内部或外部命令"，需要安装Node.js。

## 2. 安装Node.js

### 方法A：官网下载（推荐）
1. 访问 https://nodejs.org/
2. 下载LTS版本（长期支持版）
3. 运行安装程序
4. 安装完成后重启命令行

### 方法B：使用winget（Windows 10/11）
```bash
winget install OpenJS.NodeJS
```

## 3. 安装项目依赖

打开命令提示符，进入项目目录：
```bash
cd c:\Users\lzs18\IDEProjects\demo66
npm install
```

等待安装完成（可能需要几分钟）。

## 4. 启动服务器

```bash
npm start
```

或者：
```bash
node server/app.js
```

## 5. 访问网站

启动成功后，打开浏览器访问：
- 首页：http://localhost:3000
- 登录：http://localhost:3000/login.html
- 管理：http://localhost:3000/admin.html

## 登录信息

- 用户名：admin
- 密码：abc888888

## 常见问题

### Q1: npm install 报错
**A:** 可能是网络问题，尝试：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### Q2: 端口被占用
**A:** 修改端口号，编辑 `server/app.js` 最后一行：
```javascript
const PORT = 3001; // 改为其他端口
```

### Q3: 数据库错误
**A:** 删除数据库文件重新初始化：
```bash
del database\navsite.db
npm start
```

### Q4: 页面无法访问
**A:** 检查防火墙设置，确保允许Node.js访问网络。

## 项目结构

```
demo66/
├── public/          # 前端文件
│   ├── index.html   # 首页
│   ├── login.html   # 登录页
│   └── admin.html   # 管理页
├── server/          # 后端服务
│   └── app.js       # 启动文件
├── database/        # 数据库
└── package.json     # 项目配置
```

## 技术支持

如果以上步骤都无法解决问题，请提供：
1. Node.js版本（node --version）
2. npm版本（npm --version）
3. 错误信息截图

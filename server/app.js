require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// 导入路由
const categoriesRouter = require('./routes/categories');
const websitesRouter = require('./routes/websites');
const submissionsRouter = require('./routes/submissions');
const adminRouter = require('./routes/admin');
const manageRouter = require('./routes/manage');

// 导入数据库
const db = require('./database');
const adminService = require('./services/adminService');

// 创建Express应用
const app = express();

// 配置中间件
// 配置helmet，允许内联脚本和样式，允许访问外部API
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://ipapi.co", "https://ip-api.com", "https://ipwhois.app"]
        }
    }
}));
app.use(cors()); // 跨域支持
app.use(bodyParser.json()); // JSON解析
app.use(bodyParser.urlencoded({ extended: true })); // URL编码解析

// Session支持（使用cookie-based session）
const sessions = {};
app.use((req, res, next) => {
    // 从cookie获取session ID
    const sessionId = req.headers.cookie?.split(';').find(c => c.trim().startsWith('sessionId='))?.split('=')[1];

    if (sessionId && sessions[sessionId]) {
        req.session = sessions[sessionId];
    } else {
        const newSessionId = Math.random().toString(36).substring(2);
        sessions[newSessionId] = {};
        req.session = sessions[newSessionId];
        res.setHeader('Set-Cookie', `sessionId=${newSessionId}; Path=/; HttpOnly`);
    }

    // 保存session的辅助方法
    req.session.save = () => {
        const sid = req.headers.cookie?.split(';').find(c => c.trim().startsWith('sessionId='))?.split('=')[1];
        if (sid) {
            sessions[sid] = req.session;
        }
    };

    next();
});

// 请求日志中间件
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });

    next();
});

// 管理后台权限控制
const requireAdminPage = (req, res, next) => {
    if (adminService.isLoggedIn(req.session)) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

const requireAdminApi = (req, res, next) => {
    if (adminService.isLoggedIn(req.session)) {
        next();
    } else {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: '登录状态已失效，请重新登录'
            },
            timestamp: new Date().toISOString()
        });
    }
};

// 保护静态 admin.html
app.get('/admin.html', requireAdminPage);

// 提供前端 IP 信息获取代理 (绕过跨域与HTTPS限制)
const http = require('http');
app.get('/api/ipinfo', (req, res) => {
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (clientIp === '::1' || clientIp === '127.0.0.1' || clientIp.startsWith('::ffff:127.0.0.1')) {
        clientIp = ''; // 本地测试不传IP以获取出口IP
    } else if (clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
    }

    const url = `http://ip-api.com/json/${clientIp}?fields=status,message,country,countryCode,regionName,city,timezone,isp,org,as,query`;

    http.get(url, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                res.json({ success: true, data: parsed });
            } catch (e) {
                res.status(500).json({ success: false, error: { message: '数据解析失败' } });
            }
        });
    }).on('error', (err) => {
        res.status(500).json({ success: false, error: { message: err.message } });
    });
});

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// API路由
app.use('/api/categories', categoriesRouter);
app.use('/api/websites', websitesRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manage', requireAdminApi, manageRouter);

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: '请求的资源不存在'
        },
        timestamp: new Date().toISOString()
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);

    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: '服务器内部错误'
        },
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`网站导航平台已启动: http://localhost:${PORT}`);
    console.log('按 Ctrl+C 停止服务器');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('正在关闭服务器...');
    db.closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('正在关闭服务器...');
    db.closeDatabase();
    process.exit(0);
});

module.exports = app;

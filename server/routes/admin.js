const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');

/**
 * POST /api/admin/login
 * 管理员登录
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await adminService.login(username, password);

    if (result.success) {
        // 设置session
        req.session.adminId = result.data.id;
        req.session.username = result.data.username;
        req.session.isLoggedIn = true;
        
        // 保存session
        if (req.session.save) {
            req.session.save();
        }
    }

    res.json(result);
});

/**
 * POST /api/admin/logout
 * 管理员登出
 */
router.post('/logout', (req, res) => {
    req.session.adminId = null;
    req.session.username = null;
    req.session.isLoggedIn = false;

    res.json({
        success: true,
        message: '登出成功',
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/admin/check
 * 检查登录状态
 */
router.get('/check', (req, res) => {
    if (adminService.isLoggedIn(req.session)) {
        res.json({
            success: true,
            data: {
                id: req.session.adminId,
                username: req.session.username
            },
            timestamp: new Date().toISOString()
        });
    } else {
        res.json({
            success: false,
            error: {
                code: 'NOT_LOGGED_IN',
                message: '未登录'
            },
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;

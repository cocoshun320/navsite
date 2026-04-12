const express = require('express');
const router = express.Router();
const manageService = require('../services/manageService');

/**
 * GET /api/manage/websites
 * 获取所有网站列表
 */
router.get('/websites', async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await manageService.getAllWebsites(page, limit);
    res.json(result);
});

/**
 * GET /api/manage/websites/:id
 * 获取网站详情
 */
router.get('/websites/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: '无效的网站ID'
            },
            timestamp: new Date().toISOString()
        });
    }

    const result = await manageService.getWebsiteById(id);
    res.json(result);
});

/**
 * POST /api/manage/websites
 * 创建网站
 */
router.post('/websites', async (req, res) => {
    const website = {
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        category_id: parseInt(req.body.category_id, 10),
        logo_url: req.body.logo_url,
        is_hot: req.body.is_hot,
        is_recommended: req.body.is_recommended,
        status: req.body.status || 'approved'
    };

    const result = await manageService.createWebsite(website);
    res.json(result);
});

/**
 * PUT /api/manage/websites/:id
 * 更新网站
 */
router.put('/websites/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: '无效的网站ID'
            },
            timestamp: new Date().toISOString()
        });
    }

    const website = {
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        category_id: parseInt(req.body.category_id, 10),
        logo_url: req.body.logo_url,
        is_hot: req.body.is_hot,
        is_recommended: req.body.is_recommended,
        status: req.body.status
    };

    const result = await manageService.updateWebsite(id, website);
    res.json(result);
});

/**
 * DELETE /api/manage/websites/:id
 * 删除网站
 */
router.delete('/websites/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: '无效的网站ID'
            },
            timestamp: new Date().toISOString()
        });
    }

    const result = await manageService.deleteWebsite(id);
    res.json(result);
});

module.exports = router;

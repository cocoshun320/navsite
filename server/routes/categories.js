const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');
const websiteService = require('../services/websiteService');

/**
 * GET /api/categories
 * 获取所有分类
 */
router.get('/', async (req, res) => {
    const result = await categoryService.getAllCategories();
    res.json(result);
});

/**
 * GET /api/categories/:id
 * 根据ID获取分类
 */
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: '无效的分类ID'
            },
            timestamp: new Date().toISOString()
        });
    }

    const result = await categoryService.getCategoryById(id);
    res.json(result);
});

/**
 * GET /api/categories/:id/websites
 * 获取分类下的网站列表
 */
router.get('/:id/websites', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (isNaN(id)) {
        return res.json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: '无效的分类ID'
            },
            timestamp: new Date().toISOString()
        });
    }

    const result = await websiteService.getWebsitesByCategory(id, page, limit);
    res.json(result);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const websiteService = require('../services/websiteService');
const searchService = require('../services/searchService');

/**
 * GET /api/websites/search
 * 搜索网站
 */
router.get('/search', async (req, res) => {
    const keyword = req.query.q;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await searchService.searchWebsites(keyword, page, limit);
    res.json(result);
});

/**
 * GET /api/websites/hot
 * 获取热门网站
 */
router.get('/hot', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 12;

    const result = await websiteService.getHotWebsites(limit);
    res.json(result);
});

/**
 * GET /api/websites/recommended
 * 获取推荐网站
 */
router.get('/recommended', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 12;

    const result = await websiteService.getRecommendedWebsites(limit);
    res.json(result);
});

/**
 * POST /api/websites/:id/visit
 * 记录网站访问
 */
router.post('/:id/visit', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: { message: '无效的网站ID' } });
    }
    const result = await websiteService.incrementWebsiteView(id);
    if (!result.success) {
        return res.status(500).json(result);
    }
    res.json(result);
});

module.exports = router;

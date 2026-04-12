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

module.exports = router;

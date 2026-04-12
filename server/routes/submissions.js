const express = require('express');
const router = express.Router();
const submissionService = require('../services/submissionService');

/**
 * POST /api/submissions
 * 提交新网站
 */
router.post('/', async (req, res) => {
    const submission = {
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        category_id: req.body.category_id,
        contact_email: req.body.contact_email
    };

    // 获取提交者IP
    const submitterIp = req.ip || req.connection.remoteAddress;

    const result = await submissionService.createSubmission(submission, submitterIp);
    res.json(result);
});

/**
 * GET /api/submissions
 * 获取提交列表（管理员功能）
 */
router.get('/', async (req, res) => {
    const status = req.query.status;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await submissionService.getSubmissions(status, page, limit);
    res.json(result);
});

module.exports = router;

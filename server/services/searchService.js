const websiteDAO = require('../dao/websiteDAO');
const { validateSearchKeyword, escapeObject } = require('../middleware/validator');

/**
 * 搜索网站
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 搜索结果
 */
async function searchWebsites(keyword, page, limit) {
    // 验证关键词
    const validation = validateSearchKeyword(keyword);

    if (!validation.valid) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: validation.error
            },
            timestamp: new Date().toISOString()
        };
    }

    try {
        const result = await websiteDAO.searchWebsites(validation.keyword, page, limit);

        // 如果没有结果，提供热门搜索建议
        let suggestions = [];
        if (result.websites.length === 0) {
            suggestions = ['AI', '搜索', '购物', '技术', '云服务', 'GitHub'];
        }

        return {
            success: true,
            data: {
                websites: result.websites.map(escapeObject),
                pagination: result.pagination,
                suggestions
            },
            message: '搜索完成',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('搜索失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '搜索失败，请稍后重试'
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    searchWebsites
};

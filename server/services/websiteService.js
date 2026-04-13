const websiteDAO = require('../dao/websiteDAO');
const { escapeObject } = require('../middleware/validator');

/**
 * 获取分类下的网站列表
 * @param {number} categoryId - 分类ID
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 网站列表
 */
async function getWebsitesByCategory(categoryId, page, limit) {
    try {
        const result = await websiteDAO.getWebsitesByCategory(categoryId, page, limit);

        return {
            success: true,
            data: {
                websites: result.websites,
                pagination: result.pagination
            },
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取网站列表失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取网站列表失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 获取热门网站
 * @param {number} limit - 返回数量
 * @returns {Object} 热门网站列表
 */
async function getHotWebsites(limit) {
    try {
        const websites = await websiteDAO.getHotWebsites(limit);

        return {
            success: true,
            data: websites,
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取热门网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取热门网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 获取推荐网站
 * @param {number} limit - 返回数量
 * @returns {Object} 推荐网站列表
 */
async function getRecommendedWebsites(limit) {
    try {
        const websites = await websiteDAO.getRecommendedWebsites(limit);

        return {
            success: true,
            data: websites.map(escapeObject),
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取推荐网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取推荐网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 记录网站访问并检查是否需要移动分类
 * @param {number} id - 网站ID
 * @returns {Object} 执行结果
 */
async function incrementWebsiteView(id) {
    try {
        await websiteDAO.incrementViewCount(id);
        const website = await websiteDAO.getWebsiteById(id);

        // 分类 2 是"常用工具"
        if (website && website.view_count > 3 && website.category_id !== 2) {
            website.category_id = 2;
            await websiteDAO.updateWebsite(id, website);
        }

        return {
            success: true,
            message: '访问记录成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('记录网站访问失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '记录网站访问失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    getWebsitesByCategory,
    getHotWebsites,
    getRecommendedWebsites,
    incrementWebsiteView
};

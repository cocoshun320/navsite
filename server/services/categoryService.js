const categoryDAO = require('../dao/categoryDAO');
const { escapeObject } = require('../middleware/validator');

/**
 * 获取所有分类
 * @returns {Object} 分类列表
 */
async function getAllCategories() {
    try {
        const categories = await categoryDAO.getAllCategories();
        return {
            success: true,
            data: categories.map(escapeObject),
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取分类失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取分类失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 根据ID获取分类
 * @param {number} id - 分类ID
 * @returns {Object} 分类信息
 */
async function getCategoryById(id) {
    try {
        const category = await categoryDAO.getCategoryById(id);

        if (!category) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '分类不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        return {
            success: true,
            data: escapeObject(category),
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取分类失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取分类失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    getAllCategories,
    getCategoryById
};

const websiteDAO = require('../dao/websiteDAO');
const categoryDAO = require('../dao/categoryDAO');
const { escapeObject } = require('../middleware/validator');

/**
 * 获取所有网站列表（管理用）
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 网站列表
 */
async function getAllWebsites(page, limit) {
    try {
        const result = await websiteDAO.getAllWebsites(page, limit);

        return {
            success: true,
            data: {
                websites: result.websites.map(escapeObject),
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
 * 根据ID获取网站
 * @param {number} id - 网站ID
 * @returns {Object} 网站信息
 */
async function getWebsiteById(id) {
    try {
        const website = await websiteDAO.getWebsiteById(id);

        if (!website) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '网站不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        return {
            success: true,
            data: escapeObject(website),
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 创建网站
 * @param {Object} website - 网站信息
 * @returns {Object} 创建结果
 */
async function createWebsite(website) {
    try {
        const result = await websiteDAO.createWebsite(website);

        return {
            success: true,
            data: {
                id: result.lastInsertRowid
            },
            message: '创建成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('创建网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '创建网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 更新网站
 * @param {number} id - 网站ID
 * @param {Object} website - 网站信息
 * @returns {Object} 更新结果
 */
async function updateWebsite(id, website) {
    try {
        const result = await websiteDAO.updateWebsite(id, website);

        if (result.changes === 0) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '网站不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        return {
            success: true,
            message: '更新成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('更新网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '更新网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 删除网站
 * @param {number} id - 网站ID
 * @returns {Object} 删除结果
 */
async function deleteWebsite(id) {
    try {
        const result = await websiteDAO.deleteWebsite(id);

        if (result.changes === 0) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '网站不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        return {
            success: true,
            message: '删除成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('删除网站失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '删除网站失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 创建分类
 * @param {Object} category - 分类信息
 * @returns {Object} 创建结果
 */
async function createCategory(category) {
    try {
        const result = await categoryDAO.createCategory(category);

        return {
            success: true,
            data: {
                id: result.lastInsertRowid
            },
            message: '创建成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('创建分类失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '创建分类失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 更新分类
 * @param {number} id - 分类ID
 * @param {Object} category - 分类信息
 * @returns {Object} 更新结果
 */
async function updateCategory(id, category) {
    try {
        const result = await categoryDAO.updateCategory(id, category);

        if (result.changes === 0) {
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
            message: '更新成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('更新分类失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '更新分类失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 * @returns {Object} 删除结果
 */
async function deleteCategory(id) {
    try {
        const result = await categoryDAO.deleteCategory(id);

        if (result.changes === 0) {
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
            message: '删除成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('删除分类失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '删除分类失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    getAllWebsites,
    getWebsiteById,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    createCategory,
    updateCategory,
    deleteCategory
};

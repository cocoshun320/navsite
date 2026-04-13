const db = require('../database');

/**
 * 获取分类下的网站列表
 * @param {number} categoryId - 分类ID
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 网站列表和分页信息
 */
async function getWebsitesByCategory(categoryId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // 获取总数
    const countSql = `
        SELECT COUNT(*) as total
        FROM websites
        WHERE category_id = ? AND status = 'approved'
    `;
    const countResult = await db.queryOne(countSql, [categoryId]);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // 获取网站列表
    const sql = `
        SELECT
            id,
            name,
            url,
            description,
            logo_url,
            view_count,
            favorite_count,
            is_hot,
            is_recommended,
            created_at
        FROM websites
        WHERE category_id = ? AND status = 'approved'
        ORDER BY view_count DESC, created_at DESC
        LIMIT ? OFFSET ?
    `;
    const websites = await db.query(sql, [categoryId, limit, offset]);

    return {
        websites,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

/**
 * 获取热门网站
 * @param {number} limit - 返回数量
 * @returns {Array} 热门网站列表
 */
async function getHotWebsites(limit = 12) {
    const sql = `
        SELECT
            id,
            name,
            url,
            description,
            logo_url,
            view_count,
            favorite_count
        FROM websites
        WHERE is_hot = 1 AND status = 'approved'
        ORDER BY view_count DESC
        LIMIT ?
    `;
    return await db.query(sql, [limit]);
}

/**
 * 获取推荐网站
 * @param {number} limit - 返回数量
 * @returns {Array} 推荐网站列表
 */
async function getRecommendedWebsites(limit = 12) {
    const sql = `
        SELECT
            id,
            name,
            url,
            description,
            logo_url,
            view_count,
            favorite_count
        FROM websites
        WHERE is_recommended = 1 AND status = 'approved'
        ORDER BY view_count DESC
        LIMIT ?
    `;
    return await db.query(sql, [limit]);
}

/**
 * 搜索网站
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 搜索结果和分页信息
 */
async function searchWebsites(keyword, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${keyword}%`;

    // 获取总数
    const countSql = `
        SELECT COUNT(*) as total
        FROM websites
        WHERE (name LIKE ? OR description LIKE ?) AND status = 'approved'
    `;
    const countResult = await db.queryOne(countSql, [searchPattern, searchPattern]);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // 获取搜索结果
    const sql = `
        SELECT
            id,
            name,
            url,
            description,
            logo_url,
            view_count,
            favorite_count
        FROM websites
        WHERE (name LIKE ? OR description LIKE ?) AND status = 'approved'
        ORDER BY
            CASE
                WHEN name LIKE ? THEN 1
                ELSE 2
            END,
            view_count DESC
        LIMIT ? OFFSET ?
    `;
    const websites = await db.query(sql, [searchPattern, searchPattern, searchPattern, limit, offset]);

    return {
        websites,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

/**
 * 根据URL获取网站
 * @param {string} url - 网站URL
 * @returns {Object} 网站信息
 */
async function getWebsiteByUrl(url) {
    const sql = 'SELECT * FROM websites WHERE url = ?';
    return await db.queryOne(sql, [url]);
}

/**
 * 增加网站访问量
 * @param {number} id - 网站ID
 */
async function incrementViewCount(id) {
    const sql = 'UPDATE websites SET view_count = view_count + 1 WHERE id = ?';
    await db.run(sql, [id]);
}

/**
 * 获取所有网站列表（管理用）
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @param {number} [categoryId] - 分类ID
 * @returns {Object} 网站列表和分页信息
 */
async function getAllWebsites(page = 1, limit = 20, categoryId = null) {
    const offset = (page - 1) * limit;
    const params = [];
    let whereClause = '';

    if (categoryId) {
        whereClause = 'WHERE w.category_id = ?';
        params.push(categoryId);
    }

    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM websites ${whereClause.replace('w.', '')}`;
    const countResult = await db.queryOne(countSql, categoryId ? [categoryId] : []);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // 获取网站列表
    const sql = `
        SELECT
            w.id,
            w.name,
            w.url,
            w.description,
            w.category_id,
            w.logo_url,
            w.view_count,
            w.favorite_count,
            w.is_hot,
            w.is_recommended,
            w.status,
            w.created_at,
            w.updated_at,
            c.name as category_name
        FROM websites w
        LEFT JOIN categories c ON w.category_id = c.id
        ${whereClause}
        ORDER BY w.created_at DESC
        LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const websites = await db.query(sql, params);

    return {
        websites,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

/**
 * 根据ID获取网站
 * @param {number} id - 网站ID
 * @returns {Object} 网站信息
 */
async function getWebsiteById(id) {
    const sql = `
        SELECT
            w.id,
            w.name,
            w.url,
            w.description,
            w.category_id,
            w.logo_url,
            w.view_count,
            w.favorite_count,
            w.is_hot,
            w.is_recommended,
            w.status,
            w.created_at,
            w.updated_at,
            c.name as category_name
        FROM websites w
        LEFT JOIN categories c ON w.category_id = c.id
        WHERE w.id = ?
    `;
    return await db.queryOne(sql, [id]);
}

/**
 * 创建网站
 * @param {Object} website - 网站信息
 * @returns {Object} 创建结果
 */
async function createWebsite(website) {
    const sql = `
        INSERT INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await db.run(sql, [
        website.name,
        website.url,
        website.description,
        website.category_id,
        website.logo_url || null,
        website.is_hot ? 1 : 0,
        website.is_recommended ? 1 : 0,
        website.status || 'approved'
    ]);
}

/**
 * 更新网站
 * @param {number} id - 网站ID
 * @param {Object} website - 网站信息
 * @returns {Object} 更新结果
 */
async function updateWebsite(id, website) {
    const sql = `
        UPDATE websites
        SET name = ?, url = ?, description = ?, category_id = ?, logo_url = ?,
            is_hot = ?, is_recommended = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    return await db.run(sql, [
        website.name,
        website.url,
        website.description,
        website.category_id,
        website.logo_url || null,
        website.is_hot ? 1 : 0,
        website.is_recommended ? 1 : 0,
        website.status,
        id
    ]);
}

/**
 * 删除网站
 * @param {number} id - 网站ID
 * @returns {Object} 删除结果
 */
async function deleteWebsite(id) {
    const sql = 'DELETE FROM websites WHERE id = ?';
    return await db.run(sql, [id]);
}

module.exports = {
    getWebsitesByCategory,
    getHotWebsites,
    getRecommendedWebsites,
    searchWebsites,
    getWebsiteByUrl,
    incrementViewCount,
    getAllWebsites,
    getWebsiteById,
    createWebsite,
    updateWebsite,
    deleteWebsite
};

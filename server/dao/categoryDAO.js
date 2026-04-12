const db = require('../database');

/**
 * 获取所有分类
 * @returns {Array} 分类列表
 */
async function getAllCategories() {
    const sql = `
        SELECT
            c.id,
            c.name,
            c.icon,
            c.sort_order,
            c.created_at,
            COUNT(w.id) as website_count
        FROM categories c
        LEFT JOIN websites w ON c.id = w.category_id AND w.status = 'approved'
        GROUP BY c.id
        ORDER BY c.sort_order ASC
    `;
    return await db.query(sql);
}

/**
 * 根据ID获取分类
 * @param {number} id - 分类ID
 * @returns {Object} 分类信息
 */
async function getCategoryById(id) {
    const sql = `
        SELECT
            c.id,
            c.name,
            c.icon,
            c.sort_order,
            c.created_at,
            COUNT(w.id) as website_count
        FROM categories c
        LEFT JOIN websites w ON c.id = w.category_id AND w.status = 'approved'
        WHERE c.id = ?
        GROUP BY c.id
    `;
    return await db.queryOne(sql, [id]);
}

/**
 * 创建分类
 * @param {Object} category - 分类信息
 * @returns {Object} 创建结果
 */
async function createCategory(category) {
    const sql = `
        INSERT INTO categories (name, icon, sort_order)
        VALUES (?, ?, ?)
    `;
    return await db.run(sql, [category.name, category.icon, category.sort_order || 0]);
}

/**
 * 更新分类
 * @param {number} id - 分类ID
 * @param {Object} category - 分类信息
 * @returns {Object} 更新结果
 */
async function updateCategory(id, category) {
    const sql = `
        UPDATE categories
        SET name = ?, icon = ?, sort_order = ?
        WHERE id = ?
    `;
    return await db.run(sql, [category.name, category.icon, category.sort_order, id]);
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 * @returns {Object} 删除结果
 */
async function deleteCategory(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    return await db.run(sql, [id]);
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

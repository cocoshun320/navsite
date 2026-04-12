const db = require('../database');

/**
 * 根据用户名获取管理员
 * @param {string} username - 用户名
 * @returns {Object} 管理员信息
 */
async function getAdminByUsername(username) {
    const sql = `
        SELECT id, username, password, created_at, last_login_at
        FROM admins
        WHERE username = ?
    `;
    return await db.queryOne(sql, [username]);
}

/**
 * 更新最后登录时间
 * @param {number} id - 管理员ID
 */
async function updateLastLogin(id) {
    const sql = `
        UPDATE admins
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    await db.run(sql, [id]);
}

/**
 * 创建管理员
 * @param {Object} admin - 管理员信息
 * @returns {Object} 创建结果
 */
async function createAdmin(admin) {
    const sql = `
        INSERT INTO admins (username, password)
        VALUES (?, ?)
    `;
    return await db.run(sql, [admin.username, admin.password]);
}

/**
 * 修改密码
 * @param {number} id - 管理员ID
 * @param {string} newPassword - 新密码
 * @returns {Object} 更新结果
 */
async function updatePassword(id, newPassword) {
    const sql = `
        UPDATE admins
        SET password = ?
        WHERE id = ?
    `;
    return await db.run(sql, [newPassword, id]);
}

module.exports = {
    getAdminByUsername,
    updateLastLogin,
    createAdmin,
    updatePassword
};

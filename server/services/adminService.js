const adminDAO = require('../dao/adminDAO');

/**
 * 管理员登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Object} 登录结果
 */
async function login(username, password) {
    // 验证输入
    if (!username || !password) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: '用户名和密码不能为空'
            },
            timestamp: new Date().toISOString()
        };
    }

    try {
        // 查找管理员
        const admin = await adminDAO.getAdminByUsername(username);

        if (!admin) {
            return {
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: '用户名不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 验证密码
        if (admin.password !== password) {
            return {
                success: false,
                error: {
                    code: 'INVALID_PASSWORD',
                    message: '密码错误'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 更新最后登录时间
        await adminDAO.updateLastLogin(admin.id);

        return {
            success: true,
            data: {
                id: admin.id,
                username: admin.username
            },
            message: '登录成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('登录失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '登录失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 验证登录状态
 * @param {Object} session - 会话信息
 * @returns {boolean} 是否已登录
 */
function isLoggedIn(session) {
    return session && session.isLoggedIn && session.adminId;
}

module.exports = {
    login,
    isLoggedIn
};

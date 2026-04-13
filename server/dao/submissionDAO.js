const db = require('../database');

/**
 * 创建网站提交记录
 * @param {Object} submission - 提交信息
 * @returns {Object} 创建结果
 */
async function createSubmission(submission) {
    const sql = `
        INSERT INTO submissions (name, url, description, category_id, contact_email, submitter_ip)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await db.run(sql, [
        submission.name,
        submission.url,
        submission.description,
        submission.category_id,
        submission.contact_email || null,
        submission.submitter_ip || null
    ]);
}

/**
 * 获取提交记录列表
 * @param {string} status - 状态筛选
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 提交列表和分页信息
 */
async function getSubmissions(status, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let countSql, sql, params;

    if (status) {
        countSql = `
            SELECT COUNT(*) as total
            FROM submissions
            WHERE status = ?
        `;
        sql = `
            SELECT
                s.id,
                s.name,
                s.url,
                s.description,
                s.category_id,
                s.contact_email,
                s.status,
                s.created_at,
                s.reviewed_at,
                s.review_note,
                c.name as category_name
            FROM submissions s
            LEFT JOIN categories c ON s.category_id = c.id
            WHERE s.status = ?
            ORDER BY s.created_at DESC
            LIMIT ? OFFSET ?
        `;
        params = [status, limit, offset];
    } else {
        countSql = 'SELECT COUNT(*) as total FROM submissions';
        sql = `
            SELECT
                s.id,
                s.name,
                s.url,
                s.description,
                s.category_id,
                s.contact_email,
                s.status,
                s.created_at,
                s.reviewed_at,
                s.review_note,
                c.name as category_name
            FROM submissions s
            LEFT JOIN categories c ON s.category_id = c.id
            ORDER BY s.created_at DESC
            LIMIT ? OFFSET ?
        `;
        params = [limit, offset];
    }

    const countResult = await db.queryOne(countSql, status ? [status] : []);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);
    const submissions = await db.query(sql, params);

    return {
        submissions,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

/**
 * 根据ID获取提交记录
 * @param {number} id - 提交ID
 * @returns {Object} 提交信息
 */
async function getSubmissionById(id) {
    const sql = `
        SELECT
            s.id,
            s.name,
            s.url,
            s.description,
            s.category_id,
            s.contact_email,
            s.status,
            s.created_at,
            s.reviewed_at,
            s.review_note,
            c.name as category_name
        FROM submissions s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.id = ?
    `;
    return await db.queryOne(sql, [id]);
}

/**
 * 更新提交状态
 * @param {number} id - 提交ID
 * @param {string} status - 状态
 * @param {string} reviewNote - 审核备注
 * @returns {Object} 更新结果
 */
async function updateSubmissionStatus(id, status, reviewNote) {
    const sql = `
        UPDATE submissions
        SET status = ?, review_note = ?, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    return await db.run(sql, [status, reviewNote || null, id]);
}

/**
 * 检查URL是否已提交
 * @param {string} url - 网站URL
 * @returns {Object} 提交记录
 */
async function checkUrlSubmitted(url) {
    const sql = `
        SELECT id, status
        FROM submissions
        WHERE url = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;
    return await db.queryOne(sql, [url]);
}

module.exports = {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    checkUrlSubmitted
};

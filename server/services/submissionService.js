const submissionDAO = require('../dao/submissionDAO');
const websiteDAO = require('../dao/websiteDAO');
const { validateSubmission, escapeObject } = require('../middleware/validator');
const emailService = require('./emailService');

/**
 * 提交新网站
 * @param {Object} submission - 提交信息
 * @param {string} submitterIp - 提交者IP
 * @returns {Object} 提交结果
 */
async function createSubmission(submission, submitterIp) {
    // 验证提交数据
    const validation = validateSubmission(submission);

    if (!validation.valid) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: validation.errors.join('; ')
            },
            timestamp: new Date().toISOString()
        };
    }

    try {
        // 检查URL是否已存在
        const existingWebsite = await websiteDAO.getWebsiteByUrl(submission.url);
        if (existingWebsite) {
            return {
                success: false,
                error: {
                    code: 'DUPLICATE_URL',
                    message: '该网站已被收录'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 检查URL是否已提交
        const existingSubmission = await submissionDAO.checkUrlSubmitted(submission.url);
        if (existingSubmission && existingSubmission.status === 'pending') {
            return {
                success: false,
                error: {
                    code: 'DUPLICATE_SUBMISSION',
                    message: '该网站已提交，正在审核中'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 创建提交记录
        submission.submitter_ip = submitterIp;
        const result = await submissionDAO.createSubmission(submission);
        const submissionId = result.lastInsertRowid;

        // 发送确认邮件 (异步发送，不阻塞响应)
        if (submission.contact_email) {
            const fullSubmission = { ...submission, id: submissionId };
            emailService.sendSubmissionConfirmation(fullSubmission).catch(err => {
                console.error('[Service] 发送确认邮件失败:', err);
            });
        }

        return {
            success: true,
            data: {
                id: submissionId,
                status: 'pending',
                message: '提交成功，等待审核。审核时间通常为1-3个工作日。'
            },
            message: '提交成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('提交失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '提交失败，请稍后重试'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 获取提交列表
 * @param {string} status - 状态筛选
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} 提交列表
 */
async function getSubmissions(status, page, limit) {
    try {
        const result = await submissionDAO.getSubmissions(status, page, limit);

        return {
            success: true,
            data: {
                submissions: result.submissions,
                pagination: result.pagination
            },
            message: '获取成功',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取提交列表失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '获取提交列表失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 通过提交
 * @param {number} id - 提交ID
 * @returns {Object} 审核结果
 */
async function approveSubmission(id) {
    try {
        // 获取提交信息
        const submission = await submissionDAO.getSubmissionById(id);
        if (!submission) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '提交不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 创建网站
        const website = {
            name: submission.name,
            url: submission.url,
            description: submission.description,
            category_id: submission.category_id,
            status: 'approved'
        };
        await websiteDAO.createWebsite(website);

        // 更新提交状态
        await submissionDAO.updateSubmissionStatus(id, 'approved');

        // 发送通知邮件
        if (submission.contact_email) {
            emailService.sendAuditResult(submission, 'approved').catch(err => {
                console.error('[Service] 发送审核通过邮件失败:', err);
            });
        }

        return {
            success: true,
            message: '审核通过，网站已添加',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('审核提交失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '审核提交失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 拒绝提交
 * @param {number} id - 提交ID
 * @returns {Object} 审核结果
 */
async function rejectSubmission(id, reviewNote) {
    try {
        // 获取提交信息以便发送邮件
        const submission = await submissionDAO.getSubmissionById(id);
        if (!submission) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '提交不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        const result = await submissionDAO.updateSubmissionStatus(id, 'rejected', reviewNote);

        if (result.changes === 0) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: '提交不存在'
                },
                timestamp: new Date().toISOString()
            };
        }

        // 发送通知邮件
        if (submission.contact_email) {
            const submissionWithNote = { ...submission, review_note: reviewNote };
            emailService.sendAuditResult(submissionWithNote, 'rejected').catch(err => {
                console.error('[Service] 发送审核拒绝邮件失败:', err);
            });
        }

        return {
            success: true,
            message: '已拒绝',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('拒绝提交失败:', error);
        return {
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: '拒绝提交失败'
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    createSubmission,
    getSubmissions,
    approveSubmission,
    rejectSubmission
};

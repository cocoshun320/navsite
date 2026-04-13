const nodemailer = require('nodemailer');
const config = require('../config');

// 创建邮件传输对象
const transporter = nodemailer.createTransport(config.mail);

/**
 * 发送邮件
 * @param {string} to - 收件人
 * @param {string} subject - 主题
 * @param {string} html - HTML内容
 * @returns {Promise<boolean>} 是否发送成功
 */
async function sendMail(to, subject, html) {
    if (!to) return false;

    // 检查配置是否已配置 (跳过默认占位值)
    if (config.mail.auth.user === 'your_email@163.com' || config.mail.auth.pass === 'your_auth_code') {
        console.warn('[Email] 邮件服务未配置真实的帐号密码，跳过发送邮件请求。');
        return false;
    }

    try {
        const info = await transporter.sendMail({
            from: config.mail.from,
            to,
            subject,
            html
        });
        console.log('[Email] 邮件发送成功:', info.messageId);
        return true;
    } catch (error) {
        console.error('[Email] 邮件发送失败:', error);
        return false;
    }
}

/**
 * 发送提交确认邮件
 * @param {Object} submission - 提交记录
 */
async function sendSubmissionConfirmation(submission) {
    const subject = `【${config.site.name}】网站提交成功通知`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4f46e5;">您的网站已提交成功！</h2>
            <p>您好，感谢您对 <b>${config.site.name}</b> 的支持。</p>
            <p>我们已经收到您提交的网站 <b>${submission.name}</b> (${submission.url})。目前正在队列中等待审核，通常需要 1-3 个工作日。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">这是一封自动发送的邮件，请勿直接回复。</p>
        </div>
    `;
    return await sendMail(submission.contact_email, subject, html);
}

/**
 * 发送审核结果邮件
 * @param {Object} submission - 提交记录
 * @param {string} status - 审核状态 (approved/rejected)
 */
async function sendAuditResult(submission, status) {
    const isApproved = status === 'approved';
    const subject = `【${config.site.name}】您的网站审核结果`;
    const resultText = isApproved ? '已通过并成功收录' : '未通过审核';
    const color = isApproved ? '#10b981' : '#ef4444';

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: ${color};">网站审核通知</h2>
            <p>您提交的网站 <b>${submission.name}</b> ${resultText}。</p>
            ${isApproved ? `<p>现在您可以访问我们的官网查看它。</p>` : `<p>原因：${submission.review_note || '内容不符合收录标准'}</p>`}
            <a href="${config.site.url}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">前往查看</a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">这是一封自动发送的邮件，请勿直接回复。</p>
        </div>
    `;
    return await sendMail(submission.contact_email, subject, html);
}

module.exports = {
    sendSubmissionConfirmation,
    sendAuditResult
};

/**
 * 系统配置
 */

module.exports = {
    // 邮件服务配置 (163 邮箱)
    mail: {
        host: 'smtp.163.com',
        port: 465,
        secure: true, // 使用 SSL
        auth: {
            user: process.env.MAIL_USER, // 从环境变量读取
            pass: process.env.MAIL_PASS  // 从环境变量读取
        },
        from: `"网站导航平台" <${process.env.MAIL_USER}>`
    },

    // 网站基本信息
    site: {
        name: process.env.SITE_NAME || '网站导航平台',
        url: process.env.SITE_URL || 'http://localhost:3000'
    }
};

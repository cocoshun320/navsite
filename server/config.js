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
            user: 'your_email@163.com', // 替换为真实的 163 邮箱帐号
            pass: 'your_auth_code'      // 替换为真实的 SMTP 授权码 (非登录密码)
        },
        from: '"网站导航平台" <your_email@163.com>' // 必须与 auth.user 一致
    },

    // 网站基本信息
    site: {
        name: '网站导航平台',
        url: 'http://localhost:3000'
    }
};

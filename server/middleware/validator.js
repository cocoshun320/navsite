/**
 * 验证URL格式
 * @param {string} url - URL字符串
 * @returns {boolean} 是否有效
 */
function isValidUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    // 检查长度
    if (url.length > 200) {
        return false;
    }

    // 检查协议
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
    }

    // 使用正则表达式验证URL格式
    const urlPattern = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlPattern.test(url);
}

/**
 * 验证网站名称
 * @param {string} name - 网站名称
 * @returns {boolean} 是否有效
 */
function isValidName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }

    // 去除首尾空格
    const trimmedName = name.trim();

    // 检查长度
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return false;
    }

    return true;
}

/**
 * 验证描述
 * @param {string} description - 描述
 * @returns {boolean} 是否有效
 */
function isValidDescription(description) {
    if (!description || typeof description !== 'string') {
        return false;
    }

    // 去除首尾空格
    const trimmedDesc = description.trim();

    // 检查长度
    if (trimmedDesc.length < 10 || trimmedDesc.length > 500) {
        return false;
    }

    return true;
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
    if (!email) {
        return true; // 邮箱是选填的
    }

    if (typeof email !== 'string') {
        return false;
    }

    // 检查长度
    if (email.length > 100) {
        return false;
    }

    // 使用正则表达式验证邮箱格式
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

/**
 * 验证分类ID
 * @param {number} categoryId - 分类ID
 * @returns {boolean} 是否有效
 */
function isValidCategoryId(categoryId) {
    if (!categoryId) {
        return false;
    }

    const id = parseInt(categoryId, 10);
    return !isNaN(id) && id > 0;
}

/**
 * 验证搜索关键词
 * @param {string} keyword - 搜索关键词
 * @returns {Object} 验证结果
 */
function validateSearchKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string') {
        return {
            valid: false,
            error: '请输入搜索关键词'
        };
    }

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length === 0) {
        return {
            valid: false,
            error: '请输入搜索关键词'
        };
    }

    if (trimmedKeyword.length > 100) {
        return {
            valid: false,
            error: '搜索关键词过长'
        };
    }

    return {
        valid: true,
        keyword: trimmedKeyword
    };
}

/**
 * 验证网站提交数据
 * @param {Object} data - 提交数据
 * @returns {Object} 验证结果
 */
function validateSubmission(data) {
    const errors = [];

    // 验证网站名称
    if (!isValidName(data.name)) {
        errors.push('网站名称长度必须在2-50个字符之间');
    }

    // 验证URL
    if (!isValidUrl(data.url)) {
        errors.push('URL格式不正确，必须以http://或https://开头');
    }

    // 验证描述
    if (!isValidDescription(data.description)) {
        errors.push('网站描述长度必须在10-500个字符之间');
    }

    // 验证分类ID
    if (!isValidCategoryId(data.category_id)) {
        errors.push('请选择有效的网站分类');
    }

    // 验证邮箱（选填）
    if (data.contact_email && !isValidEmail(data.contact_email)) {
        errors.push('邮箱格式不正确');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * XSS防护 - 转义HTML特殊字符
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeHtml(str) {
    if (!str || typeof str !== 'string') {
        return str;
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * 转义对象中的所有字符串字段
 * @param {Object} obj - 对象
 * @returns {Object} 转义后的对象
 */
function escapeObject(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    const escaped = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                escaped[key] = escapeHtml(value);
            } else if (typeof value === 'object') {
                escaped[key] = escapeObject(value);
            } else {
                escaped[key] = value;
            }
        }
    }
    return escaped;
}

module.exports = {
    isValidUrl,
    isValidName,
    isValidDescription,
    isValidEmail,
    isValidCategoryId,
    validateSearchKeyword,
    validateSubmission,
    escapeHtml,
    escapeObject
};

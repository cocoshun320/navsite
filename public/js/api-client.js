/**
 * API客户端封装
 */

// API基础URL
const API_BASE_URL = '/api';

/**
 * 发送API请求
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应数据
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || '请求失败');
        }

        return data;
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

/**
 * 获取所有分类
 * @returns {Promise<Object>} 分类列表
 */
async function getCategories() {
    return apiRequest('/categories');
}

/**
 * 获取分类详情
 * @param {number} id - 分类ID
 * @returns {Promise<Object>} 分类信息
 */
async function getCategory(id) {
    return apiRequest(`/categories/${id}`);
}

/**
 * 获取分类下的网站列表
 * @param {number} categoryId - 分类ID
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Promise<Object>} 网站列表
 */
async function getCategoryWebsites(categoryId, page = 1, limit = 20) {
    return apiRequest(`/categories/${categoryId}/websites?page=${page}&limit=${limit}`);
}

/**
 * 搜索网站
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Promise<Object>} 搜索结果
 */
async function searchWebsites(keyword, page = 1, limit = 20) {
    const encodedKeyword = encodeURIComponent(keyword);
    return apiRequest(`/websites/search?q=${encodedKeyword}&page=${page}&limit=${limit}`);
}

/**
 * 获取热门网站
 * @param {number} limit - 返回数量
 * @returns {Promise<Object>} 热门网站列表
 */
async function getHotWebsites(limit = 12) {
    return apiRequest(`/websites/hot?limit=${limit}`);
}

/**
 * 获取推荐网站
 * @param {number} limit - 返回数量
 * @returns {Promise<Object>} 推荐网站列表
 */
async function getRecommendedWebsites(limit = 12) {
    return apiRequest(`/websites/recommended?limit=${limit}`);
}

/**
 * 提交新网站
 * @param {Object} submission - 提交信息
 * @returns {Promise<Object>} 提交结果
 */
async function submitWebsite(submission) {
    return apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify(submission)
    });
}

// 导出API方法
window.api = {
    getCategories,
    getCategory,
    getCategoryWebsites,
    searchWebsites,
    getHotWebsites,
    getRecommendedWebsites,
    submitWebsite
};

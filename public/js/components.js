/**
 * 公共组件
 */

/**
 * Toast提示组件
 * @param {string} message - 提示消息
 * @param {string} type - 类型 (success, error, warning)
 * @param {number} duration - 持续时间(毫秒)
 */
function showToast(message, type = 'success', duration = 1500) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // 添加到页面
    document.body.appendChild(toast);

    // 自动移除
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 250);
    }, duration);
}

/**
 * 转义HTML特殊字符 (前端防护)
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeHtml(str) {
    if (!str || typeof str !== 'string') return str;
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
 * 加载状态组件
 * @returns {string} HTML字符串
 */
function renderLoading() {
    return `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
        </div>
    `;
}

/**
 * 空状态组件
 * @param {string} title - 标题
 * @param {string} description - 描述
 * @param {string} icon - 图标
 * @returns {string} HTML字符串
 */
function renderEmptyState(title, description, icon = '📭') {
    return `
        <div class="empty-state fade-in">
            <div class="empty-icon">${icon}</div>
            <h3 class="empty-title">${title}</h3>
            <p class="empty-description">${description}</p>
        </div>
    `;
}

/**
 * 分类卡片组件
 * @param {Object} category - 分类信息
 * @returns {string} HTML字符串
 */
function renderCategoryCard(category) {
    // 分类图标映射
    const iconMap = {
        'search': '🔍',
        'tools': '🛠️',
        'shopping': '🛒',
        'code': '💻',
        'ai': '🤖',
        'cloud': '☁️',
        'office': '📚',
        'video': '🎬',
        'disk': '💾'
    };

    const icon = iconMap[category.icon] || '📁';

    return `
        <a href="/category.html?id=${category.id}" class="category-card stagger-item">
            <div class="category-icon">${icon}</div>
            <h3 class="category-name">${escapeHtml(category.name)}</h3>
            <p class="category-count">${category.website_count} 个网站</p>
        </a>
    `;
}

/**
 * 网站卡片组件
 * @param {Object} website - 网站信息
 * @returns {string} HTML字符串
 */
function renderWebsiteCard(website) {
    const firstLetter = website.name.charAt(0).toUpperCase();
    const viewCount = formatNumber(website.view_count);
    const favoriteCount = formatNumber(website.favorite_count);

    // 获取域名用于提取图标
    let domain = '';
    try {
        domain = new URL(website.url).hostname;
    } catch (e) { }

    // 如果没有配置logo_url，且有域名，尝试使用favicon服务，如果出错则降级显示首字母
    const logoUrl = website.logo_url || (domain ? `https://api.iowen.cn/favicon/${domain}.png` : '');

    return `
        <div class="website-card stagger-item">
            <div class="website-header">
                <div class="website-logo" data-name="${escapeHtml(website.name)}">
                    ${logoUrl ?
            `<img src="${encodeURI(logoUrl)}" alt="${escapeHtml(website.name)}" onerror="this.onerror=null; this.style.display='none';this.parentNode.innerText='${escapeHtml(firstLetter)}';">` :
            escapeHtml(firstLetter)
        }
                </div>
                <div class="website-info">
                    <h3 class="website-name">${escapeHtml(website.name)}</h3>
                    <p class="website-stats">👁 ${viewCount} · ❤️ ${favoriteCount}</p>
                </div>
            </div>
            <p class="website-description">${escapeHtml(website.description)}</p>
            <div class="website-actions">
                <a href="${encodeURI(website.url)}" target="_blank" rel="noopener noreferrer" class="visit-btn" onclick="api.visitWebsite(${website.id})">
                    访问网站
                </a>
            </div>
        </div>
    `;
}

/**
 * 分页组件
 * @param {Object} pagination - 分页信息
 * @param {Function} onPageChange - 页码改变回调
 * @returns {string} HTML字符串
 */
function renderPagination(pagination, onPageChange) {
    const { page, totalPages } = pagination;

    if (totalPages <= 1) {
        return '';
    }

    let html = '<div class="pagination">';

    // 上一页按钮
    html += `<button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} onclick="${onPageChange(page - 1)}">上一页</button>`;

    // 页码按钮
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
        html += `<button class="pagination-btn" onclick="${onPageChange(1)}">1</button>`;
        if (startPage > 2) {
            html += '<span class="pagination-btn" disabled>...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === page ? 'active' : ''}" onclick="${onPageChange(i)}">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<span class="pagination-btn" disabled>...</span>';
        }
        html += `<button class="pagination-btn" onclick="${onPageChange(totalPages)}">${totalPages}</button>`;
    }

    // 下一页按钮
    html += `<button class="pagination-btn" ${page >= totalPages ? 'disabled' : ''} onclick="${onPageChange(page + 1)}">下一页</button>`;

    html += '</div>';

    return html;
}

/**
 * 格式化数字
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出组件和方法
window.components = {
    showToast,
    renderLoading,
    renderEmptyState,
    renderCategoryCard,
    renderWebsiteCard,
    renderPagination,
    formatNumber,
    getUrlParam,
    debounce,
    throttle
};

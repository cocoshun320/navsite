-- 网站导航平台数据库初始化脚本

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建网站表
CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    logo_url TEXT,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    is_hot BOOLEAN DEFAULT 0,
    is_recommended BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建提交表
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    contact_email TEXT,
    submitter_ip TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    review_note TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_websites_category ON websites(category_id);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_hot ON websites(is_hot);
CREATE INDEX IF NOT EXISTS idx_websites_recommended ON websites(is_recommended);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- 插入分类数据
INSERT OR IGNORE INTO categories (name, icon, description, sort_order) VALUES
('搜索引擎', 'search', '各类搜索引擎，快速查找信息', 1),
('常用工具', 'tools', '日常使用的实用工具网站', 2),
('购物', 'shopping', '电商平台和购物网站', 3),
('技术编程', 'code', '编程开发相关资源', 4),
('AI', 'ai', '人工智能工具和服务', 5),
('云服务', 'cloud', '云计算和服务平台', 6),
('办公学习', 'office', '办公协作和在线学习', 7),
('影音娱乐', 'video', '视频、音乐等娱乐内容', 8),
('网盘资源', 'disk', '云存储和资源分享', 9);

-- 插入网站数据
-- 搜索引擎
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('百度', 'https://www.baidu.com', '全球最大的中文搜索引擎，提供网页、图片、视频等搜索服务。', 1, NULL, 1, 1, 50000, 2500),
('搜狗', 'https://www.sogou.com', '搜狗搜索引擎，提供网页搜索、图片搜索等服务。', 1, NULL, 0, 0, 8000, 400),
('360搜索', 'https://www.so.com', '360搜索，安全、精准的可信赖搜索引擎。', 1, NULL, 0, 0, 6000, 300),
('必应', 'https://cn.bing.com', '微软必应搜索引擎，提供网页、图片、视频搜索。', 1, NULL, 1, 0, 10000, 500),
('谷歌', 'https://www.google.com', '全球最大的搜索引擎，提供全面的互联网搜索服务。', 1, NULL, 1, 1, 30000, 1500);

-- 购物
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('淘宝', 'https://www.taobao.com', '亚洲较大的网上交易平台，提供各类商品在线交易。', 3, NULL, 1, 1, 40000, 2000),
('京东', 'https://www.jd.com', '专业的综合网上购物商城，销售家电、数码、电脑等商品。', 3, NULL, 1, 1, 35000, 1800),
('拼多多', 'https://www.pinduoduo.com', '新电商开创者，通过社交拼团模式提供高性价比商品。', 3, NULL, 1, 0, 25000, 1200),
('唯品会', 'https://www.vip.com', '专门做特卖的网站，提供品牌折扣商品。', 3, NULL, 0, 0, 8000, 400),
('亚马逊', 'https://www.amazon.cn', '全球最大的电子商务公司，提供图书、电子产品等商品。', 3, NULL, 0, 1, 12000, 600);

-- 技术编程
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('GitHub', 'https://github.com', '全球最大的代码托管平台，开源项目的聚集地。', 4, NULL, 1, 1, 45000, 2200),
('开源中国社区', 'https://www.oschina.net', '中国最大的开源技术社区，提供开源资讯、代码托管等服务。', 4, NULL, 1, 0, 15000, 750),
('C语言中文网', 'http://c.biancheng.net/c/', '专业的编程学习网站，提供C语言、C++等编程教程。', 4, NULL, 0, 0, 10000, 500),
('在线正则表达式测试', 'https://tool.oschina.net/regex/', '在线正则表达式测试工具，方便开发者测试正则表达式。', 4, NULL, 0, 0, 5000, 250),
('IT技术速查手册', 'http://www.dba.cn/book/', 'IT技术速查手册，提供各类技术文档和教程。', 4, NULL, 0, 0, 4000, 200),
('百度地图开放平台', 'http://lbsyun.baidu.com/', '百度地图开放平台，提供地图API、定位SDK等开发服务。', 4, NULL, 0, 0, 6000, 300);

-- AI
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('Claude', 'https://claude.com', 'Anthropic开发的AI助手，提供智能对话和文本生成服务。', 5, NULL, 1, 1, 20000, 1000),
('DeepSeek', 'https://chat.deepseek.com', '深度求索AI助手，提供智能对话和代码生成服务。', 5, NULL, 1, 1, 15000, 750),
('Google AI Studio', 'https://aistudio.google.com', 'Google AI Studio，提供Gemini等AI模型的开发平台。', 5, NULL, 0, 0, 8000, 400),
('Gemini', 'https://gemini.google.com', 'Google Gemini AI助手，提供多模态AI对话服务。', 5, NULL, 1, 0, 12000, 600),
('ChatGPT', 'https://chatgpt.com', 'OpenAI开发的AI聊天机器人，提供智能对话服务。', 5, NULL, 1, 1, 50000, 2500),
('Kimi智能助手', 'https://kimi.moonshot.cn', '月之暗面开发的AI助手，支持长文本对话。', 5, NULL, 1, 1, 18000, 900),
('通义千问', 'https://tongyi.aliyun.com', '阿里云开发的AI大模型，提供智能对话和文本生成服务。', 5, NULL, 1, 0, 10000, 500),
('腾讯混元', 'https://hunyuan.tencent.com', '腾讯开发的AI大模型，提供智能对话和内容创作服务。', 5, NULL, 0, 0, 7000, 350),
('AI工具集', 'https://ai-bot.cn', '全场景AI工具导航，收录各类AI工具和应用。', 5, NULL, 0, 1, 9000, 450);

-- 云服务
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('Cloudflare', 'https://www.cloudflare.com', '全球领先的云服务提供商，提供CDN、安全等服务。', 6, NULL, 1, 0, 15000, 750),
('阿里云', 'https://www.aliyun.com', '阿里巴巴旗下云计算品牌，提供云服务器、数据库等服务。', 6, NULL, 1, 1, 30000, 1500),
('腾讯云', 'https://cloud.tencent.com', '腾讯旗下云计算品牌，提供云服务器、CDN等服务。', 6, NULL, 1, 1, 25000, 1250),
('华为云', 'https://www.huaweicloud.com', '华为旗下云计算品牌，提供云服务器、AI服务等。', 6, NULL, 1, 0, 18000, 900),
('亚马逊云科技', 'https://aws.amazon.com/cn', '全球最大的云计算服务商，提供全面的云服务。', 6, NULL, 0, 1, 20000, 1000);

-- 办公学习
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('羽雀', 'https://www.yuque.com', '专业的云端知识库，提供文档协作和知识管理服务。', 7, NULL, 1, 1, 12000, 600),
('ProcessOn', 'https://www.processon.com', '在线作图协作平台，支持流程图、思维导图等。', 7, NULL, 1, 0, 10000, 500),
('熊猫办公', 'https://www.tukuppt.com', '办公模板资源网站，提供PPT模板、简历模板等。', 7, NULL, 0, 0, 6000, 300),
('中国大学MOOC', 'http://www.icourse163.org', '中国最大的在线教育平台，提供名校公开课。', 7, NULL, 1, 1, 20000, 1000),
('中国知网', 'https://www.cnki.net', '中国知识资源总库，提供学术论文检索和下载服务。', 7, NULL, 1, 0, 15000, 750),
('iLovePDF', 'https://www.ilovepdf.com/zh-cn', '在线PDF处理工具，提供PDF合并、拆分、转换等服务。', 7, NULL, 1, 0, 8000, 400),
('网易公开课', 'https://open.163.com', '网易公开课，提供名校公开课和TED演讲视频。', 7, NULL, 0, 0, 7000, 350),
('合天网安实验室', 'http://www.hetianlab.com', '在线安全实验平台，提供网络安全实验和学习资源。', 7, NULL, 0, 0, 4000, 200);

-- 影音娱乐
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('哔哩哔哩', 'https://www.bilibili.com', '国内知名的视频弹幕网站，提供动画、游戏、影视等内容。', 8, NULL, 1, 1, 50000, 2500),
('腾讯视频', 'https://v.qq.com', '腾讯视频网站，提供海量高清视频在线观看服务。', 8, NULL, 1, 1, 35000, 1750),
('优酷', 'https://youku.com', '优酷视频网站，提供电视剧、电影、综艺等视频内容。', 8, NULL, 1, 0, 20000, 1000),
('爱奇艺', 'https://www.iqiyi.com', '爱奇艺视频网站，提供热门影视剧、综艺、动漫等内容。', 8, NULL, 1, 1, 30000, 1500),
('网易云音乐', 'https://music.163.com', '网易云音乐，提供在线音乐播放和歌单分享服务。', 8, NULL, 1, 1, 25000, 1250),
('QQ音乐', 'https://y.qq.com', 'QQ音乐，提供正版音乐在线播放和下载服务。', 8, NULL, 1, 0, 18000, 900);

-- 网盘资源
INSERT OR IGNORE INTO websites (name, url, description, category_id, logo_url, is_hot, is_recommended, view_count, favorite_count) VALUES
('百度网盘', 'https://pan.baidu.com', '百度旗下云存储服务，提供文件存储和分享功能。', 9, NULL, 1, 1, 40000, 2000),
('阿里云盘', 'https://www.aliyundrive.com', '阿里云旗下云存储服务，提供大容量文件存储。', 9, NULL, 1, 1, 25000, 1250),
('天翼云盘', 'https://cloud.189.cn', '中国电信旗下云存储服务，提供个人和企业云存储。', 9, NULL, 0, 0, 8000, 400),
('坚果云', 'https://www.jianguoyun.com', '专业的云存储服务，支持多平台文件同步。', 9, NULL, 0, 0, 5000, 250);

-- 插入默认管理员账号（密码: abc888888）
INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', 'abc888888');

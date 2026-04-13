const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../database/navsite.db');

// 数据库连接实例
let db = null;

/**
 * 获取数据库连接实例（单例模式）
 */
async function getDatabase() {
    if (!db) {
        console.log('[DB] 初始化数据库连接...');
        try {
            // 初始化sql.js
            const SQL = await initSqlJs();

            // 检查数据库文件是否存在
            const dbExists = fs.existsSync(DB_PATH);

            if (dbExists) {
                console.log('[DB] 加载现有数据库文件:', DB_PATH);
                const fileBuffer = fs.readFileSync(DB_PATH);
                db = new SQL.Database(fileBuffer);
            } else {
                console.log('[DB] 创建新数据库...');
                db = new SQL.Database();
                initializeDatabase();
            }
            console.log('[DB] 数据库已就绪');
        } catch (error) {
            console.error('[DB] 数据库连接失败:', error);
            throw error;
        }
    }
    return db;
}

/**
 * 初始化数据库
 */
function initializeDatabase() {
    const initSqlPath = path.join(__dirname, '../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    // 执行初始化SQL
    db.run(initSql);

    // 保存到文件
    saveDatabase();

    console.log('数据库初始化完成');
}

/**
 * 保存数据库到文件
 */
function saveDatabase() {
    if (db) {
        try {
            const start = Date.now();
            const data = db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(DB_PATH, buffer);
            const duration = Date.now() - start;
            console.log(`[DB] 数据库已保存至磁盘 (${duration}ms)`);
        } catch (error) {
            console.error('[DB] 数据库保存失败:', error);
        }
    }
}

/**
 * 关闭数据库连接
 */
function closeDatabase() {
    if (db) {
        saveDatabase();
        db.close();
        db = null;
        console.log('数据库连接已关闭');
    }
}

/**
 * 执行查询
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数
 * @returns {Array} 查询结果
 */
async function query(sql, params = []) {
    const database = await getDatabase();
    const result = database.exec(sql, params);

    if (result.length === 0) {
        return [];
    }

    // 转换结果为对象数组
    const columns = result[0].columns;
    const values = result[0].values;

    return values.map(row => {
        const obj = {};
        columns.forEach((col, index) => {
            obj[col] = row[index];
        });
        return obj;
    });
}

/**
 * 执行单条查询
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数
 * @returns {Object} 查询结果
 */
async function queryOne(sql, params = []) {
    const results = await query(sql, params);
    return results.length > 0 ? results[0] : null;
}

/**
 * 执行插入/更新/删除
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数
 * @returns {Object} 执行结果
 */
async function run(sql, params = []) {
    const database = await getDatabase();
    try {
        database.run(sql, params);
        
        // 保存更改
        saveDatabase();

        // 返回结果（模拟better-sqlite3的返回格式）
        const info = database.exec("SELECT last_insert_rowid() as lastInsertRowid, changes() as changes");
        return {
            lastInsertRowid: info[0]?.values[0][0] || 0,
            changes: info[0]?.values[0][1] || 0
        };
    } catch (error) {
        console.error(`[DB] 执行SQL失败: ${sql}`, error);
        throw error;
    }
}

/**
 * 执行事务
 * @param {Function} fn - 事务函数
 * @returns {*} 事务结果
 */
async function transaction(fn) {
    const database = await getDatabase();
    database.run('BEGIN TRANSACTION');
    try {
        const result = await fn();
        database.run('COMMIT');
        saveDatabase();
        return result;
    } catch (error) {
        database.run('ROLLBACK');
        throw error;
    }
}

module.exports = {
    getDatabase,
    closeDatabase,
    initializeDatabase,
    saveDatabase,
    query,
    queryOne,
    run,
    transaction
};

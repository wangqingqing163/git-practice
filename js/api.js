const API_BASE = '/api';

function getAuthHeaders() {
    const token = store.getToken();
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function handleResponse(response) {
    if (response.status === 401) {
        store.clearAuth();
        throw new Error('登录已过期');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || `请求失败 (${response.status})`);
    return data;
}

const api = {
    async get(url) {
        return handleResponse(await fetch(API_BASE + url, { headers: getAuthHeaders() }));
    },

    async post(url, data) {
        return handleResponse(await fetch(API_BASE + url, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }));
    },

    async put(url, data) {
        return handleResponse(await fetch(API_BASE + url, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }));
    },

    async del(url, data = null) {
        const options = { method: 'DELETE', headers: getAuthHeaders() };
        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
        return handleResponse(await fetch(API_BASE + url, options));
    },

    async upload(url, file) {
        const formData = new FormData();
        formData.append('file', file);
        return handleResponse(await fetch(API_BASE + url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        }));
    },

    async getCategory() {
        try {
            const response = await fetch(API_BASE + '/category/list');
            if (!response.ok) {
                console.warn('获取分类列表失败:', response.status);
                return [];
            }
            const data = await response.json();
            console.log('✅ 分类列表加载成功:', data.length, '个分类');
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('获取分类列表异常:', e);
            return [];
        }
    },

    // 收藏相关
    getFavorites(userId) { return this.get('/favorite/' + userId); },
    checkFavorite(userId, bookId) { return this.get(`/favorite/check?userId=${userId}&bookId=${bookId}`); },
    addFavorite(userId, bookId) { return this.post('/favorite/add', { userId, bookId }); },
    removeFavorite(userId, bookId) { return this.del('/favorite/remove', { userId, bookId }); },

    // 认证专用（不携带Token）
    async login(username, password) {
        const res = await fetch(`${API_BASE}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({ msg: '网络错误' }));
            throw new Error(data.msg || '登录失败');
        }
        return res.json();
    },

    async register(userData) {
        const res = await fetch(`${API_BASE}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({ msg: '注册失败' }));
            throw new Error(data.msg || '注册失败');
        }
        return res.json();
    }
};
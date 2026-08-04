const API_BASE = '/api';

const api = {
    async get(url) {
        const res = await fetch(API_BASE + url);
        return res.json();
    },
    async post(url, data) {
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async put(url, data) {
        const res = await fetch(API_BASE + url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async del(url) {
        const res = await fetch(API_BASE + url, { method: 'DELETE' });
        return res.json();
    },
    async upload(url, file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            body: formData
        });
        return res.json();
    },
    async getCategory() {
        try {
            const res = await fetch('/category/list');
            return res.json();
        } catch (e) {
            return [];
        }
    },
    async adminPost(url, data) {
        const headers = { 'Content-Type': 'application/json' };
        const user = store.getUser();
        if (user && user.role === 1) {
            headers['X-User-Role'] = '1';
        }
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async adminPut(url, data) {
        const headers = { 'Content-Type': 'application/json' };
        const user = store.getUser();
        if (user && user.role === 1) {
            headers['X-User-Role'] = '1';
        }
        const res = await fetch(API_BASE + url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async adminDel(url) {
        const headers = {};
        const user = store.getUser();
        if (user && user.role === 1) {
            headers['X-User-Role'] = '1';
        }
        const res = await fetch(API_BASE + url, { method: 'DELETE', headers });
        return res.json();
    },
    async adminGet(url) {
        const headers = {};
        const user = store.getUser();
        if (user && user.role === 1) {
            headers['X-User-Role'] = '1';
        }
        const res = await fetch(API_BASE + url, { headers });
        return res.json();
    },
    
    // 收藏相关 API
    async getFavorites(userId) {
        return this.get('/favorite/' + userId);
    },
    async checkFavorite(userId, bookId) {
        return this.get('/favorite/check?userId=' + userId + '&bookId=' + bookId);
    },
    async addFavorite(userId, bookId) {
        return this.post('/favorite/add', { userId, bookId });
    },
    async removeFavorite(userId, bookId) {
        return this.delWithBody('/favorite/remove', { userId, bookId });
    },
    async delWithBody(url, data) {
        const res = await fetch(API_BASE + url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
const store = {
    _user: null,
    getUser() {
        if (this._user) return this._user;
        const raw = localStorage.getItem('bookstore_user');
        if (raw) {
            try { this._user = JSON.parse(raw); } catch (e) { this._user = null; }
        }
        return this._user;
    },
    setUser(user) {
        this._user = user;
        localStorage.setItem('bookstore_user', JSON.stringify(user));
    },
    clearUser() {
        this._user = null;
        localStorage.removeItem('bookstore_user');
    },
    isAdmin() {
        const user = this.getUser();
        if (!user) return false;
        console.log('🔍 检查管理员权限:', {
            userId: user.id,
            username: user.username,
            role: user.role,
            roleType: typeof user.role,
            isAdmin: user.role == 1
        });
        // 兼容字符串和数字
        return user.role == 1 || user.role === 'admin' || user.username === 'admin';
    },
    isLoggedIn() {
        return this.getUser() !== null;
    }
};
const store = {
    _user: null,
    _token: null,

    getToken() {
        if (this._token) return this._token;
        this._token = localStorage.getItem('bookstore_token') || null;
        return this._token;
    },

    setToken(token) {
        this._token = token;
        if (token) {
            localStorage.setItem('bookstore_token', token);
        } else {
            localStorage.removeItem('bookstore_token');
        }
    },

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
        if (user) {
            localStorage.setItem('bookstore_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('bookstore_user');
        }
    },

    clearAuth() {
        this._user = null;
        this._token = null;
        localStorage.removeItem('bookstore_user');
        localStorage.removeItem('bookstore_token');
    },

    isAdmin() {
        const user = this.getUser();
        if (!user || !this.getToken()) return false;
        return user.role == 1 || user.role === 'admin' || user.username === 'admin';
    },

    isLoggedIn() {
        return this.getUser() !== null && this.getToken() !== null;
    },

    isTokenExpired() {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
        } catch (e) {
            return true;
        }
    },

    checkAndRefreshAuth() {
        if (!this.isLoggedIn()) return false;

        if (this.isTokenExpired()) {
            this.clearAuth();
            return false;
        }

        return true;
    }
};
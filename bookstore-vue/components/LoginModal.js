const LoginModal = {
    template: `
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal">
            <h2>{{ isLogin ? '欢迎回来' : '创建账号' }}</h2>
            <div class="tab-switch">
                <button :class="{ active: isLogin }" @click="isLogin = true">登录</button>
                <button :class="{ active: !isLogin }" @click="isLogin = false">注册</button>
            </div>
            <div class="form-group">
                <label>用户名</label>
                <input v-model="username" placeholder="请输入用户名" @keyup.enter="submit">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input v-model="password" type="password" placeholder="请输入密码" @keyup.enter="submit">
            </div>
            <div class="form-group" v-if="!isLogin">
                <label>手机号</label>
                <input v-model="phone" placeholder="请输入手机号">
            </div>
            <div class="form-group" v-if="!isLogin">
                <label>收货地址</label>
                <input v-model="address" placeholder="请输入收货地址（选填）">
            </div>
            <div class="form-actions">
                <button class="btn-cancel" @click="$emit('close')">取消</button>
                <button class="btn-submit" @click="submit">{{ isLogin ? '登录' : '注册' }}</button>
            </div>
        </div>
    </div>`,
    emits: ['close', 'login-success'],
    data() {
        return { isLogin: true, username: '', password: '', phone: '', address: '' };
    },
    methods: {
        async submit() {
            if (!this.username.trim()) { this.showToast('请输入用户名', 'error'); return; }
            if (!this.password.trim()) { this.showToast('请输入密码', 'error'); return; }
            try {
                if (this.isLogin) {
                    const data = await api.post('/user/login', { username: this.username, password: this.password });
                    if (data.success) {
                        store.setUser(data.user);
                        this.$emit('login-success', data.user);
                        this.showToast('登录成功', 'success');
                    } else {
                        this.showToast(data.msg || '登录失败', 'error');
                    }
                } else {
                    const data = await api.post('/user/register', { username: this.username, password: this.password, phone: this.phone, address: this.address });
                    if (data.success) {
                        this.showToast('注册成功，请登录', 'success');
                        this.isLogin = true;
                    } else {
                        this.showToast(data.msg || '注册失败', 'error');
                    }
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        showToast(msg, type) {
            const icons = { success: '✓', error: '✗' };
            const t = document.createElement('div');
            t.className = 'toast ' + type;
            t.innerHTML = (icons[type] || '') + ' ' + msg;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 2600);
        }
    }
};
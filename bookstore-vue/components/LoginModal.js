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
                <input v-model="username" placeholder="请输入用户名（4-20位，中文/字母开头）" @keyup.enter="submit" @blur="validateUsernameInput">
                <div v-if="usernameError" class="field-error">{{ usernameError }}</div>
                <div v-else-if="username && !usernameError" class="field-success">✓ 格式正确</div>
            </div>
            <div class="form-group">
                <label>密码</label>
                <input v-model="password" type="password" placeholder="请输入密码（6-20位，必须包含字母和数字）" @keyup.enter="submit" @blur="validatePasswordInput">
                <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
                <div v-else-if="password && !passwordError" class="field-success">✓ 格式正确</div>
            </div>
            <div class="form-group" v-if="!isLogin">
                <label>手机号</label>
                <input v-model="phone" placeholder="请输入手机号（选填）" @blur="validatePhoneInput">
                <div v-if="phoneError" class="field-error">{{ phoneError }}</div>
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
        return { isLogin: true, username: '', password: '', phone: '', address: '', usernameError: '', passwordError: '', phoneError: '' };
    },
    methods: {
        validateUsernameInput() {
            if (!this.username) {
                this.usernameError = '';
                return;
            }
            const result = this.validateUsername(this.username);
            this.usernameError = result.valid ? '' : result.message;
        },

        validatePasswordInput() {
            if (!this.password) {
                this.passwordError = '';
                return;
            }
            const result = this.validatePassword(this.password);
            this.passwordError = result.valid ? '' : result.message;
        },

        validatePhoneInput() {
            if (!this.phone) {
                this.phoneError = '';
                return;
            }
            const result = this.validatePhone(this.phone);
            this.phoneError = result.valid ? '' : result.message;
        },

        async submit() {
            if (!this.username.trim()) { this.showToast('请输入用户名', 'error'); return; }
            if (!this.password.trim()) { this.showToast('请输入密码', 'error'); return; }
            
            try {
                if (this.isLogin) {
                    await this.handleLogin();
                } else {
                    await this.handleRegister();
                }
            } catch (e) {
                this.showToast(e.message || '网络错误', 'error');
            }
        },

        async handleLogin() {
            const data = await api.login(this.username, this.password);
            
            if (data.success && data.token) {
                store.setToken(data.token);
                store.setUser(data.user);
                
                console.log('✅ 登录成功，Token已保存');
                this.$emit('login-success', data.user);
                this.showToast('登录成功', 'success');

                // 清空表单
                this.username = '';
                this.password = '';
            } else {
                throw new Error(data.msg || '登录失败');
            }
        },

        validateUsername(username) {
            if (!username || username.trim().length === 0) {
                return { valid: false, message: '请输入用户名' };
            }
            
            const trimmedUsername = username.trim();
            
            if (trimmedUsername.length < 4 || trimmedUsername.length > 20) {
                return { valid: false, message: '用户名长度必须在4-20个字符之间' };
            }
            
            const usernameRegex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{3,19}$/;
            if (!usernameRegex.test(trimmedUsername)) {
                return { valid: false, message: '用户名只能包含中文、字母、数字和下划线，且必须以中文或字母开头' };
            }
            
            return { valid: true, message: '' };
        },

        validatePassword(password) {
            if (!password || password.length === 0) {
                return { valid: false, message: '请输入密码' };
            }
            
            if (password.length < 6 || password.length > 20) {
                return { valid: false, message: '密码长度必须在6-20个字符之间' };
            }
            
            const hasLetter = /[a-zA-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            
            if (!hasLetter || !hasNumber) {
                return { valid: false, message: '密码必须同时包含字母和数字' };
            }
            
            const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,20}$/;
            if (!passwordRegex.test(password)) {
                return { valid: false, message: '密码只能包含字母、数字和常见符号' };
            }
            
            return { valid: true, message: '' };
        },

        validatePhone(phone) {
            if (!phone || phone.trim().length === 0) {
                return { valid: true, message: '' };
            }
            
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone.trim())) {
                return { valid: false, message: '请输入正确的手机号格式' };
            }
            
            return { valid: true, message: '' };
        },

        async handleRegister() {
            const usernameValidation = this.validateUsername(this.username);
            if (!usernameValidation.valid) {
                this.showToast(usernameValidation.message, 'error');
                return;
            }

            const passwordValidation = this.validatePassword(this.password);
            if (!passwordValidation.valid) {
                this.showToast(passwordValidation.message, 'error');
                return;
            }

            const phoneValidation = this.validatePhone(this.phone);
            if (!phoneValidation.valid) {
                this.showToast(phoneValidation.message, 'error');
                return;
            }

            const data = await api.register({
                username: this.username.trim(),
                password: this.password,
                phone: this.phone.trim(),
                address: this.address || ''
            });

            if (data.success) {
                this.showToast('注册成功，请登录', 'success');
                this.isLogin = true;
                this.password = '';
            } else {
                throw new Error(data.msg || '注册失败');
            }
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
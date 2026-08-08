const app = Vue.createApp({
    data() {
        return {
            showLoginModal: false,
            currentUser: store.getUser(),
            isAdmin: store.isAdmin()
        };
    },
    methods: {
        onLoginSuccess(user) {
            this.currentUser = user;
            this.isAdmin = store.isAdmin();
            this.showLoginModal = false;
        },

        handleLogout() {
            store.clearAuth();
            this.currentUser = null;
            this.isAdmin = false;
            
            if (window.location.hash === '#/admin') {
                window.location.hash = '#/';
            }
            
            this.showToast('已安全退出', 'success');
        },

        showToast(msg, type) {
            const icons = { success: '✓', error: '✗' };
            const t = document.createElement('div');
            t.className = 'toast ' + type;
            t.innerHTML = (icons[type] || '') + ' ' + msg;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 2600);
        }
    },
    mounted() {
        // 页面加载时检查Token有效性
        if (store.isLoggedIn()) {
            if (!store.checkAndRefreshAuth()) {
                this.showToast('登录已过期，请重新登录', 'error');
                this.currentUser = null;
                this.isAdmin = false;
            }
        }

        router.beforeEach((to, from, next) => {
            // 仅在用户状态实际变化时更新，避免不必要的重渲染
            const user = store.getUser();
            const isAdmin = store.isAdmin();
            
            if (this.currentUser?.id !== user?.id || this.isAdmin !== isAdmin) {
                this.currentUser = user;
                this.isAdmin = isAdmin;
            }

            // 管理员页面需要管理员权限和有效Token
            if (to.path === '/admin' && !isAdmin) {
                this.showToast('无管理员权限或未登录', 'error');
                
                if (!store.getToken()) {
                    this.showLoginModal = true;
                }
                
                next('/');
                return;
            }

            // 个人中心和订单页面需要登录
            if ((to.path === '/personal' || to.path === '/orders') && !store.isLoggedIn()) {
                this.showLoginModal = true;
                next('/');
                return;
            }

            next();
        });
    }
});

app.use(router);
app.component('NavBar', NavBar);
app.component('LoginModal', LoginModal);
app.component('ToastNotification', Toast);
app.component('Carousel', Carousel);
app.mount('#app');
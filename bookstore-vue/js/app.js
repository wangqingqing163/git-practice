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
            this.currentUser = null;
            this.isAdmin = false;
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
        const self = this;
        router.beforeEach((to, from, next) => {
            const user = store.getUser();
            self.currentUser = user;
            self.isAdmin = store.isAdmin();
            if (to.path === '/admin' && !self.isAdmin) {
                self.showToast('无管理员权限', 'error');
                next('/');
                return;
            }
            if ((to.path === '/personal' || to.path === '/orders') && !user) {
                self.showLoginModal = true;
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
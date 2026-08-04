const NavBar = {
    template: `
    <nav class="navbar">
        <router-link to="/" class="logo">
            <div class="icon">📚</div>
            <span>BookLoop</span>
        </router-link>
        <div class="nav-links">
            <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
            <router-link to="/personal" :class="{ active: $route.path === '/personal' }" v-if="user">个人中心</router-link>
            <router-link to="/orders" :class="{ active: $route.path === '/orders' }" v-if="user">我的订单</router-link>
            <router-link to="/admin" :class="{ active: $route.path === '/admin' }" v-if="isAdmin">管理后台</router-link>
            <span class="user-info" v-if="user">
                <span class="dot"></span>
                {{ user.username }}
            </span>
            <button class="btn-login" v-if="!user" @click="$emit('open-login')">登录</button>
            <button class="btn-logout" v-if="user" @click="logout">退出</button>
        </div>
    </nav>`,
    props: ['user', 'isAdmin'],
    emits: ['open-login', 'logout'],
    methods: {
        logout() {
            store.clearUser();
            this.$emit('logout');
        }
    }
};
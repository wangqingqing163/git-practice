const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/personal', component: Personal },
        { path: '/orders', component: Orders },
        { path: '/admin', component: Admin },
        { path: '/seller/:id', component: SellerProfile }
    ]
});
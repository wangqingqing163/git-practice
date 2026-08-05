const Admin = {
    template: `
<div class="admin-container">
    <h1>📊 管理员后台</h1>

    <!-- 统计卡片 -->
    <div class="stats-grid">
        <div class="stat-card stat-users"><div>{{ userList.length }}</div><span>👥 用户</span></div>
        <div class="stat-card stat-books"><div>{{ bookList.length }}</div><span>📚 图书</span></div>
        <div class="stat-card stat-orders"><div>{{ orderList.length }}</div><span>📦 订单</span></div>
        <div class="stat-card stat-comments"><div>{{ commentList.length }}</div><span>💬 评论</span></div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
        <button v-for="tab in tabs" :key="tab.key" @click="currentTab=tab.key" :class="{active: currentTab===tab.key}">{{ tab.icon }} {{ tab.label }}</button>
        <button class="btn-refresh" @click="loadAllData()">🔄 刷新</button>
    </div>

    <!-- 用户管理 -->
    <div v-show="currentTab==='users'" class="panel">
        <h2>👥 用户列表 ({{ filteredUsers.length }})</h2>
        <div class="toolbar">
            <input v-model="userSearch" placeholder="🔍 搜索用户名/手机号" @input="userPage=1" />
            <select v-model="userRoleFilter" @change="userPage=1">
                <option value="">全部角色</option>
                <option value="0">普通用户</option>
                <option value="1">管理员</option>
            </select>
            <button class="btn-add" @click="openUserModal()">➕ 添加</button>
        </div>
        <table v-if="filteredUsers.length">
            <thead><tr><th @click="sort('users','id')">ID {{ sortIcon('users','id') }}</th><th @click="sort('users','username')">用户名 {{ sortIcon('users','username') }}</th><th>手机号</th><th @click="sort('users','role')">角色 {{ sortIcon('users','role') }}</th><th>操作</th></tr></thead>
            <tbody><tr v-for="u in paginatedUsers" :key="u.id"><td>{{ u.id }}</td><td class="bold red">{{ u.username }}</td><td>{{ u.phone||'-' }}</td><td><span :class="'role-'+u.role">{{ u.role==1?'管理员':'用户' }}</span></td><td class="actions"><button @click="editUser(u)">✏️</button><button @click="deleteUser(u.id)">🗑️</button></td></tr></tbody>
        </table>
        <div v-else class="empty">👥 暂无数据</div>
        <pagination :page="userPage" :total="filteredUsers.length" @change="userPage=$event" />
    </div>

    <!-- 图书管理 -->
    <div v-show="currentTab==='books'" class="panel">
        <h2>📚 图书列表 ({{ filteredBooks.length }})</h2>
        <div class="toolbar">
            <input v-model="bookSearch" placeholder="🔍 搜索书名/作者" @input="bookPage=1" />
            <select v-model="bookLevelFilter" @change="bookPage=1"><option value="">全部成色</option><option value="全新">全新</option><option value="几乎全新">几乎全新</option><option value="轻微使用痕迹">轻微使用痕迹</option><option value="明显使用痕迹">明显使用痕迹</option></select>
            <select v-model="bookPriceFilter" @change="bookPage=1"><option value="">全部价格</option><option value="0-50">¥50以下</option><option value="50-100">¥50-100</option><option value="100+">¥100以上</option></select>
            <button class="btn-add" @click="openBookModal()">➕ 添加</button>
        </div>
        <table v-if="filteredBooks.length">
            <thead><tr><th @click="sort('books','id')">ID {{ sortIcon('books','id') }}</th><th @click="sort('books','name')">书名 {{ sortIcon('books','name') }}</th><th>作者</th><th @click="sort('books','price')">价格 {{ sortIcon('books','price') }}</th><th>成色</th><th>操作</th></tr></thead>
            <tbody><tr v-for="b in paginatedBooks" :key="b.id"><td>{{ b.id }}</td><td class="bold blue">{{ b.name }}</td><td>{{ b.author||'-' }}</td><td class="green bold">¥{{ Number(b.price||0).toFixed(2) }}</td><td><span class="level">{{ b.level||'-' }}</span></td><td class="actions"><button @click="editBook(b)">✏️</button><button @click="deleteBook(b.id)">🗑️</button></td></tr></tbody>
        </table>
        <div v-else class="empty">📚 暂无数据</div>
        <pagination :page="bookPage" :total="filteredBooks.length" @change="bookPage=$event" />
    </div>

    <!-- 订单管理 -->
    <div v-show="currentTab==='orders'" class="panel">
        <h2>📦 订单列表 ({{ filteredOrders.length }})</h2>
        <div class="toolbar">
            <input v-model="orderSearch" placeholder="🔍 搜索订单号" @input="orderPage=1" />
            <select v-model="orderStatusFilter" @change="orderPage=1"><option value="">全部状态</option><option value="pending">待发货</option><option value="shipped">已发货</option><option value="received">已收货</option><option value="cancelled">已取消</option></select>
            <select v-model="orderPriceFilter" @change="orderPage=1"><option value="">全部金额</option><option value="0-100">¥100以下</option><option value="100-500">¥100-500</option><option value="500+">¥500以上</option></select>
        </div>
        <table v-if="filteredOrders.length">
            <thead><tr><th>ID</th><th>订单号</th><th>买家ID</th><th>卖家ID</th><th @click="sort('orders','totalPrice')">金额 {{ sortIcon('orders','totalPrice') }}</th><th @click="sort('orders','status')">状态 {{ sortIcon('orders','status') }}</th><th>操作</th></tr></thead>
            <tbody><tr v-for="o in paginatedOrders" :key="o.id"><td>{{ o.id }}</td><td class="mono">{{ o.orderNo||'-' }}</td><td>{{ o.buyerId||'-' }}</td><td>{{ o.sellerId||'-' }}</td><td class="green bold">¥{{ Number(o.totalPrice||0).toFixed(2) }}</td><td><span :class="'status-'+o.status">{{ statusText(o.status) }}</span></td><td class="actions"><button v-if="o.status==='pending'||o.status==='shipped'" @click="updateOrder(o.id,'cancelled')">❌</button><button @click="deleteOrder(o.id)">🗑️</button></td></tr></tbody>
        </table>
        <div v-else class="empty">📭 暂无数据</div>
        <pagination :page="orderPage" :total="filteredOrders.length" @change="orderPage=$event" />
    </div>

    <!-- 评论管理 -->
    <div v-show="currentTab==='comments'" class="panel">
        <h2>💬 评论列表 ({{ filteredComments.length }})</h2>
        <div class="toolbar">
            <input v-model="commentSearch" placeholder="🔍 搜索评论内容" @input="commentPage=1" />
            <select v-model="commentScoreFilter" @change="commentPage=1"><option value="">全部评分</option><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option></select>
        </div>
        <table v-if="filteredComments.length">
            <thead><tr><th>ID</th><th>用户ID</th><th>图书ID</th><th @click="sort('comments','score')">评分 {{ sortIcon('comments','score') }}</th><th>内容</th><th>操作</th></tr></thead>
            <tbody><tr v-for="c in paginatedComments" :key="c.id"><td>{{ c.id }}</td><td>{{ c.userId||'-' }}</td><td>{{ c.bookId||'-' }}</td><td class="stars">{{ '★'.repeat(c.score||0) }}{{ '☆'.repeat(5-(c.score||0)) }}</td><td class="max-w">{{ c.content||'-' }}</td><td class="actions"><button @click="deleteComment(c.id)">🗑️</button></td></tr></tbody>
        </table>
        <div v-else class="empty">💬 暂无数据</div>
        <pagination :page="commentPage" :total="filteredComments.length" @change="commentPage=$event" />
    </div>

    <!-- 用户弹窗 -->
    <modal v-if="showUserModal" @close="showUserModal=false" :title="editMode?'编辑用户':'添加用户'" @save="saveUser">
        <input v-model="currentUser.username" placeholder="用户名 *" />
        <input v-if="!editMode" v-model="currentUser.password" type="password" placeholder="密码 *" />
        <input v-model="currentUser.phone" placeholder="手机号" />
        <select v-model.number="currentUser.role"><option :value="0">普通用户</option><option :value="1">管理员</option></select>
    </modal>

    <!-- 图书弹窗 -->
    <modal v-if="showBookModal" @close="showBookModal=false" :title="editMode?'编辑图书':'添加图书'" @save="saveBook">
        <input v-model="currentBook.name" placeholder="书名 *" />
        <input v-model="currentBook.author" placeholder="作者" />
        <input v-model.number="currentBook.price" type="number" step="0.01" placeholder="价格 *" />
        <select v-model="currentBook.level"><option value="">选择成色</option><option value="全新">全新</option><option value="几乎全新">几乎全新</option><option value="轻微使用痕迹">轻微使用痕迹</option><option value="明显使用痕迹">明显使用痕迹</option></select>
        <textarea v-model="currentBook.description" placeholder="描述"></textarea>
        <input v-model.number="currentBook.sellerId" type="number" placeholder="卖家ID *" />
    </modal>
</div>`,

    components: {
        pagination: {
            props: ['page', 'total'],
            template: `<div v-if="totalPages>1" class="pagination"><button :disabled="page<=1" @click="$emit('change',page-1)">◀</button><span>{{ page }}/{{ totalPages }} ({{ total }})</span><button :disabled="page>=totalPages" @click="$emit('change',page+1)">▶</button></div>`,
            computed: { totalPages() { return Math.ceil(this.total / 10) || 1; } }
        },
        modal: {
            props: ['title'],
            template: `<div class="modal-overlay" @click.self="$emit('close')"><div class="modal"><h3>{{ title }}</h3><slot /><div class="modal-actions"><button @click="$emit('close')">取消</button><button class="btn-save" @click="$emit('save')">保存</button></div></div></div>`
        }
    },

data() {
    return {
        currentTab: 'users', loading: false, pageSize: 10,
        tabs: [{ key:'users', icon:'👥', label:'用户' }, { key:'books', icon:'📚', label:'图书' }, { key:'orders', icon:'📦', label:'订单' }, { key:'comments', icon:'💬', label:'评论' }],
        userList: [], bookList: [], orderList: [], commentList: [],
        userPage: 1, userSearch: '', userRoleFilter: '',
        bookPage: 1, bookSearch: '', bookLevelFilter: '', bookPriceFilter: '',
        orderPage: 1, orderSearch: '', orderStatusFilter: '', orderPriceFilter: '',
        commentPage: 1, commentSearch: '', commentScoreFilter: '',
        sortState: { users:{key:'id',order:-1}, books:{key:'id',order:-1}, orders:{key:'id',order:-1}, comments:{key:'id',order:-1} },
        showUserModal: false, showBookModal: false, editMode: false,
        currentUser: { username:'', password:'', phone:'', role:0 },
        currentBook: { name:'', author:'', price:0, level:'', description:'', sellerId:'' }
    };
},

computed: {
    filteredUsers() { return this.filterData(this.userList, this.userSearch, ['username','phone'], { role: this.userRoleFilter }); },
    filteredBooks() { return this.filterData(this.bookList, this.bookSearch, ['name','author'], { level: this.bookLevelFilter, priceRange: this.bookPriceFilter }); },
    filteredOrders() { return this.filterData(this.orderList, this.orderSearch, ['orderNo'], { status: this.orderStatusFilter, priceRange: this.orderPriceFilter }); },
    filteredComments() { return this.filterData(this.commentList, this.commentSearch, ['content'], { score: this.commentScoreFilter }); },
    paginatedUsers() { return this.paginate(this.filteredUsers, this.userPage); },
    paginatedBooks() { return this.paginate(this.filteredBooks, this.bookPage); },
    paginatedOrders() { return this.paginate(this.filteredOrders, this.orderPage); },
    paginatedComments() { return this.paginate(this.filteredComments, this.commentPage); }
},

mounted() { this.loadAllData(); },

methods: {
    async loadAllData() {
        this.loading = true;
        try {
            [this.userList, this.bookList, this.orderList, this.commentList] = await Promise.all([
                api.get('/admin/users').catch(() => []),
                api.get('/admin/books').catch(() => []),
                api.get('/admin/orders').catch(() => []),
                api.get('/admin/comments').catch(() => [])
            ]);
            this.bookList = this.bookList.filter(b => String(b.status) === '1');
        } catch(e) { console.error('Load error:', e); }
        finally { this.loading = false; }
    },

    filterData(list, search, searchFields, filters = {}) {
        let result = [...list];
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(item => searchFields.some(f => item[f] && String(item[f]).toLowerCase().includes(s)));
        }
        if (filters.role !== undefined && filters.role !== '') result = result.filter(i => String(i.role) === filters.role);
        if (filters.level) result = result.filter(i => i.level === filters.level);
        if (filters.status) result = result.filter(i => i.status === filters.status);
        if (filters.score) result = result.filter(i => String(i.score) === filters.score);
        if (filters.priceRange) {
            const p = Number(filters.priceRange);
            if (p < 50) result = result.filter(i => Number(i.price) < 50);
            else if (p <= 100) result = result.filter(i => Number(i.price) >= 50 && Number(i.price) <= 100);
            else result = result.filter(i => Number(i.price) > p === 100 ? 100 : 500);
        }

        const state = this.sortState[this.currentTab];
        if (state) {
            result.sort((a, b) => {
                let va = a[state.key], vb = b[state.key];
                if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb||'').toLowerCase(); }
                return va < vb ? -1 * state.order : va > vb ? 1 * state.order : 0;
            });
        }
        return result;
    },

    paginate(list, page) {
        const start = (page - 1) * this.pageSize;
        return list.slice(start, start + this.pageSize);
    },

    sort(tab, key) {
        if (this.currentTab !== tab) return;
        const s = this.sortState[tab];
        s.key = key;
        s.order *= -1;
    },

    sortIcon(tab, key) {
        const s = this.sortState[tab];
        return s.key === key ? (s.order === 1 ? '▲' : '▼') : '';
    },

    statusText(s) { return ({ pending:'待发货', shipped:'已发货', received:'已收货', cancelled:'已取消' })[s] || s; },

    // 用户操作
    openUserModal(user = null) {
        this.editMode = !!user;
        this.currentUser = user ? { ...user } : { username:'', password:'', phone:'', role:0 };
        this.showUserModal = true;
    },
    editUser(u) { this.openUserModal(u); },
    async saveUser() {
        if (!this.currentUser.username) return alert('请输入用户名');
        try {
            if (this.editMode) await api.put(`/admin/user/${this.currentUser.id}`, this.currentUser);
            else { if (!this.currentUser.password) return alert('请输入密码'); await api.post('/admin/user', this.currentUser); }
            this.showUserModal = false;
            await this.loadAllData();
        } catch(e) { alert(e.message); }
    },
    async deleteUser(id) { if(!confirm('确定删除？')) return; try { await api.del(`/admin/user/${id}`); await this.loadAllData(); } catch(e) { alert(e.message); } },

    // 图书操作
    openBookModal(book = null) {
        this.editMode = !!book;
        this.currentBook = book ? { ...book } : { name:'', author:'', price:0, level:'', description:'', sellerId:'' };
        this.showBookModal = true;
    },
    editBook(b) { this.openBookModal(b); },
    async saveBook() {
        if (!this.currentBook.name || !this.currentBook.price || !this.currentBook.sellerId) return alert('请填写必填项');
        try {
            if (this.editMode) await api.put(`/admin/book/${this.currentBook.id}`, this.currentBook);
            else await api.post('/admin/book', this.currentBook);
            this.showBookModal = false;
            await this.loadAllData();
        } catch(e) { alert(e.message); }
    },
    async deleteBook(id) { if(!confirm('确定删除？')) return; try { await api.del(`/admin/book/${id}`); await this.loadAllData(); } catch(e) { alert(e.message); } },

    // 订单操作
    async updateOrder(id, status) { if(!confirm('确定取消？')) return; try { await api.put(`/admin/order/${id}/status?status=${status}`); await this.loadAllData(); } catch(e) { alert(e.message); } },
    async deleteOrder(id) { if(!confirm('确定删除？')) return; try { await api.del(`/admin/order/${id}`); await this.loadAllData(); } catch(e) { alert(e.message); } },

    // 评论操作
    async deleteComment(id) { if(!confirm('确定删除？')) return; try { await api.del(`/admin/comment/${id}`); await this.loadAllData(); } catch(e) { alert(e.message); } }
}
};
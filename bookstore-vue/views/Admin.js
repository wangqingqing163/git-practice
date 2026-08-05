const Admin = {
    template: `
<div style="max-width:1400px;margin:0 auto;padding:20px;">
    <h1 style="color:#333;margin-bottom:25px;font-size:32px;">📊 管理员后台</h1>

    <!-- 统计卡片 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:30px;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;">{{ userList.length }}</div>
            <div style="font-size:18px;">👥 用户总数</div>
        </div>
        <div style="background:linear-gradient(135deg,#f093fb,#f5576c);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;">{{ bookList.length }}</div>
            <div style="font-size:18px;">📚 图书总数</div>
        </div>
        <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;">{{ orderList.length }}</div>
            <div style="font-size:18px;">📦 订单总数</div>
        </div>
        <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;">{{ commentList.length }}</div>
            <div style="font-size:18px;">💬 评论总数</div>
        </div>
    </div>

    <!-- 标签切换 -->
    <div style="margin-bottom:25px;display:flex;gap:10px;flex-wrap:wrap;">
        <button @click="currentTab='users'" :style="{background:currentTab==='users'?'#c41a1a':'#f5f5f5',color:currentTab==='users'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">👥 用户管理</button>
        <button @click="currentTab='books'" :style="{background:currentTab==='books'?'#c41a1a':'#f5f5f5',color:currentTab==='books'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">📚 图书管理</button>
        <button @click="currentTab='orders'" :style="{background:currentTab==='orders'?'#c41a1a':'#f5f5f5',color:currentTab==='orders'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">📦 订单管理</button>
        <button @click="currentTab='comments'" :style="{background:currentTab==='comments'?'#c41a1a':'#f5f5f5',color:currentTab==='comments'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">💬 评论管理</button>
        <button @click="loadAllData()" style="background:#007bff;color:white;padding:10px 24px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">🔄 刷新数据</button>
    </div>

    <!-- ==================== 用户管理 ==================== -->
    <div v-show="currentTab === 'users'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';">
        <h2 style="color:#c41a1a;marginBottom:20px;">👥 用户列表（共 {{ userList.length }} 人）</h2>
        
        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="fontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="userList.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">用户名</th>
                    <th style="padding:12px;textAlign:left;">手机号</th>
                    <th style="padding:12px;textAlign:left;">角色</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" style="borderBottom:'1px solid #eee';">
                    <td style="padding:12px;">{{ user.id }}</td>
                    <td style="padding:12px;fontWeight:bold;color:#c41a1a;">{{ user.username }}</td>
                    <td style="padding:12px;">{{ user.phone || '-' }}</td>
                    <td style="padding:12px;">
                        <span :style="{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',color:'white',background:user.role==='admin'?'#dc3545':'#28a745'}">
                            {{ user.role === 'admin' ? '管理员' : '用户' }}
                        </span>
                    </td>
                    <td style="padding:12px;">
                        <button @click="deleteUser(user.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="fontSize:64px;marginBottom:20px;">👥</div>
            <h3>暂无用户数据</h3>
            <p>点击刷新按钮加载</p>
        </div>

        <!-- 分页 -->
        <div v-if="userList.length > pageSize" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;">
            <button @click="userPage=Math.max(1,userPage-1)" :disabled="userPage===1" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ userPage }} / {{ userTotalPages }} 页</span>
            <button @click="userPage=Math.min(userTotalPages,userPage+1)" :disabled="userPage>=userTotalPages" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 图书管理 ==================== -->
    <div v-show="currentTab === 'books'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';marginTop:20px;">
        <h2 style="color:#28a745;marginBottom:20px;">📚 图书列表（共 {{ bookList.length }} 本）</h2>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="bookList.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">书名</th>
                    <th style="padding:12px;textAlign:left;">作者</th>
                    <th style="padding:12px;textAlign:left;">价格</th>
                    <th style="padding:12px;textAlign:left;">成色</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in paginatedBooks" :key="book.id" style="borderBottom:'1px solid #eee';">
                    <td style="padding:12px;">{{ book.id }}</td>
                    <td style="padding:12px;fontWeight:bold;color:#1976d2;">{{ book.name }}</td>
                    <td style="padding:12px;">{{ book.author || '-' }}</td>
                    <td style="padding:12px;color:#28a745;fontWeight:bold;">¥{{ Number(book.price||0).toFixed(2) }}</td>
                    <td style="padding:12px;"><span style="padding:3px 8px;background:#fff3cd;color:#856404;borderRadius:4px;fontSize:11px;">{{ book.level || '-' }}</span></td>
                    <td style="padding:12px;">
                        <button @click="deleteBook(book.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">📚</div>
            <h3>暂无图书数据</h3>
            <p>点击刷新按钮加载</p>
        </div>

        <!-- 分页 -->
        <div v-if="bookList.length > pageSize" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;">
            <button @click="bookPage=Math.max(1,bookPage-1)" :disabled="bookPage===1" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ bookPage }} / {{ bookTotalPages }} 页</span>
            <button @click="bookPage=Math.min(bookTotalPages,bookPage+1)" :disabled="bookPage>=bookTotalPages" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 订单管理 ==================== -->
    <div v-show="currentTab === 'orders'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';marginTop:20px;">
        <h2 style="color:#17a2b8;marginBottom:20px;">📦 订单列表（共 {{ orderList.length }} 条）</h2>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="orderList.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">订单号</th>
                    <th style="padding:12px;textAlign:left;">买家ID</th>
                    <th style="padding:12px;textAlign:left;">卖家ID</th>
                    <th style="padding:12px;textAlign:left;">金额</th>
                    <th style="padding:12px;textAlign:left;">状态</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in paginatedOrders" :key="order.id" style="borderBottom:'1px solid #eee';">
                    <td style="padding:12px;">{{ order.id }}</td>
                    <td style="padding:12px;fontFamily:monospace;fontSize:12px;">{{ order.orderNo || '-' }}</td>
                    <td style="padding:12px;">{{ order.buyerId || '-' }}</td>
                    <td style="padding:12px;">{{ order.sellerId || '-' }}</td>
                    <td style="padding:12px;color:#28a745;fontWeight:bold;">¥{{ Number(order.totalPrice||0).toFixed(2) }}</td>
                    <td style="padding:12px;">
                        <span :style="{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',color:'white',background:getStatusColor(order.status)}">
                            {{ getStatusText(order.status) }}
                        </span>
                    </td>
                    <td style="padding:12px;">
                        <button @click="deleteOrder(order.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">📭</div>
            <h3>暂无订单数据</h3>
            <p>点击刷新按钮加载</p>
        </div>

        <!-- 分页 -->
        <div v-if="orderList.length > pageSize" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;">
            <button @click="orderPage=Math.max(1,orderPage-1)" :disabled="orderPage===1" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ orderPage }} / {{ orderTotalPages }} 页</span>
            <button @click="orderPage=Math.min(orderTotalPages,orderPage+1)" :disabled="orderPage>=orderTotalPages" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 评论管理 ==================== -->
    <div v-show="currentTab === 'comments'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';marginTop:20px;">
        <h2 style="color:#ffc107;marginBottom:20px;">💬 评论列表（共 {{ commentList.length }} 条）</h2>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="commentList.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">用户ID</th>
                    <th style="padding:12px;textAlign:left;">图书ID</th>
                    <th style="padding:12px;textAlign:left;">评分</th>
                    <th style="padding:12px;textAlign:left;">内容</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="comment in paginatedComments" :key="comment.id" style="borderBottom:'1px solid #eee';">
                    <td style="padding:12px;">{{ comment.id }}</td>
                    <td style="padding:12px;">{{ comment.userId || '-' }}</td>
                    <td style="padding:12px;">{{ comment.bookId || '-' }}</td>
                    <td style="padding:12px;"><span style="color:#ffc107;">{{ '★'.repeat(comment.score||0) }}{{ '☆'.repeat(5-(comment.score||0)) }}</span></td>
                    <td style="padding:12px;maxWidth:300px;">{{ (comment.content||'-').substring(0,50) }}...</td>
                    <td style="padding:12px;">
                        <button @click="deleteComment(comment.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">💬</div>
            <h3>暂无评论数据</h3>
            <p>点击刷新按钮加载</p>
        </div>

        <!-- 分页 -->
        <div v-if="commentList.length > pageSize" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;">
            <button @click="commentPage=Math.max(1,commentPage-1)" :disabled="commentPage===1" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ commentPage }} / {{ commentTotalPages }} 页</span>
            <button @click="commentPage=Math.min(commentTotalPages,commentPage+1)" :disabled="commentPage>=commentTotalPages" style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>
</div>
`,

data() {
    return {
        currentTab: 'users',
        loading: false,
        pageSize: 20,
        
        userPage: 1,
        bookPage: 1,
        orderPage: 1,
        commentPage: 1,
        
        userList: [],
        bookList: [],
        orderList: [],
        commentList: []
    };
},

computed: {
    paginatedUsers() {
        const start = (this.userPage - 1) * this.pageSize;
        return this.userList.slice(start, start + this.pageSize);
    },
    
    paginatedBooks() {
        const start = (this.bookPage - 1) * this.pageSize;
        return this.bookList.slice(start, start + this.pageSize);
    },
    
    paginatedOrders() {
        const start = (this.orderPage - 1) * this.pageSize;
        return this.orderList.slice(start, start + this.pageSize);
    },
    
    paginatedComments() {
        const start = (this.commentPage - 1) * this.pageSize;
        return this.commentList.slice(start, start + this.pageSize);
    },
    
    userTotalPages() {
        return Math.ceil(this.userList.length / this.pageSize) || 1;
    },
    
    bookTotalPages() {
        return Math.ceil(this.bookList.length / this.pageSize) || 1;
    },
    
    orderTotalPages() {
        return Math.ceil(this.orderList.length / this.pageSize) || 1;
    },
    
    commentTotalPages() {
        return Math.ceil(this.commentList.length / this.pageSize) || 1;
    }
},

mounted() {
    console.log('✅ Admin mounted');
    this.loadAllData();
},

methods: {
    async loadAllData() {
        console.log('🔄 Loading data...');
        this.loading = true;
        
        try {
            const [usersRes, booksRes, ordersRes, commentsRes] = await Promise.all([
                api.adminGet('/admin/users').catch(e => { console.error('Users error:', e); return []; }),
                api.adminGet('/admin/books').catch(e => { console.error('Books error:', e); return []; }),
                api.adminGet('/admin/orders').catch(e => { console.error('Orders error:', e); return []; }),
                api.adminGet('/admin/comments').catch(e => { console.error('Comments error:', e); return []; })
            ]);
            
            this.userList = usersRes || [];
            this.bookList = (booksRes || []).filter(b => String(b.status) === '1');
            this.orderList = ordersRes || [];
            this.commentList = commentsRes || [];
            
            console.log(`✅ Data loaded: ${this.userList.length} users, ${this.bookList.length} books, ${this.orderList.length} orders, ${this.commentList.length} comments`);
        } catch(e) {
            console.error('❌ Load error:', e);
            alert('加载数据失败: ' + e.message);
        } finally {
            this.loading = false;
        }
    },

    getStatusColor(status) {
        const colors = {'pending':'#ffc107','shipped':'#17a2b8','received':'#28a745','cancelled':'#dc3545'};
        return colors[status] || '#6c757d';
    },

    getStatusText(status) {
        const texts = {'pending':'待发货','shipped':'已发货','received':'已收货','cancelled':'已取消'};
        return texts[status] || status || '未知';
    },

    async deleteUser(userId) {
        if(!confirm('确定删除该用户？')) return;
        try {
            await api.adminDel(`/admin/user/${userId}`);
            alert('✅ 删除成功');
            await this.loadAllData();
        } catch(e) {
            alert('❌ 删除失败: ' + e.message);
        }
    },

    async deleteBook(bookId) {
        if(!confirm('确定删除该图书？')) return;
        try {
            await api.adminDel(`/admin/book/${bookId}`);
            alert('✅ 删除成功');
            await this.loadAllData();
        } catch(e) {
            alert('❌ 删除失败: ' + e.message);
        }
    },

    async deleteOrder(orderId) {
        if(!confirm('确定删除该订单？')) return;
        try {
            await api.adminDel(`/admin/order/${orderId}`);
            alert('✅ 删除成功');
            await this.loadAllData();
        } catch(e) {
            alert('❌ 删除失败: ' + e.message);
        }
    },

    async deleteComment(commentId) {
        if(!confirm('确定删除该评论？')) return;
        try {
            await api.adminDel(`/admin/comment/${commentId}`);
            alert('✅ 删除成功');
            await this.loadAllData();
        } catch(e) {
            alert('❌ 删除失败: ' + e.message);
        }
    }
}
};
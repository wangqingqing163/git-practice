const Admin = {
    template: `
<div style="max-width:1200px;margin:0 auto;padding:20px;">
    <h1 style="color:#333;margin-bottom:25px;font-size:32px;">📊 管理员后台</h1>

    <!-- 统计卡片 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:30px;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-if="stats.users > 0">{{ stats.users }}</div>
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-else>{{ userList.length }}</div>
            <div style="font-size:18px;opacity:0.95;font-weight:500;">👥 用户总数</div>
            <div style="font-size:13px;margin-top:5px;opacity:0.8;">活跃用户管理</div>
        </div>
        <div style="background:linear-gradient(135deg,#f093fb,#f5576c);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-if="stats.books > 0">{{ stats.books }}</div>
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-else>{{ bookList.length }}</div>
            <div style="font-size:18px;opacity:0.95;font-weight:500;">📚 图书总数</div>
            <div style="font-size:13px;margin-top:5px;opacity:0.8;">在售图书管理</div>
        </div>
        <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-if="stats.orders > 0">{{ stats.orders }}</div>
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-else>{{ orderList.length }}</div>
            <div style="font-size:18px;opacity:0.95;font-weight:500;">📦 订单总数</div>
            <div style="font-size:13px;margin-top:5px;opacity:0.8;">交易订单追踪</div>
        </div>
        <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;padding:30px 20px;border-radius:12px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-if="stats.comments > 0">{{ stats.comments }}</div>
            <div style="font-size:48px;font-weight:bold;margin-bottom:8px;" v-else>{{ commentList.length }}</div>
            <div style="font-size:18px;opacity:0.95;font-weight:500;">💬 评论总数</div>
            <div style="font-size:13px;margin-top:5px;opacity:0.8;">用户评价反馈</div>
        </div>
    </div>

    <!-- 标签切换 -->
    <div style="margin-bottom:25px;display:flex;gap:10px;">
        <button @click="currentTab='users'" :style="{background:currentTab==='users'?'#c41a1a':'#f5f5f5',color:currentTab==='users'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">用户管理</button>
        <button @click="currentTab='books'" :style="{background:currentTab==='books'?'#c41a1a':'#f5f5f5',color:currentTab==='books'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">图书管理</button>
        <button @click="currentTab='orders'" :style="{background:currentTab==='orders'?'#c41a1a':'#f5f5f5',color:currentTab==='orders'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">订单管理</button>
        <button @click="currentTab='comments'" :style="{background:currentTab==='comments'?'#c41a1a':'#f5f5f5',color:currentTab==='comments'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">评论管理</button>
        <button @click="loadAllData()" style="background:#007bff;color:white;padding:10px 24px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">🔄 刷新数据</button>
    </div>

    <!-- 搜索和筛选工具栏 -->
    <div style="background:white;padding:18px;borderRadius:8px;marginBottom:20px;boxShadow:'0 1px 3px rgba(0,0,0,0.08)';display:flex;gap:12px;alignItems:center;">
        <input v-model="searchText" type="text" placeholder="🔍 搜索..." style="flex:1;padding:10px 16px;border:'1px solid #ddd';borderRadius:6px;fontSize:14px;" @input="handleSearch">
        <select v-if="currentTab==='orders'" v-model="orderStatusFilter" style="padding:10px;border:'1px solid #ddd';borderRadius:6px;fontSize:14px;">
            <option value="">所有状态</option>
            <option value="pending">待发货</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
        </select>
    </div>

    <!-- ==================== 订单管理 ==================== -->
    <div v-show="currentTab === 'orders'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';">
        <div style="display:flex;justifyContent:spaceBetween;alignItems:center;marginBottom:20px;">
            <h2 style="color:#28a745;fontSize:24px;margin:0;">📦 订单列表（共 {{ getFilteredOrders().length }} 条）</h2>
            <button v-if="selectedOrders.length > 0" @click="batchDeleteOrders()" style="background:#dc3545;color:white;padding:8px 16px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">🗑️ 批量删除 ({{ selectedOrders.length }})</button>
        </div>

        <div v-if="getFilteredOrders().length === 0" style="textAlign:center;padding:60px;color:#999;">
            <div style="fontSize:64px;marginBottom:20px;">📭</div>
            <h3 style="fontSize:18px;marginBottom:10px;">暂无订单数据</h3>
            <p>点击刷新按钮加载数据</p>
        </div>

        <table v-else style="width:100%;borderCollapse:collapse;background:white;boxShadow:'0 1px 3px rgba(0,0,0,0.08)';borderRadius:8px;overflow:hidden;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:14px;width:40px;"><input type="checkbox" @change="toggleSelectAllOrders"></th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">订单号</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">买家</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">卖家</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">金额</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">状态</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in getFilteredOrders()" :key="'o'+index" style="borderBottom:'1px solid #e9ecef';" @mouseenter="$event.currentTarget.style.background='#f8f9fa'" @mouseleave="$event.currentTarget.style.background='white'">
                    <td style="padding:13px;textAlign:center;"><input type="checkbox" :value="order.id" v-model="selectedOrders"></td>
                    <td style="padding:13px;"><strong>{{ order.id }}</strong></td>
                    <td style="padding:13px;fontFamily:'monospace';fontSize:12px;color:#666;">{{ order.orderNo || '-' }}</td>
                    <td style="padding:13px;">{{ order.buyerId || '-' }}</td>
                    <td style="padding:13px;">{{ order.sellerId || '-' }}</td>
                    <td style="padding:13px;color:#28a745;fontWeight:bold;">¥{{ (order.totalPrice || 0).toFixed(2) }}</td>
                    <td style="padding:13px;">
                        <span :style="{display:'inline-block',padding:'4px 12px',background:getStatusColor(order.orderStatus||order.status),color:'white',borderRadius:'12px',fontSize:'12px',fontWeight:'600'}">
                            {{ getStatusText(order.orderStatus||order.status) }}
                        </span>
                    </td>
                    <td style="padding:13px;">
                        <button @click="deleteOrder(order.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;" title="删除订单">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ==================== 评论管理 ==================== -->
    <div v-show="currentTab === 'comments'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';marginTop:25px;">
        <div style="display:flex;justifyContent:spaceBetween;alignItems:center;marginBottom:20px;">
            <h2 style="color:#17a2b8;fontSize:24px;margin:0;">💬 评论列表（共 {{ getFilteredComments().length }} 条）</h2>
            <button v-if="selectedComments.length > 0" @click="batchDeleteComments()" style="background:#dc3545;color:white;padding:8px 16px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">🗑️ 批量删除 ({{ selectedComments.length }})</button>
        </div>

        <div v-if="getFilteredComments().length === 0" style="textAlign:center;padding:60px;color:#999;">
            <div style="fontSize:64px;marginBottom:20px;">💬</div>
            <h3 style="fontSize:18px;marginBottom:10px;">暂无评论数据</h3>
            <p>点击刷新按钮加载数据</p>
        </div>

        <table v-else style="width:100%;borderCollapse:collapse;background:white;boxShadow:'0 1px 3px rgba(0,0,0,0.08)';borderRadius:8px;overflow:hidden;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:14px;width:40px;"><input type="checkbox" @change="toggleSelectAllComments"></th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">用户ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">图书ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">评分</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">内容</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">时间</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(comment, index) in getFilteredComments()" :key="'c'+index" style="borderBottom:'1px solid #e9ecef';" @mouseenter="$event.currentTarget.style.background='#f8f9fa'" @mouseleave="$event.currentTarget.style.background='white'">
                    <td style="padding:13px;textAlign:center;"><input type="checkbox" :value="comment.id" v-model="selectedComments"></td>
                    <td style="padding:13px;"><strong>{{ comment.id }}</strong></td>
                    <td style="padding:13px;">{{ comment.userId || '-' }}</td>
                    <td style="padding:13px;">{{ comment.bookId || '-' }}</td>
                    <td style="padding:13px;">
                        <span style="color:#ffc107;fontSize:18px;">{{ '★'.repeat(comment.score || 0) }}</span>
                        <span style="color:#ddd;fontSize:18px;">{{ '☆'.repeat(5-(comment.score||0)) }}</span>
                    </td>
                    <td style="padding:13px;maxWidth:400px;lineHeight:1.5;">{{ comment.content || '-' }}</td>
                    <td style="padding:13px;fontSize:12px;color:#888;">{{ comment.createTime || '-' }}</td>
                    <td style="padding:13px;">
                        <button @click="deleteComment(comment.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;" title="删除评论">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ==================== 用户管理 ==================== -->
    <div v-show="currentTab === 'users'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';">
        <div style="display:flex;justifyContent:spaceBetween;alignItems:center;marginBottom:20px;">
            <h2 style="color:#c41a1a;fontSize:24px;margin:0;">👥 用户列表（共 {{ userList.length }} 人）</h2>
            <button @click="showUserModal=true;editingUser=null;userForm={username:'',phone:'',password:'',role:'user'}" style="background:#28a745;color:white;padding:10px 20px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">➕ 新增用户</button>
        </div>

        <!-- 用户表单弹窗 -->
        <div v-if="showUserModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justifyContent:center;alignItems:center;zIndex:9999;" @click.self="showUserModal=false">
            <div style="background:white;padding:30px;borderRadius:12px;width:500px;maxWidth:90%;">
                <h3 style="marginBottom:20px;color:#333;">{{ editingUser ? '✏️ 编辑用户' : '➕ 新增用户' }}</h3>
                <form @submit.prevent="saveUser">
                    <div style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">👤 用户名 *</label>
                        <input type="text" v-model="userForm.username" required style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">📱 手机号 *</label>
                        <input type="tel" v-model="userForm.phone" required pattern="[0-9]{11}" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div v-if="!editingUser" style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">🔒 密码 *</label>
                        <input type="password" v-model="userForm.password" required minLength="6" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div style="marginBottom:20px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">🎭 角色</label>
                        <select v-model="userForm.role" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                            <option value="user">普通用户</option>
                            <option value="admin">管理员</option>
                        </select>
                    </div>
                    <div style="display:flex;gap:10px;justifyContent:flexEnd;">
                        <button type="button" @click="showUserModal=false" style="padding:10px 24px;background:#6c757d;color:white;border:none;borderRadius:6px;cursor:pointer;">取消</button>
                        <button type="submit" style="padding:10px 24px;background:#c41a1a;color:white;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">💾 保存</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="userList.length === 0" style="textAlign:center;padding:60px;color:#999;">
            <div style="fontSize:64px;marginBottom:20px;">👥</div>
            <h3 style="FontSize:18px;marginBottom:10px;">暂无用户数据</h3>
            <p>点击刷新按钮加载数据</p>
        </div>

        <table v-else style="width:100%;borderCollapse:collapse;background:white;boxShadow:'0 1px 3px rgba(0,0,0,0.08)';borderRadius:8px;overflow:hidden;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">用户名</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">手机号</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">角色</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">注册时间</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in userList" :key="'u'+index" style="borderBottom:'1px solid #e9ecef';" @mouseenter="$event.currentTarget.style.background='#f8f9fa'" @mouseleave="$event.currentTarget.style.background='white'">
                    <td style="padding:13px;"><strong>{{ user.id }}</strong></td>
                    <td style="padding:13px;">{{ user.username || '-' }}</td>
                    <td style="padding:13px;">{{ user.phone || '-' }}</td>
                    <td style="padding:13px;">
                        <span :style="{display:'inline-block',padding:'4px 12px',background:user.role==='admin'?'#dc3545':'#28a745',color:'white',borderRadius:'12px',fontSize:'12px',fontWeight:'600'}">
                            {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                        </span>
                    </td>
                    <td style="padding:13px;fontSize:12px;color:#888;">{{ user.createTime || '-' }}</td>
                    <td style="padding:13px;">
                        <button @click="editUser(user)" style="background:#007bff;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;marginRight:5px;" title="编辑">✏️</button>
                        <button @click="deleteUser(user.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;" title="删除">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ==================== 图书管理 ==================== -->
    <div v-show="currentTab === 'books'" style="background:white;padding:25px;borderRadius:10px;boxShadow:'0 2px 8px rgba(0,0,0,0.1)';marginTop:25px;">
        <div style="display:flex;justifyContent:spaceBetween;alignItems:center;marginBottom:20px;">
            <h2 style="color:#c41a1a;fontSize:24px;margin:0;">📚 图书列表（共 {{ bookList.length }} 本）</h2>
            <button @click="showBookModal=true;editingBook=null;bookForm={name:'',author:'',price:'',level:'全新',categoryId:null,sellerId:''}" style="background:#28a745;color:white;padding:10px 20px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">➕ 新增图书</button>
        </div>

        <!-- 图书表单弹窗 -->
        <div v-if="showBookModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justifyContent:center;alignItems:center;zIndex:9999;" @click.self="showBookModal=false">
            <div style="background:white;padding:30px;borderRadius:12px;width:550px;maxWidth:90%;maxHeight:90vh;overflowY:auto;">
                <h3 style="marginBottom:20px;color:#333;">{{ editingBook ? '✏️ 编辑图书' : '➕ 新增图书' }}</h3>
                <form @submit.prevent="saveBook">
                    <div style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">📖 书名 *</label>
                        <input type="text" v-model="bookForm.name" required style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">✍️ 作者</label>
                        <input type="text" v-model="bookForm.author" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div style="display:grid;gridTemplateColumns:1fr 1fr;gap:15px;marginBottom:15px;">
                        <div>
                            <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">💰 价格 *</label>
                            <input type="number" step="0.01" v-model.number="bookForm.price" required min="0" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                        </div>
                        <div>
                            <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">⭐ 成色</label>
                            <select v-model="bookForm.level" style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                                <option value="全新">全新</option>
                                <option value="九五新">九五新</option>
                                <option value="九成新">九成新</option>
                                <option value="八成新">八成新</option>
                                <option value="七成新">七成新</option>
                                <option value="六成新">六成新</option>
                            </select>
                        </div>
                    </div>
                    <div style="marginBottom:15px;">
                        <label style="display:block;marginBottom:5px;fontWeight:600;color:#333;">👤 卖家ID *</label>
                        <input type="number" v-model.number="bookForm.sellerId" required style="width:100%;padding:10px;border:1px solid #ddd;borderRadius:6px;fontSize:14px;">
                    </div>
                    <div style="marginBottom:20px;">
                        <label style="display:flex;alignItems:center;gap:8px;cursor:pointer;">
                            <input type="checkbox" v-model="bookForm.status" true-value="在售" false-value="下架" style="width:18px;height:18px;">
                            <span style="fontWeight:600;color:#333;">在售状态</span>
                        </label>
                    </div>
                    <div style="display:flex;gap:10px;justifyContent:flexEnd;">
                        <button type="button" @click="showBookModal=false" style="padding:10px 24px;background:#6c757d;color:white;border:none;borderRadius:6px;cursor:pointer;">取消</button>
                        <button type="submit" style="padding:10px 24px;background:#c41a1a;color:white;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">💾 保存</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="bookList.length === 0" style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">📚</div>
            <h3 style="FontSize:18px;marginBottom:10px;">暂无图书数据</h3>
            <p>点击刷新按钮加载数据</p>
        </div>

        <table v-else style="width:100%;borderCollapse:collapse;background:white;boxShadow:'0 1px 3px rgba(0,0,0,0.08)';borderRadius:8px;overflow:hidden;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">ID</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">书名</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">作者</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">价格</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">成色</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">状态</th>
                    <th style="padding:14px;textAlign:left;fontWeight:600;color:#495057;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in bookList" :key="'b'+index" style="borderBottom:'1px solid #e9ecef';" @mouseenter="$event.currentTarget.style.background='#f8f9fa'" @mouseleave="$event.currentTarget.style.background='white'">
                    <td style="padding:13px;"><strong>{{ book.id }}</strong></td>
                    <td style="padding:13px;fontWeight:500;">{{ book.name || '-' }}</td>
                    <td style="padding:13px;color:#666;">{{ book.author || '-' }}</td>
                    <td style="padding:13px;color:#28a745;fontWeight:bold;">¥{{ (book.price || 0).toFixed(2) }}</td>
                    <td style="padding:13px;">
                        <span :style="{display:'inline-block',padding:'4px 8px',background:'#e9ecef',color:'#495057',borderRadius:'6px',fontSize:'12px'}">
                            {{ book.level || '未知' }}
                        </span>
                    </td>
                    <td style="padding:13px;">
                        <span :style="{display:'inline-block',padding:'4px 12px',background:(book.status==='在售')?'#28a745':'#dc3545',color:'white',borderRadius:'12px',fontSize:'12px',fontWeight:'600'}">
                            {{ book.status || '未知' }}
                        </span>
                    </td>
                    <td style="padding:13px;">
                        <button @click="editBook(book)" style="background:#007bff;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;marginRight:5px;" title="编辑">✏️</button>
                        <button @click="deleteBook(book.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;" title="删除">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
`,

data() {
    return {
        currentTab: 'orders',
        stats: { users: 0, books: 0, orders: 0, comments: 0 },
        orderList: [],
        commentList: [],
        userList: [],
        bookList: [],
        searchText: '',
        orderStatusFilter: '',
        selectedOrders: [],
        selectedComments: [],

        showUserModal: false,
        showBookModal: false,
        editingUser: null,
        editingBook: null,
        userForm: { username: '', phone: '', password: '', role: 'user' },
        bookForm: { name: '', author: '', price: '', level: '全新', categoryId: null, sellerId: '', status: '在售' }
    };
},

async mounted() {
    console.log('✅ Admin组件已挂载');
    await this.loadAllData();
},

methods: {
    async loadAllData() {
        console.log('🔄 开始加载所有数据...');

        try {
            const [statsRes, usersRes, booksRes, ordersRes, commentsRes] = await Promise.all([
                api.adminGet('/admin/stats').catch(e => ({ users: 0, books: 0, orders: 0, comments: 0 })),
                api.adminGet('/admin/users').catch(e => []),
                api.adminGet('/admin/books').catch(e => []),
                api.adminGet('/admin/orders').catch(e => []),
                api.adminGet('/admin/comments').catch(e => [])
            ]);

            this.stats = statsRes;
            this.userList = Array.isArray(usersRes) ? usersRes : [];
            this.bookList = Array.isArray(booksRes) ? booksRes : [];
            this.orderList = Array.isArray(ordersRes) ? ordersRes : [];
            this.commentList = Array.isArray(commentsRes) ? commentsRes : [];

            console.log('✅ 数据加载完成:');
            console.log('- 用户:', this.userList.length, '条');
            console.log('- 图书:', this.bookList.length, '条');
            console.log('- 订单:', this.orderList.length, '条');
            console.log('- 评论:', this.commentList.length, '条');

        } catch (error) {
            console.error('❌ 加载数据失败:', error);
        }
    },

    handleSearch() {
        console.log('搜索:', this.searchText);
    },

    toggleSelectAllOrders(event) {
        if (event.target.checked) {
            this.selectedOrders = this.getFilteredOrders().map(o => o.id);
        } else {
            this.selectedOrders = [];
        }
    },

    toggleSelectAllComments(event) {
        if (event.target.checked) {
            this.selectedComments = this.getFilteredComments().map(c => c.id);
        } else {
            this.selectedComments = [];
        }
    },

    getFilteredOrders() {
        let filtered = this.orderList;
        
        if (this.searchText) {
            filtered = filtered.filter(order =>
                order.id.toString().includes(this.searchText) ||
                (order.orderNo && order.orderNo.toLowerCase().includes(this.searchText.toLowerCase()))
            );
        }

        if (this.orderStatusFilter) {
            filtered = filtered.filter(order =>
                order.orderStatus === this.orderStatusFilter || order.status === this.orderStatusFilter
            );
        }

        return filtered;
    },

    getFilteredComments() {
        if (!this.searchText) return this.commentList;

        return this.commentList.filter(comment =>
            comment.id.toString().includes(this.searchText) ||
            (comment.content && comment.content.includes(this.searchText))
        );
    },

    async deleteOrder(orderId) {
        if (!confirm('确定要删除这个订单吗？')) return;

        try {
            await api.adminDel(`/admin/orders/${orderId}`);
            this.orderList = this.orderList.filter(o => o.id !== orderId);
            alert('订单删除成功！');
        } catch (e) {
            alert('删除失败：' + e.message);
        }
    },

    async batchDeleteOrders() {
        if (this.selectedOrders.length === 0) {
            alert('请先选择要删除的订单');
            return;
        }

        if (!confirm(`确定要删除选中的 ${this.selectedOrders.length} 个订单吗？`)) return;

        try {
            for (const orderId of this.selectedOrders) {
                await api.adminDel(`/admin/orders/${orderId}`);
            }
            this.orderList = this.orderList.filter(o => !this.selectedOrders.includes(o.id));
            this.selectedOrders = [];
            alert('批量删除成功！');
        } catch (e) {
            alert('批量删除失败：' + e.message);
        }
    },

    async deleteComment(commentId) {
        if (!confirm('确定要删除这条评论吗？')) return;

        try {
            await api.adminDel(`/admin/comments/${commentId}`);
            this.commentList = this.commentList.filter(c => c.id !== commentId);
            alert('评论删除成功！');
        } catch (e) {
            alert('删除失败：' + e.message);
        }
    },

    async batchDeleteComments() {
        if (this.selectedComments.length === 0) {
            alert('请先选择要删除的评论');
            return;
        }

        if (!confirm(`确定要删除选中的 ${this.selectedComments.length} 条评论吗？`)) return;

        try {
            for (const commentId of this.selectedComments) {
                await api.adminDel(`/admin/comments/${commentId}`);
            }
            this.commentList = this.commentList.filter(c => !this.selectedComments.includes(c.id));
            this.selectedComments = [];
            alert('批量删除成功！');
        } catch (e) {
            alert('批量删除失败：' + e.message);
        }
    },

    getStatusColor(status) {
        const colors = {
            'pending': '#ffc107',
            'shipped': '#17a2b8',
            'completed': '#28a745',
            'cancelled': '#dc3545'
        };
        return colors[status] || '#6c757d';
    },

    getStatusText(status) {
        const texts = {
            'pending': '待发货',
            'shipped': '已发货',
            'completed': '已完成',
            'cancelled': '已取消'
        };
        return texts[status] || status || '未知';
    },

    // ==================== 用户管理方法 ====================
    editUser(user) {
        this.editingUser = user;
        this.userForm = { ...user, password: '' };
        this.showUserModal = true;
    },

    async saveUser() {
        try {
            if (this.editingUser) {
                await api.adminPut(`/admin/users/${this.editingUser.id}`, this.userForm);
                Object.assign(this.editingUser, this.userForm);
                alert('✅ 用户更新成功！');
            } else {
                const newUser = await api.adminPost('/admin/users', this.userForm);
                this.userList.push(newUser);
                alert('✅ 用户创建成功！');
            }
            this.showUserModal = false;
            await this.loadAllData();
        } catch (e) {
            alert('❌ 操作失败：' + (e.message || e));
        }
    },

    async deleteUser(userId) {
        if (!confirm('确定要删除这个用户吗？')) return;

        try {
            await api.adminDel(`/admin/users/${userId}`);
            this.userList = this.userList.filter(u => u.id !== userId);
            alert('✅ 用户删除成功！');
        } catch (e) {
            alert('❌ 删除失败：' + (e.message || e));
        }
    },

    // ==================== 图书管理方法 ====================
    editBook(book) {
        this.editingBook = book;
        this.bookForm = { ...book };
        this.showBookModal = true;
    },

    async saveBook() {
        try {
            if (this.editingBook) {
                await api.adminPut(`/admin/books/${this.editingBook.id}`, this.bookForm);
                Object.assign(this.editingBook, this.bookForm);
                alert('✅ 图书更新成功！');
            } else {
                const newBook = await api.adminPost('/admin/books', this.bookForm);
                this.bookList.push(newBook);
                alert('✅ 图书创建成功！');
            }
            this.showBookModal = false;
            await this.loadAllData();
        } catch (e) {
            alert('❌ 操作失败：' + (e.message || e));
        }
    },

    async deleteBook(bookId) {
        if (!confirm('确定要删除这本图书吗？')) return;

        try {
            await api.adminDel(`/admin/books/${bookId}`);
            this.bookList = this.bookList.filter(b => b.id !== bookId);
            alert('✅ 图书删除成功！');
        } catch (e) {
            alert('❌ 删除失败：' + (e.message || e));
        }
    }
}
};
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
    <div style="margin-bottom:25px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <button @click="currentTab='users'" :style="{background:currentTab==='users'?'#c41a1a':'#f5f5f5',color:currentTab==='users'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">👥 用户管理</button>
        <button @click="currentTab='books'" :style="{background:currentTab==='books'?'#c41a1a':'#f5f5f5',color:currentTab==='books'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">📚 图书管理</button>
        <button @click="currentTab='orders'" :style="{background:currentTab==='orders'?'#c41a1a':'#f5f5f5',color:currentTab==='orders'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">📦 订单管理</button>
        <button @click="currentTab='comments'" :style="{background:currentTab==='comments'?'#c41a1a':'#f5f5f5',color:currentTab==='comments'?'white':'#333',padding:'10px 24px',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}">💬 评论管理</button>
        <button @click="loadAllData()" style="background:#007bff;color:white;padding:10px 24px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">🔄 刷新数据</button>
    </div>

    <!-- ==================== 用户管理 ==================== -->
    <div v-show="currentTab === 'users'" style="background:white;padding:25px;borderRadius:10px;boxShadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#c41a1a;marginBottom:20px;">👥 用户列表（共 {{ filteredUsers.length }} 人）</h2>

        <!-- 搜索和筛选栏 -->
        <div style="marginBottom:20px;display:flex;gap:15px;flexWrap:wrap;alignItems:center;background:#f8f9fa;padding:15px;borderRadius:8px;">
            <input v-model="userSearch" type="text" placeholder="🔍 搜索用户名或手机号..." 
                   style="flex:1;minWidth:250px;padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;outline:none;" 
                   @input="userPage=1">
            
            <select v-model="userRoleFilter" @change="userPage=1" 
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部角色</option>
                <option value="0">普通用户</option>
                <option value="1">管理员</option>
            </select>

            <button @click="showAddUserModal=true" 
                    style="background:#28a745;color:white;padding:10px 20px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;fontSize:14px;">
                ➕ 添加用户
            </button>
        </div>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="fontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="filteredUsers.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortUsers('id')">
                        ID {{ userSortKey==='id'?(userSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortUsers('username')">
                        用户名 {{ userSortKey==='username'?(userSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">手机号</th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortUsers('role')">
                        角色 {{ userSortKey==='role'?(userSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" style="borderBottom:1px solid #eee;">
                    <td style="padding:12px;">{{ user.id }}</td>
                    <td style="padding:12px;fontWeight:bold;color:#c41a1a;">{{ user.username }}</td>
                    <td style="padding:12px;">{{ user.phone || '-' }}</td>
                    <td style="padding:12px;">
                        <span :style="{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',color:'white',background:user.role==1?'#dc3545':'#28a745'}">
                            {{ user.role == 1 ? '管理员' : '用户' }}
                        </span>
                    </td>
                    <td style="padding:12px;display:flex;gap:8px;">
                        <button @click="editUser(user)" style="background:#007bff;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">✏️ 编辑</button>
                        <button @click="deleteUser(user.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">👥</div>
            <h3>暂无用户数据</h3>
            <p>{{ userSearch || userRoleFilter ? '尝试调整筛选条件' : '点击刷新按钮加载或添加新用户' }}</p>
        </div>

        <!-- 分页 -->
        <div v-if="filteredUserTotalPages > 1" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;alignItems:center;">
            <button @click="userPage=Math.max(1,userPage-1)" :disabled="userPage===1" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ userPage }} / {{ filteredUserTotalPages }} 页 (共 {{ filteredUsers.length }} 条)</span>
            <button @click="userPage=Math.min(filteredUserTotalPages,userPage+1)" :disabled="userPage>=filteredUserTotalPages" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 图书管理 ==================== -->
    <div v-show="currentTab === 'books'" style="background:white;padding:25px;borderRadius:10px;boxShadow:0 2px 8px rgba(0,0,0,0.1);marginTop:20px;">
        <h2 style="color:#28a745;marginBottom:20px;">📚 图书列表（共 {{ filteredBooks.length }} 本）</h2>

        <!-- 搜索和筛选栏 -->
        <div style="marginBottom:20px;display:flex;gap:15px;flexWrap:wrap;alignItems:center;background:#f8f9fa;padding:15px;borderRadius:8px;">
            <input v-model="bookSearch" type="text" placeholder="🔍 搜索书名或作者..." 
                   style="flex:1;minWidth:250px;padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;outline:none;"
                   @input="bookPage=1">

            <select v-model="bookLevelFilter" @change="bookPage=1"
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部成色</option>
                <option value="全新">全新</option>
                <option value="几乎全新">几乎全新</option>
                <option value="轻微使用痕迹">轻微使用痕迹</option>
                <option value="明显使用痕迹">明显使用痕迹</option>
            </select>

            <select v-model="bookPriceFilter" @change="bookPage=1"
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部价格</option>
                <option value="0-50">¥50以下</option>
                <option value="50-100">¥50-100</option>
                <option value="100+">¥100以上</option>
            </select>

            <button @click="showAddBookModal=true" 
                    style="background:#28a745;color:white;padding:10px 20px;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;fontSize:14px;">
                ➕ 添加图书
            </button>
        </div>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="filteredBooks.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortBooks('id')">
                        ID {{ bookSortKey==='id'?(bookSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortBooks('name')">
                        书名 {{ bookSortKey==='name'?(bookSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">作者</th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortBooks('price')">
                        价格 {{ bookSortKey==='price'?(bookSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">成色</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in paginatedBooks" :key="book.id" style="borderBottom:1px solid #eee;">
                    <td style="padding:12px;">{{ book.id }}</td>
                    <td style="padding:12px;fontWeight:bold;color:#1976d2;">{{ book.name }}</td>
                    <td style="padding:12px;">{{ book.author || '-' }}</td>
                    <td style="padding:12px;color:#28a745;fontWeight:bold;">¥{{ Number(book.price||0).toFixed(2) }}</td>
                    <td style="padding:12px;"><span style="padding:3px 8px;background:#fff3cd;color:#856404;borderRadius:4px;fontSize:11px;">{{ book.level || '-' }}</span></td>
                    <td style="padding:12px;display:flex;gap:8px;">
                        <button @click="editBook(book)" style="background:#007bff;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">✏️ 编辑</button>
                        <button @click="deleteBook(book.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">📚</div>
            <h3>暂无图书数据</h3>
            <p>{{ bookSearch || bookLevelFilter || bookPriceFilter ? '尝试调整筛选条件' : '点击刷新按钮加载或添加新图书' }}</p>
        </div>

        <!-- 分页 -->
        <div v-if="filteredBookTotalPages > 1" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;alignItems:center;">
            <button @click="bookPage=Math.max(1,bookPage-1)" :disabled="bookPage===1" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ bookPage }} / {{ filteredBookTotalPages }} 页 (共 {{ filteredBooks.length }} 条)</span>
            <button @click="bookPage=Math.min(filteredBookTotalPages,bookPage+1)" :disabled="bookPage>=filteredBookTotalPages" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 订单管理 ==================== -->
    <div v-show="currentTab === 'orders'" style="background:white;padding:25px;borderRadius:10px;boxShadow:0 2px 8px rgba(0,0,0,0.1);marginTop:20px;">
        <h2 style="color:#17a2b8;marginBottom:20px;">📦 订单列表（共 {{ filteredOrders.length }} 条）</h2>

        <!-- 搜索和筛选栏 -->
        <div style="marginBottom:20px;display:flex;gap:15px;flexWrap:wrap;alignItems:center;background:#f8f9fa;padding:15px;borderRadius:8px;">
            <input v-model="orderSearch" type="text" placeholder="🔍 搜索订单号..." 
                   style="flex:1;minWidth:250px;padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;outline:none;"
                   @input="orderPage=1">

            <select v-model="orderStatusFilter" @change="orderPage=1"
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部状态</option>
                <option value="pending">待发货</option>
                <option value="shipped">已发货</option>
                <option value="received">已收货</option>
                <option value="cancelled">已取消</option>
            </select>

            <select v-model="orderPriceFilter" @change="orderPage=1"
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部金额</option>
                <option value="0-100">¥100以下</option>
                <option value="100-500">¥100-500</option>
                <option value="500+">¥500以上</option>
            </select>
        </div>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="filteredOrders.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">订单号</th>
                    <th style="padding:12px;textAlign:left;">买家ID</th>
                    <th style="padding:12px;textAlign:left;">卖家ID</th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortOrders('totalPrice')">
                        金额 {{ orderSortKey==='totalPrice'?(orderSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortOrders('status')">
                        状态 {{ orderSortKey==='status'?(orderSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in paginatedOrders" :key="order.id" style="borderBottom:1px solid #eee;">
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
                    <td style="padding:12px;display:flex;gap:8px;">
                        <button v-if="order.status==='pending'||order.status==='shipped'" @click="updateOrderStatus(order.id,'cancelled')" 
                                style="background:#6c757d;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">❌ 取消</button>
                        <button @click="deleteOrder(order.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">📭</div>
            <h3>暂无订单数据</h3>
            <p>{{ orderSearch || orderStatusFilter || orderPriceFilter ? '尝试调整筛选条件' : '点击刷新按钮加载' }}</p>
        </div>

        <!-- 分页 -->
        <div v-if="filteredOrderTotalPages > 1" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;alignItems:center;">
            <button @click="orderPage=Math.max(1,orderPage-1)" :disabled="orderPage===1" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ orderPage }} / {{ filteredOrderTotalPages }} 页 (共 {{ filteredOrders.length }} 条)</span>
            <button @click="orderPage=Math.min(filteredOrderTotalPages,orderPage+1)" :disabled="orderPage>=filteredOrderTotalPages" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ==================== 评论管理 ==================== -->
    <div v-show="currentTab === 'comments'" style="background:white;padding:25px;borderRadius:10px;boxShadow:0 2px 8px rgba(0,0,0,0.1);marginTop:20px;">
        <h2 style="color:#ffc107;marginBottom:20px;">💬 评论列表（共 {{ filteredComments.length }} 条）</h2>

        <!-- 搜索和筛选栏 -->
        <div style="marginBottom:20px;display:flex;gap:15px;flexWrap:wrap;alignItems:center;background:#f8f9fa;padding:15px;borderRadius:8px;">
            <input v-model="commentSearch" type="text" placeholder="🔍 搜索评论内容..." 
                   style="flex:1;minWidth:250px;padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;outline:none;"
                   @input="commentPage=1">

            <select v-model="commentScoreFilter" @change="commentPage=1"
                    style="padding:10px 15px;border:2px solid #dee2e6;borderRadius:6px;fontSize:14px;cursor:pointer;outline:none;">
                <option value="">全部评分</option>
                <option value="5">⭐⭐⭐⭐⭐ 5星</option>
                <option value="4">⭐⭐⭐⭐ 4星</option>
                <option value="3">⭐⭐⭐ 3星</option>
                <option value="2">⭐⭐ 2星</option>
                <option value="1">⭐ 1星</option>
            </select>
        </div>

        <div v-if="loading" style="textAlign:center;padding:40px;">
            <div style="FontSize:32px;marginBottom:10px;">⏳</div>
            <p>加载中...</p>
        </div>

        <table v-else-if="filteredComments.length > 0" style="width:100%;borderCollapse:collapse;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="padding:12px;textAlign:left;">ID</th>
                    <th style="padding:12px;textAlign:left;">用户ID</th>
                    <th style="padding:12px;textAlign:left;">图书ID</th>
                    <th style="padding:12px;textAlign:left;cursor:pointer;" @click="sortComments('score')">
                        评分 {{ commentSortKey==='score'?(commentSortOrder===1?'▲':'▼'):'' }}
                    </th>
                    <th style="padding:12px;textAlign:left;">内容</th>
                    <th style="padding:12px;textAlign:left;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="comment in paginatedComments" :key="comment.id" style="borderBottom:1px solid #eee;">
                    <td style="padding:12px;">{{ comment.id }}</td>
                    <td style="padding:12px;">{{ comment.userId || '-' }}</td>
                    <td style="padding:12px;">{{ comment.bookId || '-' }}</td>
                    <td style="padding:12px;"><span style="color:#ffc107;">{{ '★'.repeat(comment.score||0) }}{{ '☆'.repeat(5-(comment.score||0)) }}</span></td>
                    <td style="padding:12px;maxWidth:300px;">{{ comment.content || '-' }}</td>
                    <td style="padding:12px;">
                        <button @click="deleteComment(comment.id)" style="background:#dc3545;color:white;padding:6px 12px;border:none;borderRadius:4px;cursor:pointer;fontSize:12px;">🗑️ 删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else style="textAlign:center;padding:60px;color:#999;">
            <div style="FontSize:64px;marginBottom:20px;">💬</div>
            <h3>暂无评论数据</h3>
            <p>{{ commentSearch || commentScoreFilter ? '尝试调整筛选条件' : '点击刷新按钮加载' }}</p>
        </div>

        <!-- 分页 -->
        <div v-if="filteredCommentTotalPages > 1" style="marginTop:20px;display:flex;justifyContent:center;gap:10px;alignItems:center;">
            <button @click="commentPage=Math.max(1,commentPage-1)" :disabled="commentPage===1" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">◀️ 上一页</button>
            <span style="lineHeight:32px;">第 {{ commentPage }} / {{ filteredCommentTotalPages }} 页 (共 {{ filteredComments.length }} 条)</span>
            <button @click="commentPage=Math.min(filteredCommentTotalPages,commentPage+1)" :disabled="commentPage>=filteredCommentTotalPages" 
                    style="padding:8px 16px;background:#007bff;color:white;border:none;borderRadius:4px;cursor:pointer;">下一页 ▶️</button>
        </div>
    </div>

    <!-- ========== 添加/编辑用户弹窗 ========== -->
    <div v-if="showAddUserModal || showEditUserModal" 
         style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;alignItems:center;justifyContent:center;zIndex:9999;"
         @click.self="closeUserModal">
        <div style="background:white;padding:30px;borderRadius:12px;width:90%;maxWidth:500px;maxHeight:90vh;overflowY:auto;">
            <h3 style="marginBottom:20px;color:#c41a1a;">{{ showEditUserModal ? '✏️ 编辑用户' : '➕ 添加用户' }}</h3>
            
            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">用户名 *</label>
                <input v-model="currentUser.username" type="text" placeholder="请输入用户名"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div v-if="!showEditUserModal" style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">密码 *</label>
                <input v-model="currentUser.password" type="password" placeholder="请输入密码"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">手机号</label>
                <input v-model="currentUser.phone" type="text" placeholder="请输入手机号"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="marginBottom:20px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">角色 *</label>
                <select v-model.number="currentUser.role" 
                        style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
                    <option :value="0">普通用户</option>
                    <option :value="1">管理员</option>
                </select>
            </div>

            <div style="display:flex;gap:10px;justifyContent:flexEnd;">
                <button @click="closeUserModal" 
                        style="padding:10px 20px;background:#6c757d;color:white;border:none;borderRadius:6px;cursor:pointer;">取消</button>
                <button @click="saveUser" 
                        style="padding:10px 20px;background:#c41a1a;color:white;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">
                    {{ showEditUserModal ? '保存修改' : '确认添加' }}
                </button>
            </div>
        </div>
    </div>

    <!-- ========== 添加/编辑图书弹窗 ========== -->
    <div v-if="showAddBookModal || showEditBookModal" 
         style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;alignItems:center;justifyContent:center;zIndex:9999;"
         @click.self="closeBookModal">
        <div style="background:white;padding:30px;borderRadius:12px;width:90%;maxWidth:600px;maxHeight:90vh;overflowY:auto;">
            <h3 style="marginBottom:20px;color:#28a745;">{{ showEditBookModal ? '✏️ 编辑图书' : '➕ 添加图书' }}</h3>
            
            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">书名 *</label>
                <input v-model="currentBook.name" type="text" placeholder="请输入书名"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">作者</label>
                <input v-model="currentBook.author" type="text" placeholder="请输入作者"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">价格 * (元)</label>
                <input v-model.number="currentBook.price" type="number" step="0.01" min="0" placeholder="请输入价格"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">成色</label>
                <select v-model="currentBook.level" 
                        style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
                    <option value="">请选择成色</option>
                    <option value="全新">全新</option>
                    <option value="几乎全新">几乎全新</option>
                    <option value="轻微使用痕迹">轻微使用痕迹</option>
                    <option value="明显使用痕迹">明显使用痕迹</option>
                </select>
            </div>

            <div style="marginBottom:15px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">描述</label>
                <textarea v-model="currentBook.description" rows="3" placeholder="请输入图书描述"
                          style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;resize:vertical;"></textarea>
            </div>

            <div style="marginBottom:20px;">
                <label style="display:block;marginBottom:5px;fontWeight:bold;">卖家ID *</label>
                <input v-model.number="currentBook.sellerId" type="number" placeholder="请输入卖家ID"
                       style="width:100%;padding:10px;border:2px solid #dee2e6;borderRadius:6px;outline:none;">
            </div>

            <div style="display:flex;gap:10px;justifyContent:flexEnd;">
                <button @click="closeBookModal" 
                        style="padding:10px 20px;background:#6c757d;color:white;border:none;borderRadius:6px;cursor:pointer;">取消</button>
                <button @click="saveBook" 
                        style="padding:10px 20px;background:#28a745;color:white;border:none;borderRadius:6px;cursor:pointer;fontWeight:bold;">
                    {{ showEditBookModal ? '保存修改' : '确认添加' }}
                </button>
            </div>
        </div>
    </div>
</div>
`,

data() {
    return {
        currentTab: 'users',
        loading: false,
        pageSize: 10,

        // 用户相关
        userList: [],
        userPage: 1,
        userSearch: '',
        userRoleFilter: '',
        userSortKey: 'id',
        userSortOrder: -1,
        showAddUserModal: false,
        showEditUserModal: false,
        currentUser: { username: '', password: '', phone: '', role: 0 },

        // 图书相关
        bookList: [],
        bookPage: 1,
        bookSearch: '',
        bookLevelFilter: '',
        bookPriceFilter: '',
        bookSortKey: 'id',
        bookSortOrder: -1,
        showAddBookModal: false,
        showEditBookModal: false,
        currentBook: { name: '', author: '', price: 0, level: '', description: '', sellerId: '' },

        // 订单相关
        orderList: [],
        orderPage: 1,
        orderSearch: '',
        orderStatusFilter: '',
        orderPriceFilter: '',
        orderSortKey: 'id',
        orderSortOrder: -1,

        // 评论相关
        commentList: [],
        commentPage: 1,
        commentSearch: '',
        commentScoreFilter: '',
        commentSortKey: 'id',
        commentSortOrder: -1
    };
},

computed: {
    // 用户过滤和排序
    filteredUsers() {
        let list = [...this.userList];
        
        if (this.userSearch) {
            const search = this.userSearch.toLowerCase();
            list = list.filter(u => 
                (u.username && u.username.toLowerCase().includes(search)) ||
                (u.phone && u.phone.includes(search))
            );
        }

        if (this.userRoleFilter !== '') {
            list = list.filter(u => String(u.role) === this.userRoleFilter);
        }

        if (this.userSortKey) {
            list.sort((a, b) => {
                let valA = a[this.userSortKey];
                let valB = b[this.userSortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return -1 * this.userSortOrder;
                if (valA > valB) return 1 * this.userSortOrder;
                return 0;
            });
        }
        
        return list;
    },

    paginatedUsers() {
        const start = (this.userPage - 1) * this.pageSize;
        return this.filteredUsers.slice(start, start + this.pageSize);
    },

    filteredUserTotalPages() {
        return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
    },

    // 图书过滤和排序
    filteredBooks() {
        let list = [...this.bookList];

        if (this.bookSearch) {
            const search = this.bookSearch.toLowerCase();
            list = list.filter(b =>
                (b.name && b.name.toLowerCase().includes(search)) ||
                (b.author && b.author.toLowerCase().includes(search))
            );
        }

        if (this.bookLevelFilter) {
            list = list.filter(b => b.level === this.bookLevelFilter);
        }

        if (this.bookPriceFilter) {
            if (this.bookPriceFilter === '0-50') {
                list = list.filter(b => Number(b.price) < 50);
            } else if (this.bookPriceFilter === '50-100') {
                list = list.filter(b => Number(b.price) >= 50 && Number(b.price) <= 100);
            } else if (this.bookPriceFilter === '100+') {
                list = list.filter(b => Number(b.price) > 100);
            }
        }

        if (this.bookSortKey) {
            list.sort((a, b) => {
                let valA = a[this.bookSortKey];
                let valB = b[this.bookSortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return -1 * this.bookSortOrder;
                if (valA > valB) return 1 * this.bookSortOrder;
                return 0;
            });
        }

        return list;
    },

    paginatedBooks() {
        const start = (this.bookPage - 1) * this.pageSize;
        return this.filteredBooks.slice(start, start + this.pageSize);
    },

    filteredBookTotalPages() {
        return Math.ceil(this.filteredBooks.length / this.pageSize) || 1;
    },

    // 订单过滤和排序
    filteredOrders() {
        let list = [...this.orderList];

        if (this.orderSearch) {
            const search = this.orderSearch.toLowerCase();
            list = list.filter(o => o.orderNo && o.orderNo.toLowerCase().includes(search));
        }

        if (this.orderStatusFilter) {
            list = list.filter(o => o.status === this.orderStatusFilter);
        }

        if (this.orderPriceFilter) {
            if (this.orderPriceFilter === '0-100') {
                list = list.filter(o => Number(o.totalPrice) < 100);
            } else if (this.orderPriceFilter === '100-500') {
                list = list.filter(o => Number(o.totalPrice) >= 100 && Number(o.totalPrice) <= 500);
            } else if (this.orderPriceFilter === '500+') {
                list = list.filter(o => Number(o.totalPrice) > 500);
            }
        }

        if (this.orderSortKey) {
            list.sort((a, b) => {
                let valA = a[this.orderSortKey];
                let valB = b[this.orderSortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return -1 * this.orderSortOrder;
                if (valA > valB) return 1 * this.orderSortOrder;
                return 0;
            });
        }

        return list;
    },

    paginatedOrders() {
        const start = (this.orderPage - 1) * this.pageSize;
        return this.filteredOrders.slice(start, start + this.pageSize);
    },

    filteredOrderTotalPages() {
        return Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
    },

    // 评论过滤和排序
    filteredComments() {
        let list = [...this.commentList];

        if (this.commentSearch) {
            const search = this.commentSearch.toLowerCase();
            list = list.filter(c => c.content && c.content.toLowerCase().includes(search));
        }

        if (this.commentScoreFilter) {
            list = list.filter(c => String(c.score) === this.commentScoreFilter);
        }

        if (this.commentSortKey) {
            list.sort((a, b) => {
                let valA = a[this.commentSortKey];
                let valB = b[this.commentSortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return -1 * this.commentSortOrder;
                if (valA > valB) return 1 * this.commentSortOrder;
                return 0;
            });
        }

        return list;
    },

    paginatedComments() {
        const start = (this.commentPage - 1) * this.pageSize;
        return this.filteredComments.slice(start, start + this.pageSize);
    },

    filteredCommentTotalPages() {
        return Math.ceil(this.filteredComments.length / this.pageSize) || 1;
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

    // 排序方法
    sortUsers(key) {
        if (this.userSortKey === key) {
            this.userSortOrder *= -1;
        } else {
            this.userSortKey = key;
            this.userSortOrder = 1;
        }
    },

    sortBooks(key) {
        if (this.bookSortKey === key) {
            this.bookSortOrder *= -1;
        } else {
            this.bookSortKey = key;
            this.bookSortOrder = 1;
        }
    },

    sortOrders(key) {
        if (this.orderSortKey === key) {
            this.orderSortOrder *= -1;
        } else {
            this.orderSortKey = key;
            this.orderSortOrder = 1;
        }
    },

    sortComments(key) {
        if (this.commentSortKey === key) {
            this.commentSortOrder *= -1;
        } else {
            this.commentSortKey = key;
            this.commentSortOrder = 1;
        }
    },

    // ====== 用户操作 ======
    closeUserModal() {
        this.showAddUserModal = false;
        this.showEditUserModal = false;
        this.currentUser = { username: '', password: '', phone: '', role: 0 };
    },

    editUser(user) {
        this.currentUser = { ...user };
        this.showEditUserModal = true;
    },

    async saveUser() {
        if (!this.currentUser.username) {
            alert('请输入用户名');
            return;
        }

        try {
            if (this.showEditUserModal) {
                await api.adminPut(`/admin/user/${this.currentUser.id}`, this.currentUser);
                alert('✅ 用户信息更新成功');
            } else {
                if (!this.currentUser.password) {
                    alert('请输入密码');
                    return;
                }
                await api.adminPost('/admin/user', this.currentUser);
                alert('✅ 用户添加成功');
            }
            this.closeUserModal();
            await this.loadAllData();
        } catch(e) {
            alert('❌ 操作失败: ' + e.message);
        }
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

    // ====== 图书操作 ======
    closeBookModal() {
        this.showAddBookModal = false;
        this.showEditBookModal = false;
        this.currentBook = { name: '', author: '', price: 0, level: '', description: '', sellerId: '' };
    },

    editBook(book) {
        this.currentBook = { ...book };
        this.showEditBookModal = true;
    },

    async saveBook() {
        if (!this.currentBook.name) {
            alert('请输入书名');
            return;
        }
        if (!this.currentBook.price || this.currentBook.price <= 0) {
            alert('请输入有效价格');
            return;
        }
        if (!this.currentBook.sellerId) {
            alert('请输入卖家ID');
            return;
        }

        try {
            if (this.showEditBookModal) {
                await api.adminPut(`/admin/book/${this.currentBook.id}`, this.currentBook);
                alert('✅ 图书信息更新成功');
            } else {
                await api.adminPost('/admin/book', this.currentBook);
                alert('✅ 图书添加成功');
            }
            this.closeBookModal();
            await this.loadAllData();
        } catch(e) {
            alert('❌ 操作失败: ' + e.message);
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

    // ====== 订单操作 ======
    async updateOrderStatus(orderId, status) {
        if(!confirm(`确定要将订单状态改为"${this.getStatusText(status)}"？`)) return;
        try {
            await api.adminPut(`/admin/order/${orderId}/status?status=${status}`);
            alert('✅ 状态更新成功');
            await this.loadAllData();
        } catch(e) {
            alert('❌ 更新失败: ' + e.message);
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

    // ====== 评论操作 ======
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
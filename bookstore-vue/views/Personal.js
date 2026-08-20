const Personal = {
    template: `
    <div class="container" v-if="user">
        <div class="page-header">
            <button class="btn-back" @click="goBack" title="返回上一页">◀ 返回</button>
            <div class="page-title">个人中心</div>
        </div>

        <!-- 个人主页卡片 -->
        <div class="my-profile-card" :style="getProfileCardBackgroundStyle()" v-if="userProfile">
            <div class="profile-header-section">
                <div class="profile-avatar-wrapper" @click="goToMyProfile">
                    <div class="profile-avatar-large">
                        <img v-if="userProfile.avatar" :src="userProfile.avatar" :alt="user.username">
                        <span v-else>{{ (user.username || 'U').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="edit-badge">👤 查看主页</div>
                </div>

                <div class="profile-info-wrapper">
                    <h2 class="profile-username" style="color: #000000 !important;">{{ user.username }}</h2>
                    <div class="profile-meta-info" style="color: #000000 !important;">
                        <span>📅 注册时间: {{ formatTime(userProfile.createTime) }}</span>
                        <span>📍 {{ userProfile.ip || '未知' }}</span>
                    </div>

                    <div class="profile-tags-display" v-if="parsedTags.length > 0">
                        <span class="profile-tag-item" style="color: #000000 !important;" v-for="(tag, idx) in parsedTags" :key="idx">{{ tag }}</span>
                    </div>
                    <div class="profile-tags-display" v-else>
                        <span class="profile-tag-item tag-empty">暂无标签，点击编辑添加</span>
                    </div>
                </div>

                <button class="btn-edit-profile-quick" @click="goToEditProfile">
                    ✏️ 编辑主页
                </button>
            </div>

            <div class="profile-stats-row" :style="{ color: getTextColor() }">
                <div class="profile-stat-item">
                    <div class="profile-stat-num">{{ myBooks.filter(b => b.status === '1').length }}</div>
                    <div class="profile-stat-label">在售图书</div>
                </div>
                <div class="profile-stat-item">
                    <div class="profile-stat-num">{{ myBooks.filter(b => b.status !== '1').length }}</div>
                    <div class="profile-stat-label">已售出</div>
                </div>
                <div class="profile-stat-item">
                    <div class="profile-stat-num">{{ favorites.length }}</div>
                    <div class="profile-stat-label">我的收藏</div>
                </div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-card stat-dropdown-trigger" @click="toggleMyBooksDropdown" :class="{ 'active': showMyBooksDropdown }">
                <div class="stat-icon">P</div>
                <div><div class="stat-num">{{ myBooks.length }}</div><div class="stat-label">我发布的</div></div>
                <span class="dropdown-arrow">▼</span>

                <!-- 下拉弹出层 - 我的发布 -->
                <transition name="dropdown-fade">
                    <div v-if="showMyBooksDropdown" class="stat-dropdown-menu my-books-dropdown" @click.stop>
                        <div class="dropdown-header">
                            <h4>📚 我的发布 ({{ myBooks.length }}本)</h4>
                            <button class="dropdown-close" @click.stop="showMyBooksDropdown=false">✕</button>
                        </div>

                        <div class="dropdown-content" v-if="myBooks.length > 0">
                            <table class="dropdown-table">
                                <thead><tr><th>书名</th><th>价格</th><th>状态</th><th>操作</th></tr></thead>
                                <tbody>
                                    <tr v-for="b in myBooks.slice(0, 5)" :key="b.id">
                                        <td class="book-name-cell">{{ b.name }}</td>
                                        <td>¥{{ (b.price||0).toFixed(2) }}</td>
                                        <td><span class="mini-status" :class="b.status==='1'?'status-on':'status-off'">{{ b.status==='1'?'在售':'已售' }}</span></td>
                                        <td><button class="mini-btn btn-edit-mini" @click.stop="editBook(b); showMyBooksDropdown=false">编辑</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="myBooks.length > 5" class="view-more-hint">还有 {{ myBooks.length - 5 }} 本...</div>
                        </div>

                        <div class="dropdown-empty" v-else>
                            <p>暂无发布</p>
                            <button class="mini-btn btn-primary-mini" @click.stop="showMyBooksDropdown=false; showPublish=true">立即发布</button>
                        </div>

                        <div class="dropdown-footer">
                            <button class="btn-view-all" @click.stop="scrollToSection('my-books-section'); showMyBooksDropdown=false">查看全部 →</button>
                        </div>
                    </div>
                </transition>
            </div>

            <div class="stat-card stat-dropdown-trigger" @click="toggleCartDropdown" :class="{ 'active': showCartDropdown }">
                <div class="stat-icon">C</div>
                <div><div class="stat-num">{{ cartItems.length }}</div><div class="stat-label">购物车</div></div>
                <span class="dropdown-arrow">▼</span>

                <!-- 下拉弹出层 - 购物车 -->
                <transition name="dropdown-fade">
                    <div v-if="showCartDropdown" class="stat-dropdown-menu cart-dropdown" @click.stop>
                        <div class="dropdown-header">
                            <h4>🛒 购物车 ({{ cartItems.length }}件)</h4>
                            <button class="dropdown-close" @click.stop="showCartDropdown=false">✕</button>
                        </div>

                        <div class="dropdown-content" v-if="cartItems.length > 0">
                            <table class="dropdown-table">
                                <thead><tr><th>书名</th><th>数量</th><th>小计</th><th>操作</th></tr></thead>
                                <tbody>
                                    <tr v-for="c in cartItems.slice(0, 5)" :key="c.id">
                                        <td class="book-name-cell">{{ c.bookName || '图书#'+c.bookId }}</td>
                                        <td>{{ c.quantity || 1 }}</td>
                                        <td class="price-text">¥{{ ((c.price||0)*(c.quantity||1)).toFixed(2) }}</td>
                                        <td><button class="mini-btn btn-danger-mini" @click.stop="removeCart(c.id)">删除</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="cart-total-row">
                                <span>合计:</span>
                                <strong class="total-price">¥{{ totalPrice.toFixed(2) }}</strong>
                            </div>
                            <div v-if="cartItems.length > 5" class="view-more-hint">还有 {{ cartItems.length - 5 }} 件...</div>
                        </div>

                        <div class="dropdown-empty" v-else>
                            <p>购物车空空如也</p>
                            <button class="mini-btn btn-primary-mini" @click.stop="showCartDropdown=false; goBack()">去逛逛</button>
                        </div>

                        <div class="dropdown-footer">
                            <button class="btn-checkout-now" @click.stop="showCartDropdown=false; showBatchBuy=true" v-if="cartItems.length > 0">
                                💰 去结算
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <div class="publish-banner" @click="showPublish=true">
            <div class="publish-banner-icon">📖</div>
            <div class="publish-banner-text">
                <div class="publish-banner-title">发布二手书</div>
                <div class="publish-banner-desc">让闲置的书籍找到新主人，分享知识传递价值</div>
            </div>
            <div class="publish-banner-arrow">+</div>
        </div>

        <div class="section-card" id="my-books-section">
            <div class="section-header">
                <h3>我发布的二手书</h3>
                <span class="count-badge">{{ myBooks.length }} 本</span>
                <div class="batch-actions" v-if="selectedBooks.length > 0">
                    <span class="selected-count">已选 {{ selectedBooks.length }} 项</span>
                    <button class="action-btn btn-danger" @click="batchDeleteBooks">批量删除</button>
                    <button class="action-btn btn-default" @click="selectedBooks = []">取消选择</button>
                </div>
            </div>
            <div class="table-responsive"><table v-if="myBooks.length">
                <thead><tr>
                    <th style="width:40px"><input type="checkbox" v-model="selectAllBooks" @change="toggleSelectAllBooks"></th>
                    <th>书名</th><th>作者</th><th>价格</th><th>成色</th><th>状态</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="b in myBooks" :key="b.id" :class="{ 'selected-row': selectedBooks.includes(b.id) }">
                        <td><input type="checkbox" :value="b.id" v-model="selectedBooks"></td>
                        <td>{{ b.name }}</td><td>{{ b.author || '-' }}</td>
                        <td>¥{{ (b.price||0).toFixed(2) }}</td><td>{{ b.level }}</td>
                        <td><span class="status-badge" :class="b.status==='1'?'status-received':'status-pending'">{{ b.status==='1'?'在售':'已售' }}</span></td>
                        <td>
                            <button class="action-btn btn-edit" @click="editBook(b)">编辑</button>
                            <button class="action-btn btn-danger" @click="removeBook(b.id)">下架</button>
                        </td>
                    </tr>
                </tbody>
            </table></div>
            <div v-else class="empty-state"><div class="icon">📭</div><h3>还没有发布任何书籍</h3></div>
        </div>

        <div class="section-card">
            <div class="section-header">
                <h3>我的收藏</h3>
                <span class="count-badge">{{ favorites.length }} 本</span>
                <div class="batch-actions" v-if="selectedFavorites.length > 0">
                    <span class="selected-count">已选 {{ selectedFavorites.length }} 项</span>
                    <button class="action-btn btn-danger" @click="batchDeleteFavorites">批量删除</button>
                    <button class="action-btn btn-default" @click="selectedFavorites = []">取消选择</button>
                </div>
            </div>
            <div class="table-responsive"><table v-if="favorites.length">
                <thead><tr><th style="width:40px"><input type="checkbox" v-model="selectAllFavorites" @change="toggleSelectAllFavorites"></th><th>书名</th><th>价格</th><th>成色</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="f in favorites" :key="f.id" :class="{ 'sold-out-row': f.status !== 1, 'selected-row': selectedFavorites.includes(f.id) }">
                        <td><input type="checkbox" :value="f.id" v-model="selectedFavorites"></td>
                        <td :class="{ 'text-muted': f.status !== 1 }">
                            {{ f.bookName || '图书#'+f.bookId }}
                            <span class="category-tag-sm" v-if="f.categoryName">{{ f.categoryName }}</span>
                        </td>
                        <td :class="{ 'text-muted': f.status !== 1 }">¥{{ (f.price||0).toFixed(2) }}</td>
                        <td>{{ f.level || '-' }}</td>
                        <td>
                            <span v-if="f.status == 1" class="status-badge status-received">在售</span>
                            <span v-else class="status-badge status-pending">已售出/下架</span>
                        </td>
                        <td>
                            <template v-if="f.status == 1">
                                <button class="action-btn btn-primary" @click="viewFavoriteDetail(f)">查看详情</button>
                                <button class="action-btn btn-primary" @click="addToCartFromFavorite(f)">加购</button>
                                <button class="action-btn btn-success" @click="buyDirectlyFromFavorite(f)">立即购买</button>
                                <button class="action-btn btn-danger" @click="removeFavorite(f.id, f.bookId)">取消收藏</button>
                            </template>
                            <template v-else>
                                <button class="action-btn btn-disabled" disabled @click="showSoldOutTip">已售出</button>
                                <button class="action-btn btn-danger" @click="removeFavorite(f.id, f.bookId)">取消收藏</button>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state"><div class="icon">❤️</div><h3>还没有收藏任何书籍</h3><p>浏览图书时点击❤️图标即可收藏</p></div>
        </div>

        <div class="section-card">
            <div class="section-header"><h3>我的购物车</h3></div>
            <div class="table-responsive"><table v-if="cartItems.length">
                <thead><tr><th style="width:40px"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th><th>书名</th><th>价格</th><th>数量</th><th>小计</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="c in cartItems" :key="c.id" :class="{ 'selected-row': selectedIds.includes(c.id) }">
                        <td><input type="checkbox" :value="c.id" v-model="selectedIds"></td>
                        <td>{{ c.bookName || '图书#'+c.bookId }}</td>
                        <td>¥{{ (c.price||0).toFixed(2) }}</td>
                        <td>
                            <input type="number" v-model.number="c.quantity" min="1" style="width:50px;padding:4px 8px;border:1px solid var(--border);border-radius:4px" @change="updateCartNum(c)">
                        </td>
                        <td style="color:var(--primary);font-weight:600">¥{{ ((c.price||0) * (c.quantity||1)).toFixed(2) }}</td>
                        <td>
                            <button class="action-btn btn-danger" @click="removeCart(c.id)">删除</button>
                            <button class="action-btn btn-primary" @click="buySingle(c)">购买</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state"><div class="icon">🛒</div><h3>购物车空空如也</h3></div>

            <div v-if="cartItems.length && selectedIds.length > 0" class="cart-footer">
                <div class="cart-summary">
                    <span>已选择 <strong>{{ selectedIds.length }}</strong> 本图书</span>
                    <span class="total-price">合计：<strong style="color:var(--primary);font-size:20px">¥{{ totalPrice.toFixed(2) }}</strong></span>
                </div>
                <button class="btn-submit" style="padding:12px 32px;font-size:16px" @click="batchBuyNow">结算 ({{ selectedIds.length }})</button>
            </div>
        </div>

        <div class="modal-overlay" v-if="showBatchBuy" @click.self="showBatchBuy=false">
            <div class="modal" style="width:480px;max-height:85vh;overflow-y:auto">
                <h2>🛒 批量下单确认</h2>
                <div class="batch-books-list">
                    <div v-for="id in selectedIds" :key="id" class="batch-book-item">
                        {{ getBookById(id).bookName || '图书' }} × {{ getBookById(id).quantity || 1 }}本 = ¥{{ ((getBookById(id).price||0) * (getBookById(id).quantity||1)).toFixed(2) }}
                    </div>
                </div>
                <div class="batch-total" style="background:#fff5f5;padding:16px;border-radius:6px;margin:16px 0;text-align:right;border:2px solid var(--primary)">
                    <span style="font-size:18px;color:var(--dark)">总计：</span>
                    <strong style="color:var(--primary);font-size:28px">¥{{ totalPrice.toFixed(2) }}</strong>
                </div>
                <div class="form-group"><label>收货人姓名 *</label><input v-model="batchForm.receiverName" placeholder="请输入收货人姓名"></div>
                <div class="form-group"><label>联系电话 *</label><input v-model="batchForm.phone" placeholder="请输入联系电话"></div>
                
                <!-- 省市区三级联动 -->
                <div class="form-group">
                    <label>收货地址 *</label>
                    <div class="region-select-row">
                        <select v-model="batchForm.province" @change="onBatchProvinceChange" class="region-select">
                            <option value="">请选择省份</option>
                            <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                        </select>
                        <select v-model="batchForm.city" @change="onBatchCityChange" class="region-select" :disabled="!batchForm.province">
                            <option value="">请选择城市</option>
                            <option v-for="c in cities" :key="c.code" :value="c.code">{{ c.name }}</option>
                        </select>
                        <select v-model="batchForm.district" class="region-select" :disabled="!batchForm.city">
                            <option value="">请选择区县</option>
                            <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>详细地址 *</label>
                    <input v-model="batchForm.detailAddress" placeholder="请输入详细地址，如：xx街道xx号xx小区">
                </div>
                
                <div class="form-group"><label>备注</label><textarea v-model="batchForm.remark" placeholder="选填：配送要求等" style="height:60px"></textarea></div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showBatchBuy=false">取消</button>
                    <button class="btn-submit" @click="confirmBatchBuy" :disabled="batchBuying">确认下单 ({{ selectedIds.length }}单)</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showFavoriteDetail" @click.self="showFavoriteDetail=false">
            <div class="modal" style="width:620px;max-height:85vh;overflow-y:auto">
                <div v-if="favoriteDetailBook" style="display:flex;gap:20px;flex-wrap:wrap">
                    <img v-if="favoriteDetailBook.image" :src="favoriteDetailBook.image" style="width:200px;height:260px;object-fit:cover;border-radius:4px;flex-shrink:0">
                    <div v-else style="width:200px;height:260px;background:#fafafa;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:48px;flex-shrink:0;border:1px solid var(--border-light)">📖</div>
                    <div style="flex:1;min-width:250px">
                        <h2 style="margin:0 0 8px;font-size:18px;color:var(--dark)">{{ favoriteDetailBook.bookName }}</h2>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">作者：{{ favoriteDetailBook.author || '未知' }}</div>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">成色：{{ favoriteDetailBook.level || '九成新' }}</div>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">分类：{{ favoriteDetailBook.categoryName || '未分类' }}</div>
                        <div style="color:var(--primary);font-size:28px;font-weight:800;margin:12px 0">¥{{ (favoriteDetailBook.price||0).toFixed(2) }}</div>
                        <div class="form-actions" style="margin-top:8px">
                            <button class="btn-cancel" @click="addToCartFromFavorite(favoriteDetailBook)">加入购物车</button>
                            <button class="btn-submit" @click="showFavoriteDetail=false;buyFromFavorite(favoriteDetailBook)">立即购买</button>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showFavoriteDetail=false">关闭</button>
                    <button class="btn-danger" style="margin-left:12px" @click="removeFavorite(favoriteDetailBook.id, favoriteDetailBook.bookId); showFavoriteDetail=false">取消收藏</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showPublish" @click.self="showPublish=false">
            <div class="modal" style="width:520px">
                <h2>发布二手书</h2>
                <div class="form-group"><label>书名 *</label><input v-model="form.name"></div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>作者</label><input v-model="form.author"></div>
                    <div class="form-group" style="flex:1"><label>价格 *</label><input v-model.number="form.price" type="number" step="0.01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>成色</label>
                        <select v-model="form.level">
                            <option value="全新">全新</option><option value="九成新">九成新</option>
                            <option value="八成新">八成新</option>
                            <option value="七成新">七成新</option>
                            <option value="六成新">六成新</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex:1"><label>分类</label>
                        <select v-model.number="form.categoryId">
                        <option :value="null">请选择分类</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select></div>
                </div>
                <div class="form-group"><label>描述</label><textarea v-model="form.bookDesc"></textarea></div>
                <div class="form-group"><label>图片URL</label><input v-model="form.image" placeholder="可选"></div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showPublish=false">取消</button>
                    <button class="btn-submit" @click="publishBook">发布</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showEdit" @click.self="showEdit=false">
            <div class="modal" style="width:520px">
                <h2>编辑二手书</h2>
                <div class="form-group"><label>书名 *</label><input v-model="editForm.name"></div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>作者</label><input v-model="editForm.author"></div>
                    <div class="form-group" style="flex:1"><label>价格 *</label><input v-model.number="editForm.price" type="number" step="0.01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>成色</label>
                        <select v-model="editForm.level">
                            <option value="全新">全新</option><option value="九成新">九成新</option>
                            <option value="八成新">八成新</option>
                            <option value="七成新">七成新</option>
                            <option value="六成新">六成新</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex:1"><label>分类</label>
                        <select v-model.number="editForm.categoryId">
                        <option :value="null">请选择分类</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select></div>
                </div>
                <div class="form-group"><label>描述</label><textarea v-model="editForm.bookDesc"></textarea></div>
                <div class="form-group"><label>图片URL</label><input v-model="editForm.image" placeholder="可选"></div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showEdit=false">取消</button>
                    <button class="btn-submit" @click="updateBook">保存修改</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <div class="empty-state" style="padding:100px 20px"><div class="icon">🔒</div><h3>请先登录</h3></div>
    </div>`,
    data() {
        return {
            user: store.getUser(), myBooks: [], cartItems: [], favorites: [], categories: [],
            showPublish: false, showEdit: false, showBatchBuy: false, batchBuying: false, showFavoriteDetail: false, favoriteDetailBook: null,
            // 下拉弹出层状态
            showMyBooksDropdown: false,
            showCartDropdown: false,
            selectAll: false, selectedIds: [],
            selectedFavorites: [], selectAllFavorites: false,
            // 发布的图书批量操作
            selectedBooks: [],
            selectAllBooks: false,
            batchForm: { receiverName: '', phone: '', province: '', city: '', district: '', detailAddress: '', remark: '' },
            // 省市区数据
            provinces: regionData.provinces,
            cities: [],
            districts: [],
            form: { name: '', author: '', price: null, level: '九成新', categoryId: null, bookDesc: '', image: '', sellerId: null },
            editForm: { id: null, name: '', author: '', price: null, level: '九成新', categoryId: null, bookDesc: '', image: '' },
            userProfile: null
        };
    },
    computed: {
        totalPrice() {
            return this.selectedIds.reduce((sum, id) => {
                const item = this.cartItems.find(c => c.id === id);
                return sum + (item ? (item.price || 0) * (item.quantity || 1) : 0);
            }, 0);
        },
        parsedTags() {
            if (!this.userProfile || !this.userProfile.tags) return [];
            return this.userProfile.tags.split(',').filter(t => t.trim());
        }
    },
    async mounted() {
        if (!this.user) return;
        this.categories = await api.getCategory().catch(() => []);
        await Promise.all([this.loadMyBooks(), this.loadCart(), this.loadFavorites(), this.loadUserProfile()]);

        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', this.closeDropdowns);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeDropdowns);
    },
    methods: {
        // 获取当前文字颜色（供内联样式使用）
        getTextColor() {
            console.log('=== [getTextColor-DEBUG] 开始计算 ===');
            console.log('- userProfile:', this.userProfile);
            console.log('- textColorMode:', this.userProfile?.textColorMode);
            console.log('- textColor:', this.userProfile?.textColor);

            const mode = this.userProfile?.textColorMode || 'auto';
            const bg = this.userProfile?.background || '';
            let resultColor = '#000000';  // 默认黑色（临时改为黑色测试）

            if (mode === 'auto') {
                resultColor = this.calculateTextColor(bg);
                console.log('- 自动模式, 结果:', resultColor);
            } else if (this.userProfile?.textColor) {
                resultColor = this.userProfile.textColor;
                console.log('- 自定义颜色:', resultColor);
            }

            console.log('✅ [getTextColor-DEBUG] 最终返回颜色:', resultColor);
            return resultColor;
        },

        goBack() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.hash = '#/';
            }
        },

        // 下拉弹出层控制
        toggleMyBooksDropdown() {
            this.showMyBooksDropdown = !this.showMyBooksDropdown;
            if (this.showMyBooksDropdown) {
                this.showCartDropdown = false; // 关闭另一个
            }
        },

        toggleCartDropdown() {
            this.showCartDropdown = !this.showCartDropdown;
            if (this.showCartDropdown) {
                this.showMyBooksDropdown = false; // 关闭另一个
            }
        },

        closeDropdowns(event) {
            // 检查点击是否在触发器外部
            const isClickInsideMyBooks = event.target.closest('.stat-dropdown-trigger:nth-child(1)');
            const isClickInsideCart = event.target.closest('.stat-dropdown-trigger:nth-child(2)');

            if (!isClickInsideMyBooks && !isClickInsideCart) {
                this.showMyBooksDropdown = false;
                this.showCartDropdown = false;
            }
        },

        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        async loadUserProfile() {
            try {
                console.log('=== [个人中心-DEBUG] 开始加载用户信息 ===');
                console.log('[个人中心-DEBUG] 用户ID:', this.user.id);

                const data = await api.get('/user/seller/' + this.user.id);
                console.log('=== [个人中心-DEBUG] 服务器返回的完整数据 ===');
                console.log(JSON.stringify(data, null, 2));

                if (data && data.seller) {
                    this.userProfile = data.seller;

                    console.log('=== [个人中心-DEBUG] 关键字段检查 ===');
                    console.log('- userProfile.background:', this.userProfile?.background);
                    console.log('- userProfile.textColor:', this.userProfile?.textColor);  // ← 关键！
                    console.log('- userProfile.textColorMode:', this.userProfile?.textColorMode);  // ← 关键！
                    console.log('✅ 用户主页信息加载成功');
                } else {
                    console.error('❌ [个人中心-DEBUG] 返回数据中没有 seller 对象');
                }
            } catch (e) {
                console.error('❌ 加载用户主页信息失败:', e);
                this.userProfile = null;
            }
        },
        
        getProfileCardBackgroundStyle() {
            const bg = this.userProfile?.background || '';

            let baseStyle = {};

            // 检查是否为URL（以http开头）
            if (bg.startsWith('http://') || bg.startsWith('https://')) {
                baseStyle = {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            } else {
                // 使用渐变色或纯色
                baseStyle = {
                    background: bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
            }

            // ===== 计算并应用文字颜色 =====
            let textColor = '#ffffff';  // 默认白色

            const mode = this.userProfile?.textColorMode || 'auto';

            if (mode === 'auto') {
                // 自动模式：根据背景亮度计算最佳文字颜色
                textColor = this.calculateTextColor(bg);
            } else if (this.userProfile?.textColor) {
                // 使用用户设置的自定义颜色
                textColor = this.userProfile.textColor;
            }

            // 应用文字颜色到样式
            baseStyle.color = textColor;

            console.log('🎨 [个人中心] 文字颜色模式:', mode, '| 最终颜色:', textColor);

            return baseStyle;
        },

        // 智能文字颜色计算（与 SellerProfile 保持一致）
        calculateTextColor(backgroundColor) {
            if (!backgroundColor) {
                return '#ffffff';
            }

            try {
                let mainColor = backgroundColor;

                // 如果是 URL，默认返回白色（适合大多数图片背景）
                if (backgroundColor.startsWith('http') || backgroundColor.startsWith('data:image')) {
                    return '#ffffff';
                }

                // 处理渐变色 - 提取第一个颜色
                if (mainColor.includes('gradient')) {
                    const colorMatch = mainColor.match(/#[0-9a-fA-F]{6}|rgb\([^)]+\)/);
                    if (colorMatch) {
                        mainColor = colorMatch[0];
                    } else {
                        return '#ffffff';
                    }
                }

                // 解析十六进制颜色
                let r = 0, g = 0, b = 0;
                if (mainColor.startsWith('#')) {
                    r = parseInt(mainColor.slice(1, 3), 16);
                    g = parseInt(mainColor.slice(3, 5), 16);
                    b = parseInt(mainColor.slice(5, 7), 16);
                } else if (mainColor.startsWith('rgb')) {
                    const rgbMatch = mainColor.match(/\d+/g);
                    if (rgbMatch && rgbMatch.length >= 3) {
                        r = parseInt(rgbMatch[0]);
                        g = parseInt(rgbMatch[1]);
                        b = parseInt(rgbMatch[2]);
                    }
                }

                // 计算亮度 (ITU-R BT.709)
                const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                return luminance > 0.5 ? '#1a1a1a' : '#ffffff';

            } catch (e) {
                console.warn('计算文字颜色失败:', e);
                return '#ffffff';
            }
        },
        goToMyProfile() {
            this.$router.push('/seller/' + this.user.id);
        },
        goToEditProfile() {
            this.$router.push('/seller/' + this.user.id);
        },
        formatTime(time) {
            if (!time) return '未知';
            try {
                const d = new Date(time);
                return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
            } catch(e) { return time; }
        },
        async loadMyBooks() {
            try { this.myBooks = await api.get('/secondbook/my/' + this.user.id); } catch (e) { this.myBooks = []; }
        },
        async loadCart() {
            try {
                const items = await api.get('/cart/' + this.user.id);
                this.cartItems = items;
                for (let c of this.cartItems) {
                    try {
                        const book = await api.get('/secondbook/' + c.bookId);
                        c.bookName = book.name;
                        c.price = book.price;
                    } catch (e) { c.bookName = '未知'; c.price = 0; }
                }
            } catch (e) { this.cartItems = []; }
        },
        async loadFavorites() {
            try {
                const res = await api.getFavorites(this.user.id);
                console.log('收藏接口返回数据:', res);
                if (res && res.data && Array.isArray(res.data)) {
                    this.favorites = res.data;
                    console.log('收藏列表加载成功:', this.favorites.length, '本');
                } else if (Array.isArray(res)) {
                    this.favorites = res;
                } else {
                    this.favorites = [];
                    console.warn('收藏数据格式异常:', res);
                }
            } catch (e) {
                console.error('加载收藏失败:', e);
                this.favorites = [];
            }
        },
        async removeFavorite(id, bookId) {
            if (!confirm('确定取消收藏？')) return;
            try {
                const data = await api.removeFavorite(this.user.id, bookId);
                if (data.code === 200) {
                    this.showToast('已取消收藏', 'success');
                    this.favorites = this.favorites.filter(f => f.id !== id);
                } else {
                    this.showToast(data.msg || '取消失败', 'error');
                }
            } catch (e) {
                this.showToast('操作失败', 'error');
            }
        },
        viewFavoriteDetail(f) {
            if (f.status !== 1) {
                alert('抱歉，这本书已经售出了或已下架！');
                return;
            }
            this.favoriteDetailBook = f;
            this.showFavoriteDetail = true;
        },
        async addToCartFromFavorite(f) {
            if (f.status !== 1) {
                alert('抱歉，这本书已经售出了或已下架！');
                return;
            }
            try {
                const data = await api.post('/cart/add', { userId: this.user.id, secondBookId: f.bookId });
                if (data.code === 200) {
                    this.showToast('已加入购物车', 'success');
                } else {
                    this.showToast(data.msg || '添加失败', 'error');
                }
            } catch (e) {
                this.showToast('网络错误', 'error');
            }
        },
        showSoldOutTip() {
            alert('抱歉，这本书已经售出了或已下架！');
        },
        buyFromFavorite(f) {
            if (f.status !== 1) {
                alert('抱歉，这本书已经售出了或已下架！');
                return;
            }
            this.selectedIds = [];
            this.batchBuyNow();
        },
        
        // 从收藏列表直接购买（不经过购物车）
        async buyDirectlyFromFavorite(f) {
            if (f.status !== 1) {
                alert('抱歉，这本书已经售出了或已下架！');
                return;
            }
            
            try {
                // 先将这本书加入购物车
                const cartData = await api.post('/cart/add', { 
                    userId: this.user.id, 
                    secondBookId: f.bookId 
                });
                
                if (cartData.code === 200) {
                    this.showToast('已自动加入购物车', 'success');
                    
                    // 刷新购物车数据以获取新添加的商品ID
                    await this.loadCart();
                    
                    // 找到刚添加的购物车项（最后一个添加的）
                    const newCartItem = this.cartItems.find(c => c.bookId === f.bookId);
                    if (newCartItem) {
                        // 选中这个商品并打开购买窗口
                        this.selectedIds = [newCartItem.id];
                        this.batchBuyNow();
                    } else {
                        this.showToast('购买失败，请重试', 'error');
                    }
                } else {
                    this.showToast(cartData.msg || '添加到购物车失败', 'error');
                }
            } catch (e) {
                console.error('直接购买失败:', e);
                this.showToast('网络错误，请重试', 'error');
            }
        },
        async removeBook(id) {
            if (!confirm('确定下架？')) return;
            try {
                const data = await api.del('/secondbook/del/' + id);
                if (data.success) {
                    this.showToast('下架成功', 'success');
                    this.selectedBooks = this.selectedBooks.filter(bookId => bookId !== id);
                    this.loadMyBooks();
                } else this.showToast(data.msg || '失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },

        // ==================== 发布的图书批量操作方法 ====================
        toggleSelectAllBooks() {
            if (this.selectAllBooks) {
                this.selectedBooks = this.myBooks.map(b => b.id);
            } else {
                this.selectedBooks = [];
            }
        },

        async batchDeleteBooks() {
            if (this.selectedBooks.length === 0) {
                this.showToast('请先选择要删除的图书', 'warning');
                return;
            }

            if (!confirm(`确定要批量下架选中的 ${this.selectedBooks.length} 本图书吗？\n\n此操作不可恢复！`)) {
                return;
            }

            let successCount = 0;
            let failCount = 0;

            for (const bookId of this.selectedBooks) {
                try {
                    const data = await api.del('/secondbook/del/' + bookId);
                    if (data.success) {
                        successCount++;
                        console.log(`✅ 图书 ${bookId} 下架成功`);
                    } else {
                        failCount++;
                        console.error(`❌ 图书 ${bookId} 下架失败:`, data.msg);
                    }
                } catch (e) {
                    failCount++;
                    console.error(`❌ 图书 ${bookId} 下架异常:`, e);
                }
            }

            // 清空选择
            this.selectedBooks = [];
            this.selectAllBooks = false;

            // 刷新列表
            await this.loadMyBooks();

            // 显示结果
            if (failCount === 0) {
                this.showToast(`✅ 成功下架 ${successCount} 本图书`, 'success');
            } else {
                this.showToast(`⚠️ 成功: ${successCount} 本, 失败: ${failCount} 本`, 'warning');
            }
        },
        async updateCartNum(c) {
            try { await api.put('/cart/updateNum', { id: c.id, num: c.quantity }); } catch (e) {}
        },
        async removeCart(id) {
            try { await api.del('/cart/' + id); this.showToast('已删除', 'success'); this.selectedIds = this.selectedIds.filter(i => i !== id); this.loadCart(); } catch (e) { this.showToast('删除失败', 'error'); }
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedIds = this.cartItems.map(c => c.id);
            } else {
                this.selectedIds = [];
            }
        },
        toggleSelectAllFavorites() {
            if (this.selectAllFavorites) {
                this.selectedFavorites = this.favorites.map(f => f.id);
            } else {
                this.selectedFavorites = [];
            }
        },
        async batchDeleteFavorites() {
            if (!this.selectedFavorites.length) return;
            if (!confirm(`确定要删除选中的 ${this.selectedFavorites.length} 个收藏吗？此操作不可恢复！`)) return;
            try {
                let successCount = 0;
                for (let favId of this.selectedFavorites) {
                    const fav = this.favorites.find(f => f.id === favId);
                    if (fav && fav.bookId) {
                        try {
                            const data = await api.removeFavorite(this.user.id, fav.bookId);
                            if (data.code === 200 || data.success) {
                                successCount++;
                                this.favorites = this.favorites.filter(f => f.id !== favId);
                            }
                        } catch (e) {}
                    }
                }
                if (successCount > 0) {
                    this.showToast(`成功删除 ${successCount} 个收藏`, 'success');
                    this.selectedFavorites = [];
                    this.selectAllFavorites = false;
                } else {
                    this.showToast('删除失败，请重试', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        getBookById(id) {
            return this.cartItems.find(c => c.id === id) || {};
        },
        buySingle(c) {
            this.selectedIds = [c.id];
            this.batchBuyNow();
        },
        batchBuyNow() {
            if (this.selectedIds.length === 0) {
                this.showToast('请先选择要购买的图书', 'error');
                return;
            }
            
            // 解析用户已保存的地址
            let savedProvince = '', savedCity = '', savedDistrict = '', savedDetailAddress = '';
            if (this.user.address) {
                const addrParts = this.user.address.split('|');
                if (addrParts.length >= 4) {
                    savedProvince = addrParts[0] || '';
                    savedCity = addrParts[1] || '';
                    savedDistrict = addrParts[2] || '';
                    savedDetailAddress = addrParts[3] || '';
                } else {
                    savedDetailAddress = this.user.address;
                }
                
                // 加载省市数据
                if (savedProvince) {
                    this.cities = regionData.cities[savedProvince] || [];
                    if (savedCity) {
                        this.districts = regionData.districts[savedCity] || [];
                    }
                }
            }
            
            this.batchForm = {
                receiverName: this.user.username || '',
                phone: this.user.phone || '',
                province: savedProvince,
                city: savedCity,
                district: savedDistrict,
                detailAddress: savedDetailAddress,
                remark: ''
            };
            this.showBatchBuy = true;
        },
        
        // 批量下单 - 省份选择变化
        onBatchProvinceChange() {
            this.batchForm.city = '';
            this.batchForm.district = '';
            this.cities = regionData.cities[this.batchForm.province] || [];
            this.districts = [];
        },
        
        // 批量下单 - 城市选择变化
        onBatchCityChange() {
            this.batchForm.district = '';
            this.districts = regionData.districts[this.batchForm.city] || [];
        },
        
        // 获取批量下单完整地址
        getBatchFullAddress() {
            const provinceName = this.provinces.find(p => p.code === this.batchForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.batchForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.batchForm.district)?.name || '';
            const parts = [provinceName, cityName, districtName, this.batchForm.detailAddress].filter(p => p.trim());
            return parts.join('');
        },
        
        // 获取批量下单地址用于保存（带分隔符）
        getBatchAddressForSave() {
            const provinceName = this.provinces.find(p => p.code === this.batchForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.batchForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.batchForm.district)?.name || '';
            return `${provinceName}|${cityName}|${districtName}|${this.batchForm.detailAddress}`;
        },
        async confirmBatchBuy() {
            if (!this.batchForm.receiverName.trim()) { this.showToast('请输入收货人姓名', 'error'); return; }
            if (!this.batchForm.phone.trim()) { this.showToast('请输入联系电话', 'error'); return; }
            if (!this.batchForm.province) { this.showToast('请选择省份', 'error'); return; }
            if (!this.batchForm.city) { this.showToast('请选择城市', 'error'); return; }
            if (!this.batchForm.detailAddress.trim()) { this.showToast('请输入详细地址', 'error'); return; }

            this.batchBuying = true;
            let successCount = 0;
            
            const fullAddress = this.getBatchFullAddress();
            const addressForSave = this.getBatchAddressForSave();
            
            try {
                for (const id of this.selectedIds) {
                    const item = this.cartItems.find(c => c.id === id);
                    if (!item) continue;

                    const data = await api.post('/orders/create', {
                        buyerId: this.user.id,
                        bookId: item.bookId,
                        totalPrice: item.price * (item.quantity || 1),
                        receiverName: this.batchForm.receiverName,
                        address: fullAddress,
                        phone: this.batchForm.phone,
                        remark: this.batchForm.remark
                    });

                    if (data.code === 200) {
                        successCount++;
                        await api.del('/cart/' + id);
                    }
                }

                if (successCount > 0) {
                    // 同时更新用户的地址信息（保存省份）
                    try {
                        await api.put('/user/updateProfile', {
                            id: this.user.id,
                            address: addressForSave,
                            ip: this.provinces.find(p => p.code === this.batchForm.province)?.name || this.user.ip
                        });
                    } catch (e) {
                        console.log('保存地址信息失败:', e);
                    }
                    
                    this.showToast(`成功下单 ${successCount} 单！`, 'success');
                    this.showBatchBuy = false;
                    this.selectedIds = [];
                    this.selectAll = false;
                    await Promise.all([this.loadCart(), this.loadMyBooks()]);
                } else {
                    this.showToast('下单失败，请重试', 'error');
                }
            } catch (e) {
                this.showToast('网络错误', 'error');
            } finally {
                this.batchBuying = false;
            }
        },
        async publishBook() {
            if (!this.form.name.trim()) { this.showToast('请输入书名', 'error'); return; }
            if (!this.form.price || this.form.price <= 0) { this.showToast('请输入有效价格', 'error'); return; }
            this.form.sellerId = this.user.id;
            try {
                const data = await api.post('/secondbook', this.form);
                if (data.success) { this.showToast('发布成功', 'success'); this.showPublish = false; this.loadMyBooks(); }
                else this.showToast(data.msg || '失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        editBook(book) {
            this.editForm = {
                id: book.id,
                name: book.name,
                author: book.author,
                price: book.price,
                level: book.level,
                categoryId: book.categoryId,
                bookDesc: book.bookDesc,
                image: book.image,
                status: book.status
            };
            this.showEdit = true;
        },
        async updateBook() {
            if (!this.editForm.name.trim()) { this.showToast('请输入书名', 'error'); return; }
            if (!this.editForm.price || this.editForm.price <= 0) { this.showToast('请输入有效价格', 'error'); return; }
            try {
                const updateData = { ...this.editForm, sellerId: this.user.id };
                console.log('更新数据:', updateData);
                const data = await api.put('/secondbook', updateData);
                console.log('更新结果:', data);
                if (data.success) {
                    this.showToast('修改成功', 'success');
                    this.showEdit = false;
                    this.loadMyBooks();
                } else {
                    this.showToast(data.msg || '修改失败', 'error');
                }
            } catch (e) { 
                console.error('更新异常:', e);
                this.showToast('网络错误', 'error'); 
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
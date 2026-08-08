 const Home = {
    template: `
    <div>
        <div class="search-section">
            <div class="search-inner">
                <div class="search-box">
                    <select class="search-cat" v-model="searchCategoryId" @change="search">
                        <option :value="null">全部分类</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                    <input v-model="searchKeyword" placeholder="搜索书名、作者..." @keyup.enter="search">
                    <button @click="search">搜索</button>
                </div>
                <button class="btn-publish" @click="openPublish">发布二手书</button>
            </div>
        </div>

        <!-- 主内容区：左侧分类 + 右侧轮播 -->
        <div class="main-layout">
            <!-- 左侧分类导航 - 增强版 -->
            <div class="left-sidebar">
                <!-- 分类标题 -->
                <div class="sidebar-header">
                    <div class="sidebar-header-icon">📚</div>
                    <span>图书分类</span>
                </div>

                <!-- 快捷筛选 -->
                <div class="quick-filters">
                    <button class="quick-filter-btn" :class="{ active: !currentCategoryId && !searchKeyword }" @click="resetSearch()">
                        <span class="filter-icon">✨</span>
                        <span>全部图书</span>
                        <span class="filter-count">{{ total }}</span>
                    </button>
                    <button class="quick-filter-btn" @click="showNewBooks()">
                        <span class="filter-icon">🆕</span>
                        <span>最新上架</span>
                    </button>
                    <button class="quick-filter-btn" @click="showDiscountBooks()">
                        <span class="filter-icon">💰</span>
                        <span>特价优惠</span>
                    </button>
                </div>

                <!-- 分类列表 -->
                <div class="category-section">
                    <div class="section-title-small">📂 全部分类</div>
                    <ul class="category-nav-list">
                        <li class="category-nav-item" :class="{ active: currentCategoryId === null }" @click="filterByCategory(null)">
                            <span class="nav-icon">📖</span>
                            <span>全部分类</span>
                            <span class="item-arrow">›</span>
                        </li>
                        <li v-for="cat in categories" :key="cat.id"
                            class="category-nav-item"
                            :class="{ active: currentCategoryId === cat.id }"
                            @click="filterByCategory(cat.id)">
                            <span class="nav-icon">{{ getCategoryIcon(cat.name) }}</span>
                            <span>{{ cat.name }}</span>
                            <span class="item-arrow">›</span>
                        </li>
                    </ul>
                </div>

                <!-- 热门推荐 -->
                <div class="hot-recommend-section" v-if="hotBooks.length > 0">
                    <div class="section-title-small">🔥 热门推荐</div>
                    <div class="hot-book-list">
                        <div v-for="(book, index) in hotBooks.slice(0, 5)" :key="book.id"
                         class="hot-book-item"
                         @click="viewDetail(book.id)"
                         :style="{ animationDelay: index * 0.1 + 's' }">
                            <span class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                            <div class="hot-book-info">
                                <div class="hot-book-name">{{ book.name }}</div>
                                <div class="hot-book-price">¥{{ (book.price || 0).toFixed(2) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 卖家排行榜迷你版 -->
                <div class="mini-ranking-section" v-if="sellerRanking.length > 0">
                    <div class="section-title-small">🏆 优质卖家</div>
                    <div class="mini-seller-list">
                        <div v-for="(seller, index) in sellerRanking.slice(0, 3)" :key="seller.sellerId"
                             class="mini-seller-item"
                             @click="goToSeller(seller.sellerId)">
                            <span class="seller-avatar-mini">{{ (seller.username || 'U').charAt(0).toUpperCase() }}</span>
                            <div class="mini-seller-info">
                                <div class="mini-seller-name">{{ seller.username }}</div>
                                <div class="mini-seller-stats">已售 {{ seller.soldCount }} 本</div>
                            </div>
                            <span v-if="index === 0" class="top-badge">TOP</span>
                        </div>
                    </div>
                </div>

                <!-- 底部工具 -->
                <div class="sidebar-footer">
                    <div class="footer-link" @click="scrollToTop">
                        <span>⬆️</span>
                        <span>回到顶部</span>
                    </div>
                    <div class="footer-link" @click="openPublish">
                        <span>📝</span>
                        <span>发布图书</span>
                    </div>
                </div>
            </div>

            <!-- 右侧内容区 -->
            <div class="right-content">
                <!-- 轮播图区域 -->
                <carousel :slides="carouselSlides" :interval="4000" 
                          @button-click="onCarouselButtonClick"
                          @slide-click="onCarouselSlideClick"></carousel>

                <!-- 筛选和排序工具栏 -->
                <div class="container" style="padding-top:20px;padding-bottom:0">
                    <div class="filter-toolbar">
                        <div v-if="searchKeyword" style="margin-bottom:14px;font-size:13px;color:var(--text-muted)">
                            搜索"<strong style="color:var(--primary)">{{ searchKeyword }}</strong>"的结果
                            <button @click="resetSearch" style="margin-left:8px;background:none;color:var(--primary);font-size:12px;font-weight:600;text-decoration:underline">清除</button>
                        </div>

                        <div class="price-filter-row">
                            <label class="filter-label">💰 价格区间：</label>
                            <input type="number" v-model.number="minPrice" placeholder="最低价" min="0" step="0.01" class="price-input">
                            <span class="price-separator">-</span>
                            <input type="number" v-model.number="maxPrice" placeholder="最高价" min="0" step="0.01" class="price-input">
                            <button @click="applyPriceFilter" class="btn-filter">确定</button>
                            <button v-if="minPrice || maxPrice" @click="clearPriceFilter" class="btn-clear-filter">清除</button>

                            <span class="filter-divider"></span>

                            <label class="filter-label">📊 排序：</label>
                            <select v-model="sortBy" @change="applySort" class="sort-select">
                                <option value="">默认排序</option>
                                <option value="price-asc">价格从低到高 ⬆️</option>
                                <option value="price-desc">价格从高到低 ⬇️</option>
                                <option value="time-desc">最新发布 🆕</option>
                            </select>
                            
                            <!-- 全局排序提示 -->
                            <span v-if="sortBy && allBooks.length > 0" class="global-sort-badge">
                                🌐 全局排序 (共 {{ allBooks.length }} 本)
                            </span>
                        </div>
                    </div>

                    <div v-if="loading" class="book-grid">
                        <div class="skeleton-card" v-for="n in 8" :key="n">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line short"></div>
                            <div class="skeleton-line price"></div>
                        </div>
                    </div>
                    <div v-else-if="books.length === 0" class="empty-state">
                        <div class="icon">📭</div>
                        <h3>{{ searchKeyword ? '未找到相关图书' : '暂无在售图书' }}</h3>
                        <p>{{ searchKeyword ? '换个关键词试试吧' : '快来发布第一本二手书吧' }}</p>
                    </div>
                    <div v-else>
                        <div class="book-grid">
                            <book-card v-for="(book, idx) in books" :key="book.id" :book="book" 
                                :is-favorited="isBookFavorited(book.id)"
                                :style="{ animationDelay: (idx % 12) * 0.04 + 's' }" class="fade-in-card"
                                @add-cart="addToCart" @buy-now="buyNow" @view-detail="viewDetail" 
                                @toggle-favorite="toggleFavorite"></book-card>
                        </div>
                        <div class="pagination" v-if="totalPages > 1">
                            <button :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">上一页</button>
                            <span v-for="p in pageNumbers" :key="p" class="page-num" :class="{ active: p === currentPage }" @click="goPage(p)">{{ p }}</span>
                            <button :disabled="currentPage >= totalPages" @click="goPage(currentPage + 1)">下一页</button>
                            <span class="page-info">共 {{ total }} 本，{{ currentPage }}/{{ totalPages }} 页</span>
                        </div>
                    </div>
                </div>

                <!-- 卖家销量排行榜 -->
                <div class="seller-ranking-section" v-if="sellerRanking.length > 0">
                    <h3 class="ranking-title">🏆 卖家销量排行榜</h3>
                    <div class="ranking-grid">
                        <div v-for="(seller, index) in sellerRanking" :key="seller.sellerId" 
                             class="seller-ranking-card" :class="'rank-' + (index + 1)"
                             @click="goToSeller(seller.sellerId)">
                            <div class="rank-number">{{ index + 1 }}</div>
                            <div class="seller-info">
                                <div class="seller-name">{{ seller.username || '用户' + seller.sellerId }}</div>
                                <div class="seller-stats">
                                    <span>📚 已售 {{ seller.soldCount }} 本</span>
                                    <span>⭐ 评分 {{ seller.avgScore || '暂无' }}</span>
                                </div>
                            </div>
                            <div class="rank-badge" v-if="index < 3">
                                🥇
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showPublish" @click.self="showPublish=false">
            <div class="modal" style="width:560px">
                <h2>发布二手书</h2>
                <div class="form-group"><label>书名 *</label><input v-model="form.name" placeholder="请输入书名"></div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>作者</label><input v-model="form.author" placeholder="请输入作者"></div>
                    <div class="form-group" style="flex:1"><label>价格 *</label><input v-model.number="form.price" type="number" step="0.01" placeholder="请输入价格"></div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex:1"><label>成色</label>
                        <select v-model="form.level">
                            <option value="全新">全新</option><option value="九成新">九成新</option>
                            <option value="八成新">八成新</option><option value="七成新">七成新</option>
                            <option value="六成新">六成新</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex:1"><label>分类</label>
                        <select v-model.number="form.categoryId">
                            <option :value="null">请选择分类</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>描述</label><textarea v-model="form.bookDesc" placeholder="请输入书籍描述"></textarea></div>
                <div class="form-group"><label>图书封面 *</label>
                    <div class="url-input-container">
                        <input v-model="form.image"
                               type="text"
                               placeholder="请输入图片URL地址（如：https://example.com/book-cover.jpg）"
                               class="text-input"
                               @blur="validateImageUrl">
                        <button v-if="form.image" class="btn-clear-image" @click="form.image = ''" title="清除">✕</button>
                    </div>
                    <img v-if="form.image" :src="form.image" alt="封面预览" class="image-preview-small" @error="handleImageError">
                    <div class="form-hint-text">
                        💡 推荐图床：<a href="https://sm.ms/" target="_blank" rel="noopener noreferrer" class="link-primary">SM.MS</a> |
                        <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" class="link-primary">ImgBB</a>
                        <br>支持 jpg/png/gif/webp 格式
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showPublish=false;resetForm()">取消</button>
                    <button class="btn-submit" @click="publishBook">发布</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showBuy" @click.self="showBuy=null">
            <div class="modal" style="width:420px">
                <h2>确认订单</h2>
                <div style="background:var(--primary-light);padding:14px;border-radius:4px;margin-bottom:16px;border:1px solid #ffd4d4">
                    <div style="font-weight:600;font-size:16px;color:var(--dark)">{{ showBuy.name }}</div>
                    <div style="color:var(--primary);font-size:22px;font-weight:800;margin-top:4px">¥{{ (showBuy.price||0).toFixed(2) }}</div>
                </div>
                <div class="form-group"><label>收货人姓名 *</label><input v-model="buyForm.receiverName" placeholder="请输入收货人姓名"></div>
                <div class="form-group"><label>联系电话 *</label><input v-model="buyForm.phone" placeholder="请输入联系电话"></div>
                
                <!-- 省市区三级联动 -->
                <div class="form-group">
                    <label>收货地址 *</label>
                    <div class="region-select-row">
                        <select v-model="buyForm.province" @change="onProvinceChange" class="region-select">
                            <option value="">请选择省份</option>
                            <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                        </select>
                        <select v-model="buyForm.city" @change="onCityChange" class="region-select" :disabled="!buyForm.province">
                            <option value="">请选择城市</option>
                            <option v-for="c in cities" :key="c.code" :value="c.code">{{ c.name }}</option>
                        </select>
                        <select v-model="buyForm.district" class="region-select" :disabled="!buyForm.city">
                            <option value="">请选择区县</option>
                            <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>详细地址 *</label>
                    <input v-model="buyForm.detailAddress" placeholder="请输入详细地址，如：xx街道xx号xx小区">
                </div>
                
                <div class="form-group"><label>备注</label><textarea v-model="buyForm.remark" placeholder="选填，如：请在工作日配送、需要包装等" style="height:60px"></textarea></div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="showBuy=null">取消</button>
                    <button class="btn-submit" @click="confirmBuy">确认下单</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showDetail" @click.self="showDetail=null">
            <div class="modal" style="width:620px;max-height:85vh;overflow-y:auto">
                <div v-if="detailBook" style="display:flex;gap:20px;flex-wrap:wrap">
                    <img v-if="detailBook.image" :src="detailBook.image" style="width:200px;height:260px;object-fit:cover;border-radius:4px;flex-shrink:0">
                    <div v-else style="width:200px;height:260px;background:#fafafa;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:48px;flex-shrink:0;border:1px solid var(--border-light)">📖</div>
                    <div style="flex:1;min-width:250px">
                        <h2 style="margin:0 0 8px;font-size:18px;color:var(--dark)">{{ detailBook.name }}</h2>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">作者：{{ detailBook.author || '未知' }}</div>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">成色：{{ detailBook.level || '九成新' }}</div>
                        <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">分类：{{ detailBook.categoryName || '未分类' }}</div>
                        <div style="color:var(--primary);font-size:28px;font-weight:800;margin:12px 0">¥{{ (detailBook.price||0).toFixed(2) }}</div>
                        <div style="background:var(--primary-light);padding:12px;border-radius:4px;margin:12px 0;line-height:1.6;font-size:13px;color:var(--text-secondary);border:1px solid #ffd4d4">{{ detailBook.bookDesc || '暂无描述' }}</div>
                        <div class="form-actions" style="margin-top:8px">
                            <button class="btn-cancel" @click="addToCart(detailBook.id)">加入购物车</button>
                            <button class="btn-submit" @click="showDetail=null;buyNow(detailBook)">立即购买</button>
                        </div>
                    </div>
                </div>
                <div v-if="sellerInfo" style="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                        <div class="seller-avatar-clickable" @click="goToSellerProfile" title="点击查看卖家主页">
                            <img v-if="sellerInfo.seller.avatar" :src="sellerInfo.seller.avatar" :alt="sellerInfo.seller.username" style="width:48px;height:48px;border-radius:50%;object-fit:cover">
                            <span v-else style="width:48px;height:48px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--primary);font-weight:700">{{ (sellerInfo.seller.username || 'U').charAt(0).toUpperCase() }}</span>
                        </div>
                        <div style="flex:1">
                            <div style="font-weight:700;font-size:16px;color:var(--dark)">{{ sellerInfo.seller.username }} <span style="font-size:12px;color:#1890ff;cursor:pointer;font-weight:normal;margin-left:8px" @click="goToSellerProfile">→ 查看主页</span></div>
                            <div style="font-size:12px;color:var(--text-muted)">已售 {{ sellerInfo.soldCount || 0 }} 本</div>
                        </div>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
                        <span style="background:var(--primary-light);color:var(--primary);padding:4px 12px;border-radius:4px;font-size:12px;font-weight:500">📞 {{ sellerInfo.seller.phone || '未填写' }}</span>
                        <span style="background:#e6f7ff;color:#1890ff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:500">📍 {{ sellerInfo.seller.address || '未填写' }}</span>
                    </div>
                    <div v-if="sellerInfo.soldBooks && sellerInfo.soldBooks.length > 0" style="margin-top:12px">
                        <h4 style="margin-bottom:8px;font-size:14px;color:var(--dark)">曾售出的书</h4>
                        <div style="display:flex;flex-wrap:wrap;gap:6px">
                            <span v-for="b in sellerInfo.soldBooks" :key="b.id" style="background:#f5f5f5;padding:4px 10px;border-radius:4px;font-size:12px;color:var(--text-secondary)" :title="'¥'+b.price">{{ b.name }} ¥{{ b.price }}</span>
                        </div>
                    </div>
                    <div v-if="sellerInfo.comments && sellerInfo.comments.length > 0" style="margin-top:16px">
                        <h4 style="margin-bottom:8px;font-size:14px;color:var(--dark)">买家评价（{{ sellerInfo.comments.length }}）</h4>
                        <div v-for="c in sellerInfo.comments" :key="c.id" style="padding:10px;border-bottom:1px solid var(--border-light)">
                            <div style="display:flex;justify-content:space-between">
                                <span style="font-weight:600;color:var(--dark)">{{ c.username || '匿名' }}</span>
                                <span style="color:#faad14;font-size:12px">{{ '⭐'.repeat(c.score||5) }}</span>
                            </div>
                            <div style="margin-top:4px;font-size:13px;color:var(--text-secondary)">{{ c.content }}</div>
                        </div>
                    </div>
                    <div v-else style="color:var(--text-muted);text-align:center;padding:16px;font-size:13px">暂无评价</div>
                </div>
                <div v-else-if="sellerLoading" style="text-align:center;padding:20px;color:var(--text-muted)">加载卖家信息中...</div>
            </div>
        </div>

        <div class="back-to-top" :class="{ show: showBackTop }" @click="scrollToTop" title="回到顶部">&#8593;</div>

        <footer class="footer">
            <h4>BookLoop 二手图书交易平台</h4>
            <p>好书不贵，知识共享 —— 让每一本旧书找到新的主人</p>
            <div class="divider"></div>
            <p class="copyright">© 2024 BookLoop | Spring Boot + Vue 3</p>
        </footer>
    </div>`,
    components: { BookCard, Carousel },
    data() {
        return {
            books: [], categories: [], loading: true,
            searchKeyword: '', currentCategoryId: null, searchCategoryId: null,
            currentPage: 1, total: 0, totalPages: 1, pageSize: 12,
            showPublish: false, showBuy: null, showDetail: null, detailBook: null, sellerInfo: null, sellerLoading: false,
            showBackTop: false,
            carouselSlides: [],
            form: { name: '', author: '', price: null, level: '九成新', categoryId: null, bookDesc: '', image: '', sellerId: null },
             buyForm: { receiverName: '', phone: '', province: '', city: '', district: '', detailAddress: '', remark: '' },
            favoriteIds: [],  // 存储已收藏的图书ID列表
            // 省市区数据
            provinces: regionData.provinces,
            cities: [],
            districts: [],
            // 价格筛选
            minPrice: null,
            maxPrice: null,
            sortBy: '',
            // 卖家排行榜
            sellerRanking: [],
            // 热门图书
            hotBooks: [],
            // 全部图书（用于全局排序）
            allBooks: []
        };
    },
    computed: {
        pageNumbers() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            return pages;
        }
    },
    async mounted() {
        try {
            // 并行加载所有公开数据（图书、分类等）
            const publicDataPromises = [
                this.loadCategories().catch(e => { console.warn('加载分类失败:', e); return []; }),
                this.loadBooks().catch(e => { console.error('加载图书失败:', e); return []; }),
                this.loadHotBooks().catch(e => { console.warn('加载热门图书失败:', e); return []; }),
                this.loadSellerRanking().catch(e => { console.warn('加载卖家排行失败:', e); return []; })
            ];
            
            await Promise.allSettled(publicDataPromises);
            
            this.generateCarouselSlides();
            
            // 仅在用户已登录时加载个人数据（收藏等）
            if (store.isLoggedIn()) {
                this.loadFavorites().catch(e => {
                    console.warn('加载收藏列表失败（可能未登录）:', e);
                    this.favoriteIds = [];
                });
            }
        } catch (error) {
            console.error('首页数据加载异常:', error);
        } finally {
            this.loading = false;
        }
        
        window.addEventListener('scroll', this.onScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        onScroll() {
            this.showBackTop = window.scrollY > 500;
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // ==================== 价格筛选方法（全局筛选） ====================
        applyPriceFilter() {
            console.log('💰 应用价格筛选:', this.minPrice, '-', this.maxPrice);
            this.currentPage = 1;
            this.allBooks = []; // 清空缓存，重新加载
            this.loadBooks(); // loadBooks会应用价格筛选
            
            // 显示提示
            if (this.minPrice && this.maxPrice) {
                this.showToast(`已筛选 ¥${this.minPrice} - ¥${this.maxPrice} 的图书`, 'success');
            } else if (this.minPrice) {
                this.showToast(`已筛选 ¥${this.minPrice} 以上的图书`, 'success');
            } else if (this.maxPrice) {
                this.showToast(`已筛选 ¥${this.maxPrice} 以下的图书`, 'success');
            }
        },

        clearPriceFilter() {
            console.log('🗑️ 清除价格筛选');
            this.minPrice = null;
            this.maxPrice = null;
            this.currentPage = 1;
            this.allBooks = []; // 清空缓存
            this.loadBooks();
            this.showToast('已清除价格筛选', 'info');
        },

        // ==================== 排序方法（全局排序） ====================
        applySort() {
            this.currentPage = 1; // 重置到第一页
            if (!this.sortBy) {
                this.allBooks = [];
                this.loadBooks();
            } else {
                console.log('🔄 开始全局排序:', this.sortBy);
                this.loadBooks(); // loadBooks内部会处理全局排序逻辑
            }
        },

        // ==================== 卖家排行榜方法 ====================
        async loadSellerRanking() {
            try {
                // 使用公开的卖家排行榜接口（无需管理员权限）
                const data = await api.get('/secondbook/seller-ranking?limit=10');
                this.sellerRanking = data || [];
                console.log('✅ 卖家排行榜加载成功:', this.sellerRanking);
            } catch (e) {
                console.warn('⚠️ 加载卖家排行榜失败，使用模拟数据:', e.message);
                // 如果接口调用失败，使用模拟数据作为降级方案
                this.sellerRanking = [
                    { sellerId: 2, username: '书香门第', soldCount: 15, avgScore: 4.8 },
                    { sellerId: 52, username: '知识海洋', soldCount: 12, avgScore: 4.9 },
                    { sellerId: 3, username: '书虫小铺', soldCount: 10, avgScore: 4.7 },
                    { sellerId: 4, username: '旧书回收站', soldCount: 8, avgScore: 4.6 },
                    { sellerId: 5, username: '学霸书店', soldCount: 6, avgScore: 5.0 }
                ];
            }
        },

        goToSeller(sellerId) {
            window.location.href = '#/seller/' + sellerId;
        },

        // ==================== 侧边栏工具方法 ====================
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('回到顶部');
        },

        openPublish() {
            if (!this.user) {
                this.showToast('请先登录', 'warning');
                return;
            }
            this.showPublishModal = true;
            console.log('打开发布图书弹窗');
        },

        // ==================== 热门图书方法 ====================
        async loadHotBooks() {
            try {
                const data = await api.get('/secondbook/hot?limit=5');
                this.hotBooks = (data || []).filter(b => String(b.status) === '1');
                console.log('热门图书:', this.hotBooks);
            } catch (e) {
                console.error('加载热门图书失败:', e);
                // 使用当前图书列表中的前5本作为热门
                this.hotBooks = this.books.slice(0, 5).map(b => ({...b}));
            }
        },

        showNewBooks() {
            console.log('🆕 查看最新上架');
            // 重置所有筛选条件
            this.currentCategoryId = null;
            this.searchKeyword = '';
            this.minPrice = null;
            this.maxPrice = null;
            
            // 设置排序为时间降序（最新在前）
            this.sortBy = 'time-desc';
            
            // 重置到第一页并重新加载
            this.currentPage = 1;
            this.allBooks = []; // 清空缓存
            this.loadBooks(); // loadBooks会自动应用全局排序
            
            this.showToast('已切换到最新上架', 'success');
        },

        showDiscountBooks() {
            console.log('💰 查看特价优惠');
            // 重置筛选条件
            this.currentCategoryId = null;
            this.searchKeyword = '';
            this.sortBy = ''; // 清除排序
            
            // 设置价格范围
            this.minPrice = 0;
            this.maxPrice = 30; // 30元以下为特价
            
            // 重置到第一页并重新加载
            this.currentPage = 1;
            this.allBooks = []; // 清空缓存
            this.loadBooks(); // loadBooks会自动应用价格筛选
            
            this.showToast('已显示30元以下特价图书', 'success');
        },
        async loadCategories() {
            try { this.categories = await api.getCategory(); } catch (e) { console.error(e); }
        },
        async loadBooks() {
            this.loading = true;
            try {
                // 尝试获取所有图书（不带分页参数，或使用大页面）
                const params = new URLSearchParams();
                
                // 如果需要全局排序，获取所有数据
                if (this.sortBy) {
                    params.set('page', 1);
                    params.set('size', 9999); // 获取足够多的数据用于前端全局排序
                } else {
                    params.set('page', this.currentPage);
                    params.set('size', this.pageSize);
                }

                if (this.currentCategoryId) params.set('categoryId', this.currentCategoryId);

                const data = await api.get('/secondbook/page?' + params.toString());
                let loadedBooks = data.list || [];

                // 过滤在售图书
                loadedBooks = loadedBooks.filter(b => String(b.status) === '1');

                // 价格筛选
                if (this.minPrice !== null && this.minPrice !== undefined) {
                    loadedBooks = loadedBooks.filter(b => (b.price || 0) >= this.minPrice);
                }
                if (this.maxPrice !== null && this.maxPrice !== undefined) {
                    loadedBooks = loadedBooks.filter(b => (b.price || 0) <= this.maxPrice);
                }

                // 存储全部数据
                this.allBooks = [...loadedBooks];

                // 如果有排序需求，进行全局排序
                if (this.sortBy && this.allBooks.length > 0) {
                    switch (this.sortBy) {
                        case 'price-asc':
                            this.allBooks.sort((a, b) => (a.price || 0) - (b.price || 0));
                            break;
                        case 'price-desc':
                            this.allBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
                            break;
                        case 'time-desc':
                            this.allBooks.sort((a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0));
                            break;
                    }
                    console.log(`✅ 全局排序完成 (${this.sortBy}):`, this.allBooks.length, '本图书');
                    
                    // 更新总数为排序后的总数
                    this.total = this.allBooks.length;
                    this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
                    
                    // 从排序后的数据中截取当前页
                    const startIdx = (this.currentPage - 1) * this.pageSize;
                    const endIdx = startIdx + this.pageSize;
                    this.books = this.allBooks.slice(startIdx, endIdx);
                } else {
                    // 无排序时，直接使用返回的数据（可能是分页的）
                    if (!this.sortBy) {
                        this.books = loadedBooks;
                        this.total = data.total || loadedBooks.length;
                        this.totalPages = data.totalPages || 1;
                    }
                }

                console.log(`📚 当前页显示: ${this.books.length} 本 | 总计: ${this.total} 本 | 页码: ${this.currentPage}/${this.totalPages}`);
            } catch (e) {
                console.error('加载图书失败:', e);
                this.books = [];
                this.allBooks = [];
            }
            this.loading = false;
        },
        goPage(p) {
            if (p < 1 || p > this.totalPages) return;
            
            // 如果有全局排序数据且已加载，直接从缓存中截取（避免重复请求API）
            if (this.allBooks.length > 0 && this.sortBy) {
                console.log(`📄 切换到第 ${p} 页（从缓存读取）`);
                this.currentPage = p;
                const startIdx = (p - 1) * this.pageSize;
                const endIdx = startIdx + this.pageSize;
                this.books = this.allBooks.slice(startIdx, endIdx);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // 否则重新从服务器加载
                this.currentPage = p;
                this.loadBooks();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        search() {
            this.currentPage = 1;
            this.currentCategoryId = this.searchCategoryId;
            if (this.searchKeyword) { this.searchMode(); } else { this.loadBooks(); }
        },
        async searchMode() {
            this.loading = true;
            try {
                let url = '/secondbook/search?name=' + encodeURIComponent(this.searchKeyword);
                if (this.searchCategoryId) url += '&categoryId=' + this.searchCategoryId;
                const data = await api.get(url);
                let allBooks = data.list || [];
                this.books = allBooks.filter(b => String(b.status) === '1');
                this.total = this.books.length;
                this.totalPages = 1;
            } catch (e) { this.books = []; }
            this.loading = false;
        },
        resetSearch() {
            console.log('🔄 重置所有筛选');
            this.searchKeyword = '';
            this.searchCategoryId = null;
            this.currentCategoryId = null;
            this.minPrice = null;
            this.maxPrice = null;
            this.sortBy = ''; // 清除排序
            this.currentPage = 1;
            this.allBooks = []; // 清空缓存
            this.loadBooks();
        },
        
        filterByCategory(catId) {
            console.log('📂 切换分类:', catId);
            this.currentCategoryId = catId;
            this.searchCategoryId = catId;
            this.currentPage = 1;
            this.searchKeyword = '';
            this.sortBy = ''; // 切换分类时清除排序
            this.allBooks = []; // 清空缓存
            this.loadBooks();
        },
        
        generateCarouselSlides() {
            const defaultSlides = [
                {
                    title: '🎓 毕业季特惠',
                    desc: '毕业学长学姐精选好书 · 让知识在校园里持续流转',
                    btnText: '立即抢购',
                    icon: '🎓',
                    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
                    bg: 'linear-gradient(135deg, rgba(17,153,142,0.85) 0%, rgba(56,239,125,0.85) 100%)',
                    categoryId: null
                }
            ];

            if (!this.categories || this.categories.length === 0) {
                this.carouselSlides = defaultSlides;
                return;
            }

            const categoryThemes = [
                { keywords: ['教材', '教辅', '考试', '考研', '英语'],
                  title: '📚 新学期必备教材',
                  desc: '二手教材低至3折 · 学长学姐精选推荐 · 正版保证',
                  icon: '📖',
                  img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(196,26,26,0.85) 0%, rgba(232,93,93,0.85) 50%, rgba(160,21,21,0.85) 100%)' },
                { keywords: ['文学', '小说', '散文', '诗歌', '名著'],
                  title: '📖 文学经典专区',
                  desc: '百年经典名著 · 沉淀思想的力量 · 每一本都是传世之作',
                  icon: '📜',
                  img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(45,52,54,0.88) 0%, rgba(99,110,114,0.88) 100%)' },
                { keywords: ['计算机', '编程', '技术', '软件', '互联网'],
                  title: '💻 计算机科学馆',
                  desc: '从编程入门到架构进阶 · 二手好书助你弯道超车',
                  icon: '💻',
                  img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(12,52,131,0.85) 0%, rgba(162,182,223,0.85) 100%)' },
                { keywords: ['经济', '管理', '商业', '金融', '投资'],
                  title: '💼 经管励志馆',
                  desc: '商业思维培养 · 投资理财指南 · 职场进阶秘籍',
                  icon: '💼',
                  img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(240,147,251,0.85) 0%, rgba(245,87,108,0.85) 100%)' },
                { keywords: ['童书', '少儿', '绘本', '儿童', '启蒙'],
                  title: '🌈 少儿读物乐园',
                  desc: '陪伴孩子成长的好伙伴 · 寓教于乐的精彩世界',
                  icon: '🌈',
                  img: 'https://images.unsplash.com/photo-1503454537195-1dcabb93ffb9?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(250,112,154,0.85) 0%, rgba(254,225,64,0.85) 100%)' },
                { keywords: ['科幻', '悬疑', '推理', '奇幻', '冒险'],
                  title: '🔮 科幻悬疑探秘',
                  desc: '探索未知的世界 · 挑战思维的极限 · 开启想象之旅',
                  icon: '🔮',
                  img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
                  bg: 'linear-gradient(135deg, rgba(79,172,254,0.85) 0%, rgba(0,242,254,0.85) 100%)' }
            ];

            let dynamicSlides = [];
            let usedCategoryIds = new Set();

            for (let theme of categoryThemes) {
                const matchedCategory = this.categories.find(cat =>
                    theme.keywords.some(keyword => cat.name.includes(keyword))
                );

                if (matchedCategory && !usedCategoryIds.has(matchedCategory.id)) {
                    dynamicSlides.push({
                        ...theme,
                        categoryId: matchedCategory.id,
                        categoryName: matchedCategory.name,
                        btnText: `查看${matchedCategory.name}`
                    });
                    usedCategoryIds.add(matchedCategory.id);
                }
            }

            if (dynamicSlides.length === 0) {
                const fallbackImages = [
                    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=400&fit=crop'
                ];
                dynamicSlides = this.categories.slice(0, 4).map((cat, idx) => {
                    const colors = [
                        'linear-gradient(135deg, rgba(196,26,26,0.85) 0%, rgba(232,93,93,0.85) 50%, rgba(160,21,21,0.85) 100%)',
                        'linear-gradient(135deg, rgba(45,52,54,0.88) 0%, rgba(99,110,114,0.88) 100%)',
                        'linear-gradient(135deg, rgba(12,52,131,0.85) 0%, rgba(162,182,223,0.85) 100%)',
                        'linear-gradient(135deg, rgba(17,153,142,0.85) 0%, rgba(56,239,125,0.85) 100%)'
                    ];
                    const icons = ['📚', '📖', '💻', '🎨'];
                    return {
                        title: cat.name + '专区',
                        desc: `精选${cat.name}类图书 · 好书等你来发现`,
                        btnText: `浏览${cat.name}`,
                        icon: icons[idx % icons.length],
                        img: fallbackImages[idx % fallbackImages.length],
                        bg: colors[idx % colors.length],
                        categoryId: cat.id,
                        categoryName: cat.name
                    };
                });
            }
            
            this.carouselSlides = [...defaultSlides, ...dynamicSlides.slice(0, 4)];
        },
        
        onCarouselButtonClick(slide) {
            if (slide.categoryId !== undefined && slide.categoryId !== null) {
                this.filterByCategory(slide.categoryId);
                this.scrollToBookGrid();
            } else if (slide.categoryId === null) {
                this.filterByCategory(null);
                this.scrollToBookGrid();
            }
        },
        
        onCarouselSlideClick(slide) {
            this.onCarouselButtonClick(slide);
        },
        
        scrollToBookGrid() {
            setTimeout(() => {
                const bookGrid = document.querySelector('.book-grid') || document.querySelector('.category-grid');
                if (bookGrid) {
                    bookGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        },
        cateStyle(cat) {
            const colors = [
                { bg: '#fff0f0', color: '#c41a1a' },
                { bg: '#f0f5ff', color: '#2f54eb' },
                { bg: '#f6ffed', color: '#389e0d' },
                { bg: '#fff7e6', color: '#d48806' },
                { bg: '#fff0f6', color: '#c41d7f' },
                { bg: '#f9f0ff', color: '#722ed1' },
                { bg: '#e6fffb', color: '#08979c' },
                { bg: '#f0f5ff', color: '#1d39c4' },
                { bg: '#fcffe6', color: '#5b8c00' },
                { bg: '#fff2e8', color: '#d4380d' },
                { bg: '#e6f7ff', color: '#096dd9' },
            ];
            const idx = cat.id % colors.length;
            return { background: colors[idx].bg, color: colors[idx].color };
        },
        getCategoryIcon(categoryName) {
            const iconMap = {
                '计算机': '💻', '编程': '💻', '软件': '💻', '互联网': '💻', '技术': '⚙️',
                '文学': '📖', '小说': '📚', '散文': '✍️', '诗歌': '🎭', '名著': '📜',
                '教材': '📕', '教辅': '📗', '考试': '📝', '考研': '🎯', '英语': '🔤',
                '经济': '💰', '管理': '📊', '商业': '💼', '金融': '💱', '投资': '📈',
                '童书': '🌈', '少儿': '🧒', '绘本': '🎨', '儿童': '👶', '启蒙': '🌟',
                '科幻': '🔮', '悬疑': '🔍', '推理': '🕵️', '奇幻': '🐉', '冒险': '🗺️',
                '历史': '🏛️', '哲学': '🤔', '艺术': '🎪', '心理': '🧠', '地理': '🌍'
            };
            
            for (let [keyword, icon] of Object.entries(iconMap)) {
                if (categoryName.includes(keyword)) return icon;
            }
            return '📚';
        },
        openPublish() {
            const user = store.getUser();
            if (!user) { this.showToast('请先登录', 'error'); this.$root.showLoginModal = true; return; }
            this.showPublish = true;
        },
        async viewDetail(bookId) {
            try {
                this.detailBook = await api.get('/secondbook/' + bookId);
                this.showDetail = true;
                this.sellerInfo = null;
                this.sellerLoading = true;
                if (this.detailBook && this.detailBook.sellerId) {
                    try {
                        const res = await api.get('/user/seller/' + this.detailBook.sellerId);
                        if (res && res.success !== false) {
                            this.sellerInfo = res;
                        } else {
                            console.warn('卖家接口返回空:', res);
                        }
                    } catch (e) {
                        console.error('加载卖家信息失败:', e);
                        this.sellerInfo = null;
                    }
                }
                this.sellerLoading = false;
            } catch (e) { 
                console.error('加载图书详情失败:', e);
                this.showToast('加载失败', 'error'); 
            }
        },
        goToSellerProfile() {
            if (this.detailBook && this.detailBook.sellerId) {
                this.showDetail = false;
                this.$router.push('/seller/' + this.detailBook.sellerId);
            }
        },
        validateImageUrl() {
            if (!this.form.image || !this.form.image.trim()) return true;

            const url = this.form.image.trim();

            // 放宽URL验证规则，支持更多格式
            const validPatterns = [
                /^https?:\/\/.+/i,  // http:// 或 https:// 开头
                /^\/uploads\/.+/,   // 相对路径
                /^data:image\/.+/i, // base64 图片
                /^\/.+/             // 其他相对路径
            ];

            const isValid = validPatterns.some(pattern => pattern.test(url));

            if (!isValid && url.length > 5) {
                this.showToast('请输入有效的图片URL地址', 'warning');
                return false;
            }

            return true;
        },

        handleImageError(e) {
            e.target.style.display = 'none';
            this.showToast('图片加载失败，请检查URL是否正确', 'error');
        },

        resetForm() {
            this.form = {
                name: '',
                author: '',
                price: null,
                level: '九成新',
                categoryId: null,
                bookDesc: '',
                image: '',
                sellerId: store.getUser()?.id,
                status: '1'
            };
        },
        async loadFavorites() {
            const user = store.getUser();
            if (!user) return;
            try {
                const res = await api.getFavorites(user.id);
                console.log('Home-收藏接口返回:', res);
                if (res && res.data && Array.isArray(res.data)) {
                    this.favoriteIds = res.data.map(f => f.bookId);
                    console.log('Home-已收藏图书ID列表:', this.favoriteIds);
                } else if (Array.isArray(res)) {
                    this.favoriteIds = res.map(f => f.bookId);
                } else {
                    this.favoriteIds = [];
                }
            } catch (e) {
                console.error('加载收藏列表失败:', e);
                this.favoriteIds = [];
            }
        },
        isBookFavorited(bookId) {
            return this.favoriteIds.includes(bookId);
        },
        async toggleFavorite(bookId) {
            const user = store.getUser();
            if (!user) {
                this.showToast('请先登录', 'error');
                this.$root.showLoginModal = true;
                return;
            }

            try {
                if (this.isBookFavorited(bookId)) {
                    // 取消收藏
                    const data = await api.removeFavorite(user.id, bookId);
                    if (data.code === 200) {
                        this.favoriteIds = this.favoriteIds.filter(id => id !== bookId);
                        this.showToast('已取消收藏', 'success');
                    } else {
                        this.showToast(data.msg || '取消收藏失败', 'error');
                    }
                } else {
                    // 添加收藏
                    const data = await api.addFavorite(user.id, bookId);
                    if (data.code === 200) {
                        this.favoriteIds.push(bookId);
                        this.showToast('收藏成功', 'success');
                    } else {
                        this.showToast(data.msg || '收藏失败', 'error');
                    }
                }
            } catch (e) {
                this.showToast('操作失败', 'error');
            }
        },
        async addToCart(bookId) {
            const user = store.getUser();
            if (!user) { this.showToast('请先登录', 'error'); this.$root.showLoginModal = true; return; }
            try {
                const data = await api.post('/cart/add', { userId: user.id, secondBookId: bookId });
                if (data.code === 200) this.showToast('已加入购物车', 'success');
                else this.showToast(data.msg || '添加失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async buyNow(book) {
            const user = store.getUser();
            if (!user) { this.showToast('请先登录', 'error'); this.$root.showLoginModal = true; return; }
            
            // 解析用户已保存的地址
            let savedProvince = '', savedCity = '', savedDistrict = '', savedDetailAddress = '';
            if (user.address) {
                const addrParts = user.address.split('|');
                if (addrParts.length >= 4) {
                    savedProvince = addrParts[0] || '';
                    savedCity = addrParts[1] || '';
                    savedDistrict = addrParts[2] || '';
                    savedDetailAddress = addrParts[3] || '';
                } else {
                    savedDetailAddress = user.address;
                }
                
                // 加载省市数据
                if (savedProvince) {
                    this.cities = regionData.cities[savedProvince] || [];
                    if (savedCity) {
                        this.districts = regionData.districts[savedCity] || [];
                    }
                }
            }
            
            this.buyForm = { 
                receiverName: user.username || '', 
                phone: user.phone || '', 
                province: savedProvince,
                city: savedCity,
                district: savedDistrict,
                detailAddress: savedDetailAddress,
                remark: '' 
            };
            this.showBuy = book;
        },
        
        // 省份选择变化
        onProvinceChange() {
            this.buyForm.city = '';
            this.buyForm.district = '';
            this.cities = regionData.cities[this.buyForm.province] || [];
            this.districts = [];
        },
        
        // 城市选择变化
        onCityChange() {
            this.buyForm.district = '';
            this.districts = regionData.districts[this.buyForm.city] || [];
        },
        
        // 获取完整地址字符串
        getFullAddress() {
            const provinceName = this.provinces.find(p => p.code === this.buyForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.buyForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.buyForm.district)?.name || '';
            const parts = [provinceName, cityName, districtName, this.buyForm.detailAddress].filter(p => p.trim());
            return parts.join('');
        },
        
        // 获取地址用于保存（带分隔符）
        getAddressForSave() {
            const provinceName = this.provinces.find(p => p.code === this.buyForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.buyForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.buyForm.district)?.name || '';
            return `${provinceName}|${cityName}|${districtName}|${this.buyForm.detailAddress}`;
        },
        
        async confirmBuy() {
            const user = store.getUser();
            const book = this.showBuy;
            
            if (!this.buyForm.receiverName.trim()) { this.showToast('请输入收货人姓名', 'error'); return; }
            if (!this.buyForm.phone.trim()) { this.showToast('请输入联系电话', 'error'); return; }
            if (!this.buyForm.province) { this.showToast('请选择省份', 'error'); return; }
            if (!this.buyForm.city) { this.showToast('请选择城市', 'error'); return; }
            if (!this.buyForm.detailAddress.trim()) { this.showToast('请输入详细地址', 'error'); return; }
            
            try {
                const fullAddress = this.getFullAddress();
                const addressForSave = this.getAddressForSave();
                
                const data = await api.post('/orders/create', {
                    buyerId: user.id, 
                    bookId: book.id, 
                    totalPrice: book.price,
                    receiverName: this.buyForm.receiverName,
                    address: fullAddress, 
                    phone: this.buyForm.phone,
                    remark: this.buyForm.remark
                });
                
                if (data.code === 200) { 
                    // 同时更新用户的地址信息（保存省份）
                    try {
                        await api.put('/user/updateProfile', {
                            id: user.id,
                            address: addressForSave,
                            ip: this.provinces.find(p => p.code === this.buyForm.province)?.name || user.ip
                        });
                    } catch (e) {
                        console.log('保存地址信息失败:', e);
                    }
                    
                    this.showToast('下单成功！', 'success'); 
                    this.showBuy = null; 
                    this.loadBooks(); 
                }
                else this.showToast(data.msg || '下单失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async publishBook() {
            const user = store.getUser();
            if (!user) { this.showToast('请先登录', 'error'); return; }
            if (!this.form.name.trim()) { this.showToast('请输入书名', 'error'); return; }
            if (!this.form.price || this.form.price <= 0) { this.showToast('请输入有效价格', 'error'); return; }
            if (!this.form.image.trim()) { this.showToast('请输入图书封面URL', 'error'); return; }
            if (!this.validateImageUrl()) return;

            this.form.sellerId = user.id;
            try {
                const data = await api.post('/secondbook', this.form);
                if (data.success) {
                    this.showToast('发布成功！', 'success');
                    this.showPublish = false;
                    this.resetForm();
                    this.loadBooks();
                } else this.showToast(data.msg || '发布失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
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
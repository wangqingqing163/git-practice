const SellerProfile = {
    template: `
    <div class="container" v-if="seller">
        <div class="page-header">
            <button class="btn-back" @click="goBack" title="返回上一页">◀ 返回</button>
            <div class="page-title">👤 {{ isOwnProfile ? '我的主页' : '卖家主页' }}</div>
            <button v-if="isOwnProfile" class="btn-edit-profile" @click="openEditModal">✏️ 编辑主页</button>
        </div>

        <div class="seller-profile-card" :style="getSellerCardBackgroundStyle()" :key="'profile-' + (seller?.background || 'default')">
            <div class="seller-profile-content">
                <div class="seller-avatar-section" @click="!isOwnProfile || openEditModal()">
                    <div class="seller-avatar-large" :class="{ 'editable': isOwnProfile }">
                        <img v-if="seller.avatar" :src="seller.avatar" :alt="seller.username">
                        <span v-else>{{ (seller.username || 'U').charAt(0).toUpperCase() }}</span>
                        <div v-if="isOwnProfile" class="avatar-overlay">
                            <span>📷 更换头像</span>
                        </div>
                    </div>
                    <div class="seller-badge" v-if="seller.isVip">⭐ 认证卖家</div>
                </div>

                <div class="seller-info-section">
                    <div class="seller-name-row">
                        <h2 class="seller-name">{{ seller.username }}</h2>
                        <button v-if="isOwnProfile" class="btn-edit-profile-inline" @click.stop="openEditModal">✏️ 编辑</button>
                    </div>
                    
                    <div class="seller-meta">
                        <span class="meta-item">📍 {{ seller.ip || '未知' }}</span>
                        <span class="meta-item">📅 注册时间: {{ formatTime(seller.createTime) }}</span>
                    </div>

                    <div class="seller-tags" v-if="parsedTags.length > 0">
                        <span class="tag" v-for="(tag, idx) in parsedTags" :key="idx">{{ tag }}</span>
                    </div>
                    <div class="seller-tags" v-else>
                        <span class="tag tag-default">暂无个性标签</span>
                    </div>
                </div>
            </div>

            <div class="seller-stats-row">
                <div class="stat-item">
                    <div class="stat-num">{{ onSaleBooks.length }}</div>
                    <div class="stat-label">在售图书</div>
                </div>
                <div class="stat-item">
                    <div class="stat-num">{{ soldCount }}</div>
                    <div class="stat-label">已售出</div>
                </div>
                <div class="stat-item">
                    <div class="stat-num">{{ seller.rating || '5.0' }}</div>
                    <div class="stat-label">评分</div>
                </div>
            </div>
        </div>

        <div class="section-card" style="margin-top:24px">
            <div class="section-header">
                <h3>📚 在售二手书（{{ onSaleBooks.length }} 本）</h3>
            </div>
            
            <div v-if="loading" class="book-grid">
                <div class="skeleton-card" v-for="n in 6" :key="n">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line price"></div>
                </div>
            </div>
            
            <div v-else-if="onSaleBooks.length === 0" class="empty-state">
                <div class="icon">📭</div>
                <h3>该卖家暂时没有在售图书</h3>
                <p>可能正在整理新书架，稍后再来看看吧~</p>
            </div>
            
            <div v-else class="book-grid">
                <div v-for="book in onSaleBooks" :key="book.id" class="book-card" @click="viewBookDetail(book.id)">
                    <div class="book-card-img">
                        <img v-if="book.image" :src="book.image" :alt="book.name" @error="imgError">
                        <span class="placeholder" v-else>📖</span>
                        <span class="condition-badge" :class="getLevelClass(book.level)">{{ book.level || '九成新' }}</span>
                    </div>
                    <div class="book-info">
                        <h3 :title="book.name">{{ book.name }}</h3>
                        <div class="author">✍ {{ book.author || '未知作者' }}</div>
                        <div class="price-row">
                            <span class="price"><small>¥</small>{{ (book.price||0).toFixed(2) }}</span>
                        </div>
                    </div>
                    <div class="book-actions">
                        <button class="btn-outline" @click.stop="addToCart(book.id)">🛒 加购</button>
                        <button class="btn-primary" @click.stop="buyNow(book)">⚡ 购买</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="back-btn-container">
            <button class="btn-back" @click="$router.back()">← 返回上一页</button>
        </div>

        <!-- 直接购买弹窗 -->
        <div class="modal-overlay" v-if="showBuyModal" @click.self="showBuyModal=false">
            <div class="modal" style="width:520px;max-height:85vh;overflow-y:auto">
                <h2>🛒 确认购买</h2>
                
                <div v-if="currentBookForBuy" style="background:#f6f8fa;padding:16px;border-radius:8px;margin-bottom:20px;border:1px solid var(--border)">
                    <div style="display:flex;gap:16px;align-items:center">
                        <img v-if="currentBookForBuy.image" :src="currentBookForBuy.image" 
                             style="width:100px;height:130px;object-fit:cover;border-radius:4px;flex-shrink:0"
                             @error="(e) => e.target.style.display='none'">
                        <div v-else style="width:100px;height:130px;background:#fafafa;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0">📖</div>
                        <div style="flex:1">
                            <h3 style="margin:0 0 8px;font-size:16px;color:var(--dark)">{{ currentBookForBuy.name }}</h3>
                            <div style="color:var(--text-muted);margin-bottom:4px;font-size:13px">作者：{{ currentBookForBuy.author || '未知' }}</div>
                            <div style="color:var(--text-muted);margin-bottom:8px;font-size:13px">成色：{{ currentBookForBuy.level || '九成新' }}</div>
                            <div style="color:var(--primary);font-size:24px;font-weight:800">¥{{ (currentBookForBuy.price||0).toFixed(2) }}</div>
                        </div>
                    </div>
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
                
                <div class="form-group"><label>备注</label><textarea v-model="buyForm.remark" placeholder="选填：配送要求等" style="height:60px"></textarea></div>
                
                <div class="form-actions">
                    <button class="btn-cancel" @click="showBuyModal=false">取消</button>
                    <button class="btn-submit" @click="confirmBuy" :disabled="buying">
                        {{ buying ? '⏳ 处理中...' : '💳 确认下单' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 编辑主页弹窗 -->
        <div class="modal-overlay" v-if="showEditModal" @click.self="showEditModal=false">
            <div class="modal profile-edit-modal" style="width:600px;max-height:90vh;overflow-y:auto">
                <h2>✏️ 编辑个人主页</h2>

                <!-- 头像设置 -->
                <div class="edit-section">
                    <label class="edit-label">📷 头像</label>
                    <div class="avatar-url-input-area">
                        <div class="avatar-preview-small">
                            <img v-if="editForm.avatar" :src="editForm.avatar" alt="头像预览" @error="handleAvatarError">
                            <span v-else>{{ (seller.username || 'U').charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="url-input-wrapper" style="flex:1">
                            <input v-model="editForm.avatar"
                                   placeholder="请输入图片URL地址（如：https://example.com/avatar.jpg）"
                                   class="text-input"
                                   @input="validateUrl">
                            <button v-if="editForm.avatar" class="btn-clear-url" @click="editForm.avatar = ''" title="清除">
                                ✕
                            </button>
                        </div>
                    </div>
                    <div class="form-hint">
                        💡 推荐使用图床服务获取图片链接：
                        <a href="https://sm.ms/" target="_blank" rel="noopener noreferrer" class="link-primary">SM.MS</a> |
                        <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" class="link-primary">ImgBB</a> |
                        <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" class="link-primary">PostImages</a>
                    </div>
                    <div class="form-hint" style="margin-top:8px">
                        或直接使用在线图片链接（支持 jpg/png/gif/webp 格式）
                    </div>
                </div>

                <!-- 背景设置 -->
                <div class="edit-section">
                    <label class="edit-label">🎨 背景样式</label>

                    <!-- 背景图片URL -->
                    <div class="bg-url-section">
                        <div class="url-input-container" style="margin-bottom:12px">
                            <input v-model="backgroundImageUrl"
                                   type="text"
                                   placeholder="请输入背景图片URL地址（如：https://picsum.photos/1200/400）"
                                   class="text-input"
                                   @input="onBackgroundUrlChange">
                            <button v-if="backgroundImageUrl" class="btn-clear-image" @click="clearBackgroundUrl" title="清除">✕</button>
                        </div>
                        <div class="form-hint-text" style="margin-bottom:12px">
                            💡 输入网络图片URL作为背景（支持 jpg/png/gif/webp）
                        </div>
                        <div v-if="backgroundImageUrl" class="bg-image-preview-container">
                            <img :src="backgroundImageUrl" alt="背景预览" class="bg-image-preview" @error="handleBgImageError">
                            <button class="btn-remove-bg-image" @click="clearBackgroundUrl">移除图片背景</button>
                        </div>
                    </div>

                    <!-- 或选择渐变色 -->
                    <div class="divider-text" v-if="!backgroundImageUrl">—— 或选择渐变/纯色 ——</div>
                    
                    <div class="bg-presets" v-if="!backgroundImageUrl">
                        <div v-for="(bg, idx) in bgPresets" :key="idx"
                             class="bg-preset-item"
                             :class="{ active: editForm.background === bg.value && !backgroundImageUrl }"
                             :style="{ background: bg.preview }"
                             @click="selectBgPreset(bg.value)"
                             :title="bg.name">
                        </div>
                    </div>
                    <div class="form-hint" v-if="!backgroundImageUrl">或自定义CSS渐变/颜色：</div>
                    <input v-if="!backgroundImageUrl" v-model="editForm.background" placeholder="linear-gradient(135deg, #667eea, #764ba2) 或 #ff0000" class="text-input">

                    <!-- ===== 新增：文字颜色设置 ===== -->
                    <div class="theme-color-section" style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
                        <label class="edit-label">✏️ 文字与主题颜色</label>
                        
                        <!-- 智能模式切换 -->
                        <div class="theme-mode-toggle">
                            <button 
                                class="mode-btn" 
                                :class="{ active: textColorMode === 'auto' }"
                                @click="textColorMode = 'auto'"
                                title="根据背景亮度自动选择最佳文字颜色">
                                🤖 自动适配
                            </button>
                            <button 
                                class="mode-btn" 
                                :class="{ active: textColorMode === 'light' }"
                                @click="textColorMode = 'light'; editForm.textColor = '#ffffff'"
                                title="使用浅色文字（适合深色背景）">
                                ☀️ 浅色文字
                            </button>
                            <button 
                                class="mode-btn" 
                                :class="{ active: textColorMode === 'dark' }"
                                @click="textColorMode = 'dark'; editForm.textColor = '#1a1a1a'"
                                title="使用深色文字（适合浅色背景）">
                                🌙 深色文字
                            </button>
                            <button 
                                class="mode-btn" 
                                :class="{ active: textColorModeMode === 'custom' }"
                                @click="textColorMode = 'custom'"
                                title="完全自定义文字颜色">
                                🎨 自定义
                            </button>
                        </div>

                        <!-- 自定义颜色选择器 -->
                        <div v-if="textColorMode === 'custom'" class="custom-color-picker" style="margin-top:12px">
                            <label>选择文字颜色：</label>
                            <div class="color-input-row">
                                <input type="color" v-model="editForm.textColor" class="color-picker-input">
                                <input type="text" v-model="editForm.textColor" placeholder="#ffffff" class="text-input" style="flex:1">
                            </div>
                        </div>

                        <!-- 预设文字颜色快捷选项 -->
                        <div class="text-color-presets" style="margin-top:12px">
                            <span class="preset-label">快捷选择：</span>
                            <div class="color-chip" 
                                 v-for="color in textColorPresets" 
                                 :key="color.value"
                                 :style="{ backgroundColor: color.bg, color: color.text }"
                                 :class="{ active: editForm.textColor === color.value }"
                                 @click="editForm.textColor = color.value; textColorMode = 'custom'"
                                 :title="color.name">
                                Aa
                            </div>
                        </div>

                        <!-- 实时预览效果 -->
                        <div class="live-preview-box" :style="getLivePreviewStyle()" style="margin-top:16px">
                            <div class="preview-sample-text">
                                <h3 style="margin:0;font-size:20px;font-weight:800">{{ seller.username || '用户名' }}</h3>
                                <p style="margin:8px 0 0;opacity:0.9;font-size:14px">📍 示例位置信息</p>
                                <p style="margin:4px 0 0;opacity:0.85;font-size:13px">📅 注册时间: 2026-08-20</p>
                                <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
                                    <span style="padding:4px 12px;border-radius:12px;font-size:12px;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px)">标签示例1</span>
                                    <span style="padding:4px 12px;border-radius:12px;font-size:12px;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px)">标签示例2</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-hint" style="margin-top:8px;color:var(--warning)">
                            💡 <strong>提示：</strong>深色背景建议用浅色文字，浅色背景建议用深色文字。<br>
                            选择"自动适配"模式可根据背景智能调整，避免看不清的问题！
                        </div>
                    </div>
                </div>

                <!-- 个人标签 -->
                <div class="edit-section">
                    <label class="edit-label">🏷️ 个性标签</label>
                    <div class="tags-input-area">
                        <div class="current-tags">
                            <span class="tag-editable" v-for="(tag, idx) in editTagsList" :key="idx">
                                {{ tag }}
                                <span class="tag-remove" @click="removeTag(idx)">×</span>
                            </span>
                        </div>
                        <div class="add-tag-row">
                            <input v-model="newTag" 
                                   @keyup.enter="addTag" 
                                   placeholder="输入标签后按回车添加"
                                   class="tag-input"
                                   maxlength="10">
                            <button class="btn-add-tag" @click="addTag" :disabled="!newTag.trim()">+ 添加</button>
                        </div>
                    </div>
                    <div class="form-hint">
                        推荐标签：
                        <span class="recommended-tag" v-for="tag in recommendedTags" :key="tag" @click="addRecommendedTag(tag)">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <!-- 预览区域 -->
                <div class="edit-section">
                    <label class="edit-label">👁️ 效果预览</label>
                    <div class="preview-card" :style="getPreviewBackgroundStyle()">
                        <div class="preview-avatar">
                            <img v-if="editForm.avatar" :src="editForm.avatar" alt="">
                            <span v-else>{{ (seller.username || 'U').charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="preview-info">
                            <div class="preview-name">{{ seller.username }}</div>
                            <div class="preview-tags-mini">
                                <span v-for="(tag, idx) in editTagsList.slice(0, 3)" :key="idx">{{ tag }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn-cancel" @click="showEditModal = false; resetEditForm()">取消</button>
                    <button class="btn-submit" @click="saveProfile" :disabled="saving">
                        {{ saving ? '保存中...' : '💾 保存更改' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="container" v-else>
        <div class="empty-state" style="padding:100px 20px">
            <div class="icon">⏳</div>
            <h3>加载中...</h3>
        </div>
    </div>`,
    
    data() {
        return {
            sellerId: null,
            seller: null,
            onSaleBooks: [],
            soldCount: 0,
            loading: true,

            // 编辑相关
            showEditModal: false,
            saving: false,
            editForm: {
                avatar: '',
                background: '',
                tags: '',
                textColor: '',  // 新增：自定义文字颜色
                textColorMode: 'auto'  // 新增：auto/light/dark/custom
            },
            backgroundImageUrl: '',
            newTag: '',
            
            // 文字颜色模式
            textColorMode: 'auto',  // auto/light/dark/custom
            
            // 直接购买相关数据
            showBuyModal: false,
            buying: false,
            currentBookForBuy: null,
            buyForm: {
                receiverName: '',
                phone: '',
                province: '',
                city: '',
                district: '',
                detailAddress: '',
                remark: ''
            },
            // 省市区数据
            provinces: [],
            cities: [],
            districts: [],
            
            // 背景预设
            bgPresets: [
                { name: '紫蓝渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { name: '粉红渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                { name: '橙黄渐变', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
                { name: '青绿渐变', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
                { name: '深蓝渐变', value: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)', preview: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)' },
                { name: '暖色渐变', value: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)', preview: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)' }
            ],
            
            // 推荐标签
            recommendedTags: ['诚信卖家', '快速发货', '书籍保存完好', '学生党', '价格实惠', '正版保证', '包装仔细', '热情服务'],
            
            // 文字颜色预设
            textColorPresets: [
                { name: '纯白', value: '#ffffff', bg: '#1a1a1a', text: '#ffffff' },
                { name: '乳白', value: '#f5f5f5', bg: '#2d2d2d', text: '#f5f5f5' },
                { name: '浅灰', value: '#e0e0e0', bg: '#3d3d3d', text: '#e0e0e0' },
                { name: '纯黑', value: '#1a1a1a', bg: '#f0f0f0', text: '#1a1a1a' },
                { name: '深灰', value: '#333333', bg: '#e8e8e8', text: '#333333' },
                { name: '墨绿', value: '#2d5016', bg: '#c8e6c9', text: '#2d5016' },
                { name: '深蓝', value: '#1a237e', bg: '#c5cae9', text: '#1a237e' }
            ]
        };
    },
    
    computed: {
        isOwnProfile() {
            const user = store.getUser();
            return user && user.id == this.sellerId;
        },
        parsedTags() {
            if (!this.seller || !this.seller.tags) return [];
            return this.seller.tags.split(',').filter(t => t.trim());
        },
        editTagsList: {
            get() {
                if (!this.editForm.tags) return [];
                return this.editForm.tags.split(',').filter(t => t.trim());
            },
            set(tags) {
                this.editForm.tags = tags.join(',');
            }
        }
    },

    async mounted() {
        this.sellerId = this.$route.params.id;
        if (this.sellerId) {
            await this.loadSellerInfo();
            // 加载省市区数据
            await this.loadRegionData();
        }
    },
    
    methods: {
        goBack() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.hash = '#/';
            }
        },

        async loadSellerInfo() {
            this.loading = true;
            try {
                const sellerData = await api.get('/user/seller/' + this.sellerId);
                console.log('=== [DEBUG] 从服务器获取的完整数据 ===', JSON.stringify(sellerData, null, 2));
                console.log('=== [DEBUG] seller 对象 ===', sellerData.seller);
                console.log('=== [DEBUG] textColor 字段 ===', sellerData.seller?.textColor);
                console.log('=== [DEBUG] textColorMode 字段 ===', sellerData.seller?.textColorMode);
                console.log('=== [DEBUG] background 字段 ===', sellerData.seller?.background);

                // 直接赋值（Vue 2 会自动检测 data 属性的变化）
                this.seller = sellerData.seller || null;
                this.soldCount = sellerData.soldCount || 0;

                console.log('=== [DEBUG] 赋值后的 this.seller ===', this.seller);
                console.log('=== [DEBUG] 赋值后的 this.seller.textColor ===', this.seller?.textColor);
                console.log('=== [DEBUG] 赋值后的 this.seller.textColorMode ===', this.seller?.textColorMode);
                console.log('=== [DEBUG] 赋值后的 this.seller.background ===', this.seller?.background);

                const books = await api.get('/secondbook/my/' + this.sellerId);
                this.onSaleBooks = (books || []).filter(b => String(b.status) === '1');

                console.log('✅ 卖家信息加载完成');
            } catch (e) {
                console.error('加载卖家信息失败:', e);
                this.showToast('加载失败', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        viewBookDetail(bookId) {
            if (this.$root.$children[0] && this.$root.$children[0].$refs.homeView) {
                this.$router.push('/');
                setTimeout(() => {
                    const homeComponent = document.querySelector('[class*="home"]')?.__vue__;
                    if (homeComponent && homeComponent.viewDetail) {
                        homeComponent.viewDetail(bookId);
                    }
                }, 100);
            } else {
                alert('请返回首页查看详情');
            }
        },
        
        async addToCart(bookId) {
            const user = store.getUser();
            if (!user) { 
                this.$root.showLoginModal = true; 
                return; 
            }
            try {
                const data = await api.post('/cart/add', { userId: user.id, secondBookId: bookId });
                if (data.code === 200) {
                    this.showToast('已加入购物车', 'success');
                } else {
                    this.showToast(data.msg || '添加失败', 'error');
                }
            } catch (e) {
                this.showToast('网络错误', 'error');
            }
        },
        
        async buyNow(book) {
            const user = store.getUser();
            if (!user) { 
                this.$root.showLoginModal = true; 
                return; 
            }
            
            // 保存当前要购买的书籍
            this.currentBookForBuy = book;
            
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
            
            // 初始化表单
            this.buyForm = {
                receiverName: user.username || '',
                phone: user.phone || '',
                province: savedProvince,
                city: savedCity,
                district: savedDistrict,
                detailAddress: savedDetailAddress,
                remark: ''
            };
            
            // 打开购买弹窗
            this.showBuyModal = true;
        },
        
        // 加载省市区数据
        async loadRegionData() {
            try {
                // 使用全局的 regionData（如果已加载）
                if (typeof regionData !== 'undefined' && regionData.provinces) {
                    this.provinces = regionData.provinces;
                } else {
                    // 如果未加载，尝试动态导入
                    const module = await import('./regionData.js');
                    this.provinces = module.default.provinces;
                }
            } catch (e) {
                console.error('加载省市区数据失败:', e);
                this.provinces = [];
            }
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
        
        // 获取完整地址
        getFullAddress() {
            const provinceName = this.provinces.find(p => p.code === this.buyForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.buyForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.buyForm.district)?.name || '';
            const parts = [provinceName, cityName, districtName, this.buyForm.detailAddress].filter(p => p && p.trim());
            return parts.join('');
        },
        
        // 获取用于保存的地址（带分隔符）
        getAddressForSave() {
            const provinceName = this.provinces.find(p => p.code === this.buyForm.province)?.name || '';
            const cityName = this.cities.find(c => c.code === this.buyForm.city)?.name || '';
            const districtName = this.districts.find(d => d.code === this.buyForm.district)?.name || '';
            return `${provinceName}|${cityName}|${districtName}|${this.buyForm.detailAddress}`;
        },
        
        // 确认购买
        async confirmBuy() {
            const user = store.getUser();
            if (!user) {
                this.showToast('请先登录', 'error');
                return;
            }
            
            // 表单验证
            if (!this.buyForm.receiverName.trim()) {
                this.showToast('请输入收货人姓名', 'error');
                return;
            }
            if (!this.buyForm.phone.trim()) {
                this.showToast('请输入联系电话', 'error');
                return;
            }
            if (!this.buyForm.province) {
                this.showToast('请选择省份', 'error');
                return;
            }
            if (!this.buyForm.city) {
                this.showToast('请选择城市', 'error');
                return;
            }
            if (!this.buyForm.detailAddress.trim()) {
                this.showToast('请输入详细地址', 'error');
                return;
            }
            
            if (!this.currentBookForBuy) {
                this.showToast('商品信息错误', 'error');
                return;
            }
            
            this.buying = true;
            
            try {
                const fullAddress = this.getFullAddress();
                const addressForSave = this.getAddressForSave();
                
                console.log('🛒 开始下单:', {
                    bookId: this.currentBookForBuy.id,
                    bookName: this.currentBookForBuy.name,
                    price: this.currentBookForBuy.price,
                    address: fullAddress
                });
                
                // 创建订单
                const orderData = await api.post('/orders/create', {
                    buyerId: user.id,
                    bookId: this.currentBookForBuy.id,
                    totalPrice: this.currentBookForBuy.price,
                    receiverName: this.buyForm.receiverName,
                    address: fullAddress,
                    phone: this.buyForm.phone,
                    remark: this.buyForm.remark
                });
                
                console.log('📦 订单创建结果:', orderData);
                
                if (orderData.code === 200) {
                    this.showToast('✅ 下单成功！', 'success');
                    
                    // 保存用户地址信息
                    try {
                        await api.put('/user/updateProfile', {
                            id: user.id,
                            address: addressForSave,
                            ip: this.provinces.find(p => p.code === this.buyForm.province)?.name || user.ip
                        });
                    } catch (e) {
                        console.log('保存地址信息失败:', e);
                    }
                    
                    // 关闭弹窗并刷新列表
                    this.showBuyModal = false;
                    await this.loadSellerInfo();
                    
                    // 可选：跳转到订单页面
                    setTimeout(() => {
                        if (confirm('下单成功！是否查看我的订单？')) {
                            this.$router.push('/orders');
                        }
                    }, 500);
                    
                } else {
                    this.showToast(orderData.msg || '下单失败，请重试', 'error');
                }
                
            } catch (e) {
                console.error('❌ 下单异常:', e);
                this.showToast('网络错误，请稍后重试', 'error');
            } finally {
                this.buying = false;
            }
        },
        
        getLevelClass(level) {
            if (level === '全新') return 'badge-new';
            if (level === '九成新' || level === '八成新') return 'badge-good';
            if (level === '七成新') return 'badge-normal';
            return 'badge-other';
        },
        
        imgError(e) {
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.placeholder').style.display = 'flex';
        },
        
        formatTime(time) {
            if (!time) return '未知';
            try {
                const d = new Date(time);
                return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
            } catch(e) { return time; }
        },
        
        showToast(msg, type) {
            const icons = { success: '✓', error: '✗' };
            const t = document.createElement('div');
            t.className = 'toast ' + type;
            t.innerHTML = (icons[type] || '') + ' ' + msg;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 2600);
        },

        // ===== 编辑主页功能 =====
        openEditModal() {
            this.editForm = {
                avatar: this.seller.avatar || '',
                background: this.seller.background || '',
                tags: this.seller.tags || '',
                textColor: this.seller.textColor || '',
                textColorMode: this.seller.textColorMode || 'auto'
            };
            
            // 检查背景是否为URL（以http开头）
            const bg = this.seller.background || '';
            if (bg.startsWith('http://') || bg.startsWith('https://')) {
                this.backgroundImageUrl = bg;
                this.editForm.background = '';  // 清空渐变色
            } else {
                this.backgroundImageUrl = '';
            }
            
            // 初始化文字颜色模式
            this.textColorMode = this.seller.textColorMode || 'auto';
            if (!this.editForm.textColor) {
                this.editForm.textColor = this.calculateTextColor(bg);
            }
            
            this.newTag = '';
            this.showEditModal = true;
        },

        resetEditForm() {
            this.editForm = {
                avatar: this.seller.avatar || '',
                background: this.seller.background || '',
                tags: this.seller.tags || ''
            };
            this.newTag = '';
        },

        validateUrl() {
            if (!this.editForm.avatar || !this.editForm.avatar.trim()) return true;

            const url = this.editForm.avatar.trim();

            // 放宽URL验证规则，支持更多格式
            const validPatterns = [
                /^https?:\/\/.+/i,  // http:// 或 https:// 开头
                /^\/uploads\/.+/,   // 相对路径
                /^data:image\/.+/i, // base64 图片
                /^\/.+/             // 其他相对路径
            ];

            const isValid = validPatterns.some(pattern => pattern.test(url));

            if (!isValid && url.length > 5) {
                console.warn('URL格式可能不正确:', url);
                return false;
            }

            return true;
        },

        handleAvatarError(e) {
            e.target.style.display = 'none';
            this.showToast('图片加载失败，请检查URL是否正确', 'error');
        },

        addTag() {
            if (!this.newTag.trim()) return;
            
            const tag = this.newTag.trim();
            const currentTags = this.editTagsList;
            
            if (currentTags.includes(tag)) {
                this.showToast('该标签已存在', 'error');
                return;
            }
            
            if (currentTags.length >= 6) {
                this.showToast('最多添加6个标签', 'error');
                return;
            }
            
            currentTags.push(tag);
            this.editTagsList = currentTags;
            this.newTag = '';
        },

        removeTag(idx) {
            const tags = this.editTagsList;
            tags.splice(idx, 1);
            this.editTagsList = tags;
        },

        addRecommendedTag(tag) {
            this.newTag = tag;
            this.addTag();
        },
        
        // 背景图片URL相关方法
        onBackgroundUrlChange() {
            // 当输入URL时，清空渐变色选择
            if (this.backgroundImageUrl.trim()) {
                this.editForm.background = '';
            }
        },
        
        clearBackgroundUrl() {
            this.backgroundImageUrl = '';
        },
        
        selectBgPreset(bgValue) {
            // 选择渐变色时，清空背景图片URL
            this.backgroundImageUrl = '';
            this.editForm.background = bgValue;
        },
        
        handleBgImageError(e) {
            console.error('背景图片加载失败:', e);
            this.showToast('背景图片加载失败，请检查URL是否正确', 'error');
        },
        
        getPreviewBackgroundStyle() {
            // 优先使用URL背景图
            if (this.backgroundImageUrl && this.backgroundImageUrl.trim()) {
                return {
                    backgroundImage: `url(${this.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            }
            // 否则使用渐变色
            return {
                background: this.editForm.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            };
        },
        
        getSellerCardBackgroundStyle() {
            if (!this.seller) {
                console.log('⚠️ this.seller 不存在');
                return {};
            }

            const bg = this.seller?.background || '';
            console.log('🎨 [getSellerCardBackgroundStyle] 当前背景值:', bg.substring(0, 50) + '...');
            console.log('🎨 [getSellerCardBackgroundStyle] 背景长度:', bg.length);

            let baseStyle = {};

            // 检查是否为网络 URL (http/https)
            if (bg && (bg.startsWith('http://') || bg.startsWith('https://'))) {
                console.log('✅ 使用网络图片背景');
                baseStyle = {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            }
            // 检查是否为 Base64 Data URI (data:image/...)
            else if (bg && bg.startsWith('data:image/')) {
                console.log('✅ 使用 Base64 图片背景');
                baseStyle = {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            }
            // 检查是否为本地路径 (/uploads/...)
            else if (bg && bg.startsWith('/uploads/')) {
                console.log('✅ 使用本地图片背景');
                baseStyle = {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            }
            // 使用渐变色或默认值
            else {
                const finalBg = bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                console.log('✅ 使用渐变背景:', finalBg);
                baseStyle = { background: finalBg };
            }

            // ===== 新增：计算并应用文字颜色 =====
            let textColor = '#ffffff';  // 默认白色

            const mode = this.seller?.textColorMode || 'auto';
            console.log('=== [DEBUG-文字颜色] textColorMode 原始值:', this.seller?.textColorMode);
            console.log('=== [DEBUG-文字颜色] textColor 原始值:', this.seller?.textColor);
            console.log('=== [DEBUG-文字颜色] 使用模式:', mode);

            if (mode === 'auto') {
                // 自动模式：根据背景亮度计算最佳文字颜色
                textColor = this.calculateTextColor(bg);
                console.log('=== [DEBUG-文字颜色] 自动计算结果:', textColor);
            } else if (this.seller?.textColor) {
                // 使用用户设置的自定义颜色
                textColor = this.seller.textColor;
                console.log('=== [DEBUG-文字颜色] 使用自定义颜色:', textColor);
            } else {
                console.log('=== [DEBUG-文字颜色] 使用默认颜色:', textColor);
            }

            // 应用文字颜色到样式
            baseStyle.color = textColor;

            console.log('🎨 文字颜色模式:', mode, '| 最终颜色:', textColor);
            console.log('=== [DEBUG-文字颜色] 完整样式对象:', JSON.stringify(baseStyle, null, 2));
            
            return baseStyle;
        },

        // ===== 新增：智能文字颜色计算 =====
        calculateTextColor(backgroundColor) {
            if (!backgroundColor) {
                return '#ffffff';  // 默认返回白色（适合深色背景）
            }

            try {
                // 提取主要颜色（处理渐变、URL等情况）
                let mainColor = backgroundColor;

                // 如果是渐变，提取第一个颜色
                if (mainColor.includes('gradient')) {
                    const colorMatch = mainColor.match(/#[0-9a-fA-F]{6}|rgba?\([^)]+\)/gi);
                    if (colorMatch && colorMatch.length > 0) {
                        mainColor = colorMatch[0];
                    } else {
                        return '#ffffff';  // 无法解析，默认白色
                    }
                }

                // 如果是 URL 背景，默认使用白色（大多数图片背景较暗或有遮罩）
                if (mainColor.includes('url(') || mainColor.startsWith('http')) {
                    return '#ffffff';
                }

                // 解析颜色值
                let r = 0, g = 0, b = 0;

                if (mainColor.startsWith('#')) {
                    // 十六进制颜色
                    const hex = mainColor.slice(1);
                    if (hex.length === 3) {
                        r = parseInt(hex[0] + hex[0], 16);
                        g = parseInt(hex[1] + hex[1], 16);
                        b = parseInt(hex[2] + hex[2], 16);
                    } else if (hex.length === 6) {
                        r = parseInt(hex.slice(0, 2), 16);
                        g = parseInt(hex.slice(2, 4), 16);
                        b = parseInt(hex.slice(4, 6), 16);
                    }
                } else if (mainColor.startsWith('rgb')) {
                    // RGB/RGBA 颜色
                    const rgbMatch = mainColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
                    if (rgbMatch) {
                        r = parseInt(rgbMatch[1]);
                        g = parseInt(rgbMatch[2]);
                        b = parseInt(rgbMatch[3]);
                    }
                }

                // 计算亮度（使用相对亮度公式）
                // 参考 WCAG 2.0 标准
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                console.log(`🎨 颜色分析: RGB(${r},${g},${b}), 亮度: ${luminance.toFixed(2)}`);

                // 亮度 > 0.5 认为是浅色背景，用深色文字；否则用浅色文字
                if (luminance > 0.5) {
                    console.log('✅ 浅色背景 → 使用深色文字 (#1a1a1a)');
                    return '#1a1a1a';  // 深色文字
                } else {
                    console.log('✅ 深色背景 → 使用浅色文字 (#ffffff)');
                    return '#ffffff';  // 浅色文字
                }
            } catch (e) {
                console.warn('⚠️ 颜色解析失败，使用默认白色:', e);
                return '#ffffff';
            }
        },

        // ===== 新增：实时预览样式 =====
        getLivePreviewStyle() {
            let bgColor = {};

            // 获取当前选择的背景
            if (this.backgroundImageUrl && this.backgroundImageUrl.trim()) {
                bgColor = {
                    backgroundImage: `url(${this.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            } else {
                bgColor = { background: this.editForm.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
            }

            // 根据模式计算文字颜色
            let textColor = '#ffffff';
            if (this.textColorMode === 'auto') {
                textColor = this.calculateTextColor(this.editForm.background || this.backgroundImageUrl);
            } else if (this.textColorMode === 'light') {
                textColor = '#ffffff';
            } else if (this.textColorMode === 'dark') {
                textColor = '#1a1a1a';
            } else if (this.editForm.textColor) {
                textColor = this.editForm.textColor;
            }

            return {
                ...bgColor,
                color: textColor,
                padding: '20px',
                borderRadius: '12px',
                minHeight: '120px'
            };
        },

        async saveProfile() {
            this.saving = true;
            try {
                const finalBackground = this.backgroundImageUrl.trim() || this.editForm.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                
                // 计算最终文字颜色
                let finalTextColor = '';
                let finalTextColorMode = this.textColorMode || 'auto';
                
                if (finalTextColorMode === 'auto') {
                    finalTextColor = '';  // 自动模式不保存具体颜色，由前端计算
                } else if (finalTextColorMode === 'light') {
                    finalTextColor = '#ffffff';
                } else if (finalTextColorMode === 'dark') {
                    finalTextColor = '#1a1a1a';
                } else {
                    finalTextColor = this.editForm.textColor || '';
                }

                const updateData = {
                    id: parseInt(this.sellerId),
                    avatar: this.editForm.avatar,
                    background: finalBackground,
                    tags: this.editTagsList.join(','),
                    textColor: finalTextColor,  // 新增
                    textColorMode: finalTextColorMode  // 新增
                };

                console.log('📤 [步骤1] 准备发送到服务器的数据:');
                console.log('  - ID:', updateData.id);
                console.log('  - Background:', updateData.background);
                console.log('  - Text Color Mode:', updateData.textColorMode);
                console.log('  - Text Color:', updateData.textColor);

                const result = await api.put('/user/updateProfile', updateData);

                console.log('📥 [步骤2] 服务器返回结果:');
                console.log('  - 完整返回:', result);
                console.log('  - success:', result.success);
                console.log('  - msg:', result.msg);

                if (result.success !== false) {
                    this.showToast('主页更新成功！正在验证...', 'success');
                    this.showEditModal = false;

                    console.log('⏳ [步骤3] 等待1秒后重新加载...');
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    console.log('🔄 [步骤4] 调用 loadSellerInfo...');
                    await this.loadSellerInfo();

                    console.log('✅ [步骤5] 重新加载完成，当前 seller 对象:');
                    console.log('  - this.seller:', this.seller);
                    console.log('  - this.seller?.background:', this.seller?.background);

                    // 强制触发样式更新
                    this.$nextTick(() => {
                        console.log('🎨 [步骤6] 样式方法调用结果:');
                        const styleResult = this.getSellerCardBackgroundStyle();
                        console.log('  - 计算出的样式:', styleResult);

                        // 检查DOM元素
                        setTimeout(() => {
                            const card = document.querySelector('.seller-profile-card');
                            if (card) {
                                console.log('🖼️ [步骤7] DOM元素实际样式:');
                                console.log('  - background:', window.getComputedStyle(card).background);
                                console.log('  - backgroundImage:', window.getComputedStyle(card).backgroundImage);
                                console.log('  - 完整style属性:', card.getAttribute('style'));
                            }

                            this.showToast('主页更新成功！✨', 'success');
                        }, 500);
                    });

                    if (this.$parent && this.$parent.loadUserProfile) {
                        setTimeout(() => {
                            this.$parent.loadUserProfile();
                        }, 300);
                    }
                } else {
                    console.error('❌ 保存失败:', result.msg);
                    this.showToast(result.msg || '保存失败', 'error');
                }
            } catch (e) {
                console.error('❌ 保存异常:', e);
                this.showToast('网络错误，请稍后重试', 'error');
            } finally {
                this.saving = false;
            }
        }
    }
};
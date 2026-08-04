const BookCard = {
    template: `
    <div class="book-card" :class="{ 'sold-out': !isOnSale }" @click="$emit('view-detail', book.id)">
        <div class="book-card-img">
            <img v-if="book.image" :src="book.image" :alt="book.name" @error="imgError">
            <span class="placeholder" v-else>📖</span>
            <span class="condition-badge" :class="levelClass">{{ book.level || '九成新' }}</span>
            <span class="category-tag" v-if="book.categoryName">{{ book.categoryName }}</span>
            <button class="favorite-btn" :class="{ favorited: isFavorited }"
                    @click.stop="toggleFavorite" :title="isFavorited ? '取消收藏' : '收藏'">
                {{ isFavorited ? '❤️' : '🤍' }}
            </button>
            <div class="sold-out-overlay" v-if="!isOnSale" @click.stop>
                <span>已售出</span>
            </div>
        </div>
        <div class="book-info">
            <h3 :title="book.name" :class="{ 'text-muted': !isOnSale }">{{ book.name }}</h3>
            <div class="author">✍ {{ book.author || '未知作者' }}</div>
            <div class="desc">{{ book.bookDesc || '暂无描述' }}</div>
            <div class="price-row">
                <span class="price"><small>¥</small>{{ (book.price || 0).toFixed(2) }}</span>
                <span class="seller-tag" v-if="book.sellerName">{{ book.sellerName }}</span>
            </div>
        </div>
        <div class="book-actions" v-if="isOnSale">
            <button class="btn-outline" @click.stop="$emit('add-cart', book.id)">🛒 加入购物车</button>
            <button class="btn-primary" @click.stop="$emit('buy-now', book)">⚡ 立即购买</button>
        </div>
        <div class="book-actions" v-else>
            <button class="btn-disabled" disabled @click.stop="showSoldOutTip">该书已售出</button>
        </div>
    </div>`,
    props: { book: Object, isFavorited: { type: Boolean, default: false } },
    emits: ['add-cart', 'buy-now', 'view-detail', 'toggle-favorite'],
    computed: {
        isOnSale() {
            return String(this.book.status) === '1' || this.book.status === 1;
        },
        levelClass() {
            const l = this.book.level;
            if (l === '全新') return 'badge-new';
            if (l === '九成新' || l === '八成新') return 'badge-good';
            if (l === '七成新') return 'badge-normal';
            return 'badge-other';
        }
    },
    methods: {
        imgError(e) {
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.placeholder').style.display = 'flex';
        },
        toggleFavorite() {
            this.$emit('toggle-favorite', this.book.id);
        },
        showSoldOutTip() {
            const user = store.getUser();
            if (!user) {
                alert('请先登录');
                return;
            }
            alert('抱歉，这本书已经售出了或已下架！');
        }
    }
};
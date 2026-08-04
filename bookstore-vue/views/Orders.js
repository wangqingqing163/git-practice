const Orders = {
    template: `
    <div class="container" v-if="user">
        <div class="page-title">我的订单</div>
        <div class="chips">
            <span class="chip" :class="{ active: tab === 'buy' }" @click="tab='buy'">我买的</span>
            <span class="chip" :class="{ active: tab === 'sell' }" @click="tab='sell'; loadUrgedOrders(); loadConfirmedOrders()">我卖的</span>
        </div>

        <div class="section-card" v-if="tab==='buy'">
            <div class="section-header">
                <h3>购买记录</h3>
                <div class="batch-actions" v-if="selectedBuyOrders.length > 0">
                    <span class="selected-count">已选 {{ selectedBuyOrders.length }} 项</span>
                    <button class="action-btn btn-danger" @click="batchDeleteBuyOrders">批量删除</button>
                    <button class="action-btn btn-default" @click="selectedBuyOrders = []">取消选择</button>
                </div>
            </div>
            <table v-if="buyOrders.length">
                <thead><tr><th style="width:40px"><input type="checkbox" v-model="selectAllBuyOrders" @change="toggleSelectAllBuyOrders"></th><th>订单号</th><th>图书</th><th>卖家</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="o in buyOrders" :key="o.id" :class="{ 'selected-row': selectedBuyOrders.includes(o.id) }">
                        <td><input type="checkbox" :value="o.id" v-model="selectedBuyOrders"></td>
                        <td>#{{ o.id }}</td>
                        <td>{{ o.bookName || '图书#'+o.bookId }}</td>
                        <td>{{ o.sellerName || '用户#'+o.sellerId }}</td>
                        <td>¥{{ (o.totalPrice||0).toFixed(2) }}</td>
                        <td>
                            <span class="status-badge" :class="statusClass(o.statusText)">{{ o.statusText || '待发货' }}</span>
                            <span v-if="o.statusText==='已发货' && o.buyerConfirmed" class="confirmed-badge">已确认发货信息</span>
                        </td>
                        <td>
                            <button class="action-btn btn-receive" v-if="o.statusText==='已发货' && !o.buyerConfirmed" @click="confirmShipInfo(o.id)">已确认发货信息</button>
                            <button class="action-btn btn-receive" v-if="o.statusText==='已发货'" @click="receiveOrder(o.id)">确认收货</button>
                            <button class="action-btn btn-warning" v-if="o.statusText==='已收货' && !o.commented" @click="showComment(o)">评价</button>
                            <button class="action-btn btn-urge" v-if="o.statusText==='待发货' && !o.urged" @click="urgeOrder(o.id)">催发货</button>
                            <span v-if="o.statusText==='待发货' && o.urged" style="color:#f59e0b;font-size:12px">已催发货</span>
                            <button class="action-btn btn-cancel" v-if="o.statusText==='待发货'" @click="cancelOrder(o.id)">取消订单</button>
                            <span v-if="o.statusText==='已收货' && o.commented" style="color:#9ca3af;font-size:12px">已评价</span>
                            <span v-if="o.statusText==='已取消'" style="color:#ef4444;font-size:12px">已取消</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state"><div class="icon">📦</div><h3>暂无购买记录</h3></div>
        </div>

        <div class="section-card" v-if="tab==='sell'">
            <div class="section-header">
                <h3>售出记录</h3>
                <div class="batch-actions" v-if="selectedSellOrders.length > 0">
                    <span class="selected-count">已选 {{ selectedSellOrders.length }} 项</span>
                    <button class="action-btn btn-danger" @click="batchDeleteSellOrders">批量删除</button>
                    <button class="action-btn btn-default" @click="selectedSellOrders = []">取消选择</button>
                </div>
            </div>
            <div v-if="urgedOrders.length > 0" class="urge-notify">
                ⚡ 有 <strong>{{ urgedOrders.length }}</strong> 个订单的买家在催发货，请及时处理！
            </div>
            <div v-if="confirmedOrders.length > 0" class="confirmed-notify">
                ✅ 有 <strong>{{ confirmedOrders.length }}</strong> 个订单的买家已确认发货信息！
            </div>
            <table v-if="sellOrders.length">
                <thead><tr><th style="width:40px"><input type="checkbox" v-model="selectAllSellOrders" @change="toggleSelectAllSellOrders"></th><th>订单号</th><th>图书</th><th>金额</th><th>买家</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="o in sellOrders" :key="o.id" :class="{ 'selected-row': selectedSellOrders.includes(o.id) }">
                        <td><input type="checkbox" :value="o.id" v-model="selectedSellOrders"></td>
                        <td>#{{ o.id }}</td>
                        <td>{{ o.bookName || '图书#'+o.bookId }}</td>
                        <td>¥{{ (o.totalPrice||0).toFixed(2) }}</td>
                        <td>{{ o.buyerName || '用户#'+o.buyerId }}</td>
                        <td>
                            <span class="status-badge" :class="statusClass(o.statusText)">{{ o.statusText || '待发货' }}</span>
                            <span v-if="o.statusText==='待发货' && o.urged" style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px">买家催发货</span>
                            <span v-if="o.statusText==='已发货' && o.buyerConfirmed" style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px">买家已确认</span>
                            <span v-if="o.hasComment" style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px;font-weight:600">💬 已评价</span>
                        </td>
                        <td>
                            <button class="action-btn btn-ship" v-if="o.statusText==='待发货'" @click="openShipModal(o.id)">发货</button>
                            <button class="action-btn btn-primary" v-if="o.hasComment" @click="viewBuyerComment(o)">查看评价</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state"><div class="icon">📦</div><h3>暂无售出记录</h3></div>
        </div>

        <div class="modal-overlay" v-if="shipping" @click.self="shipping=null">
            <div class="modal">
                <h2>📦 填写快递单号</h2>
                <div class="form-group">
                    <label>快递单号 <span style="color:#ef4444">*</span></label>
                    <input v-model="shipTrackingNo" placeholder="请输入快递单号" />
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="shipping=null">取消</button>
                    <button class="btn-submit" @click="confirmShip" :disabled="!shipTrackingNo.trim()">确认发货</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="logisticsOrder" @click.self="logisticsOrder=null">
            <div class="modal">
                <h2>📮 物流信息查询</h2>
                <div class="logistics-info">
                    <div class="info-row"><span class="info-label">订单编号：</span><span>#{{ logisticsOrder.id }}</span></div>
                    <div class="info-row"><span class="info-label">快递单号：</span><span class="tracking-no-highlight">{{ logisticsOrder.trackingNo }}</span></div>
                    <div class="info-row"><span class="info-label">快递公司：</span><span>{{ logisticsOrder.expressCompany || '请根据单号判断' }}</span></div>
                </div>
                <div class="logistics-tip">
                    <p>请复制快递单号，前往快递公司官网或以下平台查询物流进度：</p>
                    <a :href="'https://www.kuaidi100.com/result.jsp?nu=' + logisticsOrder.trackingNo" target="_blank" class="logistics-link">🔍 快递100查询</a>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="logisticsOrder=null">关闭</button>
                    <button class="btn-submit" v-if="!logisticsOrder.buyerConfirmed" @click="confirmShipInfo(logisticsOrder.id); logisticsOrder=null">已确认发货信息</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="commenting" @click.self="commenting=null">
            <div class="modal">
                <h2>✍ 评价订单</h2>
                <div class="form-group"><label>评分</label>
                    <div style="display:flex;gap:4px;font-size:24px">
                        <span v-for="s in 5" :key="s" style="cursor:pointer" @click="commentForm.rating = s">{{ s <= commentForm.rating ? '⭐' : '☆' }}</span>
                    </div>
                </div>
                <div class="form-group"><label>评价内容</label><textarea v-model="commentForm.content" placeholder="说说你的感受..."></textarea></div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="commenting=null">取消</button>
                    <button class="btn-submit" @click="submitComment">提交评价</button>
                </div>
            </div>
        </div>

        <!-- 查看买家评价弹窗（卖家端） -->
        <div class="modal-overlay" v-if="viewCommentOrder" @click.self="viewCommentOrder=null">
            <div class="modal" style="width:500px">
                <h2>💬 买家评价详情</h2>
                <div v-if="viewCommentOrder.comments && viewCommentOrder.comments.length > 0" style="margin:16px 0">
                    <div v-for="(comment, idx) in viewCommentOrder.comments" :key="idx" style="background:#f8f9fa;padding:16px;border-radius:8px;margin-bottom:12px;border-left:4px solid #3b82f6">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                            <strong style="color:#1f2937">{{ comment.username || '匿名买家' }}</strong>
                            <span style="color:#f59e0b;font-size:18px">{{ '⭐'.repeat(comment.score || 5) }}</span>
                        </div>
                        <div style="color:#4b5563;line-height:1.6;font-size:14px">{{ comment.content || '暂无评价内容' }}</div>
                        <div style="margin-top:8px;color:#9ca3af;font-size:12px">{{ comment.createTime }}</div>
                    </div>
                </div>
                <div v-else style="text-align:center;padding:40px;color:#9ca3af">
                    <div style="font-size:48px;margin-bottom:12px">💬</div>
                    <p>暂无评价信息</p>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" @click="viewCommentOrder=null">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container" v-else><div class="empty-state" style="padding:100px"><div class="icon">🔒</div><h3>请先登录</h3></div></div>`,
    data() {
        return {
            user: store.getUser(), tab: 'buy', buyOrders: [], sellOrders: [],
            commenting: null, commentForm: { rating: 5, content: '' },
            shipping: null, shipTrackingNo: '', urgedOrders: [], confirmedOrders: [],
            logisticsOrder: null,
            viewCommentOrder: null,
            selectedBuyOrders: [], selectAllBuyOrders: false,
            selectedSellOrders: [], selectAllSellOrders: false
        };
    },
    async mounted() {
        if (!this.user) return;
        await this.loadOrders();
        let userInfo = await api.get('/user/' + this.user.id).catch(() => ({}));
        if (userInfo.success) { store.setUser(userInfo.user); this.user = userInfo.user; }
    },
    methods: {
        async loadOrders() {
            try {
                const all = await api.get('/orders/my/' + this.user.id);
                if (!Array.isArray(all)) return;
                this.buyOrders = all.filter(o => o.buyerId === this.user.id);
                this.sellOrders = all.filter(o => o.sellerId === this.user.id);
                for (let o of [...this.buyOrders, ...this.sellOrders]) {
                    try { const b = await api.get('/secondbook/' + o.bookId); o.bookName = b.name; } catch (e) { o.bookName = '未知'; }
                    try { const u = await api.get('/user/' + o.buyerId); o.buyerName = u.user ? u.user.username : '未知'; } catch (e) {}
                }
                for (let o of this.buyOrders) {
                    try { const u = await api.get('/user/' + o.sellerId); o.sellerName = u.user ? u.user.username : '未知'; } catch (e) { o.sellerName = '未知'; }
                }
                for (let o of this.buyOrders) {
                    try {
                        const comments = await api.get('/comment/' + o.id);
                        o.commented = comments && comments.length > 0;
                        o.comments = comments || [];
                    } catch (e) { o.commented = false; o.comments = []; }
                }
                for (let o of this.sellOrders) {
                    try {
                        const comments = await api.get('/comment/' + o.id);
                        o.hasComment = comments && comments.length > 0;
                        o.comments = comments || [];
                    } catch (e) { o.hasComment = false; o.comments = []; }
                }
                if (this.tab === 'sell') { this.loadUrgedOrders(); this.loadConfirmedOrders(); }
            } catch (e) { this.buyOrders = []; this.sellOrders = []; }
        },
        async loadUrgedOrders() {
            try {
                this.urgedOrders = await api.get('/orders/urged/' + this.user.id);
            } catch (e) { this.urgedOrders = []; }
        },
        async loadConfirmedOrders() {
            try {
                this.confirmedOrders = await api.get('/orders/confirmed/' + this.user.id);
            } catch (e) { this.confirmedOrders = []; }
        },
        statusClass(status) {
            if (status === '待发货') return 'status-pending';
            if (status === '已发货') return 'status-shipped';
            if (status === '已收货') return 'status-received';
            return 'status-pending';
        },
        openShipModal(id) {
            this.shipping = id;
            this.shipTrackingNo = '';
        },
        async confirmShip() {
            if (!this.shipTrackingNo.trim()) {
                this.showToast('请填写快递单号', 'error');
                return;
            }
            try {
                const data = await api.put('/orders/ship/' + this.shipping, { trackingNo: this.shipTrackingNo.trim() });
                if (data.code === 200) {
                    this.showToast('发货成功', 'success');
                    this.shipping = null;
                    this.loadOrders();
                } else {
                    this.showToast(data.msg || '失败', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        queryLogistics(order) {
            this.logisticsOrder = order;
        },
        async confirmShipInfo(id) {
            try {
                const data = await api.put('/orders/confirm-ship-info/' + id);
                if (data.code === 200) {
                    this.showToast('已确认发货信息', 'success');
                    this.loadOrders();
                } else {
                    this.showToast(data.msg || '失败', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async urgeOrder(id) {
            try {
                const data = await api.put('/orders/urge/' + id);
                if (data.code === 200) {
                    this.showToast('已提醒卖家发货', 'success');
                    this.loadOrders();
                } else {
                    this.showToast(data.msg || '失败', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async receiveOrder(id) {
            try {
                const data = await api.put('/orders/receive/' + id);
                if (data.code === 200) { this.showToast('收货成功', 'success'); this.loadOrders(); }
                else this.showToast(data.msg || '失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async cancelOrder(id) {
            if (!confirm('确定要取消这个订单吗？')) return;
            try {
                const data = await api.put('/orders/cancel/' + id);
                if (data.code === 200) { this.showToast('订单已取消', 'success'); this.loadOrders(); }
                else this.showToast(data.msg || '失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        showComment(order) {
            this.commenting = order;
            this.commentForm = { rating: 5, content: '' };
        },
        viewBuyerComment(order) {
            this.viewCommentOrder = order;
        },
        async submitComment() {
            try {
                const data = await api.post('/comment', {
                    userId: this.user.id, orderId: this.commenting.id, bookId: this.commenting.bookId,
                    score: this.commentForm.rating, content: this.commentForm.content
                });
                if (data.success) { this.showToast('评价成功', 'success'); this.commenting = null; this.loadOrders(); }
                else this.showToast(data.msg || '失败', 'error');
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        showToast(msg, type) {
            const icons = { success: '✓', error: '✗' };
            const t = document.createElement('div');
            t.className = 'toast ' + type;
            t.innerHTML = (icons[type] || '') + ' ' + msg;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 2600);
        },
        toggleSelectAllBuyOrders() {
            if (this.selectAllBuyOrders) {
                this.selectedBuyOrders = this.buyOrders.map(o => o.id);
            } else {
                this.selectedBuyOrders = [];
            }
        },
        toggleSelectAllSellOrders() {
            if (this.selectAllSellOrders) {
                this.selectedSellOrders = this.sellOrders.map(o => o.id);
            } else {
                this.selectedSellOrders = [];
            }
        },
        async batchDeleteBuyOrders() {
            if (!this.selectedBuyOrders.length) return;
            if (!confirm(`确定要删除选中的 ${this.selectedBuyOrders.length} 个订单吗？此操作不可恢复！`)) return;
            try {
                let successCount = 0;
                for (let id of this.selectedBuyOrders) {
                    try {
                        await api.delete('/orders/' + id);
                        successCount++;
                    } catch (e) {}
                }
                if (successCount > 0) {
                    this.showToast(`成功删除 ${successCount} 个订单`, 'success');
                    this.selectedBuyOrders = [];
                    this.selectAllBuyOrders = false;
                    this.loadOrders();
                } else {
                    this.showToast('删除失败', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        },
        async batchDeleteSellOrders() {
            if (!this.selectedSellOrders.length) return;
            if (!confirm(`确定要删除选中的 ${this.selectedSellOrders.length} 个订单吗？此操作不可恢复！`)) return;
            try {
                let successCount = 0;
                for (let id of this.selectedSellOrders) {
                    try {
                        await api.delete('/orders/' + id);
                        successCount++;
                    } catch (e) {}
                }
                if (successCount > 0) {
                    this.showToast(`成功删除 ${successCount} 个订单`, 'success');
                    this.selectedSellOrders = [];
                    this.selectAllSellOrders = false;
                    this.loadOrders();
                } else {
                    this.showToast('删除失败', 'error');
                }
            } catch (e) { this.showToast('网络错误', 'error'); }
        }
    }
};
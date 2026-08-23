const Carousel = {
    template: `
    <div class="carousel-wrapper" @mouseenter="stopAuto" @mouseleave="startAuto">
        <div class="carousel-inner">
            <div class="carousel-track" :style="{ transform: 'translateX(-' + currentIndex * 100 + '%)' }">
                <div class="carousel-slide" v-for="(slide, idx) in slides" :key="idx"
                    :style="{ background: slide.bg }"
                    @click="handleSlideClick(slide)">
                    <div class="carousel-slide-bg" v-if="slide.img" :style="{ backgroundImage: 'url(' + slide.img + ')' }"></div>
                    <div class="carousel-slide-content">
                        <div class="carousel-slide-text">
                            <h2>{{ slide.title }}</h2>
                            <p>{{ slide.desc }}</p>
                            <span class="carousel-slide-btn" v-if="slide.btnText" 
                                  @click.stop="handleButtonClick(slide)">{{ slide.btnText }}</span>
                        </div>
                        <div class="carousel-slide-img" v-if="slide.icon">
                            <span>{{ slide.icon }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-dots">
            <span v-for="(slide, idx) in slides" :key="idx"
                class="carousel-dot" :class="{ active: idx === currentIndex }"
                @click="goTo(idx)"></span>
        </div>
        <button class="carousel-arrow carousel-prev" @click="prev">&lsaquo;</button>
        <button class="carousel-arrow carousel-next" @click="next">&rsaquo;</button>
    </div>`,
    props: {
        slides: { type: Array, default: () => [] },
        interval: { type: Number, default: 4000 }
    },
    data() {
        return { currentIndex: 0, timer: null };
    },
    mounted() {
        this.startAuto();
    },
    beforeUnmount() {
        this.stopAuto();
    },
    methods: {
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        },
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        },
        goTo(idx) {
            this.currentIndex = idx;
        },
        startAuto() {
            if (this.slides.length <= 1) return;
            this.stopAuto();
            this.timer = setInterval(() => this.next(), this.interval);
        },
        stopAuto() {
            if (this.timer) { clearInterval(this.timer); this.timer = null; }
        },
        handleSlideClick(slide) {
            if (slide.link && this.$router) {
                this.$router.push(slide.link);
            }
            this.$emit('slide-click', slide);
        },
        handleButtonClick(slide) {
            this.$emit('button-click', slide);
        }
    }
};
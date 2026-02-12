// 粒子特效系统
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // 创建粒子画布
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '998';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 创建收集福字的粒子爆炸效果
    createCollectExplosion(x, y) {
        const colors = ['#ff6b6b', '#feca57', '#ff9ff3', '#48dbfb'];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.02,
                size: 4 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'circle'
            });
        }
    }

    // 创建移动轨迹粒子
    createTrailParticles(x, y) {
        const colors = ['#ffeaa7', '#fdcb6e', '#fab1a0'];

        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.03,
                size: 3 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'star'
            });
        }
    }

    // 创建通关烟花效果
    createVictoryFireworks() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#55efc4'];

        for (let burst = 0; burst < 3; burst++) {
            setTimeout(() => {
                const burstX = centerX + (Math.random() - 0.5) * 200;
                const burstY = centerY + (Math.random() - 0.5) * 200;

                for (let i = 0; i < 50; i++) {
                    const angle = (Math.PI * 2 * i) / 50;
                    const velocity = 3 + Math.random() * 4;

                    this.particles.push({
                        x: burstX,
                        y: burstY,
                        vx: Math.cos(angle) * velocity,
                        vy: Math.sin(angle) * velocity - 2,
                        life: 1,
                        decay: 0.015,
                        size: 3 + Math.random() * 5,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        type: 'circle',
                        gravity: 0.1
                    });
                }
            }, burst * 300);
        }
    }

    // 创建错误震动效果
    createErrorShake(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // 更新位置
            p.x += p.vx;
            p.y += p.vy;

            // 应用重力
            if (p.gravity) {
                p.vy += p.gravity;
            }

            // 更新生命值
            p.life -= p.decay;

            // 绘制粒子
            if (p.life > 0) {
                this.ctx.globalAlpha = p.life;
                this.ctx.fillStyle = p.color;

                if (p.type === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (p.type === 'star') {
                    this.drawStar(p.x, p.y, p.size);
                }
            } else {
                this.particles.splice(i, 1);
            }
        }

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }

    drawStar(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    // 获取元素在屏幕上的中心位置
    getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
}

// 导出全局实例
window.particleSystem = new ParticleSystem();

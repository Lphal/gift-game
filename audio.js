// 音频管理器
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.bgmGainNode = null;
        this.sfxGainNode = null;
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.bgmVolume = 0.3;
        this.sfxVolume = 0.5;
        this.bgmSource = null;
        this.bgmStartTime = 0;
        this.bgmPauseTime = 0;

        // 音频分析器
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.canvas = null;
        this.canvasCtx = null;
        this.animationId = null;

        this.init();
    }

    init() {
        // 初始化Canvas
        this.canvas = document.getElementById('waveform-canvas');
        if (this.canvas) {
            this.canvasCtx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }

        // 延迟初始化AudioContext，等待用户交互
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.setupAudioNodes();
                // 不在这里自动播放音乐，等待游戏开始时再播放
                this.startVisualization();
            }
        }, { once: true });
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    setupAudioNodes() {
        // 创建分析器节点
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // 减小FFT大小以获得更少但更明显的频谱柱
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.smoothingTimeConstant = 0.7; // 平滑处理
        this.analyser.connect(this.audioContext.destination);

        // 创建增益节点用于音量控制
        this.bgmGainNode = this.audioContext.createGain();
        this.bgmGainNode.gain.value = this.bgmVolume;
        this.bgmGainNode.connect(this.analyser);

        this.sfxGainNode = this.audioContext.createGain();
        this.sfxGainNode.gain.value = this.sfxVolume;
        this.sfxGainNode.connect(this.analyser);
    }

    startVisualization() {
        if (!this.canvas || !this.canvasCtx || !this.analyser) return;

        const draw = () => {
            this.animationId = requestAnimationFrame(draw);

            // 使用频域数据而非时域数据
            this.analyser.getByteFrequencyData(this.dataArray);

            const rect = this.canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // 清空画布
            this.canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.canvasCtx.fillRect(0, 0, width, height);

            // 只使用前32个频率柱（低频到中频部分更有律动感）
            const barCount = 32;
            const barWidth = width / barCount;
            const barGap = 1;

            for (let i = 0; i < barCount; i++) {
                // 增强低频和中频的显示效果
                const dataIndex = Math.floor(i * 1.5);
                const value = this.dataArray[dataIndex] || 0;

                // 增加振幅，使变化更明显
                const barHeight = (value / 255) * height * 1.2;

                // 根据高度创建渐变色
                const gradient = this.canvasCtx.createLinearGradient(0, height - barHeight, 0, height);

                if (barHeight > height * 0.7) {
                    // 高音量：紫色到粉色
                    gradient.addColorStop(0, '#a29bfe');
                    gradient.addColorStop(1, '#fd79a8');
                } else if (barHeight > height * 0.4) {
                    // 中音量：紫色到蓝色
                    gradient.addColorStop(0, '#a29bfe');
                    gradient.addColorStop(1, '#74b9ff');
                } else {
                    // 低音量：浅紫色
                    gradient.addColorStop(0, '#dfe4ea');
                    gradient.addColorStop(1, '#a29bfe');
                }

                this.canvasCtx.fillStyle = gradient;

                // 绘制圆角矩形柱
                const x = i * barWidth;
                const y = height - barHeight;
                const actualBarWidth = barWidth - barGap;
                const radius = 2;

                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(x + radius, y);
                this.canvasCtx.lineTo(x + actualBarWidth - radius, y);
                this.canvasCtx.quadraticCurveTo(x + actualBarWidth, y, x + actualBarWidth, y + radius);
                this.canvasCtx.lineTo(x + actualBarWidth, height);
                this.canvasCtx.lineTo(x, height);
                this.canvasCtx.lineTo(x, y + radius);
                this.canvasCtx.quadraticCurveTo(x, y, x + radius, y);
                this.canvasCtx.closePath();
                this.canvasCtx.fill();
            }
        };

        draw();
    }

    // 加载并播放背景音乐
    async loadAndPlayBGM() {
        if (!this.audioContext || !this.bgmEnabled) return;

        try {
            const response = await fetch('assets/festival.mp3');
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.playBGM(audioBuffer);
        } catch (error) {
            console.warn('无法加载背景音乐文件，使用合成音乐作为备选', error);
            this.playFallbackBGM();
        }
    }

    // 播放背景音乐
    playBGM(audioBuffer) {
        if (!this.audioContext || !this.bgmEnabled) return;

        // 停止当前播放的音乐
        if (this.bgmSource) {
            try {
                this.bgmSource.stop();
            } catch (e) {
                // 忽略已停止的错误
            }
        }

        // 创建新的音频源
        this.bgmSource = this.audioContext.createBufferSource();
        this.bgmSource.buffer = audioBuffer;
        this.bgmSource.loop = true;
        this.bgmSource.connect(this.bgmGainNode);
        this.bgmSource.start(0);

        // 强制更新 canvas 尺寸
        this.resizeCanvas();

        // 确保可视化正在运行
        if (!this.animationId) {
            this.startVisualization();
        }
    }

    // 备选：使用合成音乐（当MP3文件加载失败时）
    playFallbackBGM() {
        if (!this.audioContext || !this.bgmEnabled) return;

        const melody = [
            { note: 'C5', duration: 0.3 },
            { note: 'D5', duration: 0.3 },
            { note: 'E5', duration: 0.3 },
            { note: 'G5', duration: 0.3 },
            { note: 'A5', duration: 0.6 },
            { note: 'G5', duration: 0.3 },
            { note: 'E5', duration: 0.3 },
            { note: 'D5', duration: 0.6 },
            { note: 'C5', duration: 0.3 },
            { note: 'D5', duration: 0.3 },
            { note: 'E5', duration: 0.6 },
            { note: 'G5', duration: 0.6 },
            { note: 'A5', duration: 0.3 },
            { note: 'G5', duration: 0.3 },
            { note: 'E5', duration: 0.6 },
            { note: 'D5', duration: 0.6 }
        ];

        this.playMelody(melody, 0);
    }

    playMelody(melody, index) {
        if (!this.bgmEnabled || index >= melody.length) {
            if (this.bgmEnabled && index >= melody.length) {
                setTimeout(() => this.playMelody(melody, 0), 500);
            }
            return;
        }

        const { note, duration } = melody[index];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = this.getNoteFrequency(note);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.bgmGainNode);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);

        setTimeout(() => this.playMelody(melody, index + 1), duration * 1000);
    }

    getNoteFrequency(note) {
        const notes = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'G4': 392.00, 'A4': 440.00,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00,
            'C6': 1046.50
        };
        return notes[note] || 440;
    }

    // 移动音效（轻快的跳跃声）
    playMoveSound() {
        if (!this.audioContext || !this.sfxEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    // 收集福字音效（喜庆的铃声）
    playCollectSound() {
        if (!this.audioContext || !this.sfxEnabled) return;

        const frequencies = [800, 1000, 1200];
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            const startTime = this.audioContext.currentTime + index * 0.05;
            gainNode.gain.setValueAtTime(0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // 通关音效（胜利的号角）
    playVictorySound() {
        if (!this.audioContext || !this.sfxEnabled) return;

        const melody = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 659.25, time: 0.15 },   // E5
            { freq: 783.99, time: 0.3 },    // G5
            { freq: 1046.50, time: 0.45 }   // C6
        ];

        melody.forEach(({ freq, time }) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;

            const startTime = this.audioContext.currentTime + time;
            gainNode.gain.setValueAtTime(0.5, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    }

    // 错误音效（低沉的提示音）
    playErrorSound() {
        if (!this.audioContext || !this.sfxEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // 按钮点击音效
    playClickSound() {
        if (!this.audioContext || !this.sfxEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 1000;

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGainNode);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // 切换背景音乐
    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled && this.audioContext) {
            this.playBGM();
        }
        return this.bgmEnabled;
    }

    // 切换音效
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    // 设置音量
    setBGMVolume(volume) {
        this.bgmVolume = volume;
        if (this.bgmGainNode) {
            this.bgmGainNode.gain.value = volume;
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = volume;
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = volume;
        }
    }
}

// 导出全局实例
window.audioManager = new AudioManager();

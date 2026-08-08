// Монитор звука с микрофона робота: принимает сырой PCM (int16 моно) по WS и
// проигрывает через WebAudio. Звук идёт всегда, пока открыт сокет (робот не
// приглушает монитор во время синтеза речи).
class WSAudioStream {
    constructor(socketUrl, sampleRate = 16000) {
        this.socketUrl = socketUrl;
        this.sampleRate = sampleRate;
        this.socket = null;
        this.ctx = null;
        this.gainNode = null;
        this.volume = 1.0;   // 0..3 (усиление до x3)
        this.nextTime = 0;
    }

    setVolume(v) {
        this.volume = v;
        if (this.gainNode) {
            this.gainNode.gain.value = v;
        }
    }

    begin() {
        if (this.socket) {
            return;
        }
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new Ctx({ sampleRate: this.sampleRate });
        // AudioContext может стартовать в suspended (autoplay policy) — запускаем
        // из пользовательского клика по вкладке стрима
        this.ctx.resume?.();
        // усиление громкости (может быть > 1, до x3)
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.ctx.destination);
        this.nextTime = 0;

        this.socket = new WebSocket(this.socketUrl);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = () => console.log("Аудио-монитор подключён");
        this.socket.onmessage = (event) => this._onPcm(event.data);
        this.socket.onerror = (e) => console.error("Аудио WS ошибка:", e);
        this.socket.onclose = () => console.log("Аудио-монитор закрыт");
    }

    _onPcm(arrayBuffer) {
        const pcm = new Int16Array(arrayBuffer);
        if (pcm.length === 0) {
            return;
        }
        const f32 = new Float32Array(pcm.length);
        for (let i = 0; i < pcm.length; i++) {
            f32[i] = pcm[i] / 32768;
        }
        const buf = this.ctx.createBuffer(1, f32.length, this.sampleRate);
        buf.copyToChannel(f32, 0);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.gainNode);

        const now = this.ctx.currentTime;
        // небольшой запас, чтобы сгладить джиттер сети и не было подрывов
        if (this.nextTime < now + 0.02) {
            this.nextTime = now + 0.08;
        }
        src.start(this.nextTime);
        this.nextTime += buf.duration;
    }

    stop() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
        this.gainNode = null;
    }
}

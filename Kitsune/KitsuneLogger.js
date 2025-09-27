// =========================================================================================
// --- INÍCIO: Módulo de Log (KitsuneLogger.js) ---
// =========================================================================================
(function () {
    if (window.KitsuneLogger) {
        return;
    }

    console.log("📜 Kitsune | Módulo de Log (v1.2) está sendo carregado...");

    // A lógica agora é executada imediatamente, sem esperar pelo 'load'
    const KitsuneLogger = {
        STORAGE_KEY: `kitsune_logs_${typeof game_data !== 'undefined' ? game_data.player.id : 'unknown_player'}`,
        MAX_LOG_ENTRIES: 50,
        logs: [],
        init() {
            this.load();
        },
        load() {
            try {
                const storedLogs = localStorage.getItem(this.STORAGE_KEY);
                this.logs = storedLogs ? JSON.parse(storedLogs) : [];
            } catch (e) {
                console.error("Kitsune Logger: Erro ao carregar logs.", e);
                this.logs = [];
            }
        },
        save() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
            } catch (e) {
                console.error("Kitsune Logger: Erro ao salvar logs.", e);
            }
        },
        add(moduleName, message) {
            const now = new Date();
            const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const logEntry = {
                timestamp,
                moduleName,
                message
            };
            this.logs.unshift(logEntry);
            if (this.logs.length > this.MAX_LOG_ENTRIES) {
                this.logs.pop();
            }
            this.save();
        },
        getLogs(count = 25) {
            return this.logs.slice(0, count);
        },
        clear() {
            this.logs = [];
            this.save();
        }
    };

    window.KitsuneLogger = KitsuneLogger;
    KitsuneLogger.init(); // Inicializa imediatamente
})();
// =========================================================================================
// --- INÍCIO: Módulo de Configurações (kitsunesettings.js) ---
// =========================================================================================
(function () {
    if (window.KitsuneSettingsManager) {
        return;
    }

    console.log("💾 Kitsune | Módulo de Configurações (v2.3) está sendo carregado...");

    const KitsuneSettingsManager = (function() {
        const PLAYER_ID = typeof game_data !== 'undefined' ? game_data.player.id : 'unknown_player';
        const STORAGE_KEY = `kitsune_settings_${PLAYER_ID}`;

        const defaultSettings = {
            sidebarWidth: '550px',
            sidebarHeight: '70vh',
            lastTab: 'dashboard',
            licenseExpiry: null, // Chave para armazenar a data de validade da licença
            saqueador: {
                A: {}, B: {}, C: {},
                distancia: 20,
                nivelMuralha: 0,
                ataquesPorAldeia: 1,
                reports: {
                    scouted: true,
                    win: true,
                    loss: false,
                    win_damage: false,
                    loss_scout: false,
                    loss_full: false
                },
                syncEnabled: { A: false, B: false, C: false },
                tempoMin: '00:03:00',
                tempoMax: '00:30:00',
                autoStart: false
            },
            ferreiro: {
                modelo: null // Para armazenar o NOME do modelo de pesquisa ativo
            },
            recrutador: [{}, {}],
            construtor: {
                autoStart: false
            },
            construtorConfig: {
                tempoMin: '00:01:00',
                tempoMax: '00:10:00'
            },
            recrutadorConfig: {
                barracks: { lote: '1', filas: '10' },
                stable: { lote: '1', filas: '10' },
                garage: { lote: '1', filas: '10' },
                tempoMin: '00:02:00',
                tempoMax: '00:20:00',
                autoStart: false
            },
            modules: {}
        };

        let settings = {};

        function deepMerge(target, source) {
            let output = { ...target };
            if (isObject(target) && isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (isObject(source[key])) {
                        if (!(key in target)) Object.assign(output, { [key]: source[key] });
                        else output[key] = deepMerge(target[key], source[key]);
                    } else {
                        Object.assign(output, { [key]: source[key] });
                    }
                });
            }
            return output;
        }
        const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));

        function save() {
            try {
                delete settings.modules;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) {
                console.error("Kitsune Settings: Erro ao salvar.", e);
            }
        }

        function load() {
            try {
                const storedSettings = localStorage.getItem(STORAGE_KEY);
                const loaded = storedSettings ? JSON.parse(storedSettings) : {};
                settings = deepMerge(defaultSettings, loaded);
                settings.modules = {};
                console.log(`⚙️ Kitsune Settings: Configurações carregadas para o jogador ${PLAYER_ID}.`);
            } catch (e) {
                console.error("Kitsune Settings: Erro ao carregar. Usando padrões.", e);
                settings = { ...defaultSettings };
            }
        }

        function getSettings() {
            return settings;
        }

        load();

        return {
            get: getSettings,
            save: save,
        };
    })();

    window.KitsuneSettingsManager = KitsuneSettingsManager;
})();
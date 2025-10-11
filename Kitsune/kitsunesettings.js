// =========================================================================================
// --- INÍCIO: Módulo de Configurações (kitsunesettings.js) ---
// =========================================================================================
(function () {
    if (window.KitsuneSettingsManager) {
        return;
    }

    console.log("💾 Kitsune | Módulo de Configurações (v2.5) está sendo carregado...");

    const KitsuneSettingsManager = (function() {
        const PLAYER_ID = typeof game_data !== 'undefined' ? game_data.player.id : 'unknown_player';
        const STORAGE_KEY = `kitsune_settings_${PLAYER_ID}`;

        const defaultSettings = {
            sidebarWidth: '550px',
            sidebarHeight: '70vh',
            lastTab: 'dashboard',
            licenseExpiry: null,
            saqueador: {
                A: {}, B: {}, C: {},
                distancia: 20,
                nivelMuralha: 0,
                ataquesPorAldeia: 1,
                cliqueMin: 1000,
                cliqueMax: 2000,
                reports: { scouted: true, win: true, loss: false, win_damage: false, loss_scout: false, loss_full: false },
                syncEnabled: { A: false, B: false, C: false },
                tempoMin: '00:05:00',
                tempoMax: '00:12:00',
                autoStart: false,
                modelo: 'A',
                advanced: {
                    enabled: false,
                    rules: []
                }
            }, // ✅ VÍRGULA ADICIONADA AQUI
            ferreiro: {
                modelo: null
            }, // ✅ VÍRGULA ADICIONADA AQUI
            recrutador: [
                {}, 
                {}
            ], // ✅ VÍRGULA ADICIONADA AQUI
            construtor: {
                regras: [
                    { grupo: '0', filas: (typeof game_data !== 'undefined' && game_data.player.premium ? 2 : 1) } // Começa com uma regra padrão
                ],
                modelo: 'default',
                fazenda: '90%',
                armazem: '90%',
                nivelMuralha: '20',
                nivelEsconderijo: '0',
                autoStart: false
            }, // ✅ VÍRGULA ADICIONADA AQUI
            construtorConfig: {
                tempoMin: '00:01:00',
                tempoMax: '00:10:00',
                autoStart: false,
                advanced: {
                    enabled: false,
                    rules: []
                }
            }, // ✅ VÍRGULA ADICIONADA AQUI
            recrutadorConfig: {
                barracks: { lote: '5', filas: '10' },
                stable: { lote: '5', filas: '10' },
                garage: { lote: '3', filas: '10' },
                tempoMin: '00:04:00',
                tempoMax: '00:12:00',
                autoStart: false,
                advanced: {
                    enabled: false,
                    rules: []
                }
            }, // ✅ VÍRGULA ADICIONADA AQUI
            mercadorConfig: {
                tempoMin: '00:15:00',
                tempoMax: '00:30:00',
                autoStart: false,
                advanced: {
                    enabled: false,
                    rules: []
                }
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
                const tempSettings = { ...settings };
                delete tempSettings.modules;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tempSettings));
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

        load();

        return {
            get: () => settings,
            save: save,
        };
    })();

    window.KitsuneSettingsManager = KitsuneSettingsManager;
})();








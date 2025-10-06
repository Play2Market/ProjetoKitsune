// =========================================================================================
// --- INÍCIO: Módulo de Configurações (kitsunesettings.js) ---
// =========================================================================================
(function () {
    if (window.KitsuneSettingsManager) {
        return;
    }

    console.log("💾 Kitsune | Módulo de Configurações (v2.4) está sendo carregado...");

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
                // NOVO: Adicionado tempos de clique
                cliqueMin: 1000, // em milissegundos
                cliqueMax: 2000, // em milissegundos
                reports: {
                    scouted: true,
                    win: true,
                    loss: false,
                    win_damage: false,
                    loss_scout: false,
                    loss_full: false
                },
                syncEnabled: { A: false, B: false, C: false },
                tempoMin: '00:05:00', // Padrão de 5 minutos
                tempoMax: '00:12:00', // Padrão de 12 minutos
                autoStart: false,
                modelo: 'A' // Modelo padrão definido
            },
            ferreiro: {
                modelo: null 
            },
            recrutador: [{}, {}],
            construtor: {
                autoStart: false
            },
            construtorConfig: {
                tempoMin: '00:01:00',
                tempoMax: '00:10:00',
                autoStart: false
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
                // Cria uma cópia temporária para não modificar o objeto 'settings' em memória
                const tempSettings = { ...settings };
                delete tempSettings.modules; // Remove o estado volátil dos módulos
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
                settings.modules = {}; // Sempre reinicia o estado dos módulos
                console.log(`⚙️ Kitsune Settings: Configurações carregadas para o jogador ${PLAYER_ID}.`);
            } catch (e) {
                console.error("Kitsune Settings: Erro ao carregar. Usando padrões.", e);
                settings = { ...defaultSettings };
            }
        }

        // Carrega as configurações na inicialização do módulo
        load();

        return {
            get: () => settings,
            save: save,
        };
    })();

    window.KitsuneSettingsManager = KitsuneSettingsManager;
})();

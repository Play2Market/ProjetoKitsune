// =========================================================================================
// --- INÍCIO: Módulo Guardião Anti-Captcha (KitsuneCaptchaGuardian.js) ---
// =========================================================================================
(function () {
    // Evita que o módulo seja carregado mais de uma vez
    if (window.KitsuneCaptchaGuardian) {
        return;
    }

    console.log("🛡️ Kitsune | Módulo Guardião Anti-Captcha (v1.1) está sendo carregado...");

    const KitsuneCaptchaGuardian = {
        isGloballyPaused: false,
        checkInterval: 3000, // Verifica a cada 3 segundos

        // Seletores secundários para identificar o CAPTCHA (fallback)
        FALLBACK_CAPTCHA_SELECTORS: [
            '#botprotection_quest',    // O ícone da missão/alerta
            '.bot-protection-row',     // A tela de bloqueio principal
            '.bot-protection-blur'     // O efeito de blur na tela de fundo
        ],

        /**
         * Verifica se algum elemento de CAPTCHA está visível na página.
         * A verificação primária e mais rápida é no atributo da tag <body>.
         * @returns {boolean} - True se um CAPTCHA for detectado, false caso contrário.
         */
        check() {
            // NÍVEL 1: Verificação principal, mais rápida e confiável
            if (document.body.dataset.botProtect === 'forced') {
                return true;
            }

            // NÍVEL 2: Verificação secundária (fallback) se a principal não for positiva
            for (const selector of this.FALLBACK_CAPTCHA_SELECTORS) {
                const element = document.querySelector(selector);
                // Verifica se o elemento existe e está visível
                if (element && element.offsetParent !== null) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Exibe um aviso visual proeminente no topo do sidebar do Kitsune.
         */
        showCaptchaWarning() {
            const sidebar = document.getElementById('kitsune-sidebar');
            if (!sidebar) return;

            // Evita adicionar múltiplos avisos
            if (document.getElementById('kitsune-captcha-warning')) return;

            const warningDiv = document.createElement('div');
            warningDiv.id = 'kitsune-captcha-warning';
            warningDiv.innerHTML = '<strong>CAPTCHA DETECTADO!</strong><br>O Kitsune foi pausado. Resolva a verificação para continuar.';
            warningDiv.style.backgroundColor = '#e06c75'; // Cor de destaque
            warningDiv.style.color = 'white';
            warningDiv.style.textAlign = 'center';
            warningDiv.style.padding = '10px';
            warningDiv.style.fontWeight = 'bold';
            warningDiv.style.position = 'absolute';
            warningDiv.style.top = '0';
            warningDiv.style.left = '0';
            warningDiv.style.right = '0';
            warningDiv.style.zIndex = '20000';
            warningDiv.style.borderTopLeftRadius = '10px';
            warningDiv.style.borderTopRightRadius = '10px';

            sidebar.prepend(warningDiv);
        },

        /**
         * Desativa os botões de toggle (liga/desliga) de todos os módulos.
         */
        disableModuleToggles() {
            document.querySelectorAll('[data-module-switch]').forEach(toggle => {
                toggle.checked = false;
                toggle.disabled = true;
            });
        },

        /**
         * Ação de parada de emergência. Interrompe todos os timers e notifica o usuário.
         */
        emergencyStop() {
            if (this.isGloballyPaused) {
                return; // Já está pausado, não faz nada
            }
            
            this.isGloballyPaused = true;
            console.error("KITSUNE GUARDIAN: CAPTCHA DETECTADO! Parada de emergência acionada.");

            // Usa o KitsuneLogger, se disponível
            if (window.KitsuneLogger) {
                window.KitsuneLogger.add("Guardião", "CAPTCHA detectado! Todos os módulos foram pausados.");
            }

            // Para todos os timers usando o KitsuneTimerManager, se disponível
            if (window.KitsuneTimerManager && window.KitsuneConstants) {
                const { MODULOS } = window.KitsuneConstants;
                window.KitsuneTimerManager.stop(MODULOS.CONSTRUTOR);
                window.KitsuneTimerManager.stop(MODULOS.RECRUTADOR);
                window.KitsuneTimerManager.stop(MODULOS.SAQUEADOR);
            }

            // Desativa a UI e mostra o aviso
            this.disableModuleToggles();
            this.showCaptchaWarning();
        },

        /**
         * Inicia a verificação periódica.
         */
        init() {
            // Verificação imediata ao iniciar
            if (this.check()) {
                this.emergencyStop();
                return; // Se já começou com captcha, não inicia o loop
            }

            // Inicia o loop de verificação
            setInterval(() => {
                if (this.check()) {
                    this.emergencyStop();
                }
            }, this.checkInterval);

            console.log("🛡️ Kitsune Guardião iniciado. Monitorando CAPTCHA...");
        },

        /**
         * Retorna o estado de pausa do script.
         * @returns {boolean}
         */
        isPaused() {
            return this.isGloballyPaused;
        }
    };

    // Expõe o módulo para o escopo global para que o script principal possa usá-lo
    window.KitsuneCaptchaGuardian = KitsuneCaptchaGuardian;

})();
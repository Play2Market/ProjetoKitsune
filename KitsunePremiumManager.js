// =========================================================================================
// --- INÍCIO: Módulo de Status Premium (KitsunePremiumManager.js) ---
// =========================================================================================
(function() {
    if (window.KitsunePremiumManager) return;

    const KitsunePremiumManager = {
        status: {
            premium: false,
            manager: false,
            assistant: false
        },
        async init() {
            if (typeof game_data !== 'undefined' && game_data.player) {
                this.status.premium = game_data.player.premium;
                this.status.manager = game_data.player.account_manager;
                this.status.assistant = game_data.player.farm_assistant;
            }
            await this.verifyFeaturesFromPage();
            document.dispatchEvent(new CustomEvent('kitsunePremiumStatusUpdated'));
        },
        async verifyFeaturesFromPage() {
            try {
                const response = await fetch('/game.php?screen=premium&mode=use');
                if (!response.ok) return;

                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const premiumBoxes = doc.querySelectorAll('.premium-box');

                premiumBoxes.forEach(box => {
                    const head = box.querySelector('.premium-box-head');
                    if (!head) return;

                    const title = head.textContent.trim();
                    const isActive = box.querySelector('.info_box') !== null || box.querySelector('button[name="activate"]')?.textContent.includes('Prolongar');

                    if (title.includes('Conta premium')) {
                        this.status.premium = isActive;
                    } else if (title.includes('Gerente de conta')) {
                        this.status.manager = isActive;
                    } else if (title.includes('Assistente de saque')) {
                        this.status.assistant = isActive;
                    }
                });
            } catch (e) {
                console.error("Kitsune Premium: Falha ao verificar status detalhado.", e);
            }
        },
        getStatus() {
            return this.status;
        }
    };
    window.KitsunePremiumManager = KitsunePremiumManager;
})();
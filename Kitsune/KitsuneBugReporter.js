// =========================================================================================
// --- INÍCIO: Módulo de Reporte de Falhas (KitsuneBugReporter.js) ---
// =========================================================================================
(function () {
    if (window.KitsuneBugReporter) return;

    console.log("🐞 Kitsune | Módulo de Reporte de Falhas (v1.0) está sendo carregado...");

    const KitsuneBugReporter = {
        // IMPORTANTE: Cole a URL do seu Webhook do Discord aqui!
        WEBHOOK_URL: 'COLE_A_SUA_URL_DO_WEBHOOK_AQUI',

        openReportModal() {
            if (document.getElementById('kitsune-bug-report-modal')) return;

            const modalHTML = `
                <div id="kitsune-bug-report-modal" class="kitsune-modal-overlay show">
                    <div class="kitsune-modal" style="width: 500px;">
                        <div class="kitsune-modal-header">
                            <h3>Reportar uma Falha</h3>
                            <button class="kitsune-modal-close">&times;</button>
                        </div>
                        <div class="kitsune-modal-body">
                            <p style="margin-top:0; color: var(--kitsune-text-dark);">Descreva o problema que você encontrou. Tente ser o mais detalhado possível.</p>
                            <textarea id="kitsune-bug-report-description" style="width: 100%; height: 120px; resize: vertical;" placeholder="Ex: O construtor parou de funcionar quando..."></textarea>
                            <div style="text-align: right; margin-top: 20px;">
                                <button id="kitsune-bug-report-submit" class="kitsune-button">Enviar Relatório</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const modal = document.getElementById('kitsune-bug-report-modal');
            const closeModal = () => modal.remove();
            modal.querySelector('.kitsune-modal-close').addEventListener('click', closeModal);
            modal.querySelector('#kitsune-bug-report-submit').addEventListener('click', () => this.sendReport());
        },

        async sendReport() {
            const description = document.getElementById('kitsune-bug-report-description').value.trim();
            if (!description) {
                alert('Por favor, descreva a falha antes de enviar.');
                return;
            }
            
            if (!this.WEBHOOK_URL || this.WEBHOOK_URL === 'COLE_A_SUA_URL_DO_WEBHOOK_AQUI') {
                alert('Erro de configuração: A URL do Webhook não foi definida no script.');
                return;
            }

            const submitButton = document.getElementById('kitsune-bug-report-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            const reportData = this.gatherAutomaticData();

            // Formata a mensagem para o Discord
            const payload = {
                embeds: [{
                    title: '🐞 Novo Relatório de Falha do Kitsune',
                    color: 15158332, // Cor vermelha
                    description: `**Descrição do Usuário:**\n>>> ${description}`,
                    fields: [
                        { name: 'Versão do Script', value: reportData.scriptVersion, inline: true },
                        { name: 'Mundo', value: reportData.world, inline: true },
                        { name: 'Jogador', value: `${reportData.playerName} (${reportData.playerId})`, inline: false },
                        { name: 'Aldeia Atual', value: reportData.villageId, inline: true },
                        { name: 'Tela Atual', value: reportData.screen, inline: true },
                        { name: 'Logs Recentes', value: `\`\`\`\n${reportData.logs}\n\`\`\``, inline: false },
                        { name: 'Navegador', value: `\`${reportData.userAgent}\``, inline: false },
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            try {
                const response = await fetch(this.WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert('Relatório enviado com sucesso! Obrigado pela sua contribuição.');
                    document.getElementById('kitsune-bug-report-modal').remove();
                } else {
                    throw new Error(`O Discord retornou o status: ${response.status}`);
                }
            } catch (error) {
                console.error("Kitsune Bug Reporter Error:", error);
                alert('Ocorreu um erro ao enviar o relatório. Tente novamente mais tarde.');
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Relatório';
            }
        },

        gatherAutomaticData() {
            const logs = window.KitsuneLogger ? window.KitsuneLogger.getLogs(15).map(l => `[${l.timestamp}] ${l.moduleName}: ${l.message}`).join('\n') : 'Logger não disponível.';
            
            return {
                scriptVersion: typeof GM_info !== 'undefined' ? GM_info.script.version : 'Desconhecida',
                world: game_data.world || 'Desconhecido',
                playerName: game_data.player.name || 'Desconhecido',
                playerId: game_data.player.id || 'Desconhecido',
                villageId: game_data.village.id || 'Desconhecido',
                screen: `${game_data.screen}/${game_data.mode}` || 'Desconhecida',
                userAgent: navigator.userAgent || 'Desconhecido',
                logs: logs
            };
        }
    };

    window.KitsuneBugReporter = KitsuneBugReporter;
})();
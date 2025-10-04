// =========================================================================================
// --- INÍCIO: Módulo de Grupos Personalizados (custom_groups.js) ---
// =========================================================================================
(function () {
    const CUSTOM_GROUPS_KEY = `kitsune_groups_${game_data.world}`;
    const PREMIUM_CACHE_KEY = `kitsune_premium_groups_cache_${game_data.world}`;
    const CACHE_DURATION_MS = 60 * 60 * 1000;

    function addModalStyles() {
        GM_addStyle(`
            .kitsune-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 15000; justify-content: center; align-items: center; }
            .kitsune-modal-overlay.show { display: flex; }
            .kitsune-modal { background-color: #282c34; border: 1px solid #4a515e; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 600px; max-width: 90%; display: flex; flex-direction: column; }
            .kitsune-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #4a515e; background-color: #21252b; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            .kitsune-modal-header h3 { margin: 0; color: #98c379; font-size: 1.3em; flex-grow: 1; text-align: center; }
            .kitsune-modal-close { font-size: 1.5em; font-weight: bold; color: #8a919e; cursor: pointer; border: none; background: none; z-index: 1; margin-left: -20px; }
            .kitsune-modal-close:hover { color: #dcdfe4; }
            .kitsune-modal-body { padding: 20px; line-height: 1.5; max-height: 60vh; overflow-y: auto;}
            .kitsune-modal-footer { padding: 10px 20px; border-top: 1px solid var(--kitsune-border); }
            #kitsune-custom-groups-list { border: 1px solid #4a515e; border-radius: 5px; padding: 10px; margin-bottom: 20px; min-height: 120px; background-color: #21252b; }
            .kitsune-custom-group-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #4a515e; }
            .kitsune-custom-group-item:last-child { border-bottom: none; }
            .kitsune-custom-group-item span { font-weight: bold; color: #98c379; }
            .kitsune-group-actions { text-align: right; }
            .kitsune-group-actions span { margin-right: 10px; color: var(--kitsune-text-dark); }
            .kitsune-group-actions button { margin-left: 10px; }
            .kitsune-button { display: inline-block; margin-top: 10px; padding: 8px 20px; background-color: #e06c75; border: 1px solid #e06c75; color: #fff; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background-color 0.2s; text-align: center;}
            .kitsune-button:hover { background-color: #c05c65; }
            .kitsune-button:disabled { background-color: #4a515e; border-color: #4a515e; cursor: not-allowed; }
            .kitsune-button-small { padding: 4px 10px; font-size: 0.9em; }
            .kitsune-button-secondary { background-color: #3a404a; border-color: #4a515e; }
            .kitsune-button-secondary:hover { background-color: #4a515e; }
            .kitsune-button-danger { background-color: #a43a42; border-color: #a43a42; }
            .kitsune-button-danger:hover { background-color: #8b3138; }
            .kitsune-button-success { background-color: #7b9e61; border-color: #7b9e61; }
            .kitsune-button-success:hover { background-color: #6a8a52; }
            #kitsune-btn-new-group { display: block; width: 100%; margin-top:0; }
            .kitsune-form-row-vertical { display: flex; flex-direction: column; margin-bottom: 15px; }
            .kitsune-form-row-vertical label { margin-bottom: 5px; font-weight: bold; color: #8a919e; }
            .kitsune-form-row-vertical input, .kitsune-form-row-vertical textarea { width: 100%; box-sizing: border-box; background-color: #21252b; color: #dcdfe4; border: 1px solid #4a515e; border-radius: 4px; padding: 5px; }
            .kitsune-form-actions { text-align: right; margin-top: 20px; }
            .kitsune-form-actions button { margin-left: 10px; }
            .kitsune-no-groups-message { text-align: center; color: var(--kitsune-text-dark); padding: 20px; }
            /* NOVO: Estilos para o modal de lista de aldeias */
            #kitsune-villages-list-textarea { width: 100%; height: 40vh; font-family: monospace; font-size: 12px; resize: none; }
        `);
    }

    function getCustomGroups() { return JSON.parse(localStorage.getItem(CUSTOM_GROUPS_KEY) || '[]'); }
    function saveCustomGroups(groups) {
        localStorage.setItem(CUSTOM_GROUPS_KEY, JSON.stringify(groups));
        document.dispatchEvent(new CustomEvent('kitsuneCustomGroupsUpdated'));
    }

    // NOVO: Função para criar e mostrar o modal com a lista de aldeias do jogador
    function createVillagesListModal() {
        const MODAL_ID = 'kitsune-villages-list-modal';
        if (document.getElementById(MODAL_ID)) return;

        let villageListText = "Selecione o texto abaixo e use Ctrl+C para copiar as coordenadas.\nDepois, cole no campo de coordenadas ao criar/editar um grupo.\n\n";
        
        const villageMap = window.KitsuneVillageManager.getMap();
        const villages = Object.values(villageMap);

        if (villages.length === 0) {
            villageListText = "Nenhuma aldeia encontrada. Por favor, sincronize suas aldeias primeiro (Menu > Forçar Sincronização).";
        } else {
            villages.sort((a, b) => a.name.localeCompare(b.name)); // Ordena por nome
            villageListText += villages.map(v => `${v.coords} # ${v.name}`).join('\n');
        }

        const modalHTML = `
            <div class="kitsune-modal" style="width: 500px;">
                <div class="kitsune-modal-header">
                    <h3>Minhas Aldeias</h3>
                    <button class="kitsune-modal-close">&times;</button>
                </div>
                <div class="kitsune-modal-body">
                    <p style="color: var(--kitsune-text-dark); margin-top: 0;">Lista de todas as suas aldeias para fácil cópia.</p>
                    <textarea id="kitsune-villages-list-textarea" readonly>${villageListText}</textarea>
                </div>
            </div>`;

        const modalContainer = document.createElement("div");
        modalContainer.id = MODAL_ID;
        modalContainer.className = "kitsune-modal-overlay show";
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        const closeModal = () => modalContainer.remove();
        modalContainer.querySelector(".kitsune-modal-close").addEventListener("click", closeModal);
        modalContainer.addEventListener("click", (event) => {
            if (event.target === modalContainer) closeModal();
        });

        // Foca e seleciona o texto para o usuário
        const textarea = modalContainer.querySelector("#kitsune-villages-list-textarea");
        textarea.focus();
        textarea.select();
    }


    function manageCustomGroupsModal() {
        const MODAL_ID = 'kitsune-custom-groups-modal';
        const MAX_GROUPS = 3;
        let modal;
        let currentGroups = [];
        let editingGroupId = null;
        let confirmingDeleteId = null;

        function createModal() {
            if (document.getElementById(MODAL_ID)) {
                modal = document.getElementById(MODAL_ID);
                return;
            }
            // ALTERADO: Botões de Importar/Exportar trocados por "Mostrar Minhas Aldeias"
            const modalHTML = `
            <div class="kitsune-modal">
                <div class="kitsune-modal-header">
                    <h3>Gerenciar Grupos Personalizados</h3>
                    <button class="kitsune-modal-close">&times;</button>
                </div>
                <div class="kitsune-modal-body">
                    <div id="kitsune-groups-list-view">
                        <div id="kitsune-custom-groups-list"></div>
                         <div style="display: flex; gap: 10px; margin-top: 15px;">
                             <button id="kitsune-btn-new-group" class="kitsune-button" style="flex-grow: 1; margin-top: 0;">Criar Novo Grupo</button>
                             <button id="kitsune-btn-show-villages" class="kitsune-button kitsune-button-secondary" style="margin-top: 0;">Mostrar Minhas Aldeias</button>
                         </div>
                    </div>
                    <div id="kitsune-groups-form-view" style="display: none;">
                        <h4 id="kitsune-form-title"></h4>
                        <div class="kitsune-form-row-vertical">
                            <label for="kitsune-group-name">Nome do Grupo (máx. 8 caracteres):</label>
                            <input type="text" id="kitsune-group-name" maxlength="8">
                        </div>
                        <div class="kitsune-form-row-vertical">
                            <label for="kitsune-group-coords">Coordenadas (uma por linha):</label>
                            <textarea id="kitsune-group-coords" rows="8" placeholder="555|444\n555|445"></textarea>
                        </div>
                        <div class="kitsune-form-actions">
                            <button id="kitsune-btn-cancel-edit" class="kitsune-button kitsune-button-secondary">Cancelar</button>
                            <button id="kitsune-btn-save-group" class="kitsune-button">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>`;
            const modalContainer = document.createElement("div");
            modalContainer.id = MODAL_ID;
            modalContainer.className = "kitsune-modal-overlay";
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            modal = modalContainer;
            bindUIEvents();
        }

        function renderGroupsList() {
            const listContainer = modal.querySelector("#kitsune-custom-groups-list");
            listContainer.innerHTML = "";
            if (currentGroups.length === 0) {
                listContainer.innerHTML = '<p class="kitsune-no-groups-message">Nenhum grupo personalizado criado.</p>';
            } else {
                currentGroups.forEach(group => {
                    const item = document.createElement("div");
                    item.className = "kitsune-custom-group-item";
                    item.dataset.id = group.id;
                    let actionsHTML;
                    if (confirmingDeleteId === group.id) {
                        actionsHTML = `
                            <span>Tem certeza?</span>
                            <button class="kitsune-button kitsune-button-small kitsune-button-secondary action-confirm-no">Não</button>
                            <button class="kitsune-button kitsune-button-small kitsune-button-success action-confirm-yes">Sim</button>
                        `;
                    } else {
                        actionsHTML = `
                            <button class="kitsune-button kitsune-button-small kitsune-button-secondary action-edit">Editar</button>
                            <button class="kitsune-button kitsune-button-small kitsune-button-danger action-delete">Excluir</button>
                        `;
                    }
                    item.innerHTML = `
                        <span>${group.name}</span>
                        <div class="kitsune-group-actions">${actionsHTML}</div>
                    `;
                    listContainer.appendChild(item);
                });
            }
            modal.querySelector("#kitsune-btn-new-group").disabled = currentGroups.length >= MAX_GROUPS;
        }

        function bindUIEvents() {
            const listView = modal.querySelector("#kitsune-groups-list-view");
            const formView = modal.querySelector("#kitsune-groups-form-view");
            const formTitle = modal.querySelector("#kitsune-form-title");
            const groupNameInput = modal.querySelector("#kitsune-group-name");
            const groupCoordsInput = modal.querySelector("#kitsune-group-coords");

            // NOVO: Evento para o botão "Mostrar Minhas Aldeias"
            modal.querySelector("#kitsune-btn-show-villages").addEventListener("click", createVillagesListModal);

            modal.querySelector("#kitsune-btn-new-group").addEventListener("click", () => {
                editingGroupId = null;
                confirmingDeleteId = null;
                formTitle.textContent = "Criar Novo Grupo";
                groupNameInput.value = "";
                groupCoordsInput.value = "";
                listView.style.display = "none";
                formView.style.display = "block";
            });

            modal.querySelector("#kitsune-btn-cancel-edit").addEventListener("click", () => {
                formView.style.display = "none";
                listView.style.display = "block";
            });

            modal.querySelector("#kitsune-btn-save-group").addEventListener("click", () => {
                const name = groupNameInput.value.trim();
                const coordsText = groupCoordsInput.value.trim();
                
                // Extrai apenas as coordenadas, ignorando nomes ou outros textos após '#'
                const coords = coordsText.split("\n")
                    .map(line => line.split('#')[0].trim()) // Pega a parte antes do '#'
                    .filter(c => c.match(/^\d+\|\d+$/)); // Filtra apenas as que são coordenadas válidas

                if (!name) {
                    alert("O nome do grupo não pode estar vazio.");
                    return;
                }
                if (editingGroupId) {
                    const group = currentGroups.find(g => g.id === editingGroupId);
                    if (group) {
                        group.name = name;
                        group.coords = coords;
                    }
                } else {
                    currentGroups.push({ id: Date.now(), name: name, coords: coords });
                }
                saveCustomGroups(currentGroups);
                renderGroupsList();
                formView.style.display = "none";
                listView.style.display = "block";
            });

            modal.querySelector("#kitsune-custom-groups-list").addEventListener("click", (event) => {
                const target = event.target;
                const item = target.closest(".kitsune-custom-group-item");
                if (!item) return;

                const groupId = parseInt(item.dataset.id, 10);

                if (target.classList.contains("action-edit")) {
                    confirmingDeleteId = null;
                    const group = currentGroups.find(g => g.id === groupId);
                    if (group) {
                        editingGroupId = groupId;
                        formTitle.textContent = `Editar Grupo "${group.name}"`;
                        groupNameInput.value = group.name;
                        groupCoordsInput.value = group.coords.join("\n");
                        listView.style.display = "none";
                        formView.style.display = "block";
                    }
                } else if (target.classList.contains("action-delete")) {
                    confirmingDeleteId = groupId;
                    renderGroupsList();
                } else if (target.classList.contains("action-confirm-yes")) {
                    currentGroups = currentGroups.filter(g => g.id !== groupId);
                    saveCustomGroups(currentGroups);
                    confirmingDeleteId = null;
                    renderGroupsList();
                } else if (target.classList.contains("action-confirm-no")) {
                    confirmingDeleteId = null;
                    renderGroupsList();
                }
            });

            modal.querySelector(".kitsune-modal-close").addEventListener("click", hide);
            modal.addEventListener("click", (event) => {
                if (event.target === modal) hide();
            });
        }

        function show() {
            createModal();
            currentGroups = getCustomGroups();
            confirmingDeleteId = null;
            renderGroupsList();
            modal.querySelector("#kitsune-groups-form-view").style.display = "none";
            modal.querySelector("#kitsune-groups-list-view").style.display = "block";
            modal.classList.add("show");
        }

        function hide() {
            if (modal) modal.classList.remove("show");
        }

        return { open: show };
    }


    async function getOfficialGroups() {
        const groups = [];
        try {
            if (typeof villageDock !== 'undefined' && villageDock.loadLink) {
                let finalUrl = villageDock.loadLink;
                if (typeof game_data !== 'undefined' && game_data.csrf) { finalUrl = `${finalUrl}&h=${game_data.csrf}`; }
                const response = await fetch(finalUrl);
                if (!response.ok) return [];
                const data = await response.json();
                if (data && Array.isArray(data.result)) {
                    data.result.forEach(groupInfo => {
                        if (groupInfo.group_id && groupInfo.name) {
                            groups.push({ id: groupInfo.group_id, nome: groupInfo.name });
                        }
                    });
                }
            }
        } catch (e) { console.error("Kitsune: Erro ao buscar grupos oficiais.", e); }
        return groups;
    }

    async function getCombinedGroups() {
        const officialGroups = await getOfficialGroups();
        const customGroups = getCustomGroups().map(g => ({
            id: `custom_${g.id}`,
            nome: `[P] ${g.name}`
        }));
        return [...officialGroups, ...customGroups];
    }

    function getVillagesFromGroup(groupId) {
        if (typeof groupId === 'string' && groupId.startsWith('custom_')) {
            const customId = parseInt(groupId.replace('custom_', ''));
            const customGroups = getCustomGroups();
            const group = customGroups.find(g => g.id === customId);

            if (!group || !window.KitsuneVillageManager) {
                return [];
            }

            const villageMap = window.KitsuneVillageManager.getMap();
            const targetCoords = new Set(group.coords);
            const matchingVillages = [];
            for (const villageId in villageMap) {
                const village = villageMap[villageId];
                if (targetCoords.has(village.coords)) {
                    matchingVillages.push({
                        id: villageId,
                        name: village.name,
                        coords: village.coords
                    });
                }
            }
            return matchingVillages;

        } else {
            const cache = JSON.parse(localStorage.getItem(PREMIUM_CACHE_KEY) || '{}');
            const groupData = cache[groupId];
            if (groupData && (Date.now() - groupData.timestamp < CACHE_DURATION_MS)) {
                return groupData.villages;
            }
            console.warn(`Kitsune Grupos: Dados para o grupo premium ${groupId} estão desatualizados ou não existem. Sincronize os grupos.`);
            return [];
        }
    }

    addModalStyles();

    window.kitsuneModalManager = {
        modal: manageCustomGroupsModal(),
        getCombinedGroups: getCombinedGroups,
        getVillagesFromGroup: getVillagesFromGroup,
    };
})();

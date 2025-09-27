// =========================================================================================
// --- INÍCIO: Módulo de Modelos de Tropas (custom_templates.js) ---
// =========================================================================================
(function () {
    const TROOP_STORAGE_KEY = 'kitsune_troop_templates';
    const RESEARCH_STORAGE_KEY = 'kitsune_research_templates';
    const MODAL_ID = 'kitsune-template-modal';
    const unitConfig = [
        { id: 'spear', name: 'Lanceiro', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_spear.webp' },
        { id: 'sword', name: 'Espadachim', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_sword.webp' },
        { id: 'axe', name: 'Bárbaro', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_axe.webp' },
        { id: 'archer', name: 'Arqueiro', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_archer.webp' },
        { id: 'spy', name: 'Explorador', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_spy.webp' },
        { id: 'light', name: 'Cavalaria Leve', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_light.webp' },
        { id: 'marcher', name: 'Arq. a Cavalo', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_marcher.webp' },
        { id: 'heavy', name: 'Cavalaria Pesada', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/unit_heavy.webp' },
        { id: 'ram', name: 'Aríete', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/recruit/grey/ram.webp' },
        { id: 'catapult', name: 'Catapulta', icon: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/recruit/grey/catapult.webp' }
    ];

    const defaultTroopTemplates = [
        { name: 'P ATK', troops: { axe: 1, spy: 1, light: 1, marcher: 1, ram: 1 } },
        { name: 'P DEF', troops: { spear: 1, sword: 1, archer: 1, heavy: 1 } },
        { name: 'TODOS', troops: { spear: 1, sword: 1, axe: 1, archer: 1, spy: 1, light: 1, marcher: 1, heavy: 1, ram: 1, catapult: 1 } },
    ];

    const defaultResearchTemplates = [
        { name: 'P ATK', research: { axe: { active: true }, spy: { active: true }, light: { active: true }, marcher: { active: true }, ram: { active: true } } },
        { name: 'P DEF', research: { spear: { active: true }, sword: { active: true }, archer: { active: true }, heavy: { active: true } } },
        { name: 'TODOS', research: { spear: { active: true }, sword: { active: true }, axe: { active: true }, archer: { active: true }, spy: { active: true }, light: { active: true }, marcher: { active: true }, heavy: { active: true }, ram: { active: true }, catapult: { active: true } } },
    ];

    function getModalStyles() {
        return `
            #${MODAL_ID} {
                display: none; position: fixed; z-index: 15000; left: 0; top: 0; width: 100%; height: 100%;
                overflow: auto; background-color: rgba(0,0,0,0.6); justify-content: center; align-items: center;
                font-family: Verdana, sans-serif; font-size: 12px;
            }
            .ktm-modal-content {
                background-color: var(--kitsune-bg, #282c34); color: var(--kitsune-text, #dcdfe4);
                width: 90%; max-width: 750px; border-radius: 10px; border: 1px solid var(--kitsune-border, #4a515e);
                box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; max-height: 80vh;
            }
            .ktm-modal-header {
                padding: 12px 20px; background-color: var(--kitsune-bg-darker, #21252b);
                border-bottom: 1px solid var(--kitsune-border, #4a515e); border-top-left-radius: 10px; border-top-right-radius: 10px;
                display: flex; justify-content: center; align-items: center; position: relative;
            }
            .ktm-modal-header h2 { margin: 0; color: var(--kitsune-accent, #e06c75); font-size: 1.4em; }
            .ktm-close-button {
                color: var(--kitsune-text-dark, #8a919e); font-size: 28px; font-weight: bold; cursor: pointer;
                position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
            }
            .ktm-close-button:hover, .ktm-close-button:focus { color: #fff; }
            .ktm-tabs { display: flex; padding: 10px 20px 0 20px; background-color: var(--kitsune-bg, #282c34); gap: 10px; }
            .ktm-tab-btn { background-color: var(--kitsune-bg-light); border: 1px solid var(--kitsune-border); border-bottom: none; color: var(--kitsune-text-dark); padding: 8px 15px; cursor: pointer; border-top-left-radius: 5px; border-top-right-radius: 5px; font-weight: bold; }
            .ktm-tab-btn.active { background-color: var(--kitsune-bg-darker); color: var(--kitsune-accent-alt); border-color: var(--kitsune-border); }
            .ktm-modal-body { display: flex; padding: 20px; overflow: hidden; gap: 20px; background-color: var(--kitsune-bg-darker); }
            .ktm-template-list, .ktm-template-form { flex: 1; display: flex; flex-direction: column; }
            .ktm-template-list { min-width: 200px; }
            .ktm-scroll-container { overflow-y: auto; padding-right: 10px; border: 1px solid var(--kitsune-border); border-radius: 5px; background-color: var(--kitsune-bg); padding: 10px; flex-grow: 1;}
            .ktm-list-item { display: block; padding: 8px; border-radius: 4px; margin-bottom: 5px; background-color: var(--kitsune-bg-light); }
            .ktm-list-item-header { display: flex; justify-content: space-between; align-items: center; }
            .ktm-list-item-header span { font-weight: bold; }
            .ktm-troop-preview { display: flex; gap: 12px; margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--kitsune-bg, #282c34); }
            .ktm-troop-item { display: flex; align-items: center; gap: 4px; font-size: 0.9em; color: var(--kitsune-text-dark, #8a919e); }
            .ktm-troop-item img { width: 16px; height: 16px; }
            .ktm-button-group button { background: none; border: 1px solid var(--kitsune-border, #4a515e); color: var(--kitsune-text, #dcdfe4); cursor: pointer; padding: 4px 8px; border-radius: 3px; margin-left: 5px; }
            .ktm-button-group button:hover { background-color: var(--kitsune-border, #4a515e); }
            .ktm-form-title { font-size: 1.2em; color: var(--kitsune-accent-alt, #98c379); margin-top: 0; margin-bottom: 15px; text-align: center; }
            .ktm-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px 20px; margin-top: 20px; }
            .ktm-research-grid { display: grid; grid-template-columns: auto 1fr auto; gap: 10px 15px; align-items: center; margin-top: 20px; }
            .ktm-research-grid .kitsune-beta-feature { text-align: center; }
            .ktm-form-group { display: flex; flex-direction: column; }
            .ktm-form-group.full-width { grid-column: 1 / -1; }
            .ktm-form-group label { margin-bottom: 5px; font-weight: bold; display: flex; align-items: center; gap: 5px;}
            .ktm-form-group img { width: 18px; height: 18px; }
            .ktm-form-group input { width: 100%; box-sizing: border-box; background-color: var(--kitsune-bg); color: var(--kitsune-text); border: 1px solid var(--kitsune-border); border-radius: 4px; padding: 6px; }
            .ktm-modal-footer { padding: 10px 20px; border-top: 1px solid var(--kitsune-border); text-align: right; background-color: var(--kitsune-bg-darker); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; }
            .ktm-button { padding: 8px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; border: 1px solid; }
            .ktm-button-primary { background-color: var(--kitsune-accent, #e06c75); color: #fff; border-color: var(--kitsune-accent, #e06c75); }
            .ktm-button-primary:hover { background-color: #c05c65; }
            .ktm-button-secondary { background-color: transparent; color: var(--kitsune-accent-alt, #98c379); border-color: var(--kitsune-accent-alt, #98c379); margin-right: 10px; }
            .ktm-button-secondary:hover { background-color: rgba(152, 195, 121, 0.2); }
        `;
    }

    const manager = {
        isEditing: null,
        currentMode: 'troops',

        getStorageKey: function() {
            return this.currentMode === 'troops' ? TROOP_STORAGE_KEY : RESEARCH_STORAGE_KEY;
        },
        loadTemplates: function() {
            try {
                const templates = localStorage.getItem(this.getStorageKey());
                return templates ? JSON.parse(templates) : [];
            } catch (e) {
                console.error("Kitsune Error: Failed to load templates.", e);
                return [];
            }
        },
        saveTemplates: function(templates) {
            try {
                if (this.currentMode === 'troops') {
                    const normalizedTemplates = templates.map(template => {
                        const normalizedTroops = {};
                        unitConfig.forEach(unit => {
                            normalizedTroops[unit.id] = template.troops[unit.id] || 0;
                        });
                        return { ...template, troops: normalizedTroops };
                    });
                    localStorage.setItem(this.getStorageKey(), JSON.stringify(normalizedTemplates));
                } else {
                    localStorage.setItem(this.getStorageKey(), JSON.stringify(templates));
                }

            } catch (e) {
                console.error("Kitsune Error: Failed to save templates.", e);
            }
        },
        render: function() {
            this.renderList();
            this.renderForm();
        },
        renderList: function() {
            const templates = this.loadTemplates();
            const listContainer = document.querySelector(`#${MODAL_ID} .ktm-scroll-container`);
            listContainer.innerHTML = '';

            templates.forEach(template => {
                const item = document.createElement('div');
                item.className = 'ktm-list-item';
                item.innerHTML = `
                    <div class="ktm-list-item-header">
                        <span>${template.name}</span>
                        <div class="ktm-button-group">
                            <button class="ktm-edit-btn" data-name="${template.name}">Editar</button>
                            <button class="ktm-delete-btn" data-name="${template.name}">Excluir</button>
                        </div>
                    </div>`;
                listContainer.appendChild(item);
            });
        },
        renderForm: function() {
            const formContainer = document.querySelector(`#${MODAL_ID} .ktm-template-form`);
            if (this.currentMode === 'troops') {
                formContainer.innerHTML = this.getTroopFormHtml();
            } else {
                formContainer.innerHTML = this.getResearchFormHtml();
            }
            this.clearForm();
        },
        clearForm: function() {
            document.querySelector('#ktm-template-name').value = '';
            if (this.currentMode === 'troops') {
                unitConfig.forEach(unit => {
                    const input = document.querySelector(`#ktm-unit-${unit.id}`);
                    if(input) input.value = '0';
                });
            } else {
                 unitConfig.forEach(unit => {
                    const checkbox = document.querySelector(`#ktm-research-${unit.id}-active`);
                    const levelInput = document.querySelector(`#ktm-research-${unit.id}-level`);
                    if(checkbox) checkbox.checked = false;
                    if(levelInput) levelInput.value = '0';
                });
            }
            document.querySelector('#ktm-form-title').textContent = 'Criar Novo Modelo';
            this.isEditing = null;
        },
        populateForm: function(templateName) {
            const templates = this.loadTemplates();
            const template = templates.find(t => t.name === templateName);
            if (!template) return;
            document.querySelector('#ktm-form-title').textContent = `Editando: ${template.name}`;
            document.querySelector('#ktm-template-name').value = template.name;

            if (this.currentMode === 'troops') {
                unitConfig.forEach(unit => {
                    document.querySelector(`#ktm-unit-${unit.id}`).value = template.troops[unit.id] || '0';
                });
            } else {
                unitConfig.forEach(unit => {
                    const unitData = template.research?.[unit.id] || {};
                    document.querySelector(`#ktm-research-${unit.id}-active`).checked = !!unitData.active;
                    document.querySelector(`#ktm-research-${unit.id}-level`).value = unitData.level || '0';
                });
            }

            this.isEditing = templateName;
        },
        handleSave: function() {
            const newName = document.querySelector('#ktm-template-name').value.trim();
            if (!newName) {
                alert('Kitsune: O nome do modelo não pode estar vazio.');
                return;
            }
            let templates = this.loadTemplates();
            if (this.isEditing && this.isEditing !== newName && templates.some(t => t.name === newName)) {
                alert('Kitsune: Já existe um modelo com este nome.');
                return;
            } else if (!this.isEditing && templates.some(t => t.name === newName)) {
                 alert('Kitsune: Já existe um modelo com este nome.');
                 return;
            }

            let newTemplate = { name: newName };
            if (this.currentMode === 'troops') {
                newTemplate.troops = {};
                unitConfig.forEach(unit => {
                    const value = parseInt(document.querySelector(`#ktm-unit-${unit.id}`).value, 10) || 0;
                    newTemplate.troops[unit.id] = value;
                });
            } else {
                newTemplate.research = {};
                unitConfig.forEach(unit => {
                    newTemplate.research[unit.id] = {
                        active: document.querySelector(`#ktm-research-${unit.id}-active`).checked,
                        level: parseInt(document.querySelector(`#ktm-research-${unit.id}-level`).value, 10) || 0
                    };
                });
            }

            if (this.isEditing) {
                templates = templates.map(t => t.name === this.isEditing ? newTemplate : t);
            } else {
                templates.push(newTemplate);
            }
            this.saveTemplates(templates);
            this.renderList();
            this.clearForm();
        },
        handleDelete: function(templateName) {
            if (!confirm(`Tem certeza que deseja excluir o modelo "${templateName}"?`)) return;
            let templates = this.loadTemplates();
            templates = templates.filter(t => t.name !== templateName);
            this.saveTemplates(templates);
            this.renderList();
            if (this.isEditing === templateName) {
                this.clearForm();
            }
        },
        init: function() {
            if (!localStorage.getItem(TROOP_STORAGE_KEY)) {
                localStorage.setItem(TROOP_STORAGE_KEY, JSON.stringify(defaultTroopTemplates));
            }
             if (!localStorage.getItem(RESEARCH_STORAGE_KEY)) {
                localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(defaultResearchTemplates));
            }

            const style = document.createElement('style');
            style.textContent = getModalStyles();
            document.head.appendChild(style);

            const modalContainer = document.createElement('div');
            modalContainer.id = MODAL_ID;
            document.body.appendChild(modalContainer);

            // **REVISÃO APLICADA:** Mover o event listener para a inicialização e usar delegação.
            modalContainer.addEventListener('click', (e) => {
                const target = e.target;

                if (target.id === MODAL_ID || target.classList.contains('ktm-close-button')) {
                    this.close();
                }
                if (target.classList.contains('ktm-edit-btn')) {
                    this.populateForm(target.dataset.name);
                }
                if (target.classList.contains('ktm-delete-btn')) {
                    this.handleDelete(target.dataset.name);
                }
                if(target.classList.contains('ktm-tab-btn')) {
                    this.currentMode = target.dataset.mode;
                    document.querySelector('.ktm-tab-btn.active').classList.remove('active');
                    target.classList.add('active');
                    this.render();
                }
                if (target.id === 'ktm-save-btn') {
                    this.handleSave();
                }
                if (target.id === 'ktm-new-btn') {
                    this.clearForm();
                }
            });
        },
        open: function(mode = 'troops') {
            this.currentMode = mode;
            const modalContainer = document.getElementById(MODAL_ID);
            modalContainer.innerHTML = this.getModalHtml();
            this.render();
            modalContainer.style.display = 'flex';
            // **REVISÃO APLICADA:** Os listeners de botões estáticos foram removidos daqui, pois são tratados pelo listener delegado.
        },
        close: function() {
            document.getElementById(MODAL_ID).style.display = 'none';
        },
        getTroopFormHtml: function() {
             const unitInputs = unitConfig.map(unit => `
                <div class="ktm-form-group">
                    <label for="ktm-unit-${unit.id}"><img src="${unit.icon}" title="${unit.name}">${unit.name}</label>
                    <input type="number" id="ktm-unit-${unit.id}" min="0" value="0">
                </div>
            `).join('');
            return `<h3 id="ktm-form-title" class="ktm-form-title">Criar Novo Modelo</h3>
                    <div class="ktm-form-group full-width">
                        <label for="ktm-template-name">Nome do Modelo</label>
                        <input type="text" id="ktm-template-name" placeholder="Ex: Full Ataque CL">
                    </div>
                    <div class="ktm-form-grid">${unitInputs}</div>`;
        },
        getResearchFormHtml: function() {
            const researchInputs = unitConfig.map(unit => `
                <label for="ktm-research-${unit.id}-active"><img src="${unit.icon}" title="${unit.name}">${unit.name}</label>
                <input type="checkbox" id="ktm-research-${unit.id}-active">
                <div class="kitsune-beta-feature">
                    <input type="number" id="ktm-research-${unit.id}-level" min="0" max="20" value="0" style="width: 60px; text-align: center;" disabled>
                </div>
            `).join('');
            return `<h3 id="ktm-form-title" class="ktm-form-title">Criar Novo Modelo</h3>
                    <div class="ktm-form-group full-width">
                        <label for="ktm-template-name">Nome do Modelo</label>
                        <input type="text" id="ktm-template-name" placeholder="Ex: Pesquisas Ofensivas">
                    </div>
                    <div class="ktm-research-grid">
                       <strong style="grid-column: 1;">Unidade</strong>
                       <strong style="text-align: center; grid-column: 2;">Ativar</strong>
                       <strong style="text-align: center; grid-column: 3;">Nível</strong>
                       ${researchInputs}
                    </div>`;
        },
        getModalHtml: function() {
            return `
                <div class="ktm-modal-content">
                    <div class="ktm-modal-header">
                        <h2>Gerenciador de Modelos</h2>
                        <span class="ktm-close-button">&times;</span>
                    </div>
                    <div class="ktm-tabs">
                         <button class="ktm-tab-btn ${this.currentMode === 'troops' ? 'active' : ''}" data-mode="troops">Tropas</button>
                         <button class="ktm-tab-btn ${this.currentMode === 'research' ? 'active' : ''}" data-mode="research">Pesquisas</button>
                    </div>
                    <div class="ktm-modal-body">
                        <div class="ktm-template-list">
                            <h3 class="ktm-form-title">Modelos Salvos</h3>
                            <div class="ktm-scroll-container"></div>
                        </div>
                        <div class="ktm-template-form">
                            </div>
                    </div>
                    <div class="ktm-modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
                         <div style="display: flex; gap: 10px;">
                             <div class="kitsune-beta-feature"><button id="ktm-import-btn" class="ktm-button ktm-button-secondary" style="margin-right: 0;" disabled>IMPORTAR</button></div>
                             <div class="kitsune-beta-feature"><button id="ktm-export-btn" class="ktm-button ktm-button-secondary" style="margin-right: 0;" disabled>EXPORTAR</button></div>
                         </div>
                        <div>
                             <button id="ktm-new-btn" class="ktm-button ktm-button-secondary">Criar Novo</button>
                             <button id="ktm-save-btn" class="ktm-button ktm-button-primary">Salvar</button>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    window.kitsuneTemplateManager = {
        modal: {
            open: (mode = 'troops') => manager.open(mode)
        },
        getTemplates: (mode = 'troops') => {
            const key = mode === 'troops' ? TROOP_STORAGE_KEY : RESEARCH_STORAGE_KEY;
            try {
                const templates = localStorage.getItem(key);
                return templates ? JSON.parse(templates) : [];
            } catch(e) { return []; }
        },
        // Adicionado para permitir salvar de fora do módulo
        saveTemplates: (templates, mode = 'troops') => {
             const key = mode === 'troops' ? TROOP_STORAGE_KEY : RESEARCH_STORAGE_KEY;
             localStorage.setItem(key, JSON.stringify(templates));
        }
    };
    window.addEventListener('load', () => manager.init());
})();
// =========================================================================================
// --- INÍCIO: Módulo de UI do Kitsune (kitsuneUI.js) ---
// =========================================================================================
(function() {
    'use strict';

    if (window.UI) {
        return;
    }

    console.log("🎨 Kitsune | Módulo de UI está sendo carregado...");

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const SVG_TAGS = ['svg', 'path', 'polyline'];

    const UI = {
        createElement: (tag, options = {}, children = []) => {
            // Verifica se a tag é um tipo de SVG
            const isSvg = SVG_TAGS.includes(tag.toLowerCase());
            
            // Usa o método correto para criar o elemento
            const el = isSvg
                ? document.createElementNS(SVG_NS, tag)
                : document.createElement(tag);

            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Atributos SVG (como 'd' e 'points') não usam setAttribute da mesma forma
                    el.setAttribute(key, value);
                }
            });

            children.forEach(child => {
                el.append(child);
            });

            return el;
        }
    };

    window.UI = UI;

})();

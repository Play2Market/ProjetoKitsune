 =========================================================================================
 --- INÍCIO Módulo de UI do Kitsune (kitsuneUI.js) ---
 =========================================================================================
(function() {
    'use strict';

    if (window.UI) {
        return;
    }

    console.log(🎨 Kitsune  Módulo de UI está sendo carregado...);

    const UI = {
        
          Cria um elemento HTML com opções e filhos.
          @param {string} tag - A tag HTML a ser criada (ex 'div', 'button').
          @param {object} options - Um objeto com os atributos do elemento (ex { id 'meu-id', class 'classe' }).
          @param {Array} children - Uma lista de filhos para adicionar ao elemento. Podem ser outros elementos ou strings de texto.
          @returns {HTMLElement} O elemento HTML criado.
         
        createElement (tag, options = {}, children = []) = {
             1. Cria o elemento principal (ex div ...div)
            const el = document.createElement(tag);

             2. Adiciona os atributos (id, class, style, etc.)
             Ex se options é { class 'painel' }, ele faz el.setAttribute('class', 'painel')
            Object.entries(options).forEach(([key, value]) = {
                if (value !== undefined && value !== null) {
                    el.setAttribute(key, value);
                }
            });

             3. Adiciona os filhos dentro do elemento
            children.forEach(child = {
                 A função .append() é inteligente
                 - Se o 'child' for um elemento (como um h3), ele o anexa.
                 - Se o 'child' for um texto (string), ele o adiciona como texto.
                el.append(child);
            });

             4. Retorna o elemento completo e pronto para ser usado
            return el;
        }
    };

     Expõe nossa fábrica para que outros scripts possam usá-la
    window.UI = UI;

})();
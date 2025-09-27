// =========================================================================================
// --- INÍCIO: Módulo de Constantes do Kitsune (kitsuneConstants.js) ---
// =========================================================================================
(function() {
    'use strict';

    if (window.KitsuneConstants) {
        return;
    }

    console.log("📚 Kitsune | Módulo de Constantes está sendo carregado...");

    const constants = {
        MODULOS: {
            DASHBOARD: 'dashboard',
            CONSTRUTOR: 'Construtor',
            RECRUTADOR: 'Recrutador',
            SAQUEADOR: 'Saqueador'
        },

        ICONS: {
            KITSUNE: 'https://b.thumbs.redditmedia.com/1l0qG91U_lSzE-4gEGrE2cNeXMVTBeFQ0Hvjes3VYsE.png',
            FARM_A: 'https://cdn-icons-png.flaticon.com/512/3665/3665892.png',
            FARM_B: 'https://cdn-icons-png.flaticon.com/512/3665/3665896.png',
            FARM_C: 'https://cdn-icons-png.flaticon.com/512/3665/3665899.png',
            ARIETE: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/recruit/grey/ram.webp',
            CATAPULTA: 'https://dsbr.innogamescdn.com/asset/636f8dd3/graphic/unit/recruit/grey/catapult.webp',
            REFRESH: 'https://cdn-icons-png.flaticon.com/512/61/61444.png',
            MANAGE: 'https://cdn-icons-png.flaticon.com/512/7887/7887701.png',
            TEMPLATE: 'https://w7.pngwing.com/pngs/388/107/png-transparent-write-modify-tool-edit-pen-document-multimedia-solid-px-icon-thumbnail.png',
            ADICIONAR: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDhoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTkgMTNoLTZ2NmgtMnYtNmgtNnYtMmg2di02aDJ2Nmg2djJ6Ii8+PC9zdmc+',
            REMOVER: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0wIDhoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTkgMTNINVYxMWgxNHYyeiIvPjwvc3ZnPg==',
            TIMER_CONFIG: 'https://cdn-icons-png.flaticon.com/512/6488/6488603.png'
        }
    };

    window.KitsuneConstants = constants;

})();
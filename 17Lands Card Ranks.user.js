// ==UserScript==
// @name         17Lands Card Ranks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays numeric rank next to card names on 17Lands.
// @author       Davis Burton
// @match        https://www.17lands.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CARD_SELECTOR = '.list_card_name';
    const RANK_CLASS = 'tm-card-rank';

    // Inject badge styles once
    const style = document.createElement('style');
    style.textContent = `.${RANK_CLASS} { margin-right: 6px; font-weight: 600; opacity: 0.85; pointer-events: none; }`;
    document.head.appendChild(style);

    let scheduled = false;

    function applyRanks() {
        scheduled = false;
        if (!location.pathname.startsWith('/card_data')) return;

        const cards = document.querySelectorAll(CARD_SELECTOR);
        cards.forEach((el, idx) => {
            let badge = el.querySelector(`.${RANK_CLASS}`);
            if (!badge) {
                badge = document.createElement('span');
                badge.className = RANK_CLASS;
                el.prepend(badge);
            }
            badge.textContent = `${idx + 1}.`;
        });
    }

    function scheduleApply() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(applyRanks);
    }

    // Observe DOM changes
    const observer = new MutationObserver(scheduleApply);
    function startObserver() {
        observer.disconnect();
        observer.observe(document.body, { childList: true, subtree: true });
        scheduleApply();
    }

    // Hook History API for SPA navigation
    const origPush = history.pushState;
    history.pushState = function () {
        origPush.apply(this, arguments);
        setTimeout(startObserver, 50);
    };
    const origReplace = history.replaceState;
    history.replaceState = function () {
        origReplace.apply(this, arguments);
        setTimeout(startObserver, 50);
    };
    window.addEventListener('popstate', () => setTimeout(startObserver, 50));

    // Start
    startObserver();
})();

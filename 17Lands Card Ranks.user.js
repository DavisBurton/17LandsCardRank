// ==UserScript==
// @name         17Lands Card Ranks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prepends numeric rank to card names.
// @author       Davis Burton
// @match        https://www.17lands.com/card_data*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addRanks() {
        const cardNames = document.getElementsByClassName("list_card_name")
        for (let i = 0; i < cardNames.length; i++) {
            const row = cardNames[i];
            // This function will run a lot so we only want to add the rank if it isn't there already
            if(row.innerHTML && !row.innerHTML.startsWith(i + 1 + ". ")){
                row.innerHTML = (i + 1) + ". " + row.innerHTML;
            };
        };
    };

    const observer = new MutationObserver(function(mutationsList, observer) {
        // Disconnect the observer before making changes, so we don't detect our own changes
        observer.disconnect();

        addRanks();

        observer.observe(document.body, observerOptions);
    });

    const observerOptions = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerOptions);

    // Also add rank after every click. I found both an observer and listener together were needed to always display the card ranks.
    document.addEventListener("click", addRanks);
})();
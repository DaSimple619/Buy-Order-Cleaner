// ==UserScript==
// @name         Backpack.tf Buy Order Spells and Effects Pruner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Purges spell, effect, and part buy orders except for quality 5 items
// @author       My big balls
// @match        *://backpack.tf/stats*
// @match        *://backpack.tf/classifieds*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;

    // Updated badAttributes array to include a function that checks for data-part_name_ attributes
    const badAttributes = [
        "data-spell_1",
        "data-spell_2",
        "data-effect_name",
        // Function to check for any data-part_name_ attributes
        (element) => {
            const attributes = element.attributes;
            for (let attr of attributes) {
                if (attr.name.includes('data-part_name_')) {
                    return true;
                }
            }
            return false;
        }
    ];

    let listings;
    if (url.includes("premium")) listings = document.querySelectorAll("li.item");
    else listings = document.querySelectorAll("div.item");

    if (!listings) return;

    for (let l = 0; l < listings.length; l++){
        let listing = listings[l];

        let badListing = false;
        for (let i = 0; i < badAttributes.length; i++) {
            const badAttribute = badAttributes[i];
            // Check if it's a function or a string attribute name
            if (typeof badAttribute === 'function') {
                if (badAttribute(listing)) {
                    badListing = true;
                    break;
                }
            } else {
                if (listing.getAttribute(badAttribute) != null) {
                    badListing = true;
                    break;
                }
            }
        }

        let isBuyOrder = false;
        if (listing.getAttribute('data-listing_intent') == 'buy') {
            isBuyOrder = true;
        }

        let isQuality5 = false;
        if (listing.getAttribute('data-quality') == '5') {
            isQuality5 = true;
        }

        if (badListing && isBuyOrder && !isQuality5) {
            console.log(listing);
            hideListing(listing);
        }
    }
})();

function hideListing(listing) {
    const currentStyle = listing.parentNode.parentNode.getAttribute("style");
    listing.parentNode.parentNode.setAttribute("style", currentStyle + ";display: none !important");
}

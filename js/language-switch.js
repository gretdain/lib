/* language-switch.js
   Reusable per-container language cycler.
   Expected page structure:
     .breeding-page (or any selector in LANGUAGE_SWITCH_CONFIG.pageSelector)
   Expected optional translations:
     window.pageTranslations = {
       en: { SectionId: "<p>...</p>" },
       ge: { SectionId: "<p>...</p>" }
     };
*/
(function () {
    'use strict';

    const config = Object.assign({
        pageSelector: '.breeding-page',
        order: ['ru', 'en', 'de'],
        labels: { ru: 'RU', en: 'EN', de: 'DE' },
        titles: { ru: 'Русский', en: 'English', de: 'Deutsch' },
        htmlLang: { ru: 'ru', en: 'en', de: 'de' },
        defaultLanguage: 'ru',
        viewportTop: 65,
        targetViewportRatio: 0.38,
        minimumTargetY: 120,
        bottomReserve: 80
    }, window.LANGUAGE_SWITCH_CONFIG || {});

    const pages = Array.from(document.querySelectorAll(config.pageSelector));
    if (!pages.length) return;

    const translations = window.pageTranslations || {};

    const switcher = document.createElement('button');
    switcher.type = 'button';
    switcher.className = 'lang-switcher';
    switcher.hidden = true;
    document.body.appendChild(switcher);

    let activePage = null;
    let ticking = false;

    function makePlaceholder(languageName, pageId) {
        const placeholder = document.createElement('div');
        placeholder.className = 'lang-placeholder';
        placeholder.innerHTML =
            '<div><strong>' + languageName + ' version — prototype</strong>' +
            '<span>Section: ' + (pageId || 'untitled') + '</span></div>';
        return placeholder;
    }

    /*
     * Popup images for translated layers are created lazily.
     * Nothing is inserted into a photo-tip until the visitor actually
     * hovers it (desktop) or taps it (touch). This keeps translated
     * links structurally identical to the RU source and prevents popup
     * images from ever appearing as ordinary inline content.
     */
    function ensurePhotoPopup(tip) {
        if (!tip) return null;

        let popup = tip.querySelector(':scope > .photo-popup');
        if (popup) return popup;

        const photoSrc = tip.getAttribute('data-photo');
        if (!photoSrc) return null;

        popup = document.createElement('span');
        popup.className = 'photo-popup';

        const image = document.createElement('img');
        image.src = photoSrc;
        image.alt = '';

        popup.appendChild(image);
        tip.appendChild(popup);

        return popup;
    }

    function buildLanguageLayer(page, lang) {
        const layer = document.createElement('div');
        layer.className = 'lang-layer lang-' + lang;
        layer.setAttribute('lang', config.htmlLang[lang] || lang);
        layer.hidden = lang !== config.defaultLanguage;

        if (lang === config.defaultLanguage) {
            while (page.firstChild) {
                layer.appendChild(page.firstChild);
            }
            return layer;
        }

        const languageContent =
            translations[lang] ||
            (lang === 'de' ? translations.ge : null) ||
            {};
        if (languageContent[page.id]) {
            layer.innerHTML = languageContent[page.id];
        } else {
            layer.appendChild(
                makePlaceholder(config.titles[lang] || lang.toUpperCase(), page.id)
            );
        }

        return layer;
    }

    pages.forEach(function (page) {
        config.order.forEach(function (lang) {
            page.appendChild(buildLanguageLayer(page, lang));
        });
        page.dataset.lang = config.defaultLanguage;
    });

    function setLanguage(page, lang) {
        if (!page || !config.order.includes(lang)) return;

        config.order.forEach(function (item) {
            const layer = page.querySelector(':scope > .lang-' + item);
            if (layer) layer.hidden = item !== lang;
        });

        page.dataset.lang = lang;
        updateSwitcher();
    }

    function nextLanguage(current) {
        const index = config.order.indexOf(current);
        return config.order[(index + 1) % config.order.length];
    }

    function chooseActivePage() {
        const viewportBottom = window.innerHeight;
        const targetY = Math.min(
            Math.max(window.innerHeight * config.targetViewportRatio, config.minimumTargetY),
            viewportBottom - config.bottomReserve
        );

        let best = null;
        let bestDistance = Infinity;

        pages.forEach(function (page) {
            const r = page.getBoundingClientRect();
            if (r.bottom <= config.viewportTop || r.top >= viewportBottom) return;

            let distance = 0;
            if (targetY < r.top) distance = r.top - targetY;
            else if (targetY > r.bottom) distance = targetY - r.bottom;

            if (distance < bestDistance) {
                bestDistance = distance;
                best = page;
            }
        });

        activePage = best;
        updateSwitcher();
    }

    function updateSwitcher() {
        if (!activePage) {
            switcher.hidden = true;
            return;
        }

        const current = activePage.dataset.lang || config.defaultLanguage;
        const next = nextLanguage(current);

        switcher.textContent = config.labels[next] || next.toUpperCase();
        switcher.title = 'Switch to ' + (config.titles[next] || next);
        switcher.setAttribute(
            'aria-label',
            'Switch to ' + (config.titles[next] || next)
        );
        switcher.hidden = false;
    }

    switcher.addEventListener('click', function () {
        if (!activePage) return;
        const current = activePage.dataset.lang || config.defaultLanguage;
        setLanguage(activePage, nextLanguage(current));
    });

    function scheduleActiveCheck() {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(function () {
            ticking = false;
            chooseActivePage();
        });
    }


    /*
     * Desktop: create the popup only when the pointer actually reaches
     * a photo-tip. The existing :hover CSS then displays it.
     */
    document.addEventListener('pointerover', function (event) {
        if (window.matchMedia('(hover: none)').matches) return;

        const tip = event.target.closest('.photo-tip[data-photo]');
        if (tip) ensurePhotoPopup(tip);
    });

    document.addEventListener('focusin', function (event) {
        const tip = event.target.closest('.photo-tip[data-photo]');
        if (tip) ensurePhotoPopup(tip);
    });

    /*
     * Mobile / touch: one tap opens any photo-tip, a second tap on the
     * open image or a tap elsewhere closes it. Event delegation means
     * this works for RU as well as dynamically inserted EN/DE content.
     */
    function isTouchLayout() {
        return window.matchMedia('(hover: none), (pointer: coarse)').matches;
    }

    function closeOpenPhotoTips(except) {
        document.querySelectorAll('.photo-tip.open').forEach(function (tip) {
            if (tip !== except) tip.classList.remove('open');
        });
    }

    document.addEventListener('click', function (event) {
        if (!isTouchLayout()) return;

        const tip = event.target.closest('.photo-tip[data-photo]');

        if (tip) {
            ensurePhotoPopup(tip);
            const popup = event.target.closest('.photo-popup');

            // Tapping the enlarged image closes it.
            if (popup && tip.classList.contains('open')) {
                tip.classList.remove('open');
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // Tapping the source word/icon/photo toggles its popup.
            const wasOpen = tip.classList.contains('open');
            closeOpenPhotoTips(tip);
            tip.classList.toggle('open', !wasOpen);

            event.preventDefault();
            event.stopPropagation();
            return;
        }

        // Tap outside any photo closes the current popup.
        closeOpenPhotoTips(null);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeOpenPhotoTips(null);
        }
    });

    window.addEventListener('scroll', scheduleActiveCheck, { passive: true });
    window.addEventListener('resize', scheduleActiveCheck);
    window.addEventListener('hashchange', function () {
        window.setTimeout(chooseActivePage, 50);
    });

    chooseActivePage();
})();
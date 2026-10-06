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
        order: ['ru', 'en', 'ge'],
        labels: { ru: 'RU', en: 'EN', ge: 'GE' },
        titles: { ru: 'Русский', en: 'English', ge: 'Deutsch' },
        htmlLang: { ru: 'ru', en: 'en', ge: 'de' },
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
     * External scripts such as pictures-view.js can run before translated
     * layers are inserted. This prepares photo-tip popups for EN/GE content
     * added dynamically by this controller.
     */
    function prepareDynamicPhotoTips(root) {
        if (!root) return;

        root.querySelectorAll('.photo-tip[data-photo]').forEach(function (tip) {
            if (tip.querySelector(':scope > .photo-popup')) return;

            const photoSrc = tip.getAttribute('data-photo');
            if (!photoSrc) return;

            const popup = document.createElement('span');
            popup.className = 'photo-popup';

            const image = document.createElement('img');
            image.src = photoSrc;
            image.alt = '';

            popup.appendChild(image);
            tip.appendChild(popup);
        });
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

        const languageContent = translations[lang] || {};
        if (languageContent[page.id]) {
            layer.innerHTML = languageContent[page.id];
        } else {
            layer.appendChild(
                makePlaceholder(config.titles[lang] || lang.toUpperCase(), page.id)
            );
        }

        prepareDynamicPhotoTips(layer);
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

    window.addEventListener('scroll', scheduleActiveCheck, { passive: true });
    window.addEventListener('resize', scheduleActiveCheck);
    window.addEventListener('hashchange', function () {
        window.setTimeout(chooseActivePage, 50);
    });

    chooseActivePage();
})();
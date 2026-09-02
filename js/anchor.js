(function () {

    function goToAnchor() {
        if (!location.hash) return;

        const target = document.getElementById(
            decodeURIComponent(location.hash.slice(1))
        );

        if (!target) return;

        const header = document.querySelector('.header-top__container');
        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 50;

        const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

        window.scrollTo(0, y);
    }

    window.addEventListener('load', function () {
        setTimeout(goToAnchor, 0);
    });

    window.addEventListener('hashchange', goToAnchor);

})();

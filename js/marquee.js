(function () {

    function startMarquee() {

        document.querySelectorAll('.vertical-marquee').forEach(function (box) {

            let paused = false;
            let speed = 0.35;
            let position = 0;


            function move() {

                if (!paused) {

                    position += speed;
                    box.scrollTop = position;

                    if (box.scrollTop >= box.scrollHeight - box.clientHeight) {
                        position = 0;
                        box.scrollTop = 0;
                    }
                }

                requestAnimationFrame(move);
            }


            box.addEventListener('mouseenter', function () {
                paused = true;
            });


            box.addEventListener('mouseleave', function () {
                paused = false;
            });


            box.addEventListener('touchstart', function () {
                paused = true;
            }, { passive: true });


            box.addEventListener('touchend', function () {
                paused = false;
            }, { passive: true });


            move();

        });

    }


    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startMarquee);
    } else {
        startMarquee();
    }

})();
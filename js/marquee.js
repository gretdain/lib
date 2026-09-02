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


			box.addEventListener('pointerdown', function () {
				paused = true;
			});


			box.addEventListener('pointerup', function () {

				setTimeout(function () {
					paused = false;
				}, 3000);

			});


			box.addEventListener('pointercancel', function () {
				paused = false;
			});

			// вот сюда
			box.addEventListener('scroll', function () {
				if (paused) {
					position = box.scrollTop;
				}
			});
	
            move();

        });

    }


    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startMarquee);
    } else {
        startMarquee();
    }

})();
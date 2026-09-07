const videos = document.querySelectorAll('video');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            entry.target.pause();
        }
    });
}, {
    threshold: 0.25
});

videos.forEach((video) => {
    observer.observe(video);
});


document.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => {
        if (!details.open) {
            details.querySelectorAll('video').forEach((video) => {
                video.pause();
            });
        }
    });
});

/* Modal video on desktop follows its place in the parent page */

document.querySelectorAll('details').forEach((details) => {

    const video = details.querySelector('video');

    if (!video) return;

    const parentBlock = details.closest('.vet-item.modal-line');

    if (!parentBlock) return;

    const parentObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (
                window.innerWidth >= 768 &&
                !entry.isIntersecting &&
                details.open
            ) {
                video.pause();
                details.open = false;
            }

        });

    }, {
        threshold: 0
    });

    parentObserver.observe(parentBlock);

});
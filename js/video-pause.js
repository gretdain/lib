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
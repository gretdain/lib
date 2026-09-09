document.querySelectorAll('.photo-tip').forEach((tip) => {

    const popup = document.createElement('span');
    popup.className = 'photo-popup';

    const img = document.createElement('img');
    img.src = tip.dataset.photo;
    img.alt = '';

    popup.appendChild(img);
    tip.appendChild(popup);

    tip.addEventListener('click', (e) => {

        if (window.matchMedia('(hover:none)').matches) {
            e.stopPropagation();

            document.querySelectorAll('.photo-tip.open').forEach((other) => {
                if (other !== tip) other.classList.remove('open');
            });

            tip.classList.toggle('open');
        }

    });

});

document.addEventListener('click', () => {
    document.querySelectorAll('.photo-tip.open')
        .forEach((tip) => tip.classList.remove('open'));
});
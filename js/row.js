function equalizeRowImages() {

    const rows = document.querySelectorAll('.article table tr');

    rows.forEach((row) => {

        const images = Array.from(row.querySelectorAll(':scope > td > img'));

        if (images.length < 2) return;

        /* mobile — return images to normal */
        if (window.innerWidth < 768) {

            images.forEach((img) => {
                img.style.width = '';
                img.style.height = '';
                img.style.maxWidth = '';
                img.style.display = '';
                img.style.margin = '';
            });

            return;
        }


        /* first reset previous calculation */

        images.forEach((img) => {
            img.style.width = '';
            img.style.height = '';
            img.style.maxWidth = '';
        });


        const possibleHeights = images.map((img) => {

            const cell = img.parentElement;

            const style = getComputedStyle(cell);

            const availableWidth =
                cell.clientWidth
                - parseFloat(style.paddingLeft)
                - parseFloat(style.paddingRight);

            const ratio = img.naturalWidth / img.naturalHeight;

            return availableWidth / ratio;
        });


        const commonHeight = Math.min(...possibleHeights);


        images.forEach((img) => {

            img.style.height = commonHeight + 'px';
            img.style.width = 'auto';
            img.style.maxWidth = '100%';

            img.style.display = 'block';
            img.style.margin = '0 auto';
        });

    });

}


window.addEventListener('load', equalizeRowImages);

window.addEventListener('resize', equalizeRowImages);
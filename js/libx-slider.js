(function () {
const sliderEl = document.getElementById('librarySlider');
if (!sliderEl || typeof Swiper === 'undefined') return;

const prevBtn = document.getElementById('librarySliderPrev');
const nextBtn = document.getElementById('librarySliderNext');

let captionTimer = null;

function isDesktopHoverDevice() {
return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function clearCaptionState(swiper) {
swiper.slides.forEach(function (slide) {
slide.classList.remove('libx-caption-visible');
});
}

function getRealTotal(swiper) {
return swiper.slides.length - (swiper.loopedSlides * 2);
}

function scheduleMobileCaption(swiper) {
clearTimeout(captionTimer);
clearCaptionState(swiper);

if (isDesktopHoverDevice()) return;

captionTimer = setTimeout(function () {
const activeSlide = swiper.slides[swiper.activeIndex];

if (activeSlide) {
activeSlide.classList.add('libx-caption-visible');
}
}, 5000);
}

const swiper = new Swiper(sliderEl, {
loop: true,
speed: 450,
zoom: false,
allowTouchMove: true,
slidesPerView: 1,
spaceBetween: 16,

navigation: {
prevEl: prevBtn,
nextEl: nextBtn
},

pagination: {
el: '#librarySliderPagination',
clickable: true
},

on: {
init: function () {
scheduleMobileCaption(this);
},

slideChangeTransitionStart: function () {
clearTimeout(captionTimer);
clearCaptionState(this);
},

slideChangeTransitionEnd: function () {
scheduleMobileCaption(this);
}
}
});


sliderEl.addEventListener('click', function (event) {

const slide = event.target.closest('.libx-slide');

if (!slide) return;

const action = slide.dataset.action;

if (!action) return;


/*
 * PDF object
 *
 * New architecture:
 *
 * data-action="pdf"
 * data-object="complete_antology"
 *
 * becomes:
 *
 * /open/?id=complete_antology
 */

if (action === 'pdf') {

const objectId = slide.dataset.object;

if (objectId && /^[A-Za-z0-9_-]+$/.test(objectId)) {

window.location.href =
'/open/?id=' + encodeURIComponent(objectId);

return;
}


/*
 * Transitional fallback.
 *
 * Пока остальные PDF-карточки ещё содержат
 * старый data-target, они продолжают работать.
 */

const legacyTarget = slide.dataset.target;

if (legacyTarget) {
window.location.href = legacyTarget;
}

return;
}


/*
 * Ordinary links.
 *
 * Их пока вообще не меняем.
 */

if (action === 'link') {

const target = slide.dataset.target;

if (target) {
window.location.href = target;
}

}

});


window.addEventListener('resize', function () {

clearTimeout(captionTimer);
clearCaptionState(swiper);
scheduleMobileCaption(swiper);

});

})();
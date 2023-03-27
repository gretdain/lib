document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-background', {
    loop: true,
    setWrapperSize: true,
    autoplay: {
      delay: 1000,
    },
    speed: 4000,
  });
});

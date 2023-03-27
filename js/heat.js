document.addEventListener('DOMContentLoaded', () => {
  const btnHeat = document.querySelector('.heat__btn');
const containerHeat = document.querySelector('.heat');
const allItemsHeat = document.querySelectorAll('.heat__paragraph');
const allItemsHeatVisibility = document.querySelectorAll('.heat__change-visibility');

const addActiveContainerHeat = () => {
  containerHeat.classList.add('active');
};

const makeVision = () => {
  allItemsHeatVisibility.forEach((item) => {
    item.style.display = 'block';
  });
  console.log(allItemsHeat)
}

const makeHide = () => {
  allItemsHeatVisibility.forEach((item) => {
    item.style.display = 'none';
  });
  btnHeat.style.display = 'block';
}

btnHeat.addEventListener('click', (e) => {
  e.stopPropagation();

  makeVision();
  addActiveContainerHeat();
  e.currentTarget.style.display = 'none';
});

document.addEventListener('click', (e) => {
  const { target } = e;
  const isContainerHeat = target == containerHeat || containerHeat.contains(target);
  const isActive = containerHeat.classList.contains('active');

  if (!isContainerHeat && isActive) {
    containerHeat.classList.remove('active');
    makeHide();

  }
});
})
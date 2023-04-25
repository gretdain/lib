document.addEventListener('DOMContentLoaded', () => {
const btnSecu = document.querySelector('.security__btn');
const containerSecu = document.querySelector('.security');
const allItemsSecu = document.querySelectorAll('.security__paragraph');
const allItemsSecuVisibility = document.querySelectorAll('.security__change-visibility');

const addActiveContainerSecu = () => {
  containerSecu.classList.add('active');
};

const makeVision = () => {
  allItemsSecuVisibility.forEach((item) => {
    item.style.display = 'block';
  });
  console.log(allItemsSecu)
}

const makeHide = () => {
  allItemsSecuVisibility.forEach((item) => {
    item.style.display = 'none';
  });
  btnSecu.style.display = 'block';
}

btnSecu.addEventListener('click', (e) => {
  e.stopPropagation();

  makeVision();
  addActiveContainerSecu();
  e.currentTarget.style.display = 'none';
});

document.addEventListener('click', (e) => {
  const { target } = e;
  const isContainerSecu = target == containerSecu || containerSecu.contains(target);
  const isActive = containerSecu.classList.contains('active');

  if (!isContainerSecu && isActive) {
    containerSecu.classList.remove('active');
    makeHide();

  }
});
})
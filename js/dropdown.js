(function () {

  const dropdowns = Array.from(
    document.querySelectorAll('.menu, .links')
  );

  let activeButton = null;

  function closeAll(returnFocus) {

    dropdowns.forEach(function (wrapper) {
      wrapper.classList.remove('is-open');

      const button = wrapper.querySelector('button');

      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });

    if (returnFocus && activeButton) {
      activeButton.focus();
    }

    activeButton = null;
  }


  dropdowns.forEach(function (wrapper) {

    const button = wrapper.querySelector('button');
    const dropdown = wrapper.querySelector('.dropdown-content');

    if (!button || !dropdown) return;


    /* Button click */
    button.addEventListener('click', function () {

      const wasOpen = wrapper.classList.contains('is-open');

      closeAll(false);

      /* Разрешаем открыть снова после предыдущего закрытия */
      wrapper.classList.remove('menu-closed');

      if (!wasOpen) {
        wrapper.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        activeButton = button;
      }

    });


    /* Click on menu link */
    dropdown.addEventListener('click', function (event) {

      if (!event.target.closest('a')) return;

      closeAll(false);

      /*
       * :hover всё ещё может быть активен.
       * Поэтому временно запрещаем ему снова показать меню.
       */
      wrapper.classList.add('menu-closed');

    });


    /*
     * Когда мышь действительно ушла из меню,
     * снова разрешаем обычный CSS hover.
     */
    wrapper.addEventListener('mouseleave', function () {
      wrapper.classList.remove('menu-closed');
    });

  });


  /* Click outside */
  document.addEventListener('click', function (event) {

    if (!event.target.closest('.menu, .links')) {
      closeAll(false);
    }

  });


  /* Escape */
  document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
      closeAll(true);
    }

  });

})();
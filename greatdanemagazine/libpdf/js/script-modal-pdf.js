$(document).ready(function() {
  // Элементы модального окна
  const modal = $('#demo-modal');
  const modalContent = $('.modal-content');
  const openBtn = $('.modal-target');
  const closeBtn = $('.modal-close');
  const actionBtn = $('.modal-action-btn');
  const modalTitle = $('.modal-title');

  // Переменная для хранения экземпляра PDF
  let pdfInstance = null;

  // Функция открытия модального окна
  function openModal(pdfSource, pdfTitle) {
    // Очищаем предыдущий PDF, если он есть
    if (pdfInstance) {
      $(".my-pdf").empty();
    }

    // Инициализируем новый PDF
    $(".my-pdf").pdf({
      source: pdfSource,
      title: pdfTitle, // Добавляем title
      loadingHeight: 841,
      loadingWidth: 595,
    });

    // Обновляем заголовок модального окна
    modalTitle.text(pdfTitle);

    // Сохраняем ссылку на экземпляр
    pdfInstance = $(".my-pdf").data('pdf');

    modal.addClass('show');

    // Небольшая задержка для запуска анимации
    setTimeout(() => {
      modal.addClass('active');
    }, 10);

    // Блокируем скролл на странице
    $('body').css('overflow', 'hidden');
  }

  // Функция закрытия модального окна
  function closeModal() {
    modal.removeClass('active');

    // Ждем окончания анимации и скрываем модалку
    setTimeout(() => {
      modal.removeClass('show');
      $('body').css('overflow', 'auto');

      // Очищаем PDF при закрытии (опционально)
      if (pdfInstance) {
        $(".my-pdf").empty();
        pdfInstance = null;
      }
    }, 300);
  }

  // Функция для загрузки PDF
  function loadPDF(pdfSource, pdfTitle) {
    // Уничтожаем предыдущий экземпляр, если он есть
    if ($(".my-pdf").data('pdf')) {
      $(".my-pdf").empty().removeData('pdf');
    }

    // Создаем новый контейнер для PDF
    $(".my-pdf").html('<div class="pdf-container" ></div>');

    // Обновляем заголовок модального окна
    modalTitle.text(pdfTitle);

    // Инициализируем плагин с title
    $(".my-pdf .pdf-container").pdf({
      source: pdfSource,
      title: pdfTitle // Передаем заголовок из data-title
    });
  }

  // Открытие модального окна по клику на кнопку
  openBtn.on('click', function(e) {
    e.preventDefault();
    var dataSrc = $(this).attr('datasrc');
    var dataTitle = $(this).attr('data-title') || 'PDF документ'; // Получаем title из атрибута
    console.log('Opening PDF:', dataSrc, 'with title:', dataTitle);

    // Загружаем PDF
    loadPDF(dataSrc, dataTitle);

    // Открываем модальное окно
    modal.addClass('show');
    setTimeout(() => {
      modal.addClass('active');
    }, 10);
    $('body').css('overflow', 'hidden');
  });

  // ОБРАБОТЧИК ДЛЯ КРЕСТИКА
  closeBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  // Закрытие модального окна по клику вне его (на overlay)
  modal.on('click', function(e) {
    if (!$(e.target).closest('.modal-content').length) {
      closeModal();
    }
  });

  // Закрытие модального окна по клавише ESC
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && modal.hasClass('show')) {
      closeModal();
    }
  });

  // Предотвращаем закрытие при клике внутри контента модалки
  modalContent.on('click', function(e) {
    e.stopPropagation();
  });
});
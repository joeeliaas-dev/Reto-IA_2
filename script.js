/* El Café de Don Pedro — comportamiento ligero compartido por las 4 páginas */
(function () {
  'use strict';

  var WA_NUMBER = '50379856009';

  /* 1. Aparición de tarjetas al entrar en pantalla ----------------------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* 2. Menú: filtro por categoría ---------------------------------------- */
  var pills = Array.prototype.slice.call(document.querySelectorAll('.filter-pill'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#dishGrid .product-card'));
  var counter = document.getElementById('resultsCount');

  function updateCount(n) {
    if (counter) {
      counter.textContent = 'Mostrando ' + n + (n === 1 ? ' platillo' : ' platillos');
    }
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) {
        p.classList.remove('is-active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-pressed', 'true');

      var filter = pill.getAttribute('data-filter');
      var shown = 0;
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !show;
        if (show) { shown += 1; }
      });
      updateCount(shown);
    });
  });

  /* 3. Menú: selector de cantidad "- 1 + | PEDIR" ------------------------ */
  document.querySelectorAll('.add-pill').forEach(function (pill) {
    var out = pill.querySelector('.qty');
    var link = pill.querySelector('.add-link');
    if (!out || !link) { return; }
    var dish = link.getAttribute('data-dish');
    var qty = 1;

    function update() {
      out.textContent = qty;
      var msg = 'Hola El Café de Don Pedro, deseo ordenar: ' + qty + ' x ' + dish;
      link.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    pill.querySelectorAll('.step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qty = Math.min(20, Math.max(1, qty + Number(btn.getAttribute('data-step'))));
        update();
      });
    });
  });

  /* 4. Contacto: arma el mensaje y lo abre en WhatsApp -------------------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get('nombre') || '').trim();

      var lines = ['Hola El Café de Don Pedro, quiero hacer una solicitud:'];
      [
        ['Nombre', 'nombre'],
        ['Teléfono / WhatsApp', 'telefono'],
        ['Correo', 'correo'],
        ['Motivo', 'motivo'],
        ['Fecha del evento', 'fecha'],
        ['Número de personas', 'personas'],
        ['Mensaje', 'mensaje']
      ].forEach(function (pair) {
        var value = String(data.get(pair[1]) || '').trim();
        if (value) { lines.push(pair[0] + ': ' + value); }
      });

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      if (status) {
        status.textContent = '¡Gracias, ' + (name || 'amigo') + '! Abrimos WhatsApp con tu solicitud lista para enviar. Si no se abrió, llámanos al 2260-2011.';
        status.hidden = false;
      }
      form.reset();
    });
  }
})();

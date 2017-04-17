(function() {
  'use strict';

  $('.parallax').parallax();

  $.getJSON('/books')
    .done((books) => {
      const $books = $('#books');

      for (const book of books) {
        const $anchor = $('<a>')
          .attr({
            href: `/book.html?id=${book.id}`,
            'data-delay': '50',
            'data-tooltip': book.title
          })
          .tooltip();

        const $card = $('<div>').addClass('card');
        const $cardImage = $('<div>').addClass('card-image');
        const $col = $('<div>').addClass('col s6 m4 l3');
        const $img = $('<img>').attr({ src: book.cover_url, alt: book.title });

        $cardImage.append($img);
        $anchor.append($cardImage);
        $card.append($anchor);
        $col.append($card);
        $books.append($col);
      }
    })
    .fail(() => {
      Materialize.toast('Unable to retrieve books', 3000);
    });
})();

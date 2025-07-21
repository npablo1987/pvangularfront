/**
 * Smooth Scroll
 */
export default () => {
  const $body = $('body');

  $('a[href*="#"]')
  // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .not('.not-smooth')
    .click((event) => {
      // On-page links
      if (
        window.location.pathname.replace(/^\//, '') === event.currentTarget.pathname.replace(/^\//, '')
        && window.location.hostname === event.currentTarget.hostname
      ) {
        // Figure out element to scroll to
        let $target = $(event.currentTarget.hash);
        $target = $target.length ? $target : $(`[name=${event.currentTarget.hash.slice(1)}]`);
        // Does a scroll target exist?
        if ($target.length) {
          // Only prevent default if animation is actually gonna happen
          const scrollMemory = $(document).scrollTop();
          window.location.hash = event.currentTarget.hash;
          $(document).scrollTop(scrollMemory);

          $('.scroll-item').each((i, item) => {
            const $scrollItem = $(item);
            if ($scrollItem.data('active')) {
              if ($scrollItem.data('active') === 'parent') {
                $scrollItem.parent().removeClass('active');
              } else {
                $($scrollItem.data('active')).removeClass('active');
              }
            } else {
              $(item).removeClass('active');
            }
          });

          const selector = `.scroll-item[href*='${window.location.hash}']`;
          const $scrollItem = $(selector);
          if ($scrollItem.data('active')) {
            if ($scrollItem.data('active') === 'parent') {
              $scrollItem.parent().addClass('active');
            } else {
              $($scrollItem.data('active')).addClass('active');
            }
          } else {
            $scrollItem.addClass('active');
          }

          $('html, body').stop().animate({
            scrollTop: $target.offset().top
              - parseInt($($body.data('main') ? $body.data('main') : 'body').css('margin-top'), 10)
              - parseInt($body.data('offset') || 10, 10)
          }, 500, () => {
            // Callback after animation
            // Must change focus!
            const $realTarget = $($target);
            $realTarget.focus();
            if ($target.is(':focus')) { // Checking if the target was focused
              return false;
            }

            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
            $target.addClass('active');
            return true;
          });
        }
      }
    });

  if (window.location.hash && window.location.hash !== '#') {
    let $target = $(window.location.hash);
    $target = $target.length ? $target : $(`[name=${window.location.hash.slice(1)}]`);

    if ($target.length) {
      $('.scroll-item').each((i, item) => {
        const $scrollItem = $(item);
        if ($scrollItem.data('active')) {
          if ($scrollItem.data('active') === 'parent') {
            $scrollItem.parent().removeClass('active');
          } else {
            $($scrollItem.data('active')).removeClass('active');
          }
        } else {
          $(item).removeClass('active');
        }
      });

      const selector = `.scroll-item[href*='${window.location.hash}']`;
      const $scrollItem = $(selector);
      if ($scrollItem.data('active')) {
        if ($scrollItem.data('active') === 'parent') {
          $scrollItem.parent().addClass('active');
        } else {
          $($scrollItem.data('active')).addClass('active');
        }
      } else {
        $scrollItem.addClass('active');
      }

      $('html, body').stop().animate({
        scrollTop: $target.offset().top
          - parseInt($($body.data('main') ? $body.data('main') : 'body').css('margin-top'), 10)
      }, 500, () => {
        // Callback after animation
        // Must change focus!
        const $realTarget = $($target);
        $realTarget.focus();
        if ($target.is(':focus')) { // Checking if the target was focused
          return false;
        }

        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
        $target.focus(); // Set focus again
        return true;
      });
    }
  }
};

/**
 * Redirect behavior
 *
 * data-target-active-class: class for target on redirect, default-show.
 * data-timeout: time for redirect
 * data-body-class: class for body on redirect, default redirecting-active.
 */
export default function () {
  $(document).on('click', '.redirecting-behavior-link', (e) => {
    e.preventDefault();
    const $link = $(e.currentTarget);

    $($link.data('target')).addClass($link.data('target-active-class') || 'show');

    $('body').addClass($link.data('body-class') || 'redirecting-active');

    setTimeout(() => {
      window.location = $link.attr('href');
    }, parseInt($link.data('timeout'), 10) || 3000);
  });
}

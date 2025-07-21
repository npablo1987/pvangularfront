/**
 * cover background support with data-attribute data-background.
 */
export default () => {
  $('[data-background]').each((i, item) => {
    if (!$(item).data('background-video')) {
      const $background = $('<div/>')
        .addClass('contain-cover-background');

      if ($(item).data('background')) {
        if ($(item).data('opacity') || !($(item).data('inline'))) {
          $background
            .css('background-image', `url("${$(item).data('background')}")`);
        } else {
          $(item)
            .css('background-image', `url("${$(item).data('background')}")`);
        }
      } else {
        $(item)
          .addClass('none');
      }

      if ($(item).data('opacity')) {
        $(item)
          .append($background)
          .addClass('contain-cover contain-cover-opacity');

        if ($(item).data('hover-disabled')) {
          $(item).addClass('hover-disabled');
        }
      } else if ($(item).data('inline')) {
        $(item)
          .addClass('contain-cover contain-cover-background');

        if ($(item).data('background')) {
          $(item).css('background-image', `url("${$(item).data('background')}")`);
        } else {
          $(item)
            .addClass('none');
        }
      } else {
        $(item)
          .append($background)
          .addClass('contain-cover');
      }
    } else {
      const $video = $('<video/>', {
        autoplay: 'autoplay',
        loop: 'loop',
        muted: true,
        poster: $(item).data('background')
      })
        .append(
          $('<source/>', { src: $(item).data('background-video') })
        );

      $video[0].muted = true; // fix muted bug.

      $(item).append(
        $('<div/>')
          .append($video)
          .addClass('video-container'),
        $('<div/>')
          .addClass('contain-cover-opacity hover-disabled')
      ).addClass('contain-cover contain-cover-video');
    }
  });
};

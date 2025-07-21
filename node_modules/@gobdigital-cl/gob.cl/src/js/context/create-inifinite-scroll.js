/* global $, document, moment, templates */

/**
 * createInifiniteScroll - This function generates a creator of an infinite scroll
 * @param {string} urlTemplate - a link for ajax request
 * @param {function} urlTransformation -  function that adds additional parameters
 * to a requestUrl (optional), should accept url as parameter and return a new url.
 * Will be used only at first call, after it we just use what server sends us a 'next'
 * @param {string} templateName - a pug template which will be used to render results from server
 * @param {string} targetSelector - a selector to an existing container
 * @param {function} postLoadingTransformation - a function that is caused in the end
 * of the procedure (optional)
 * @returns {function} - a function that creates an infinite scroll
 */
export default (
  urlTemplate,
  urlTransformation,
  templateName,
  targetSelector,
  postLoadingTransformation
) => function factory() {
  // adding additional parameter to a request using a function-parameter
  let requestUrl = urlTransformation ? urlTransformation(urlTemplate) : urlTemplate;

  let isAlreadySent = false;
  let blockFutureRequests = false;
  const $loadingIndicator = $('.loading-indicator');
  $loadingIndicator.hide();

  document.addEventListener('scroll', () => {
    // This checks prevent additional request while the already sent one is not resolved
    if (isAlreadySent) {
      return;
    }

    if (!$loadingIndicator.length) {
      return;
    }

    // Here we check if a loading indicator is inside our viewport. If it is true
    // We can call a request
    const docViewTop = $(window).scrollTop();
    const docViewBottom = docViewTop + $(window).height();

    // we use parent of an indicator because hidden elements do not have a height
    // but their container still has
    const elemTop = $loadingIndicator.parent().offset().top;
    const elemBottom = elemTop + $loadingIndicator.height();

    const shouldLoadMore = ((elemBottom <= docViewBottom - 10)
      && (elemTop >= docViewTop));

    if (shouldLoadMore && !blockFutureRequests) {
      isAlreadySent = true;
      $loadingIndicator.show();

      window.GobCl.closeReadSpeaker();

      $.ajax(requestUrl, {
        success: (response) => {
          // Setting a link for a consequent request
          requestUrl = response.next || requestUrl;
          const currentLanguage = response.current_language;

          // transforming a publishing date to a readable format for all results
          const articles = response.results.map((article) => {
            let format;
            if (currentLanguage === 'es') {
              format = 'LL';
            } else if (currentLanguage === 'en') {
              format = 'll';
            }
            moment.locale(currentLanguage);

            return {
              ...article,
              publishing_date: moment(article.publishing_date).format(format)
            };
          });

          // Generating DOM using a pug-template
          const newContent = templates[templateName]({
            articles,
            currentLanguage
          });

          // Appending it to a current container
          $(targetSelector).append(newContent);
          isAlreadySent = false;
          $loadingIndicator.hide();

          // post loading transformatiom
          if (postLoadingTransformation) postLoadingTransformation();

          // If no more articles is loaded we block this function forever
          if (response.results.length === 0) {
            blockFutureRequests = true;
          }
        }
      });
    }
  });
};

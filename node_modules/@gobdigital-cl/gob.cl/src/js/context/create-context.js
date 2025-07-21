import createInfiniteScroll from './create-inifinite-scroll';

/**
 * create application context
 * @returns {{closeReadSpeaker: closeReadSpeaker, createInfiniteScroll: Function}}
 */
export default () => ({
  closeReadSpeaker: () => {
    $('.rsbtn_closer').click();
  },
  createInfiniteScroll
});

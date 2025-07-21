import './plugins/Toolbar';
import './plugins/PseudoBackground';
import './plugins/Search';
import './plugins/Contingency';
import './plugins/Onboarding';

import smoothScroll from './behaviors/smooth-scroll';
import coverBackground from './behaviors/cover-background';
import redirecting from './behaviors/redirecting';

import createContext from './context/create-context';

window.GobCL = createContext();

$(() => {
  // plugins.
  $('.toolbar').toolbar();
  $('.pseudo-background').pseudoBackground();
  $('.dom-search').domSearch();
  $('.simple-search').domSearch({ isSimple: true });
  $('.contingency').contingency();
  $('.onboarding').onboarding();

  // behaviors.
  smoothScroll();
  coverBackground();
  redirecting();
});

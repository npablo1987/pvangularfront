/**
 * JQuery Plugin (Toolbar a11Y).
 * Handle A- A+
 *
 * Singleton widget.
 * @flow
 */
import Plugin, { register } from '../core/Plugin';
import type { PluginBehaviors } from '../core/Plugin';

class Toolbar extends Plugin implements PluginBehaviors {
  static code = 'toolbar';
  static key = 'gl.toolbar';

  static instance: Toolbar;

  static defaults = {
    value: '16px',
    index: 0,
    values: ['16px', '20px', '24px'],
    classes: ['a11y-font-0', 'a11y-font-1', 'a11y-font-2'],
    contrast: 'a11y-contrast'
  };

  static storageKey = 'gob.cl:toolbar';
  static changeEvent = 'change.gl.toolbar';

  static buttons = {
    contrast: '.toolbar-behavior-contrast',
    decrease: '.toolbar-behavior-decrease',
    increase: '.toolbar-behavior-increase',
    toggler: '.toolbar-toggler'
  };

  static defaultExpand = 'navbar-expand-lg';

  static storageKeyPaths = {
    contrast: `${Toolbar.storageKey}.contrast`,
    index: `${Toolbar.storageKey}.index`,
    expand: `${Toolbar.storageKey}.expand`
  };

  constructor(element: string, options: Object) {
    if (!Toolbar.instance) {
      super(element, options);
      Toolbar.instance = this;
    }
    return Toolbar.instance;
  }

  init() {
    this.options.index = this.getIndex(); // get index from the current value.

    this.update(); // and update UI.

    const $html = $('html');
    const $toolbar = $('.toolbar'); // Use this.$element for non global behavior

    const $prev = $(Toolbar.buttons.decrease); // Use this.$element.find for non global behavior
    const $next = $(Toolbar.buttons.increase); // Use this.$element.find for non global behavior
    const $contrast = $(Toolbar.buttons.contrast); // Use this.$element.find for non global behavior
    const $toggle = $(Toolbar.buttons.toggler); // Use this.$element.find for non global behavior

    const storedContrast = !!localStorage.getItem(Toolbar.storageKeyPaths.contrast);

    $html.toggleClass(this.options.contrast, storedContrast);

    $contrast.on('click', (e) => {
      e.preventDefault();
      $(e.currentTarget).toggleClass('active');
      $html.toggleClass(this.options.contrast);
      if ($html.hasClass(this.options.contrast)) {
        localStorage.setItem(Toolbar.storageKeyPaths.contrast, 'active');
      } else {
        localStorage.removeItem(Toolbar.storageKeyPaths.contrast);
      }
    });

    // show / hide - mobile
    $toggle.on('click', (e) => {
      e.preventDefault();
      $toolbar.toggleClass('active');
    });

    $prev.on('click', (e) => {
      e.preventDefault();
      if (!$prev.hasClass('disabled') && this.options.index > 0) {
        this.options.index = this.getIndex() - 1;
        this.options.value = this.options.values[this.options.index];

        this.update();
        this.$element.trigger(Toolbar.changeEvent, this.options.value);
      }
    });

    $next.on('click', (e) => {
      e.preventDefault();
      if (!$next.hasClass('disabled') && this.options.index < this.options.values.length) {
        this.options.index = this.getIndex() + 1;
        this.options.value = this.options.values[this.options.index];

        this.update();
        this.$element.trigger(Toolbar.changeEvent, this.options.value);
      }
    });
  }

  // #
  getIndex() {
    return (this.options.values || []).indexOf(this.options.value);
  }

  // #
  update() {
    $('html')
      .css({
        fontSize: this.options.value
      })
      .removeClass(this.options.classes.join(' '))
      .addClass(this.options.classes[this.options.index]);

    localStorage.setItem(Toolbar.storageKeyPaths.index, this.options.index);

    const $prev = $(Toolbar.buttons.decrease); // Use this.$element.find for non global behavior
    const $next = $(Toolbar.buttons.increase); // Use this.$element.find for non global behavior

    $prev.removeClass('disabled');
    $next.removeClass('disabled');

    if (this.options.index === 0) {
      $prev.addClass('disabled');
    }

    if (this.options.index === this.options.values.length - 1) {
      $next.addClass('disabled');
    }

    this.updateNavbar();
  }

  updateNavbar() {
    const $nav = $('.navbar');

    let navbarExpandClass = localStorage.getItem(Toolbar.storageKeyPaths.expand);
    if (!navbarExpandClass) {
      navbarExpandClass = $nav
        .attr('class')
        .split(' ')
        .find(item => /navbar-expand-*/.test(item)) || Toolbar.defaultExpand;

      localStorage
        .setItem(Toolbar.storageKeyPaths.expand, navbarExpandClass);
    }

    if (this.options.index === 0) {
      $nav.addClass(localStorage.getItem(Toolbar.storageKeyPaths.expand) || Toolbar.defaultExpand);
    }

    if (this.options.index > 0) {
      $nav.removeClass(navbarExpandClass);
    }
  }
}

register(Toolbar);

if (!window.rsConf) {
  window.rsConf = {
    general: {
      usePost: true
    },
    ui: {}
  };
}

// TODO: refactor this.

if (!window.rsConf.ui) { window.rsConf.ui = {}; }
window.rsConf.ui.rsbtnClass = 'rsbtn-gobcl-skin';
window.rsConf.ui.player = [
  '<span class="rsbtn_box">',
  ' <a href="javascript:void(0);" class="rsbtn_pause rsimg rspart rsbutton">',
  '   <span class="toolbar-btn-icon-content">',
  '     <em class="cl cl-pause"></em>',
  '     <em class="cl cl-play"></em>',
  '   </span> ',
  ' </a>',
  ' <span class="rsbtn_progress_container rspart">',
  '   <span class="rsbtn_progress_played"></span>',
  ' </span>',
  ' <a href="javascript:void(0);" class="rsbtn_dl rsimg rspart rsbutton">',
  '   <span class="toolbar-btn-icon-content">',
  '     <i class="cl cl-download"></i>',
  '   </span> ',
  ' </a>',
  ' <a href="javascript:void(0);" class="rsbtn_closer rsimg rspart rsbutton">',
  '   <span class="toolbar-btn-icon-content">',
  '     <i class="cl cl-close"></i>',
  '   </span> ',
  ' </a>',
  ' <span class="rsdefloat"></span>',
  '</span>'
];

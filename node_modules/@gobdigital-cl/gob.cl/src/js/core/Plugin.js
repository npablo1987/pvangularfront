/**
 * Plugin base class
 * @flow
 */
export interface PluginBehaviors {
  init(): void;
}

export default class Plugin {
  $element: JQuery;
  options: Object;

  static code: string;
  static key: string = '';
  static defaults: Object = {};

  constructor(element: string, options: Object) {
    this.$element = $(element);

    this.options = {
      ...this.constructor.defaults,
      ...options,
      ...this.$element.data()
    };

    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    throw new Error('You have to implement the method init!');
  }

  // eslint-disable-next-line class-methods-use-this
  update() {}

  setOptions(options: Object) {
    this.options = {
      ...this.options,
      ...options
    };
    this.update();
  }
}

export const register = (Descendant: Class<Plugin>) => {
  $.fn[Descendant.code] = function pluginGenerator(options) {
    return this.each(function elementFinder() {
      if (!$.data(this, Descendant.key)) {
        $.data(this, Descendant.key, new Descendant(this, options));
      } else {
        $.data(this, Descendant.key).setOptions(options);
      }
    });
  };
};

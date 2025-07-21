/**
 * JQuery Plugin (Pseudo Background).
 * @flow
 */
import Plugin, { register } from '../core/Plugin';
import type { PluginBehaviors } from '../core/Plugin';

class PseudoBackground extends Plugin implements PluginBehaviors {
  static code = 'pseudoBackground';
  static key = 'gl.pseudo-background';

  init() {
    const $source = this.$element.find('.pseudo-src').addClass('d-none');

    this.$element.css('background-image', `url("${$source.attr('src')}")`);
  }
}

register(PseudoBackground);

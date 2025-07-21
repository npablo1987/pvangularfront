/**
 * JQuery Plugin (Onboarding Widget).
 * @flow
 */
import Plugin, { register } from '../core/Plugin';
import type { PluginBehaviors } from '../core/Plugin';

class Onboarding extends Plugin implements PluginBehaviors {
  static code = 'onboarding';
  static key = 'gl.onboarding';

  static storageKey = 'gob.cl:onboarding';

  init() {
    this.update();

    const $body = $('body');

    const $dismiss = this.$element.find('.onboarding-behavior-dismiss');

    $dismiss.on('click', () => {
      localStorage.setItem(Onboarding.storageKey, 'active');
      $body.addClass('onboarding-closed');
    });
  }

  update() {
    const $body = $('body');

    if (this.options.active && !localStorage.getItem(Onboarding.storageKey)) {
      $body
        .addClass('onboarding-active');
    } else {
      $body
        .removeClass('onboarding-active');
    }
  }
}

register(Onboarding);

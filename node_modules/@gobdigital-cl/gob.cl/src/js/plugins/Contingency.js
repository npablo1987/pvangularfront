/**
 * JQuery Plugin (Contingency Widget).
 * @flow
 */
import Plugin, { register } from '../core/Plugin';
import type { PluginBehaviors } from '../core/Plugin';

class Contingency extends Plugin implements PluginBehaviors {
  static code = 'contingency';
  static key = 'gl.contingency';

  static storageKey = 'gob.cl:contingency';

  static storageKeyPaths = {
    state: `${Contingency.storageKey}.state`,
    current: `${Contingency.storageKey}.current`
  };

  static defaults = {
    current: '.contingency-1'
  };

  init() {
    this.update();

    const $body = $('body');

    const $close = this.$element.find('.contingency-behavior-close');

    $close.on('click', () => {
      localStorage.setItem(Contingency.storageKeyPaths.state, 'active');
      $body.addClass('contingency-closed');
    });

    $(document).on('click', '.contingency-behavior-open', () => {
      localStorage.removeItem(Contingency.storageKeyPaths.state);
      $body.removeClass('contingency-closed');

      this.setOptions({
        active: true
      });
    });

    $(document).on('click', '.contingency-behavior-change', (e: JQueryEventObject) => {
      e.preventDefault();
      const $index = $(e.currentTarget);
      this.internalUpdate($index.data('target'));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  internalUpdate(target: string) {
    $('.contingency-item').addClass('d-none');
    $(target).removeClass('d-none');

    $('.contingency-index .contingency-item').removeClass('d-none');
    $(`.contingency-index ${target}`).addClass('d-none');

    localStorage.setItem(Contingency.storageKeyPaths.current, target);
  }

  update() {
    const $body = $('body');

    if (this.options.active) {
      $body
        .addClass('contingency-active')
        .toggleClass('contingency-closed', !!localStorage.getItem(Contingency.storageKeyPaths.state));

      this.internalUpdate(
        localStorage.getItem(Contingency.storageKeyPaths.current) || Contingency.defaults.current
      );
    } else {
      $body
        .removeClass('contingency-active');
    }
  }
}

register(Contingency);

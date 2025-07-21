/**
 * JQuery Plugin (Search Field)
 * @flow
 */
import Plugin, { register } from '../core/Plugin';
import type { PluginBehaviors } from '../core/Plugin';

import accentFold from '../core/functions/accent-fold';

class Search extends Plugin implements PluginBehaviors {
  static code = 'domSearch';
  static key = 'gl.search';

  static defaults = {
    scrappingValue: 'search-value',
    scrappingClass: '.searchable',
    groups: [],
    isSimple: false
  };

  static buttons = {
    cancel: '.dom-search-behavior-cancel',
    search: '.dom-search-behavior-search'
  };

  init() {
    const $input = this.$element.find('.form-control');
    const $cancel = this.$element.find(Search.buttons.cancel);

    $cancel.addClass('d-none');

    if ($input.val()) {
      $cancel.removeClass('d-none');
    }

    $input.on('input', () => {
      if ($input.val()) {
        $cancel.removeClass('d-none');
      } else {
        $cancel.addClass('d-none');
      }
    });

    $cancel.on('click', () => {
      $input.val('');
      $cancel.addClass('d-none');
    });

    if (!this.options.isSimple) {
      this.configureViewFilterBehavior();
    }
  }

  configureViewFilterBehavior() {
    this.$element
      .find('.form-control')
      .on('input', (event) => {
        const value = accentFold($(event.currentTarget).val());
        $(this.options.scrappingClass)
          .each((index, element) => {
            const $element = $(element);
            $element.removeClass('d-none');

            if (accentFold($element.data(this.options.scrappingValue)).search(new RegExp(value, 'gi')) === -1) {
              $element.addClass('d-none');
            }
          });
        this.groupBehavior();
      })
      .end()
      .find(Search.buttons.cancel)
      .on('click', () => {
        $(this.options.scrappingClass).each((index, element) => {
          $(element).removeClass('d-none');
          this.groupBehavior();
        });
      });
  }

  groupBehavior() {
    this.options.groups.forEach((group) => {
      $(`.search-not-found.not-found-${group.substr(1)}`)
        .toggleClass(
          'not-found',
          ($(`${this.options.scrappingClass}${group}`).length
            === $(`${this.options.scrappingClass}${group}.d-none`).length)
        );
    });
  }
}

register(Search);

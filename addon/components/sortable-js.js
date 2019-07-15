import Component from '@ember/component';
import Sortable from 'sortablejs';
import { bind } from '@ember/runloop';
import layout from '../templates/components/sortable-js';

const { freeze } = Object;

export default Component.extend({
  layout,

  classNames: ['ember-sortable-js'],

  options: null,

  events: freeze([
    'onChoose',
    'onUnchoose',
    'onStart',
    'onEnd',
    'onAdd',
    'onUpdate',
    'onSort',
    'onRemove',
    'onMove',
    'onClone',
    'onChange',
    'scrollFn',
    'onSetData',
    'setData',
    'onFilter',
  ]),

  didInsertElement() {
    this._super(...arguments);

    const el = this.element.firstElementChild;
    const defaults = {};
    const options = Object.assign({}, defaults, this.options);

    this.sortable = Sortable.create(el, options);
    this.setupEventHandlers();
  },

  willDestroyElement() {
    this.sortable.destroy();
    this._super(...arguments);
  },

  setupEventHandlers() {
    this.events.forEach(eventName => {
      const action = this[eventName];
      if (typeof action === 'function') {
        this.sortable.option(eventName, bind(this, 'performExternalAction', eventName));
      }
    });
  },

  performExternalAction(actionName, ...args) {
    let action = this[actionName];

    action = (action === 'onSetData') ? 'setData' : action;

    if (typeof action === 'function') {
      action(...args, this.sortable);
    }
  }
});

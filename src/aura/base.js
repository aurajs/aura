// Pass through the required jQuery methods to the mediator.
//
// TODO: Remove dependency on underscore. Will have to create an equivalent for
// _.bindAll and _.template
define(['dom', 'underscore'], function ($, _) {

  'use strict';

  var base = {};

  base.util = {
    each: $.each,
    extend: $.extend
  };

  base.dom = {
    find: function(selector, context) {
      context = context || document;
      return $(context).find(selector);
    },
    data: function(selector, attribute) {
      return $(selector).data(attribute);
    }
  };

  base.events = {
    listen: function(context, events, selector, callback) {
      return $(context).on(events, selector, callback);
    },
    bindAll: function() {
      return _.bindAll.apply(this, arguments);
    }
  };

  base.template = {
    parse: _.template
  };

  // Placeholder for things like ajax and local storage
  base.data = {
    deferred: $.Deferred,
    when: $.when
  };

  return base;

});

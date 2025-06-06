/*! js-cookie v3.0.1 | MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
      ? define(factory)
      : ((global = global || self),
        (function () {
          var current = global.Cookies;
          var exports = (global.Cookies = factory());
          exports.noConflict = function () {
            global.Cookies = current;
            return exports;
          };
        })());
})(this, function () {
  'use strict';
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function (value) {
      return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    },
  };
  function init(converter, defaultAttributes) {
    function set(key, value, attributes) {
      if (typeof document === 'undefined') {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);
      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += '; ' + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }
      return (document.cookie = key + '=' + converter.write(value, key) + stringifiedAttributes);
    }
    function get(key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');
        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);
          if (key === foundKey) {
            break;
          }
        } catch (e) {}
      }
      return key ? jar[key] : jar;
    }
    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(key, '', assign({}, attributes, { expires: -1 }));
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes);
        },
      },
      { attributes: { value: Object.freeze(defaultAttributes) }, converter: { value: Object.freeze(converter) } }
    );
  }
  var api = init(defaultConverter, { path: '/' });
  return api;
});

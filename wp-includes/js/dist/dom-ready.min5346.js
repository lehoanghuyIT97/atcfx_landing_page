/*! This file is auto-generated */
(() => {
  'use strict';
  var e = {
      d: (t, d) => {
        for (var o in d) e.o(d, o) && !e.o(t, o) && Object.defineProperty(t, o, { enumerable: !0, get: d[o] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    },
    t = {};
  function d(e) {
    'undefined' != typeof document &&
      ('complete' !== document.readyState && 'interactive' !== document.readyState ? document.addEventListener('DOMContentLoaded', e) : e());
  }
  e.d(t, { default: () => d }), ((window.wp = window.wp || {}).domReady = t.default);
})();

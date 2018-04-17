/*!
 * pure-swipe.js - v1.0.4
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/pure-swipe
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */

export default function initSwipe() {
  (function(t, e) {
    'initCustomEvent' in e.createEvent('CustomEvent') &&
      ((t.CustomEvent = function(t, n) {
        n = n || { bubbles: !1, cancelable: !1, detail: void 0 };
        const u = e.createEvent('CustomEvent');
        return u.initCustomEvent(t, n.bubbles, n.cancelable, n.detail), u;
      }),
      (t.CustomEvent.prototype = t.Event.prototype)),
      e.addEventListener(
        'touchstart',
        (t) => {
          if (t.target.getAttribute('data-swipe-ignore') === 'true') return;
          (l = t.target),
            (i = Date.now()),
            (n = t.touches[0].clientX),
            (u = t.touches[0].clientY),
            (a = 0),
            (o = 0);
        },
        !1,
      ),
      e.addEventListener(
        'touchmove',
        (t) => {
          if (!n || !u) return;
          let e = t.touches[0].clientX,
            i = t.touches[0].clientY;
          (a = n - e), (o = u - i);
        },
        !1,
      ),
      e.addEventListener(
        'touchend',
        (t) => {
          if (l !== t.target) return;
          let e = parseInt(l.getAttribute('data-swipe-threshold') || '20', 10),
            s = parseInt(l.getAttribute('data-swipe-timeout') || '500', 10),
            r = Date.now() - i,
            c = '';
          Math.abs(a) > Math.abs(o)
            ? Math.abs(a) > e && r < s && (c = a > 0 ? 'swiped-left' : 'swiped-right')
            : Math.abs(o) > e && r < s && (c = o > 0 ? 'swiped-up' : 'swiped-down');
          c !== '' &&
            (l.dispatchEvent(new CustomEvent(c, { bubbles: !0, cancelable: !0 })),
            console && console.log && console.log(`${c} fired on ${l.tagName}`));
          (n = null), (u = null), (i = null);
        },
        !1,
      );
    var n = null,
      u = null,
      a = null,
      o = null,
      i = null,
      l = null;
  })(window, document);
}

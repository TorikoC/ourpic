!(function(e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var a = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function(e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function(e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var a in e)
          n.d(
            o,
            a,
            function(t) {
              return e[t];
            }.bind(null, a)
          );
      return o;
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 0));
})([
  function(e, t, n) {
    n(1), (e.exports = n(2));
  },
  function(e, t) {
    let n = !1;
    const o = document.getElementsByClassName('contact__button')[0],
      a = document.createElement('img');
    document.getElementsByClassName('contact__form')[0].addEventListener(
      'submit',
      e => (
        e.preventDefault(),
        (function(e) {
          if ((console.log('hi'), n)) return;
          if (!e) return;
          (n = !0),
            o.setAttribute('disabled', !0),
            o.classList.add('contact__button--disabled'),
            (o.innerHTML = ''),
            o.appendChild(a),
            console.log(a);
          const t = new FormData(e);
          axios
            .post('/api/feedbacks', t)
            .then(() => {
              swal({
                title: '发送成功',
                text: '感谢你的反馈',
                icon: 'success'
              }),
                (n = !1),
                o.removeAttribute('disabled'),
                o.classList.remove('contact__button--disabled'),
                o.removeChild(a),
                (o.innerHTML = '提交'),
                e.reset();
            })
            .catch(() => {
              (n = !1),
                o.removeAttribute('disabled'),
                o.classList.remove('contact__button--disabled'),
                o.removeChild(a),
                (o.innerHTML = '提交'),
                swal({ title: '发送失败', text: error.message, icon: 'error' });
            });
        })(e.target),
        !1
      )
    ),
      (a.src = '../images/spinner-solid.svg'),
      (a.alt = 'spinner-solid');
  },
  function(e, t) {
    const n = document.getElementById('image'),
      o = document.getElementsByClassName('upload__button')[0],
      a = document.getElementsByClassName('upload__icon--waiting')[0],
      i = document.getElementsByClassName('upload__icon--uploading')[0];
    let l = !1;
    const s = [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon'
    ];
    n.onchange = e => {
      if (l) return;
      if (!e.target.files) return;
      if (
        !(function(e) {
          return !!e && -1 !== s.indexOf(e.type);
        })(e.target.files[0])
      )
        return void swal('无法识别的图片类型', '请重新上传', 'error');
      const t = new FormData();
      t.append('image', image.files[0]),
        o.classList.add('upload__button--disabled'),
        (a.style.display = 'none'),
        (i.style.display = 'inline-block'),
        n.setAttribute('disabled', !0),
        (l = !0),
        axios
          .post('/api/images', t)
          .then(e => {
            !(function(e) {
              const t = document.createElement('div'),
                n = document.createElement('div'),
                o = document.createElement('a'),
                a = document.createElement('button'),
                i = document.createElement('div'),
                l = document.createElement('label');
              l.innerHTML = '选择托管时间: ';
              const s = document.createElement('select'),
                r = [
                  { name: '1分钟', value: 6e4 },
                  { name: '5分钟', value: 3e5 },
                  { name: '10分钟', value: 6e5 },
                  { name: '30分钟', value: 18e5 },
                  { name: '1小时', value: 36e5 },
                  { name: '12小时', value: 432e5 },
                  { name: '24小时', value: 864e5 }
                ];
              for (let e of r) {
                let t = document.createElement('option');
                (t.innerHTML = e.name), (t.value = e.value), s.appendChild(t);
              }
              a.classList.add('copy-button'),
                (a.innerHTML = '复制'),
                tippy(a, {
                  content: 'copied!',
                  arrow: !0,
                  arrowType: 'round',
                  animation: 'fade',
                  trigger: 'manual',
                  zIndex: 99999
                }),
                a.addEventListener(
                  'click',
                  e => {
                    !(function(e) {
                      if (document.body.createTextRange) {
                        const t = document.body.createTextRange();
                        t.moveToElementText(e), t.select();
                      } else if (window.getSelection) {
                        const t = window.getSelection(),
                          n = document.createRange();
                        n.selectNodeContents(e),
                          t.removeAllRanges(),
                          t.addRange(n);
                      } else
                        console.warn(
                          'Could not select text in node: Unsupported browser.'
                        );
                    })(o),
                      document.execCommand('copy');
                  },
                  !1
                ),
                (o.href = e.data),
                (o.innerHTML = e.data),
                o.setAttribute('target', '_blank'),
                o.addEventListener('copy', e => {
                  e.preventDefault(),
                    e.clipboardData &&
                      (e.clipboardData.setData('text/plain', o.textContent),
                      a._tippy.show()),
                    window.getSelection
                      ? window.getSelection().empty
                        ? window.getSelection().empty()
                        : window.getSelection().removeAllRanges &&
                          window.getSelection().removeAllRanges()
                      : document.selection && document.selection.empty(),
                    setTimeout(() => {
                      a._tippy.hide();
                    }, 1e3);
                }),
                (n.innerText = '图片地址: '),
                n.appendChild(o),
                n.appendChild(a),
                i.appendChild(l),
                i.appendChild(s),
                t.appendChild(n),
                t.appendChild(i),
                swal({ title: '上传成功', icon: 'success', content: t }).then(
                  () => {
                    const n = t.querySelector('select'),
                      o = new FormData();
                    o.append('age', n.value), console.log(n.value);
                    const a = e.data.split('/').pop();
                    axios
                      .put(`/api/images/${a}`, o)
                      .then(e => {
                        console.log(e);
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }
                );
            })(e),
              o.classList.remove('upload__button--disabled'),
              (i.style.display = 'none'),
              (a.style.display = 'inline-block'),
              n.removeAttribute('disabled'),
              (l = !1);
          })
          .catch(e => {
            o.classList.remove('upload__button--disabled'),
              (i.style.display = 'none'),
              (a.style.display = 'inline-block'),
              n.removeAttribute('disabled'),
              (l = !1);
          });
    };
  }
]);

/* Ocean 博客交互脚本：主题切换 / 移动导航 / 阅读进度 / 目录高亮 / 回到顶部 / 代码复制 */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'ocean-theme';

  /* ---------- 主题切换 ---------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      btn.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    }
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (prefersDark ? 'dark' : 'light'));

    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  /* ---------- 移动端导航 ---------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 页头滚动阴影 ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 阅读进度 + 回到顶部 ---------- */
  function initProgress() {
    var bar = document.getElementById('progressBar');
    var backTop = document.getElementById('backTop');

    var onScroll = function () {
      if (bar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      }
      if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 640);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (backTop) {
      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------- 目录高亮 ---------- */
  function initToc() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var targets = links
      .map(function (a) {
        var id = decodeURIComponent(a.getAttribute('href').slice(1));
        var el = document.getElementById(id);
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    if (!targets.length || !('IntersectionObserver' in window)) return;

    var visible = new Map();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.target);
          else visible.delete(entry.target.id);
        });

        if (!visible.size) return;
        var first = targets.filter(function (t) { return visible.has(t.el.id); })[0];
        if (!first) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        first.link.classList.add('is-active');
      },
      { rootMargin: '-90px 0px -66% 0px', threshold: 0 }
    );

    targets.forEach(function (t) { observer.observe(t.el); });
  }

  /* ---------- 代码块复制 ---------- */
  function initCopy() {
    var blocks = document.querySelectorAll('.prose pre');
    if (!blocks.length || !navigator.clipboard) return;

    Array.prototype.forEach.call(blocks, function (pre) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.setAttribute('aria-label', '复制这段代码');
      btn.style.cssText =
        'position:absolute;top:6px;right:8px;padding:3px 9px;font-family:var(--font-mono);font-size:11px;' +
        'color:#7fa3ac;background:#12262d;border:1px solid #22434e;border-radius:5px;cursor:pointer;opacity:0;' +
        'transition:opacity .16s ease;';
      pre.appendChild(btn);

      pre.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
      pre.addEventListener('mouseleave', function () { btn.style.opacity = '0'; });
      btn.addEventListener('focus', function () { btn.style.opacity = '1'; });

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(
          function () {
            btn.textContent = '已复制';
            setTimeout(function () { btn.textContent = '复制'; }, 1600);
          },
          function () { btn.textContent = '复制失败'; }
        );
      });
    });
  }

  /* ---------- 页脚年份 ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function boot() {
    initTheme();
    initNav();
    initHeader();
    initProgress();
    initToc();
    initCopy();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

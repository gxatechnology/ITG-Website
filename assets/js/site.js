(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function closeMobile() {
    const p = $('#itg-mobile-panel');
    const b = $('#itg-menu-toggle');
    if (p) {
      p.hidden = true;
      document.body.style.overflow = '';
    }
    if (b) {
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', 'Open navigation menu');
    }
  }

  function initMoreDropdowns() {
    const moreContainers = $$('.itg-more');
    moreContainers.forEach(container => {
      const trigger = $('.itg-more-trigger', container);
      const menu = $('.itg-more-menu', container);
      if (!trigger || !menu) return;

      let leaveTimer = null;

      function isMenuOpen() {
        return (container.classList.contains('is-open') || menu.classList.contains('open')) && !container.classList.contains('is-closed');
      }

      function openMenu() {
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        container.classList.remove('is-closed');
        container.classList.add('is-open');
        menu.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function closeMenu(immediate = false) {
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (immediate) {
          container.classList.add('is-closed');
          container.classList.remove('is-open');
          menu.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          leaveTimer = setTimeout(() => {
            container.classList.remove('is-closed');
            container.classList.remove('is-open');
            menu.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            leaveTimer = null;
          }, 200);
        }
      }

      // Mouse enter on entire interaction area (trigger, hover bridge, or menu)
      container.addEventListener('mouseenter', () => {
        openMenu();
      });

      // Mouse leave from entire interaction area with grace period
      container.addEventListener('mouseleave', () => {
        closeMenu(false);
      });

      // Pointer enter/leave support for modern devices
      container.addEventListener('pointerenter', () => {
        openMenu();
      });

      container.addEventListener('pointerleave', (e) => {
        if (e.relatedTarget && container.contains(e.relatedTarget)) {
          return;
        }
        closeMenu(false);
      });

      // Click on trigger toggles
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen()) {
          closeMenu(true);
        } else {
          openMenu();
        }
      });

      // Clicking any link in menu closes it and navigates
      menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          closeMenu(true);
        }
      });

      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMenu();
          const firstLink = $('a', menu);
          if (firstLink) firstLink.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu(true);
        }
      });

      menu.addEventListener('keydown', (e) => {
        const links = $$('a', menu);
        const currentIndex = links.indexOf(document.activeElement);

        if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu(true);
          trigger.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % links.length;
          links[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + links.length) % links.length;
          links[prevIndex].focus();
        } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === links.length - 1) {
          // Tab out from last link closes menu
          closeMenu(true);
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.itg-more')) {
        moreContainers.forEach(container => {
          container.classList.remove('is-open');
          container.classList.remove('is-closed');
          const m = $('.itg-more-menu', container);
          const t = $('.itg-more-trigger', container);
          if (m) m.classList.remove('open');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  window.ITG = {
    showPreviewInfo: function () {
      alert('This is a design preview, not a working authenticated portal. Please contact ITG using the Contact page for assistance.');
    },
    closeMobile
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation panel handling
    const open = $('#itg-menu-toggle');
    const panel = $('#itg-mobile-panel');
    const close = $('.itg-mobile-close');

    if (open && panel) {
      open.addEventListener('click', () => {
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        open.setAttribute('aria-expanded', String(willOpen));
        open.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
        document.body.style.overflow = willOpen ? 'hidden' : '';
      });
    }

    if (close) {
      close.addEventListener('click', closeMobile);
    }

    if (panel) {
      panel.addEventListener('click', (e) => {
        if (e.target === panel) closeMobile();
        if (e.target.closest('a')) closeMobile();
      });
    }

    // Global escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobile();
      }
    });

    // Initialize More dropdown interactions
    initMoreDropdowns();

    // Auto-update footer copyright year
    const year = $('#itg-year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Quote confirmation page state handling
    const confirmation = new URLSearchParams(location.search).get('sent');
    if (location.pathname.endsWith('quote-confirmation.html') && confirmation === '1') {
      const notice = $('.itg-preview-bar');
      if (notice) {
        notice.innerHTML = 'Your request has been accepted by the website mail handler. Check your inbox for a reference and contact ITG if you do not receive a reply.';
        notice.style.background = '#e8f6ec';
        notice.style.color = '#1f6f42';
      }
    }

    // Redirect empty hashes safely to contact page
    document.querySelectorAll('a[href="#"]').forEach(a => {
      a.href = 'contact.html';
    });
  });
})();

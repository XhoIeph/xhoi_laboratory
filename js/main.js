document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu');
  const header = document.querySelector('header');
  const nav = document.querySelector('header ul') || document.querySelector('#main-nav');

  if (!menuBtn || !nav || !header) return;

  // Ensure nav has an id for aria-controls
  if (!nav.id) nav.id = 'main-nav';

  let resizeTimer = null;

  function isOpen() {
    return header.classList.contains('nav-open');
  }

  function openNav() {
    header.classList.add('nav-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    // expose nav to assistive tech and move focus into the menu
    nav.setAttribute('aria-hidden', 'false');
    // focus first link for keyboard users
    const firstLink = nav.querySelector('a');
    if (firstLink) {
      // slight delay to allow the browser to paint the opening animation
      setTimeout(() => firstLink.focus(), 50);
    }
  }

  function closeNav() {
    header.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    // return focus to the menu button so keyboard users don't get lost
    setTimeout(() => menuBtn.focus(), 50);
  }

  // helper: apply stagger delays using CSS variable --delay
  function applyStagger(opening) {
    const items = Array.from(nav.querySelectorAll('li'));
    // respect reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      items.forEach((li) => li.style.removeProperty('--delay'));
      return;
    }

    if (opening) {
      items.forEach((li, i) => {
        const ms = i * 60; // 60ms step
        li.style.setProperty('--delay', `${ms}ms`);
      });
    } else {
      // closing: reverse order so items disappear from bottom to top
      const len = items.length;
      items.forEach((li, i) => {
        const ms = (len - i - 1) * 40; // shorter step for close
        li.style.setProperty('--delay', `${ms}ms`);
      });
    }
  }

  // Initialize: remove nav-open on desktop, hide on mobile unless opened
  function initNavState() {
    if (window.innerWidth <= 768) {
      // mobile: keep closed by default
      header.classList.remove('nav-open');
    } else {
      // desktop: ensure nav-open removed so CSS controls layout
      header.classList.remove('nav-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Toggle when button clicked
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // On desktop we don't want the button to toggle the mobile menu; only show micro-feedback
    if (window.innerWidth > 768) {
      menuBtn.classList.add('pressed');
      setTimeout(() => menuBtn.classList.remove('pressed'), 140);
      return;
    }

    if (isOpen()) {
      applyStagger(false);
      closeNav();
    } else {
      applyStagger(true);
      openNav();
    }
  });

  // Close when clicking a link inside nav
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        applyStagger(false);
        closeNav();
      }
    });
    // ensure links are focusable in mobile overlay
    a.setAttribute('tabindex', '0');
  });

  // Click outside header closes the menu
  document.addEventListener('click', (e) => {
    if (isOpen() && !header.contains(e.target)) closeNav();
  });

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeNav();
  });

  // On resize, reset nav state
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initNavState();
    }, 150);
  });

  // Add a small scroll effect: add class 'scrolled' to header when page is scrolled
  function onScroll() {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);

  // initial setup
  // set aria-hidden initial state and init
  nav.setAttribute('aria-hidden', window.innerWidth <= 768 ? 'true' : 'false');
  initNavState();
  onScroll();
});

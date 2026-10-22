const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}));

const participantVideos = [...document.querySelectorAll('.participant-video[data-video-src]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (participantVideos.length && !reducedMotion) {
  const loadAndPlay = (video) => {
    if (!video.src) {
      video.src = video.dataset.videoSrc;
      video.load();
    }
    video.play().catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) loadAndPlay(target);
        else target.pause();
      });
    }, { rootMargin: '240px 0px', threshold: 0.01 });
    participantVideos.forEach((video) => videoObserver.observe(video));
  } else {
    participantVideos.forEach(loadAndPlay);
  }
}

const heroHeadline = document.querySelector('.hero-headline-rotator');
const heroHeadlineLines = ['Move work forward.', 'Join without an app.', 'Start in moments.'];
if (heroHeadline) {
  heroHeadline.classList.add('is-blue');
}
if (heroHeadline && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let headlineIndex = 0;
  window.setInterval(() => {
    heroHeadline.classList.add('is-changing');
    window.setTimeout(() => {
      headlineIndex = (headlineIndex + 1) % heroHeadlineLines.length;
      heroHeadline.textContent = heroHeadlineLines[headlineIndex];
      heroHeadline.classList.toggle('is-blue', headlineIndex % 2 === 0);
      heroHeadline.classList.toggle('is-orange', headlineIndex % 2 === 1);
      heroHeadline.classList.remove('is-changing');
    }, 220);
  }, 3000);
}

const demoCopy = [
  { url: 'link.veqno.com/r/azure-rain-72', title: 'Clear, adaptive meetings', description: "HD video adapts to each participant's connection.", primary: 'A fast guest experience', secondary: 'Controls where they matter' },
  { url: 'link.veqno.com/r/azure-rain-72', title: 'A fast guest experience', description: 'Open the link, review your setup, and join from a modern browser.', primary: 'Enter a name', secondary: 'No guest account required' },
  { url: 'link.veqno.com/r/azure-rain-72', title: 'Host-controlled entry', description: 'Waiting rooms are enabled by default and hosts decide who enters.', primary: 'Waiting room by default', secondary: 'Hosts decide who enters' },
  { url: 'link.veqno.com/r/azure-rain-72', title: 'Controls where they matter', description: 'Chat, file sharing, reactions, and screen sharing stay close at hand.', primary: 'Meeting controls', secondary: 'Desktop and mobile web' }
];

const demoTabs = [...document.querySelectorAll('.demo-tab')];
function activateDemo(index) {
  const copy = demoCopy[index];
  if (!copy) return;
  demoTabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector('.preview-browser-top>span').textContent = copy.url;
  document.querySelector('.preview-title').textContent = copy.title;
  document.querySelector('.preview-desc').textContent = copy.description;
  document.querySelector('.preview-form>span').textContent = copy.primary;
  document.querySelector('.preview-empty .empty-title').textContent = copy.secondary;
  document.querySelector('.preview-empty small').textContent = [
    'HD video adapts to each participant’s connection.',
    'Review camera and microphone settings before joining.',
    'Guests wait until the host lets them in.',
    'Chat, reactions, files, and sharing stay close at hand.'
  ][index];
  const preview = document.querySelector('.demo-preview');
  preview.dataset.state = String(index);
  document.querySelector('.preview-caption b').textContent = `0${index + 1} / 04`;
}
demoTabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener('click', () => activateDemo(Number(tab.dataset.demo)));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % demoTabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + demoTabs.length) % demoTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = demoTabs.length - 1;
    else return;
    event.preventDefault();
    activateDemo(nextIndex);
    demoTabs[nextIndex].focus();
  });
});

const teamData = [
  { kicker: 'BUILT FOR FOCUSED COLLABORATION', title: 'Clear, adaptive meetings', description: "HD video adapts to each participant's connection so the conversation stays usable when conditions change.", bullets: ['A fast guest experience', 'Review camera and microphone settings', 'Enter a name', 'Join from a modern browser'] },
  { kicker: 'A FAST GUEST EXPERIENCE', title: 'A fast guest experience', description: 'Open the link, review camera and microphone settings, enter a name, and join from a modern browser.', bullets: ['Open the link', 'Review camera and microphone settings', 'Enter a name', 'Join without downloading an app'] },
  { kicker: 'CONTROLS WHERE THEY MATTER', title: 'Controls where they matter', description: 'Waiting rooms, participant controls, chat, file sharing, reactions, and screen sharing stay close at hand.', bullets: ['Waiting rooms', 'Participant controls', 'Chat, file sharing, and reactions', 'Screen sharing'] }
];
const teamButtons = [...document.querySelectorAll('.team-switcher button')];
function activateTeam(index) {
  const data = teamData[index];
  teamButtons.forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-selected', String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
  document.querySelectorAll('.team-illustration').forEach((illustration, i) => {
    illustration.hidden = i !== index;
  });
  const panel = document.querySelector('#team-panel');
  panel.setAttribute('aria-labelledby', `team-tab-${index}`);
  document.querySelector('.team-kicker').textContent = data.kicker;
  document.querySelector('.team-copy h3').textContent = data.title;
  document.querySelector('.team-description').textContent = data.description;
  document.querySelector('.team-copy ul').innerHTML = data.bullets.map((item) => `<li>${item}</li>`).join('');
}
teamButtons.forEach((button, index) => button.addEventListener('click', () => activateTeam(index)));
teamButtons.forEach((button, index) => button.addEventListener('keydown', (event) => {
  let nextIndex = index;
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % teamButtons.length;
  else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + teamButtons.length) % teamButtons.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = teamButtons.length - 1;
  else return;
  event.preventDefault();
  activateTeam(nextIndex);
  teamButtons[nextIndex].focus();
}));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.feature-card,.trust-stats>div,.quote-card');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

// Static feature story: expand only from direct hover, click, or keyboard input.
(() => {
  const grid = document.querySelector('.features-section .feature-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.feature-card')];
  const triggers = cards.map((card) => card.querySelector('.feature-accordion-trigger'));
  if (!cards.length || triggers.some((trigger) => !trigger)) return;

  const canHover = window.matchMedia('(hover: hover)');
  const canExpand = window.matchMedia('(min-width: 641px)');
  let activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains('is-active')));
  const syncColumns = () => {
    if (!canExpand.matches) {
      grid.style.removeProperty('grid-template-columns');
      return;
    }
    grid.style.gridTemplateColumns = cards
      .map((_, index) => index === activeIndex ? '5fr' : '1fr')
      .join(' ');
  };
  const activate = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;
    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === index;
      card.classList.toggle('is-active', selected);
      triggers[cardIndex].setAttribute('aria-expanded', String(selected));
    });
    syncColumns();
  };
  syncColumns();
  canExpand.addEventListener('change', syncColumns);
  window.addEventListener('resize', syncColumns, { passive: true });

  grid.addEventListener('mouseenter', (event) => {
    const card = event.target.closest('.feature-card');
    if (canHover.matches && card && grid.contains(card)) activate(cards.indexOf(card));
  }, true);
  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => activate(index));
    trigger.addEventListener('focus', () => activate(index));
    trigger.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % cards.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + cards.length) % cards.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = cards.length - 1;
      else return;
      event.preventDefault();
      activate(nextIndex);
      triggers[nextIndex].focus();
    });
  });

})();





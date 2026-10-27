const mascot = document.querySelector('#mascot');
const prey = document.querySelector('#web-prey');
const thread = document.querySelector('#silk-thread');
const silk = document.querySelector('#silk-path');
let threadFrame;
const homeEyes = document.querySelector('#home-eyes');
const logo = document.querySelector('.nav .brand img');
const bugs = [...document.querySelectorAll('.bug')];
// Explicit first/second roles: automatic blue bug, then the peach bug for the user.
const automaticBug = document.querySelector('.bug-a') || bugs[0];
const userBug = document.querySelector('.bug-b') || bugs[1];
const status = document.querySelector('#status');
const puff = document.querySelector('#puff');
const theme = document.querySelector('#theme');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroMotions = new WeakMap();
let busy = false;
let activeAnimation;
let messageTimer;
let hintTimer;
const hint = document.querySelector('#bug-hint');
let introTimer;
let introCancelled = false;
let introPending = false;
let introStarted = false;
function showTurnHint() {
  const remaining = userBug.classList.contains('caught') ? bugs.find(bug => !bug.classList.contains('caught')) : userBug;
  if (!remaining || introCancelled) return;
  document.documentElement.classList.add('hero-user-turn');
  remaining.style.setProperty?.('--legs-play', 'running');
  remaining.append(hint);
  hint.textContent = 'Your turn. Click or tap a bug to squash it.';
  document.documentElement.classList.add('introducing-bugs');
  // The catch compliment uses the squashed bug's coordinates. Keep its
  // announcement accessible, but show the invitation only beside the survivor.
  clearTimeout(messageTimer);
  status.classList.remove('visible');
  status.textContent = hint.textContent;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => document.documentElement.classList.remove('introducing-bugs'), 7000);
}
async function runIntroduction() {
  if (introCancelled || introStarted) return;
  if (busy || document.hidden) { introPending = true; return; }
  if (reducedMotion.matches) { showTurnHint(); return; }
  const origin = logo.getBoundingClientRect();
  const target = automaticBug.getBoundingClientRect();
  // Do not chase offscreen when the user has already moved down the page.
  if (target.top < 0 || target.top >= innerHeight) { introPending = true; return; }
  introPending = false;
  introStarted = true;
  await catchBug(automaticBug, { detail: 1, automatic: true });
  if (automaticBug.classList.contains('caught')) showTurnHint();
}
// Replay on every page load. Other sections have their own visibility timers.
if (reducedMotion.matches) showTurnHint();
else introTimer = setTimeout(runIntroduction, 2700);
function retryVisibleIntroduction() {
  if (!introPending || introCancelled || introStarted) return;
  clearTimeout(introTimer);
  introTimer = setTimeout(runIntroduction, 200);
}
// These listeners retry only the introduction; they never finish a live catch.
addEventListener('scroll', retryVisibleIntroduction, { passive: true });
addEventListener('resize', retryVisibleIntroduction);
document.addEventListener?.('visibilitychange', retryVisibleIntroduction);


function dismissHint() {
  clearTimeout(hintTimer);
  document.documentElement.classList.remove('introducing-bugs');
}
addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    introCancelled = true;
    clearTimeout(introTimer);
      document.documentElement.classList.remove('introducing-bugs');
    document.documentElement.classList.add('hide-bug-tooltips');
  }
});
bugs.forEach(bug => {
  for (const name of ['pointerenter', 'focus']) {
    bug.addEventListener(name, () => document.documentElement.classList.remove('hide-bug-tooltips'));
  }
});
theme.addEventListener('click', () => {
  const light = document.documentElement.classList.toggle('light');
  theme.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  theme.textContent = light ? '☾' : '☼';
  if (prey.classList.contains('visible')) prey.style.color = light ? '#3268a8' : '#8cc3ff';
  document.querySelector('meta[name="theme-color"]').content = light ? '#f5f8ff' : '#0c162e';
});
function chooseCatchStyle(random = Math.random) { return random() < .5 ? 'swoop' : 'web'; }
// Bugs sit in hero whitespace. Only bugs intercept pointer input.
async function catchBug(bug, event) {
  if (busy || bug.classList.contains('caught')) return;
  busy = true;
  if (activeVisitor?.bug === bug) {
    clearTimeout(visitorTimer);
    activeVisitor.retreating = false;
  }
  const heroMotion = heroMotions.get(bug);
  heroMotion?.travel.pause();
  heroMotion?.turn.pause();
  const catchStyle = chooseCatchStyle();
  mascot.dataset.catchStyle = catchStyle;
  if (!event.automatic) {
    introCancelled = true;
    clearTimeout(introTimer);
      dismissHint();
  }
  const keyboard = event.detail === 0;
  const hadFocus = document.activeElement === bug;
  const returnSection = activeVisitor?.bug === bug ? activeVisitor.section : undefined;
  bugs.forEach(item => { item.disabled = true; });
  bug.classList.add('targeted');
  clearTimeout(messageTimer);
  status.classList.remove('visible');
  const target = bug.getBoundingClientRect();
  const initialScrollX = scrollX;
  const initialScrollY = scrollY;
  const localCatch = Boolean(returnSection);
  const localShelter = returnSection?.querySelector('.conversation, .steps') || returnSection;
  const origin = (localShelter || logo).getBoundingClientRect();
  const x = target.left + target.width / 2;
  const y = target.top + target.height / 2;
  const startX = localCatch ? Math.max(origin.left + 22, Math.min(origin.right - 22, x + 60)) : origin.left + origin.width / 2;
  const localEdgeY = Math.abs(y - origin.top) <= Math.abs(y - origin.bottom) ? origin.top + 4 : origin.bottom - 4;
  const startY = localCatch ? Math.max(20, Math.min(innerHeight - 20, localEdgeY)) : Math.max(-24, origin.top + origin.height / 2);
  const dx = x - startX;
  const dy = y - startY;
  mascot.style.left = `${startX}px`;
  mascot.style.top = `${startY}px`;
  try {
    if (!reducedMotion.matches) {
      if (!localCatch) logo.classList.add('away');
      mascot.classList.add('visible', 'awake');
      thread.classList.add('visible');
      if (catchStyle === 'web') thread.classList.add('shooting');
      prey.style.color = getComputedStyle(bug).color;
      prey.style.left = `${x}px`;
      prey.style.top = `${y}px`;
      const followThread = () => {
        // Keep the running path in document space while its overlay is fixed.
        // Scrolling moves the origin and destination together, without restarting.
        const anchorX = startX + initialScrollX - scrollX;
        const anchorY = startY + initialScrollY - scrollY;
        mascot.style.left = `${anchorX}px`;
        mascot.style.top = `${anchorY}px`;
        prey.style.left = `${x + initialScrollX - scrollX}px`;
        prey.style.top = `${y + initialScrollY - scrollY}px`;
        const position = catchStyle === 'swoop' ? mascot.getBoundingClientRect() : (prey.classList.contains('visible') ? prey.getBoundingClientRect() : bug.getBoundingClientRect());
        const cx = position.left + position.width / 2;
        const cy = position.top + position.height / 2;
        silk.setAttribute('d', `M ${anchorX} ${anchorY} Q ${(anchorX + cx) / 2} ${anchorY} ${cx} ${cy}`);
        threadFrame = requestAnimationFrame(followThread);
      };
      followThread();
      if (catchStyle === 'swoop') {
        activeAnimation = mascot.animate([
          { translate: '0 0', rotate: '0deg', scale: localCatch ? '0' : '.8' },
          { translate: `${dx * .65}px ${Math.min(24, dy * .04)}px`, rotate: '-10deg', scale: '1', offset: .22 },
          { translate: `${dx + 26}px ${dy * .32}px`, rotate: '13deg', scale: '1', offset: .47 },
          { translate: `${dx - 7}px ${dy + 10}px`, rotate: '-7deg', scale: '1.06', offset: .87 },
          { translate: `${dx}px ${dy}px`, rotate: '0deg', scale: '1' }
        ], { duration: 1050, easing: 'cubic-bezier(.3,0,.3,1)', fill: 'forwards' });
      } else {
      activeAnimation = mascot.animate([
        { translate: '0 0', rotate: '-10deg', scale: localCatch ? '0' : '.8' },
        { translate: '0 0', rotate: '5deg', scale: '1', offset: .6 },
        { translate: '0 0', rotate: '0deg', scale: '.9' }
      ], { duration: 450, easing: 'ease-out', fill: 'forwards' });
      }
      await activeAnimation.finished;
    }
    bug.classList.add('caught');
    heroMotion?.travel.cancel();
    heroMotion?.turn.cancel();
    if (!event.automatic) dismissHint();
    status.textContent = (['Nice catch!', 'Sharp eyes!', 'Better together.'][bugs.indexOf(bug)] || 'Nice catch!');
    const impactX = (catchStyle === 'swoop' ? x : startX) + initialScrollX;
    const impactY = (catchStyle === 'swoop' ? y : startY) + initialScrollY;
    status.style.left = `${Math.min(scrollX + innerWidth - 95, Math.max(scrollX + 95, impactX))}px`;
    status.style.top = `${impactY + 28}px`;
    if (reducedMotion.matches) status.classList.add('visible');
    messageTimer = setTimeout(() => status.classList.remove('visible'), 2200);
    if (!reducedMotion.matches) {
      puff.style.left = `${impactX}px`;
      puff.style.top = `${impactY}px`;
      puff.classList.remove('burst');
      void puff.offsetWidth;

      activeAnimation?.cancel();
      thread.classList.remove('shooting');
      if (catchStyle === 'swoop') {
        puff.classList.add('burst');
        status.classList.add('visible');
        activeAnimation = mascot.animate([
          { translate: `${dx}px ${dy}px`, rotate: '0deg', scale: '1.06' },
          { translate: `${dx + 12}px ${dy * .35}px`, rotate: '9deg', scale: '1', offset: .5 },
          { translate: `${dx * .3}px 8px`, rotate: '-5deg', scale: '.9', offset: .82 },
          { translate: '0 0', rotate: '0deg', scale: '.8' }
        ], { duration: 800, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
      } else {
      prey.classList.add('visible');
      activeAnimation = prey.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: `${-dx * .5}px ${-dy * .5 - 12}px`, rotate: '-20deg', scale: '.8', offset: .55 },
        { translate: `${-dx}px ${-dy}px`, rotate: '-40deg', scale: '0' }
      ], { duration: 850, easing: 'cubic-bezier(.4,0,.5,1)', fill: 'forwards' });
      }
      await activeAnimation.finished;
      prey.classList.remove('visible');
      if (catchStyle === 'web') {
        puff.classList.add('burst');
        status.classList.add('visible');
      }
      if (localCatch) {
        // Fold back into this section's shelter instead of visiting the header.
        activeAnimation.cancel();
        cancelAnimationFrame(threadFrame);
        thread.classList.remove('visible');
        activeAnimation = mascot.animate([
          { translate: '0 0', rotate: '0deg', scale: '.8', opacity: 1, offset: 0 },
          { translate: '0 0', rotate: '-12deg', scale: '.65', opacity: 1, offset: .45 },
          { translate: '0 -10px', rotate: '-20deg', scale: '0', opacity: 0, offset: 1 }
        ], { duration: 450, easing: 'ease-in', fill: 'forwards' });
        await activeAnimation.finished;
      } else {
      // Land in the reserved header slot, linger awake, blink, then sleep.
      activeAnimation.cancel();
      cancelAnimationFrame(threadFrame);
      thread.classList.remove('visible');
      mascot.classList.remove('visible', 'awake');
      logo.classList.remove('away');
      homeEyes.classList.add('awake');
      activeAnimation = homeEyes.animate([
        { transform: 'scaleY(1)', offset: 0 },
        { transform: 'scaleY(1)', offset: .55 },
        { transform: 'scaleY(.05)', offset: .68 },
        { transform: 'scaleY(1)', offset: .82 },
        { transform: 'scaleY(1)', offset: .9 },
        { transform: 'scaleY(0)', offset: 1 }
      ], { duration: 850, easing: 'ease-in-out' });
      await activeAnimation.finished;
      }

    }
  } catch (error) {
    if (error.name !== 'AbortError') console.error('Ziki animation failed', error);
  } finally {
    activeAnimation?.cancel();
    activeAnimation = undefined;
    cancelAnimationFrame(threadFrame);
    thread.classList.remove('visible', 'shooting');
    prey.classList.remove('visible');
    silk.setAttribute('d', '');
    mascot.classList.remove('visible', 'awake');
    logo.classList.remove('away');
    homeEyes.classList.remove('awake');
    bug.classList.remove('targeted');
    busy = false;
    bugs.forEach(item => { item.disabled = item.classList.contains('caught'); });
    if (bug.dataset?.sectionEgg) retireVisitor();
    if (!event.automatic && hadFocus && document.activeElement === document.body) {
      if (returnSection) {
        returnSection.setAttribute('tabindex', '-1');
        returnSection.focus({ preventScroll: true });
      } else {
        const next = keyboard ? bugs.find(item => !item.disabled) : null;
        (next || document.querySelector('.primary')).focus({ preventScroll: true });
      }
    }
  }
}
function bindBugCatch(bug) {
  // Catch on press, before the moving target can leave the pointer.
  bug.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    catchBug(bug, { detail: 1 });
  });
  bug.addEventListener('click', event => catchBug(bug, event));
}
bugs.forEach(bindBugCatch);
reducedMotion.addEventListener('change', event => {
  if (event.matches) activeAnimation?.finish();
});
// A resized layout can invalidate the path; ordinary scrolling must not finish it.
addEventListener('resize', () => activeAnimation?.finish());

// Quiet section visitors: active reading time, one visitor, long cooldowns.
const eggTiming = { dwell: 4000, globalCooldown: 15000, sectionCooldown: 15000, lifetime: 12000 };
function sectionEggDelay(now, visibleSince, lastAny, lastSection) {
  return Math.max(0, eggTiming.dwell - (now - visibleSince),
    eggTiming.globalCooldown - (now - lastAny), eggTiming.sectionCooldown - (now - lastSection));
}
let activeVisitor;
let visitorTimer;
let dwellTimer;
let visibleSection;
let visibleSince = 0;
let lastAnyVisitor = -Infinity;
const sectionVisits = new Map();
const sectionVisibility = new Map();
function retireVisitor() {
  if (!activeVisitor || activeVisitor.retreating) return;
  clearTimeout(visitorTimer);
  const { bug, nook, section } = activeVisitor;
  // Never remove a focused control just because its display time elapsed.
  if (busy || document.activeElement === bug) {
    visitorTimer = setTimeout(retireVisitor, 2000);
    return;
  }
  const visitor = activeVisitor;
  if (visitor.retreating) return;
  if (!bug.classList.contains('caught') && !document.hidden && !reducedMotion.matches) {
    visitor.retreating = true;
    bug.classList.add('retreating', 'is-crawling');
    // Remove only after the beetle is completely behind the edge.
    visitorTimer = setTimeout(() => finishVisitorRetirement(visitor), 3100);
    return;
  }
  finishVisitorRetirement(visitor);
}
function finishVisitorRetirement(visitor) {
  if (activeVisitor !== visitor) return;
  const { bug, nook, section } = visitor;
  visitor.travel?.cancel();
  visitor.turn?.cancel();
  lastAnyVisitor = Date.now();
  sectionVisits.set(section, lastAnyVisitor);
  const index = bugs.indexOf(bug);
  if (index >= 0) bugs.splice(index, 1);
  nook.remove();
  activeVisitor = undefined;
  scheduleVisitor();
}

function placeVisitorShelter(nook, section, preferWord) {
  const bounds = section.getBoundingClientRect();
  const headings = [...section.querySelectorAll('h2, h3')];
  const cards = [...section.querySelectorAll('.conversation, .steps article')];
  const heading = headings[Math.floor(Math.random() * headings.length)];
  const card = cards[Math.floor(Math.random() * cards.length)];
  if ((preferWord || !card) && heading) {
    // Measure the actual final word, including wrapped headings, without
    // replacing or wrapping any of the product's text.
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let node;
    let lastText;
    while ((node = walker.nextNode())) if (node.textContent.trim()) lastText = node;
    if (lastText) {
      const text = lastText.textContent;
      const end = text.trimEnd().length;
      const start = text.slice(0, end).search(/\S+$/);
      const range = document.createRange();
      range.setStart(lastText, Math.max(0, start));
      range.setEnd(lastText, end);
      const word = range.getBoundingClientRect();
      const left = word.right - bounds.left + 2;
      // Fall back to a card/section edge when the word has no safe side room.
      if (left + 42 < bounds.width - 6) {
        nook.classList.add('word-nook');
        nook.style.left = `${left}px`;
        nook.style.top = `${word.top - bounds.top + word.height / 2 - 20}px`;
        nook.style.right = 'auto';
        return;
      }
    }
  }
  const shelter = (card || section).getBoundingClientRect();
  nook.classList.remove('word-nook');
  nook.style.left = `${Math.max(4, Math.min(bounds.width - Math.min(400, bounds.width) - 4, shelter.left - bounds.left + Math.random() * Math.max(0, shelter.width - 400)))}px`;
  nook.style.top = `${card ? shelter.bottom - bounds.top - 2 : 3}px`;
  nook.style.right = 'auto';
}
function scheduleVisitor() {
  clearTimeout(dwellTimer);
  if (!visibleSection || document.hidden || activeVisitor) return;
  const section = visibleSection;
  const delay = sectionEggDelay(Date.now(), visibleSince, lastAnyVisitor, sectionVisits.get(section) ?? -Infinity);
  dwellTimer = setTimeout(() => {
    if (document.hidden || section !== visibleSection) return;
    if (busy) { dwellTimer = setTimeout(scheduleVisitor, 2000); return; }
    const nook = document.createElement('div');
    nook.className = 'bug-nook';
    const bug = document.createElement('button');
    bug.type = 'button';
    bug.className = 'bug section-bug is-crawling';
    bug.dataset.sectionEgg = 'true';
    bug.setAttribute('aria-label', 'Squash the bug');
    bug.innerHTML = '<svg viewBox="0 0 80 80" aria-hidden="true"><use href="#bug-shape"/></svg>';
    bug.addEventListener('animationend', event => {
      if (['crawl-in','word-crawl-in','card-up-in','card-down-in','card-diagonal-in','word-up-in'].includes(event.animationName)) bug.classList.remove('is-crawling');
    });
    bindBugCatch(bug);
    nook.append(bug);
    section.append(nook);
    placeVisitorShelter(nook, section, Math.random() < .5);
    nook.style.setProperty('--crawl-distance', `${100 + Math.round(Math.random() * 60)}px`);
    const drift = Math.random() < .5 ? -24 : 24;
    nook.style.setProperty('--crawl-direction', drift > 0 ? '1' : '-1');
    nook.style.setProperty('--crawl-drift', `${drift}px`);
    nook.style.setProperty('--travel-angle', drift > 0 ? '160deg' : '200deg');
    nook.style.setProperty('--return-angle', drift > 0 ? '-20deg' : '20deg');
    nook.style.setProperty('--crawl-speed', `${2.6 + Math.random() * 1.4}s`);
    bugs.push(bug);
    activeVisitor = { bug, nook, section };
    configureVisitorRoute(activeVisitor);
    visitorTimer = setTimeout(retireVisitor, eggTiming.lifetime);
  }, Math.max(100, delay));
}
function chooseSection() {
  const candidates = [...sectionVisibility].filter(([, ratio]) => ratio >= .4).sort((a, b) => b[1] - a[1]);
  const next = document.hidden ? undefined : candidates[0]?.[0];
  if (next !== visibleSection) {
    visibleSection = next;
    visibleSince = Date.now();
    if (activeVisitor && activeVisitor.section !== next) retireVisitor();
    scheduleVisitor();
  }
}
if (typeof IntersectionObserver !== 'undefined') {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => sectionVisibility.set(entry.target, entry.intersectionRatio));
    chooseSection();
  }, { threshold: [0, .4, .6, .8, 1] });
  document.querySelectorAll('main > .section, main > .closing').forEach(section => sectionObserver.observe(section));
  document.addEventListener('visibilitychange', chooseSection);
}


if (document.querySelector('.hero-nook')) {
  bugs.filter(bug => bug.closest('.hero-nook')).forEach(bug => {
    bug.addEventListener('animationend', event => {
      if (event.animationName === 'hero-crawl' || event.animationName === 'button-crawl') bug.style.setProperty('--legs-play', 'paused');
    });
  });
}


let previousRouteKind;
function configureVisitorRoute(visitor) {
  const { nook, bug } = visitor;
  const word = nook.classList.contains('word-nook');
  const choices = (word ? ['up', 'down'] : ['straight', 'up', 'down', 'diagonal']).filter(kind => kind !== previousRouteKind);
  const kind = choices[Math.floor(Math.random() * choices.length)];
  previousRouteKind = kind;
  bug.dataset.route = kind;
  nook.classList.add(`path-${kind}`);
  if (word && kind === 'up') {
    nook.style.top = `${Math.max(4, parseFloat(nook.style.top) - 130)}px`;
    nook.style.setProperty('--crawl-distance', '120px');
  }
}
